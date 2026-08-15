import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceSupabase } from "@/lib/supabase";
import { normalisePhone } from "@/lib/messaging";

// SimpleTexting webhook: inbound replies and delivery events.
// Carriers REQUIRE that STOP/UNSUBSCRIBE/QUIT/END/CANCEL opt a number out
// immediately — this is not optional.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STOP_WORDS = ["stop", "unsubscribe", "quit", "end", "cancel", "stopall", "optout"];
const HELP_WORDS = ["help", "info"];

function verify(raw: string, headers: Headers): boolean {
  const secret = process.env.SIMPLETEXTING_WEBHOOK_SECRET;
  if (!secret) return true;   // not configured yet
  const provided = headers.get("x-st-signature") || headers.get("x-webhook-signature") || "";
  if (!provided) return false;
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(provided.replace(/^sha256=/, "").toLowerCase(), "utf8");
  const b = Buffer.from(expected.toLowerCase(), "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verify(raw, req.headers)) {
    return NextResponse.json({ ok: false, error: "bad signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(raw || "{}");
    const supabase = getServiceSupabase();

    const phone = normalisePhone(
      event?.contactPhone || event?.phone || event?.from || event?.contact?.phone || "",
    );
    const text: string = String(event?.text || event?.message || "").trim();
    const eventId: string = String(event?.id || event?.smsid || `sms-${Date.now()}`);
    const type: string = event?.type || event?.event || (text ? "inbound" : "status");

    await supabase.from("comm_webhook_events").upsert({
      id: eventId, provider: "simpletexting", event_type: type, payload: event,
      received_at: new Date().toISOString(),
    }, { onConflict: "id" });

    if (phone) {
      const word = text.toLowerCase().replace(/[^a-z]/g, "");
      if (STOP_WORDS.includes(word)) {
        // Opt out at once — carrier requirement.
        await supabase.from("contacts").update({ sms_consent: false }).eq("phone", phone);
      } else if (HELP_WORDS.includes(word)) {
        const { sendSms } = await import("@/lib/comm-providers");
        await sendSms({
          phone,
          text: "Team Trainers Rescue Group: we rescue, train and rehome dogs. Reply STOP to unsubscribe. teamtrainersrescuegroup.com",
        });
      }

      const status: string = String(event?.status || "").toLowerCase();
      if (["failed", "undelivered", "rejected"].includes(status)) {
        await supabase.from("message_log").update({ status: "failed", error: String(event?.error || status) })
          .eq("provider_id", eventId);
      } else if (status === "delivered") {
        await supabase.from("message_log").update({ status: "delivered" }).eq("provider_id", eventId);
      }
    }

    await supabase.from("comm_settings").update({
      last_sms_event: { type, phone, text: text.slice(0, 60), at: new Date().toISOString() },
    }).eq("id", 1);
  } catch (err) {
    console.error("[simpletexting webhook]", err);
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "simpletexting webhook" });
}
