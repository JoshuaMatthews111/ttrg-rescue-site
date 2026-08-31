import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { normalisePhone, cleanName } from "@/lib/messaging";

// Public opt-in endpoint for the /ttrg/join page.
//
// Consent here is the ONLY thing that later permits a marketing email or
// text, so the record it writes is deliberately evidential: the exact
// wording the person agreed to, when, from what address, and which link
// brought them. If a carrier or regulator ever asks "prove they agreed",
// that row is the answer.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phoneRaw = String(body.phone || "").trim();
  const phone = normalisePhone(phoneRaw);

  const emailConsent = body.emailConsent === true;
  const smsConsent = body.smsConsent === true;

  // Two ways in: updates only, or a monthly gift at a chosen level.
  const membershipType = body.membershipType === "mission" ? "mission" : "updates";
  const level = Number(body.membershipLevel);
  const membershipLevel = membershipType === "mission" && level > 0 ? level : null;

  if (!firstName) return NextResponse.json({ ok: false, error: "Please enter your first name." }, { status: 400 });
  if (!email && !phone) return NextResponse.json({ ok: false, error: "Please give us an email address or a mobile number." }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
  }
  if (phoneRaw && !phone) {
    return NextResponse.json({ ok: false, error: "That mobile number doesn't look like a 10-digit US number." }, { status: 400 });
  }
  // Consent must be given deliberately — never assumed from the fact they
  // filled the form in.
  if (!emailConsent && !smsConsent) {
    return NextResponse.json({ ok: false, error: "Please tick at least one box so we know how you'd like to hear from us." }, { status: 400 });
  }
  if (smsConsent && !phone) {
    return NextResponse.json({ ok: false, error: "Add your mobile number to receive texts." }, { status: 400 });
  }
  if (emailConsent && !email) {
    return NextResponse.json({ ok: false, error: "Add your email address to receive emails." }, { status: 400 });
  }
  // A monthly supporter must pick an amount, and we need a receipt address.
  if (membershipType === "mission" && !membershipLevel) {
    return NextResponse.json({ ok: false, error: "Please choose a monthly amount." }, { status: 400 });
  }
  if (membershipType === "mission" && !email) {
    return NextResponse.json({ ok: false, error: "We need your email address to send your monthly receipts." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip") || "";
  const agent = req.headers.get("user-agent") || "";

  const row = {
    first_name: cleanName(firstName) || firstName,
    last_name: cleanName(lastName) || lastName,
    full_name: [cleanName(firstName) || firstName, cleanName(lastName) || lastName].filter(Boolean).join(" "),
    email: email || null,
    phone: phone || null,
    city: String(body.city || "").trim(),
    state: String(body.state || "").trim().toUpperCase().slice(0, 2),
    zip: String(body.zip || "").trim(),

    email_consent: emailConsent,
    sms_consent: smsConsent,
    email_consent_at: emailConsent ? now : null,
    sms_consent_at: smsConsent ? now : null,

    // Attribution — which link brought them.
    source: String(body.source || "").slice(0, 60),
    utm_source: String(body.utm_source || "").slice(0, 60),
    utm_medium: String(body.utm_medium || "").slice(0, 60),
    utm_campaign: String(body.utm_campaign || "").slice(0, 60),
    utm_content: String(body.utm_content || "").slice(0, 60),
    referrer: String(body.referrer || "").slice(0, 300),
    landing_page: String(body.landingPage || "").slice(0, 300),

    // Evidence.
    consent_text: String(body.consentText || "").slice(0, 2000),
    consent_ip: ip,
    consent_agent: agent.slice(0, 300),
    signed_up_at: now,
    status: "active",
    updated_at: now,

    membership_type: membershipType,
    membership_level: membershipLevel,
    membership_started_at: membershipType === "mission" ? now : null,
    // Only the completed charge flips this on — picking a level is an
    // intention, not a payment.
    membership_active: false,
  };

  const supabase = getServiceSupabase();

  // Someone who already exists (an old donor, or a second visit) should be
  // updated rather than duplicated — and consent may only ever be ADDED here,
  // never silently removed.
  let existingId: number | null = null;
  if (email) {
    const { data } = await supabase.from("contacts").select("id, email_consent, sms_consent").ilike("email", email).limit(1);
    if (data?.[0]) existingId = data[0].id;
  }
  if (!existingId && phone) {
    const { data } = await supabase.from("contacts").select("id, email_consent, sms_consent").eq("phone", phone).limit(1);
    if (data?.[0]) existingId = data[0].id;
  }

  if (existingId) {
    const update: Record<string, unknown> = { ...row };
    // Don't downgrade an existing permission because a box was left unticked.
    if (!emailConsent) { delete update.email_consent; delete update.email_consent_at; }
    if (!smsConsent) { delete update.sms_consent; delete update.sms_consent_at; }
    // Likewise, someone already giving monthly who comes back for updates
    // must not be demoted out of the mission.
    if (membershipType !== "mission") {
      delete update.membership_type;
      delete update.membership_level;
      delete update.membership_started_at;
    }
    delete update.membership_active;
    const { error } = await supabase.from("contacts").update(update).eq("id", existingId);
    if (error) return NextResponse.json({ ok: false, error: "We couldn't save that — please try again." }, { status: 500 });
  } else {
    const { error } = await supabase.from("contacts").insert(row);
    if (error) return NextResponse.json({ ok: false, error: "We couldn't save that — please try again." }, { status: 500 });
  }

  // Mark the visit as converted so the portal can show a real conversion rate.
  if (body.visitId) {
    await supabase.from("signup_visits").update({ converted: true }).eq("visit_id", String(body.visitId));
  }

  return NextResponse.json({
    ok: true,
    returning: !!existingId,
    membershipType,
    membershipLevel,
  });
}
