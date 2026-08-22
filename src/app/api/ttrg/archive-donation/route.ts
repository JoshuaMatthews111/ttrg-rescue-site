import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

// Archive a donation — BOOKKEEPING ONLY.
//
// This deliberately does NOT contact Authorize.net. It exists so staff can
// take a test donation, a duplicate, or a gift they already refunded inside
// the gateway out of the dashboard totals, so the reported numbers reflect
// real money. The money itself is never moved from here; refunding is done
// in Authorize.net by whoever handles the account.
//
// Because nothing financial happens, archiving is fully reversible: the
// previous status is stored so Restore puts the record back exactly.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const ARCHIVE_REASONS = [
  "Test donation",
  "Refunded in Authorize.net",
  "Duplicate charge",
  "Chargeback",
  "Entered by mistake",
  "Other",
];

export async function POST(req: NextRequest) {
  const session = requireAdmin(req);
  if (!canSendMessages(session)) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const { donationId, reason, restore } = await req.json().catch(() => ({}));
  if (!donationId) {
    return NextResponse.json({ ok: false, error: "donationId is required" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data: rows } = await supabase
    .from("donations")
    .select("id, name, amount, status, status_before_archive")
    .eq("id", String(donationId))
    .limit(1);
  const donation = rows?.[0];
  if (!donation) {
    return NextResponse.json({ ok: false, error: "Donation not found" }, { status: 404 });
  }

  // ── Restore ──
  if (restore === true) {
    if (donation.status !== "archived") {
      return NextResponse.json({ ok: false, error: "That donation is not archived." }, { status: 400 });
    }
    const previous = donation.status_before_archive || "completed";
    const { error } = await supabase.from("donations").update({
      status: previous,
      archive_reason: "",
      archived_at: null,
      archived_by: "",
      status_before_archive: "",
    }).eq("id", donation.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({
      ok: true,
      action: "restored",
      status: previous,
      message: `${donation.name}'s $${Number(donation.amount).toFixed(0)} donation is back in the totals.`,
    });
  }

  // ── Archive ──
  if (donation.status === "archived") {
    return NextResponse.json({ ok: false, error: "That donation is already archived." }, { status: 400 });
  }

  const { error } = await supabase.from("donations").update({
    status: "archived",
    status_before_archive: donation.status || "completed",
    archive_reason: String(reason || "Other").slice(0, 120),
    archived_at: new Date().toISOString(),
    archived_by: session?.name || "",
  }).eq("id", donation.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    action: "archived",
    status: "archived",
    message: `$${Number(donation.amount).toFixed(0)} from ${donation.name} removed from the totals. The payment itself was not changed at Authorize.net.`,
  });
}
