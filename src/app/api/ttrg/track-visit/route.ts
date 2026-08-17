import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// Records that somebody OPENED the opt-in link, whether or not they join.
// Without this the portal can only show signups; with it you can see
// "247 people opened Lorenzo's link, 38 joined" — which is what tells you
// whether the text itself is working.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  try {
    await getServiceSupabase().from("signup_visits").insert({
      visit_id: String(body.visitId || "").slice(0, 60),
      source: String(body.source || "").slice(0, 60),
      utm_source: String(body.utm_source || "").slice(0, 60),
      utm_medium: String(body.utm_medium || "").slice(0, 60),
      utm_campaign: String(body.utm_campaign || "").slice(0, 60),
      referrer: String(body.referrer || "").slice(0, 300),
    });
  } catch { /* tracking must never block the page */ }
  return NextResponse.json({ ok: true });
}
