import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// Public fundraising progress — PERCENTAGES ONLY.
//
// The dollar goal ($50,000 by default) and the running total are deliberately
// never returned by this endpoint. Anything sent here is readable by any
// visitor who opens the browser's network tab, so the arithmetic stays on the
// server and only the percentage crosses the wire.
//
//   /api/ttrg/progress                  → whole-organisation progress
//   /api/ttrg/progress?dog=Draco        → that dog's campaign
//   /api/ttrg/progress?dogs=Draco,Lo    → several campaigns in one request

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const MILESTONES = [5, 25, 50, 75, 100];

/** Every campaign's goal: the dogs table first, then family campaigns. */
async function goalMap(supabase: ReturnType<typeof getServiceSupabase>) {
  const map = new Map<string, number>();
  const { data: dogRows } = await supabase.from("dogs").select("name, goal_amount");
  for (const d of dogRows || []) {
    const g = Number(d.goal_amount);
    if (g > 0 && d.name) map.set(String(d.name).trim().toLowerCase(), g);
  }
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/site-data/family-profiles.json?t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const profiles = await res.json();
      for (const p of Array.isArray(profiles) ? profiles : []) {
        const g = Number(p?.goalAmount);
        const name = String(p?.dogName || "").trim().toLowerCase();
        if (g > 0 && name && !map.has(name)) map.set(name, g);
      }
    }
  } catch { /* fall back to the site default */ }
  return map;
}

export async function GET(req: NextRequest) {
  const dog = (req.nextUrl.searchParams.get("dog") || "").trim();
  const many = (req.nextUrl.searchParams.get("dogs") || "").trim();
  const supabase = getServiceSupabase();

  // Batch mode — one request for a whole grid of campaign cards. Still
  // percentages only; the goals used in the arithmetic never leave the server.
  if (many) {
    try {
      const names = many.split(",").map(n => n.trim()).filter(Boolean).slice(0, 200);
      const { data: settings } = await supabase
        .from("site_settings").select("default_goal").eq("id", 1).single();
      const defaultGoal = Number(settings?.default_goal) || 50000;
      const goals = await goalMap(supabase);
      const { data: donations } = await supabase
        .from("donations").select("amount, status, dog_name");

      const byDog: Record<string, { percent: number; donors: number }> = {};
      for (const name of names) {
        const key = name.toLowerCase();
        const rows = (donations || []).filter(
          d => (d.status === "completed" || d.status === "pending") &&
               String(d.dog_name || "").trim().toLowerCase() === key,
        );
        const raised = rows.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const goal = goals.get(key) || defaultGoal;
        byDog[name] = {
          percent: goal > 0 ? Math.min(100, Math.round((raised / goal) * 1000) / 10) : 0,
          donors: rows.length,
        };
      }
      return NextResponse.json(
        { ok: true, byDog, milestones: MILESTONES },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch {
      return NextResponse.json({ ok: false, byDog: {}, milestones: MILESTONES });
    }
  }

  try {
    // Goal: the dog's own target when set, otherwise the site-wide default.
    const { data: settings } = await supabase
      .from("site_settings").select("default_goal").eq("id", 1).single();
    let goal = Number(settings?.default_goal) || 50000;

    if (dog) {
      // A dog in the dogs table may carry its own target...
      const { data: dogRows } = await supabase
        .from("dogs").select("goal_amount").ilike("name", dog).limit(1);
      const dogGoal = Number(dogRows?.[0]?.goal_amount);
      if (dogGoal > 0) {
        goal = dogGoal;
      } else {
        // ...otherwise the dog may belong to a family campaign, which keeps
        // its goal on the campaign record. Staff set it in the admin panel.
        try {
          const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/site-data/family-profiles.json?t=${Date.now()}`;
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const profiles = await res.json();
            const match = Array.isArray(profiles)
              ? profiles.find((p: { dogName?: string }) =>
                  (p.dogName || "").toLowerCase() === dog.toLowerCase())
              : null;
            const famGoal = Number(match?.goalAmount);
            if (famGoal > 0) goal = famGoal;
          }
        } catch { /* fall back to the site default */ }
      }
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

    // A count of supporters is safe to publish (it reveals no dollar figure)
    // and it is what the campaign pages display.
    const donors = (donations || [])
      .filter(d => d.status === "completed" || d.status === "pending").length;

    return NextResponse.json({
      ok: true,
      dog: dog || null,
      percent,
      donors,
      reached: MILESTONES.filter(m => percent >= m),
      nextMilestone: MILESTONES.find(m => percent < m) ?? null,
      milestones: MILESTONES,
      // NOTE: `goal` and `raised` are intentionally absent.
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, percent: 0, reached: [], nextMilestone: 5, milestones: MILESTONES });
  }
}
