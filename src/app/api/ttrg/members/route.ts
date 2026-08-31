import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

// The office's client list: everyone who opted in through /ttrg/join.
//
// Sign-in required — this returns names, emails, phone numbers and the consent
// evidence attached to each person, none of which may be publicly readable.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!canSendMessages(requireAdmin(req))) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, full_name, email, phone, city, state, email_consent, sms_consent, email_consent_at, sms_consent_at, membership_type, membership_level, membership_active, membership_started_at, source, utm_campaign, referrer, consent_text, consent_ip, signed_up_at, status")
    .order("signed_up_at", { ascending: false })
    .limit(2000);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const rows = data || [];
  const mission = rows.filter(r => r.membership_type === "mission");

  return NextResponse.json({
    ok: true,
    members: rows,
    stats: {
      total: rows.length,
      mission: mission.length,
      updatesOnly: rows.length - mission.length,
      // What the recurring gifts are worth once every pledge is paying.
      pledgedMonthly: mission.reduce((s, r) => s + (Number(r.membership_level) || 0), 0),
      activeMonthly: mission
        .filter(r => r.membership_active)
        .reduce((s, r) => s + (Number(r.membership_level) || 0), 0),
      awaitingPayment: mission.filter(r => !r.membership_active).length,
      emailConsented: rows.filter(r => r.email_consent).length,
      smsConsented: rows.filter(r => r.sms_consent).length,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
