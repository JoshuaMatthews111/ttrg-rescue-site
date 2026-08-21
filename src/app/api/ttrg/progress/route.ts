import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// Public fundraising progress — PERCENTAGES ONLY.
//
// The dollar goal ($50,000 by default) and the running total are deliberately
// never returned by this endpoint. Anything sent here is readable by any
// visitor who opens the browser's network tab, so the arithmetic stays on the
// server and only the percentage crosses the wire.
//
//   /api/ttrg/progress             → whole-organisation progress
//   /api/ttrg/progress?dog=Draco   → that dog's campaign

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const MILESTONES = [5, 25, 50, 75, 100];

export async function GET(req: NextRequest) {
  const dog = (req.nextUrl.searchParams.get("dog") || "").trim();
  const supabase = getServiceSupabase();

  try {
    // Goal: the dog's own target when set, otherwise the site-wide default.
    const { data: settings } = await supabase
      .from("site_settings").select("default_goal").eq("id", 1).single();
    let goal = Number(settings?.default_goal) || 50000;

    if (dog) {
      const { data: dogRows } = await supabase
        .from("dogs").select("goal_amount").ilike("name", dog).limit(1);
      const dogGoal = Number(dogRows?.[0]?.goal_amount);
      if (dogGoal > 0) goal = dogGoal;
    }

    // Raised is summed live rather than kept as a counter, so a voided or
    // refunded gift disappears from the percentage on its own.
    let query = supabase.from("donations").select("amount, status, dog_name");
    if (dog) query = query.ilike("dog_name", dog);
    const { data: donations } = await query;

    const raised = (donations || [])
      .filter(d => d.status === "completed" || d.status === "pending")
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const exact = goal > 0 ? (raised / goal) * 100 : 0;
    const percent = Math.min(100, Math.round(exact * 10) / 10); // one decimal

    return NextResponse.json({
      ok: true,
      dog: dog || null,
      percent,
      reached: MILESTONES.filter(m => percent >= m),
      nextMilestone: MILESTONES.find(m => percent < m) ?? null,
      milestones: MILESTONES,
      // NOTE: `goal` and `raised` are intentionally absent.
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, percent: 0, reached: [], nextMilestone: 5, milestones: MILESTONES });
  }
}
