import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceSupabase } from "@/lib/supabase";

// ═══════════════════════════════════════════════════════════════════════════
// Authorize.net webhook receiver.
//
// WHY THIS EXISTS: the webhook was registered against
// "http://teamtrainersrescuegroup.com/" — the homepage, over plain HTTP.
// Authorize.net does not follow redirects, so every delivery hit the
// 308 http->https redirect and failed; even following it, a POST to the
// homepage returns 405. After enough consecutive failures Authorize.net
// deactivates the webhook, which is why it kept "turning off".
//
// This endpoint answers POST over HTTPS with a fast 200 so deliveries
// succeed. Register it as:
//   https://teamtrainersrescuegroup.com/api/ttrg/webhook
// ═══════════════════════════════════════════════════════════════════════════

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Authorize.net signs the raw body with the Signature Key (HMAC-SHA512). */
function isValidSignature(rawBody: string, header: string | null): boolean {
  const key = process.env.AUTHNET_SIGNATURE_KEY;
  if (!key || !header) return false;
  // Header looks like: "sha512=ABC123..."
  const provided = header.includes("=") ? header.split("=")[1].trim() : header.trim();
  const expected = crypto.createHmac("sha512", key).update(rawBody).digest("hex");
  const a = Buffer.from(provided.toLowerCase(), "utf8");
  const b = Buffer.from(expected.toLowerCase(), "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  // Read the RAW body — the signature is computed over the exact bytes.
  const raw = await req.text();

  // Verify when a signature key is configured. Never reject on our own
  // internal errors: a non-2xx response is what deactivates the webhook.
  const signature = req.headers.get("x-anet-signature");
  const verified = isValidSignature(raw, signature);
  if (process.env.AUTHNET_SIGNATURE_KEY && signature && !verified) {
    // A genuinely forged request — refuse it, but this does not affect
    // Authorize.net's own deliveries (theirs are always signed correctly).
    return NextResponse.json({ received: false, reason: "bad signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(raw || "{}");
    const type: string = event?.eventType || "";
    const payload = event?.payload || {};

    // Keep a durable record so nothing is silently lost, and so the admin
    // can see subscription/refund/void activity that isn't a fresh donation.
    const supabase = getServiceSupabase();
    await supabase.from("webhook_events").insert({
      id: event?.notificationId || `wh-${Date.now()}`,
      event_type: type,
      payload: event,
      received_at: new Date().toISOString(),
    });

    // Only a cryptographically verified delivery may create a donation
    // record. Unverified posts are still logged above, but must never be
    // able to write financial rows.
    if (verified &&
        (type.startsWith("net.authorize.customer.subscription") ||
         type.startsWith("net.authorize.payment"))) {
      const amount = Number(payload?.authAmount ?? payload?.amount ?? 0);
      const transId = String(payload?.id ?? payload?.transId ?? "");
      if (transId && amount > 0 && type.includes("authcapture")) {
        // The donate page saves the full record (name, email, dog, referral)
        // the moment the charge succeeds. Webhook payloads carry almost none
        // of that, so an upsert here would REPLACE the donor's details with
        // "Authorize.net donor" — which is exactly the bug that hit the
        // 2026-08-21 test donations. Insert ONLY when no row exists yet
        // (recurring subscription charges have no client-side insert), and
        // never touch a row that is already there.
        const { data: existing } = await supabase
          .from("donations").select("id").eq("id", transId).limit(1);
        if (!existing || existing.length === 0) {
          await supabase.from("donations").insert({
            id: transId,
            name: [payload?.billTo?.firstName, payload?.billTo?.lastName].filter(Boolean).join(" ") || "Authorize.net donor",
            email: payload?.customer?.email || "",
            amount,
            frequency: type.includes("subscription") ? "monthly" : "one-time",
            dog_name: "",
            date: new Date().toISOString(),
            status: "completed",
            last4: String(payload?.accountNumber || "").replace(/[^0-9]/g, "").slice(-4),
          });
        }
      }
    }
  } catch (err) {
    // Log and still return 200 — retrying won't fix a parse/storage problem
    // on our side, and repeated non-2xx replies deactivate the webhook.
    console.error("[authnet webhook] processing error:", err);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Authorize.net (and humans) may probe with GET — answer 200 so the endpoint
// never looks dead during setup/verification.
export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "authorize.net webhook" }, { status: 200 });
}
