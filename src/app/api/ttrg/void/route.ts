import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, canSendMessages } from "@/lib/admin-auth";

// Void (or, when already settled, refund) a donation from the staff portal,
// so test charges and mistakes stop skewing the numbers.
//
// Authorize.net's rule: a transaction can be VOIDED only until it settles
// (usually the same evening). After settlement the only way to reverse it is
// a linked REFUND, which needs the card's last 4 — we send those from the
// stored record. The response tells staff plainly which one happened.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_LOGIN_ID = process.env.AUTHNET_API_LOGIN_ID;
const TRANSACTION_KEY = process.env.AUTHNET_TRANSACTION_KEY;
const ENDPOINT = process.env.AUTHNET_ENV === "production"
  ? "https://api.authorize.net/xml/v1/request.api"
  : "https://apitest.authorize.net/xml/v1/request.api";

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return m ? m[1].trim() : "";
}

async function gateway(xmlBody: string): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: xmlBody,
  });
  return await res.text();
}

function txRequest(inner: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${API_LOGIN_ID}</name>
    <transactionKey>${TRANSACTION_KEY}</transactionKey>
  </merchantAuthentication>
  <transactionRequest>
    ${inner}
  </transactionRequest>
</createTransactionRequest>`;
}

export async function POST(req: NextRequest) {
  const session = requireAdmin(req);
  if (!canSendMessages(session)) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  if (!API_LOGIN_ID || !TRANSACTION_KEY) {
    return NextResponse.json({ ok: false, error: "Authorize.net credentials are not configured" }, { status: 500 });
  }

  const { donationId } = await req.json().catch(() => ({}));
  if (!donationId) {
    return NextResponse.json({ ok: false, error: "donationId is required" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data: rows } = await supabase
    .from("donations")
    .select("id, name, amount, status, last4, transaction_id")
    .eq("id", String(donationId))
    .limit(1);
  const donation = rows?.[0];
  if (!donation) return NextResponse.json({ ok: false, error: "Donation not found" }, { status: 404 });
  if (donation.status === "voided" || donation.status === "refunded") {
    return NextResponse.json({ ok: false, error: `This donation is already ${donation.status}.` }, { status: 400 });
  }

  const transId = String(donation.transaction_id || donation.id || "");
  if (!/^\d{6,}$/.test(transId)) {
    // Not a real gateway transaction (e.g. a locally generated test id) —
    // there is no money to reverse, so just take it out of the numbers.
    await supabase.from("donations").update({ status: "voided" }).eq("id", donation.id);
    return NextResponse.json({ ok: true, action: "removed", message: "No payment existed at Authorize.net for this record — it has been marked voided so it no longer counts in totals." });
  }

  // 1) Try a VOID (works until the batch settles).
  const voidXml = await gateway(txRequest(
    `<transactionType>voidTransaction</transactionType>
    <refTransId>${transId}</refTransId>`
  ));
  if (tag(voidXml, "resultCode") === "Ok" && tag(voidXml, "responseCode") === "1") {
    await supabase.from("donations").update({ status: "voided" }).eq("id", donation.id);
    return NextResponse.json({ ok: true, action: "voided", message: `Voided at Authorize.net — the ${donation.name} charge will not settle and no longer counts in totals.` });
  }
  const voidError = tag(voidXml, "errorText") || tag(voidXml, "text") || "void refused";

  // 2) Already settled → linked REFUND using the stored last 4.
  const last4 = String(donation.last4 || "").replace(/[^0-9]/g, "").slice(-4);
  if (last4.length === 4) {
    const refundXml = await gateway(txRequest(
      `<transactionType>refundTransaction</transactionType>
    <amount>${Number(donation.amount).toFixed(2)}</amount>
    <payment><creditCard><cardNumber>${last4}</cardNumber><expirationDate>XXXX</expirationDate></creditCard></payment>
    <refTransId>${transId}</refTransId>`
    ));
    if (tag(refundXml, "resultCode") === "Ok" && tag(refundXml, "responseCode") === "1") {
      await supabase.from("donations").update({ status: "refunded" }).eq("id", donation.id);
      return NextResponse.json({ ok: true, action: "refunded", message: `The charge had already settled, so it was refunded instead ($${Number(donation.amount).toFixed(2)} back to the card). It no longer counts in totals.` });
    }
    const refundError = tag(refundXml, "errorText") || tag(refundXml, "text") || "refund refused";
    return NextResponse.json({ ok: false, error: `Could not void (${voidError}) or refund (${refundError}). If the charge settled today, try again tomorrow — settled charges can only be refunded after the batch closes.` }, { status: 502 });
  }

  return NextResponse.json({ ok: false, error: `Could not void: ${voidError}. A refund needs the card's last 4 digits, which this record is missing — refund it from the Authorize.net dashboard instead.` }, { status: 502 });
}
