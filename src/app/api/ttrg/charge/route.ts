import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const API_LOGIN_ID = process.env.AUTHNET_API_LOGIN_ID!;
const TRANSACTION_KEY = process.env.AUTHNET_TRANSACTION_KEY!;
const SIGNATURE_KEY = process.env.AUTHNET_SIGNATURE_KEY!;
const IS_PRODUCTION = process.env.AUTHNET_ENV === "production";

const ENDPOINT = IS_PRODUCTION
  ? "https://api.authorize.net/xml/v1/request.api"
  : "https://apitest.authorize.net/xml/v1/request.api";

interface ChargeBody {
  amount: number;
  cardNumber: string;
  expDate: string; // MMYY
  cvv: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  donationType: "once" | "monthly";
  dogName?: string;
  description?: string;
}

function verifyTransactionSignature(
  transId: string,
  amount: string,
): string {
  const value = `^${API_LOGIN_ID}^${transId}^${amount}^`;
  const hash = crypto
    .createHmac("sha512", Buffer.from(SIGNATURE_KEY, "hex"))
    .update(value)
    .digest("hex")
    .toUpperCase();
  return hash;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChargeBody = await req.json();

    // Basic validation
    if (!body.amount || body.amount < 1) {
      return NextResponse.json({ success: false, error: "Invalid donation amount." }, { status: 400 });
    }
    if (!body.cardNumber || !body.expDate || !body.cvv) {
      return NextResponse.json({ success: false, error: "Card details are required." }, { status: 400 });
    }
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({ success: false, error: "Name and email are required." }, { status: 400 });
    }

    const orderDesc = body.dogName
      ? `TTRG Donation for ${body.dogName}`
      : body.description || "TTRG Donation";

    // ─── ONE-TIME CHARGE ───
    if (body.donationType === "once") {
      const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${API_LOGIN_ID}</name>
    <transactionKey>${TRANSACTION_KEY}</transactionKey>
  </merchantAuthentication>
  <transactionRequest>
    <transactionType>authCaptureTransaction</transactionType>
    <amount>${body.amount.toFixed(2)}</amount>
    <payment>
      <creditCard>
        <cardNumber>${body.cardNumber.replace(/\s/g, "")}</cardNumber>
        <expirationDate>${body.expDate}</expirationDate>
        <cardCode>${body.cvv}</cardCode>
      </creditCard>
    </payment>
    <order>
      <invoiceNumber>TTRG-${Date.now()}</invoiceNumber>
      <description>${orderDesc}</description>
    </order>
    <customer>
      <email>${body.email}</email>
    </customer>
    <billTo>
      <firstName>${body.firstName}</firstName>
      <lastName>${body.lastName}</lastName>
      ${body.address ? `<address>${body.address}</address>` : ""}
      ${body.city ? `<city>${body.city}</city>` : ""}
      ${body.state ? `<state>${body.state}</state>` : ""}
      ${body.zip ? `<zip>${body.zip}</zip>` : ""}
      ${body.phone ? `<phoneNumber>${body.phone}</phoneNumber>` : ""}
    </billTo>
  </transactionRequest>
</createTransactionRequest>`;

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlPayload,
      });

      const text = await response.text();
      return parseTransactionResponse(text, body.amount);
    }

    // ─── MONTHLY (ARB — Automated Recurring Billing) ───
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start tomorrow
    const startDateStr = startDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const arbPayload = `<?xml version="1.0" encoding="utf-8"?>
<ARBCreateSubscriptionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${API_LOGIN_ID}</name>
    <transactionKey>${TRANSACTION_KEY}</transactionKey>
  </merchantAuthentication>
  <subscription>
    <name>${orderDesc} - Monthly</name>
    <paymentSchedule>
      <interval>
        <length>1</length>
        <unit>months</unit>
      </interval>
      <startDate>${startDateStr}</startDate>
      <totalOccurrences>9999</totalOccurrences>
    </paymentSchedule>
    <amount>${body.amount.toFixed(2)}</amount>
    <payment>
      <creditCard>
        <cardNumber>${body.cardNumber.replace(/\s/g, "")}</cardNumber>
        <expirationDate>${body.expDate}</expirationDate>
        <cardCode>${body.cvv}</cardCode>
      </creditCard>
    </payment>
    <customer>
      <email>${body.email}</email>
      ${body.phone ? `<phoneNumber>${body.phone}</phoneNumber>` : ""}
    </customer>
    <billTo>
      <firstName>${body.firstName}</firstName>
      <lastName>${body.lastName}</lastName>
    </billTo>
  </subscription>
</ARBCreateSubscriptionRequest>`;

    const arbResponse = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: arbPayload,
    });

    const arbText = await arbResponse.text();
    return parseSubscriptionResponse(arbText);

  } catch (err: unknown) {
    console.error("Authorize.Net charge error:", err);
    return NextResponse.json(
      { success: false, error: "Payment processing failed. Please try again." },
      { status: 500 }
    );
  }
}

function parseTransactionResponse(xml: string, amount: number) {
  // Extract resultCode
  const resultCode = xml.match(/<resultCode>(.*?)<\/resultCode>/)?.[1];
  const messageText = xml.match(/<message>[\s\S]*?<text>(.*?)<\/text>/)?.[1] || "";
  const transId = xml.match(/<transId>(.*?)<\/transId>/)?.[1] || "";
  const responseCode = xml.match(/<responseCode>(.*?)<\/responseCode>/)?.[1];

  if (resultCode === "Ok" && responseCode === "1") {
    // Verify signature if transId present
    let signatureValid = false;
    if (transId && SIGNATURE_KEY) {
      const transHashSha2 = xml.match(/<transHashSha2>(.*?)<\/transHashSha2>/)?.[1] || "";
      const expected = verifyTransactionSignature(transId, amount.toFixed(2));
      signatureValid = transHashSha2.toUpperCase() === expected;
    }

    return NextResponse.json({
      success: true,
      transactionId: transId,
      message: "Payment processed successfully! Thank you for your donation.",
      signatureVerified: signatureValid,
    });
  }

  // Error
  const errorText = xml.match(/<error>[\s\S]*?<errorText>(.*?)<\/errorText>/)?.[1] || messageText || "Transaction declined.";
  return NextResponse.json({ success: false, error: errorText }, { status: 400 });
}

function parseSubscriptionResponse(xml: string) {
  const resultCode = xml.match(/<resultCode>(.*?)<\/resultCode>/)?.[1];
  const messageText = xml.match(/<message>[\s\S]*?<text>(.*?)<\/text>/)?.[1] || "";
  const subscriptionId = xml.match(/<subscriptionId>(.*?)<\/subscriptionId>/)?.[1] || "";

  if (resultCode === "Ok") {
    return NextResponse.json({
      success: true,
      subscriptionId,
      message: "Monthly donation set up successfully! Thank you for your ongoing support.",
    });
  }

  const errorText = xml.match(/<error>[\s\S]*?<errorText>(.*?)<\/errorText>/)?.[1] || messageText || "Subscription setup failed.";
  return NextResponse.json({ success: false, error: errorText }, { status: 400 });
}
