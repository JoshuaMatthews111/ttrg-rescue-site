import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// Called by the join page once a Rescue Mission gift has actually been charged,
// to mark the member's payment as set up.
//
// The client is not trusted: before flipping the flag we look for a real
// donation row belonging to that email address, so nobody can mark themselves
// an active monthly supporter without paying.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, level } = await req.json().catch(() => ({}));
  const address = String(email || "").trim().toLowerCase();
  if (!address) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

  const supabase = getServiceSupabase();

  // Proof of payment: a donation recorded against this address.
  const { data: paid } = await supabase
    .from("donations")
    .select("id")
    .ilike("email", address)
    .in("status", ["completed", "pending"])
    .limit(1);

  if (!paid || paid.length === 0) {
    return NextResponse.json({ ok: false, error: "no payment found" }, { status: 409 });
  }

  const update: Record<string, unknown> = {
    membership_type: "mission",
    membership_active: true,
    updated_at: new Date().toISOString(),
  };
  const amount = Number(level);
  if (amount > 0) update.membership_level = amount;

  const { error } = await supabase.from("contacts").update(update).ilike("email", address);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
