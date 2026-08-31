import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

// Staff-only view of the ACTUAL money: the dollar goal, the amount raised, the
// number of donors and the resulting percentage. Sign-in required, because the
// public side of the site is built to never reveal these figures.
//
// Everything here is summed live from the donations table. Nothing in the back
// office stores a raised total or a donor count any more — a stored counter is
// only ever right until the next gift arrives.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Gifts that count toward a campaign. Archived/refunded rows are excluded. */
function counts(status: string | null) {
  return status === "completed" || status === "pending";
}

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
  const counted = (donations || []).filter(d => counts(d.status));
  const raised = counted.reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return {
    goal, raised, donors: counted.length, defaultGoal, usesDefault,
    percent: goal > 0 ? Math.round((raised / goal) * 1000) / 10 : 0,
    remaining: Math.max(0, goal - raised),
  };
}

/**
 * Live totals for several campaigns at once, in a single query — the family
 * profiles list needs a figure per row and must not fire one request per dog.
 * Goals come from the caller (family goals live in the profile JSON), so this
 * returns raised/donors keyed by the dog name exactly as it was passed in.
 */
async function batch(names: string[]) {
  const supabase = getServiceSupabase();
  const { data: donations } = await supabase
    .from("donations").select("amount, status, dog_name");

  const out: Record<string, { raised: number; donors: number }> = {};
  for (const name of names) {
    const key = name.trim().toLowerCase();
    const rows = (donations || []).filter(
      d => counts(d.status) && String(d.dog_name || "").trim().toLowerCase() === key,
    );
    out[name] = {
      raised: rows.reduce((s, d) => s + (Number(d.amount) || 0), 0),
      donors: rows.length,
    };
  }
  return out;
}

export async function GET(req: NextRequest) {
  if (!canSendMessages(requireAdmin(req))) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const many = req.nextUrl.searchParams.get("dogs");
  if (many) {
    const names = many.split(",").map(s => s.trim()).filter(Boolean).slice(0, 200);
    return NextResponse.json(
      { ok: true, byDog: await batch(names) },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const dog = req.nextUrl.searchParams.get("dog") || undefined;
  return NextResponse.json(
    { ok: true, ...(await summary(dog)) },
    { headers: { "Cache-Control": "no-store" } },
  );
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
