import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";
import { personalise, greetingName } from "@/lib/messaging";
import { unsubscribeUrl } from "@/lib/messaging-tokens";
import { buildEmailHtml } from "@/lib/email-template";
import { sendEmail, sendSms, emailConfigured, smsConfigured } from "@/lib/comm-providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BATCH = 500;   // keep a single request well inside the function timeout

interface Contact {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  email_consent?: boolean;
  sms_consent?: boolean;
}

// ─── GET: audience counts + saved testers ──────────────────────────────────
export async function GET(req: NextRequest) {
  const session = requireAdmin(req);
  if (!canSendMessages(session)) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const base = () => supabase.from("contacts").select("id", { count: "exact", head: true });

  const [totalRes, emailRes, smsRes, refusedRes] = await Promise.all([
    base(),
    base().eq("email_consent", true).not("email", "is", null),
    base().eq("sms_consent", true).not("phone", "is", null),
    base().eq("sms_consent", false),
  ]);
  const total = totalRes.count ?? 0;
  const emailReady = emailRes.count ?? 0;
  const smsReady = smsRes.count ?? 0;
  const smsRefused = refusedRes.count ?? 0;

  const { data: settings } = await supabase.from("comm_settings").select("*").eq("id", 1).single();

  return NextResponse.json({
    ok: true,
    total, emailReady, smsReady, smsRefused,
    testRecipients: settings?.test_recipients || [],
    emailFrom: settings?.email_from || process.env.RESEND_FROM || "",
    providers: {
      email: emailConfigured() ? "Resend" : "not configured",
      sms: smsConfigured() ? "SimpleTexting" : "not configured",
    },
    lastEmailEvent: settings?.last_email_event || null,
    lastSmsEvent: settings?.last_sms_event || null,
  });
}

// ─── POST: send ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = requireAdmin(req);
  if (!canSendMessages(session)) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const channel: "email" | "sms" | "both" = body.channel || "email";
  const mode: "test" | "audience" = body.mode || "test";
  const subject: string = body.subject || "";
  const headline: string = body.headline || "";
  const emailBody: string = body.body || "";
  const buttonLabel: string = body.buttonLabel || "";
  const buttonUrl: string = body.buttonUrl || "";
  const imageUrl: string = body.imageUrl || "";
  const smsText: string = body.text || "";
  const media: string = body.media || "";

  // An audience send is irreversible — demand an explicit confirmation.
  if (mode === "audience" && body.confirm !== true) {
    return NextResponse.json(
      { ok: false, error: "Refused: an audience send requires confirm: true." },
      { status: 400 },
    );
  }

  const supabase = getServiceSupabase();
  let recipients: Contact[] = [];
  let nextOffset: number | null = null;

  if (mode === "test") {
    // Testers are supplied by the screen; personalise per tester so one test
    // proves the real merge (each sees their own name).
    recipients = (body.recipients || []).map((r: Record<string, string>, i: number) => ({
      id: -(i + 1),
      first_name: r.name || "",
      email: r.email || null,
      phone: r.phone || null,
      email_consent: true,   // an explicit test to yourself
      sms_consent: true,
    }));
    if (recipients.length === 0) {
      return NextResponse.json({ ok: false, error: "No test recipients selected." }, { status: 400 });
    }
  } else {
    const limit = Math.min(Number(body.limit) || 100, MAX_BATCH);
    const offset = Math.max(Number(body.offset) || 0, 0);

    // Consent is enforced HERE, in the send routine — never in the UI.
    let query = supabase.from("contacts").select("*");
    if (channel === "email") query = query.eq("email_consent", true).not("email", "is", null);
    else if (channel === "sms") query = query.eq("sms_consent", true).not("phone", "is", null);
    else query = query.or("and(email_consent.eq.true,email.not.is.null),and(sms_consent.eq.true,phone.not.is.null)");

    // Deterministic order — without it, paging silently skips and repeats.
    const { data, error } = await query.order("id", { ascending: true }).range(offset, offset + limit - 1);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    recipients = (data || []) as Contact[];
    nextOffset = recipients.length === limit ? offset + limit : null;
  }

  const results: { to: string; channel: string; ok: boolean; error?: string }[] = [];
  let emailsSent = 0, textsSent = 0;

  for (const c of recipients) {
    // ── Email ──
    const mayEmail = (channel === "email" || channel === "both") && !!c.email && c.email_consent !== false;
    if (mayEmail && c.email) {
      const unsub = unsubscribeUrl(c.email);
      const html = buildEmailHtml({
        headline: personalise(headline, c, unsub),
        body: personalise(emailBody, c, unsub),
        buttonLabel, buttonUrl, imageUrl,
      }, unsub);

      const r = await sendEmail({
        to: c.email,
        subject: personalise(subject, c, unsub),
        html,
        unsubscribeUrl: unsub,
      });
      results.push({ to: c.email, channel: "email", ok: r.ok, error: r.error });
      if (r.ok) emailsSent++;
      if (mode === "audience") {
        await supabase.from("message_log").insert({
          contact_id: c.id, channel: "email", subject, provider_id: r.id || "",
          status: r.ok ? "sent" : "failed", error: r.error || "",
        });
      }
    }

    // ── Text ──
    const maySms = (channel === "sms" || channel === "both") && !!c.phone && c.sms_consent !== false;
    if (maySms && c.phone) {
      const r = await sendSms({
        phone: c.phone,
        text: personalise(smsText, c, unsubscribeUrl(c.email || "", "sms")),
        mediaUrl: media || undefined,
      });
      results.push({ to: c.phone, channel: "sms", ok: r.ok, error: r.error });
      if (r.ok) textsSent++;
      if (mode === "audience") {
        await supabase.from("message_log").insert({
          contact_id: c.id, channel: "sms", provider_id: r.id || "",
          status: r.ok ? "sent" : "failed", error: r.error || "",
        });
      }
    }
  }

  const failures = results.filter(r => !r.ok);
  return NextResponse.json({
    ok: true,
    processed: recipients.length,
    emailsSent,
    textsSent,
    failed: failures.length,
    errors: failures.slice(0, 50),
    nextOffset,
    // Handy for the confirmation line on the screen.
    sampleGreeting: recipients[0] ? greetingName(recipients[0].first_name) : null,
  });
}
