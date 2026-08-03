import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// ═══════════════════════════════════════════════════════════════════════════
// One-time recovery: backfill donor address/phone from Authorize.net.
//
// The giving form always collected address, city, state, zip and phone and
// sent them to Authorize.net inside <billTo>, but our donations table had no
// columns for them, so our own copy was lost. Authorize.net still holds it,
// so we can read each transaction back and restore the details.
//
// Protected with the Supabase service-role key (already set in Vercel) so a
// stranger can't trigger it. The response deliberately returns COUNTS ONLY —
// never donor PII.
// ═══════════════════════════════════════════════════════════════════════════

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const API_LOGIN_ID = process.env.AUTHNET_API_LOGIN_ID;
const TRANSACTION_KEY = process.env.AUTHNET_TRANSACTION_KEY;
const ENDPOINT = process.env.AUTHNET_ENV === "production"
  ? "https://api.authorize.net/xml/v1/request.api"
  : "https://apitest.authorize.net/xml/v1/request.api";

function tag(xml: string, name: string): string {
  // billTo values we care about are simple, non-nested elements.
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return m ? m[1].trim() : "";
}

async function getTransaction(transId: string): Promise<string | null> {
  const body = `<?xml version="1.0" encoding="utf-8"?>
<getTransactionDetailsRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${API_LOGIN_ID}</name>
    <transactionKey>${TRANSACTION_KEY}</transactionKey>
  </merchantAuthentication>
  <transId>${transId}</transId>
</getTransactionDetailsRequest>`;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body,
  });
  if (!res.ok) return null;
  return await res.text();
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || token !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!API_LOGIN_ID || !TRANSACTION_KEY) {
    return NextResponse.json({ error: "Authorize.net credentials not configured" }, { status: 500 });
  }

  const supabase = getServiceSupabase();
  const { data: rows, error } = await supabase
    .from("donations")
    .select("id, name, address, phone, transaction_id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = { checked: 0, recovered: 0, alreadyHadDetails: 0, noDataAtGateway: 0, lookupFailed: 0 };

  for (const row of rows || []) {
    if (row.address || row.phone) { results.alreadyHadDetails++; continue; }

    // Authorize.net transaction IDs are numeric; our own generated ids
    // (e.g. "don-1783705923867") were never real gateway transactions.
    const transId = String(row.transaction_id || row.id || "");
    if (!/^\d{6,}$/.test(transId)) { results.noDataAtGateway++; continue; }

    results.checked++;
    let xml: string | null = null;
    try { xml = await getTransaction(transId); } catch { xml = null; }
    if (!xml || xml.includes("<resultCode>Error</resultCode>")) { results.lookupFailed++; continue; }

    const update: Record<string, string> = {};
    const address = tag(xml, "address");
    const city = tag(xml, "city");
    const state = tag(xml, "state");
    const zip = tag(xml, "zip");
    const phone = tag(xml, "phoneNumber");
    if (address) update.address = address;
    if (city) update.city = city;
    if (state) update.state = state;
    if (zip) update.zip = zip;
    if (phone) update.phone = phone;
    if (!update.transaction_id && /^\d{6,}$/.test(transId)) update.transaction_id = transId;

    if (Object.keys(update).length === 0) { results.noDataAtGateway++; continue; }

    const { error: upErr } = await supabase.from("donations").update(update).eq("id", row.id);
    if (upErr) results.lookupFailed++;
    else results.recovered++;
  }

  return NextResponse.json({
    ok: true,
    ...results,
    note: "Counts only — no donor information is returned by this endpoint.",
  });
}
