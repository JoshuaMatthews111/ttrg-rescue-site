import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

// Traffic-source report for the staff portal: who opened each link, who
// actually joined, and what permission they gave.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row {
  source: string;
  utm_campaign?: string | null;
  email_consent?: boolean;
  sms_consent?: boolean;
  signed_up_at?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
}

export async function GET(req: NextRequest) {
  const session = requireAdmin(req);
  if (!canSendMessages(session)) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("source, utm_campaign, email_consent, sms_consent, signed_up_at, first_name, last_name, email, phone, city, state")
    .order("signed_up_at", { ascending: false, nullsFirst: false })
    .limit(5000);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const { data: visits } = await supabase.from("signup_visits").select("source, converted").limit(20000);

  // Signups grouped by the link that brought them.
  const bySource: Record<string, { signups: number; email: number; sms: number; visits: number }> = {};
  const bucket = (s: string) => (bySource[s] ??= { signups: 0, email: 0, sms: 0, visits: 0 });

  for (const c of (contacts || []) as Row[]) {
    if (!c.signed_up_at) continue;      // imported contacts, not link signups
    const b = bucket(c.source || "direct");
    b.signups++;
    if (c.email_consent) b.email++;
    if (c.sms_consent) b.sms++;
  }
  for (const v of (visits || []) as { source: string }[]) {
    bucket(v.source || "direct").visits++;
  }

  const sources = Object.entries(bySource)
    .map(([source, s]) => ({
      source,
      ...s,
      conversion: s.visits > 0 ? Math.round((s.signups / s.visits) * 100) : null,
    }))
    .sort((a, b) => b.signups - a.signups || b.visits - a.visits);

  const recent = ((contacts || []) as Row[])
    .filter(c => c.signed_up_at)
    .slice(0, 50)
    .map(c => ({
      name: [c.first_name, c.last_name].filter(Boolean).join(" ") || "—",
      email: c.email, phone: c.phone,
      place: [c.city, c.state].filter(Boolean).join(", "),
      source: c.source || "direct",
      campaign: c.utm_campaign || "",
      emailConsent: !!c.email_consent,
      smsConsent: !!c.sms_consent,
      at: c.signed_up_at,
    }));

  const totalSignups = recent.length ? sources.reduce((n, s) => n + s.signups, 0) : 0;
  const totalVisits = sources.reduce((n, s) => n + s.visits, 0);

  return NextResponse.json({
    ok: true,
    sources,
    recent,
    totals: {
      signups: totalSignups,
      visits: totalVisits,
      conversion: totalVisits > 0 ? Math.round((totalSignups / totalVisits) * 100) : null,
    },
  });
}
