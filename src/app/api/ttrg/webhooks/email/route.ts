import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceSupabase } from "@/lib/supabase";

// Resend webhook. Acts on events rather than merely storing them:
//  · bounced    -> mark the address unusable
//  · complained -> switch email consent OFF immediately. Continuing to mail
//                  someone who reported you as spam is how a sending domain
//                  gets blocked.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Svix-style signature: v1,<base64>. Signed over "<id>.<timestamp>.<body>". */
function verify(raw: string, headers: Headers): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return true;            // not configured yet — accept, but log
  const id = headers.get("svix-id");
  const ts = headers.get("svix-timestamp");
  const sigHeader = headers.get("svix-signature");
  if (!id || !ts || !sigHeader) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${raw}`).digest("base64");
  return sigHeader.split(" ").some(part => {
    const value = part.includes(",") ? part.split(",")[1] : part;
    const a = Buffer.from(value, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verify(raw, req.headers)) {
    return NextResponse.json({ ok: false, error: "bad signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(raw || "{}");
    const type: string = event?.type || "";
    const email: string = event?.data?.to?.[0] || event?.data?.email || "";
    const eventId: string = event?.data?.email_id || event?.id || `email-${Date.now()}`;
    const supabase = getServiceSupabase();

    // Keyed on the provider's id, so a retry cannot double-apply.
    await supabase.from("comm_webhook_events").upsert({
      id: eventId, provider: "resend", event_type: type, payload: event,
      received_at: new Date().toISOString(),
    }, { onConflict: "id" });

    if (email) {
      if (type === "email.complained") {
        await supabase.from("contacts").update({ email_consent: false }).ilike("email", email);
      } else if (type === "email.bounced") {
        await supabase.from("contacts").update({ email_bounced: true, email_consent: false }).ilike("email", email);
      }
      const status = type.replace("email.", "");
      if (["delivered", "bounced", "complained", "opened", "clicked"].includes(status)) {
        await supabase.from("message_log").update({ status }).eq("provider_id", eventId);
      }
    }

    await supabase.from("comm_settings").update({
      last_email_event: { type, email, at: new Date().toISOString() },
    }).eq("id", 1);
  } catch (err) {
    console.error("[resend webhook]", err);
  }

  // Always 200 quickly — providers retry on anything else.
  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "resend webhook" });
}
