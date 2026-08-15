import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Saves the editable pieces of the Message Center setup (testers, from-address). */
export async function POST(req: NextRequest) {
  const session = requireAdmin(req);
  if (!canSendMessages(session)) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (Array.isArray(body.test_recipients)) update.test_recipients = body.test_recipients;
  if (typeof body.email_from === "string") update.email_from = body.email_from;
  if (typeof body.sms_number === "string") update.sms_number = body.sms_number;

  const { error } = await getServiceSupabase().from("comm_settings").update(update).eq("id", 1);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
