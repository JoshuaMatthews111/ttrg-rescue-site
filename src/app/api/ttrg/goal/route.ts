import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

// Staff-only view of the ACTUAL money: the dollar goal, the amount raised and
// the resulting percentage. Sign-in required, because the public side of the
// site is built to never reveal these figures.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function summary(dog?: string) {
  const supabase = getServiceSupabase();
  const { data: settings } = await supabase
    .from("site_settings").select("default_goal").eq("id", 1).single();
  const defaultGoal = Number(settings?.default_goal) || 50000;

  let goal = defaultGoal;
  let usesDefault = true;
  if (dog) {
    const { data } = await supabase.from("dogs").select("goal_amount").ilike("name", dog).limit(1);
    const own = Number(data?.[0]?.goal_amount);
    if (own > 0) { goal = own; usesDefault = false; }
  }

  let q = supabase.from("donations").select("amount, status, dog_name");
  if (dog) q = q.ilike("dog_name", dog);
  const { data: donations } = await q;
  const raised = (donations || [])
    .filter(d => d.status === "completed" || d.status === "pending")
    .reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return {
    goal, raised, defaultGoal, usesDefault,
    percent: goal > 0 ? Math.round((raised / goal) * 1000) / 10 : 0,
    remaining: Math.max(0, goal - raised),
  };
}

export async function GET(req: NextRequest) {
  if (!canSendMessages(requireAdmin(req))) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const dog = req.nextUrl.searchParams.get("dog") || undefined;
  return NextResponse.json({ ok: true, ...(await summary(dog)) });
}

/** Update the site-wide default goal, or one dog's own goal. */
export async function POST(req: NextRequest) {
  if (!canSendMessages(requireAdmin(req))) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const { defaultGoal, dog, goalAmount } = await req.json().catch(() => ({}));
  const supabase = getServiceSupabase();

  if (defaultGoal !== undefined) {
    const value = Number(defaultGoal);
    if (!(value > 0)) return NextResponse.json({ ok: false, error: "Goal must be greater than zero." }, { status: 400 });
    const { error } = await supabase.from("site_settings").update({ default_goal: value }).eq("id", 1);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (dog) {
    // Empty/zero clears the override so the dog follows the site default again.
    const value = Number(goalAmount);
    const { error } = await supabase.from("dogs")
      .update({ goal_amount: value > 0 ? value : null }).ilike("name", String(dog));
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ...(await summary(dog)) });
}
