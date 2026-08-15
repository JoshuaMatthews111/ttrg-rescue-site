import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { verifyUnsubscribeToken } from "@/lib/messaging-tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function unsubscribe(email: string, token: string, channel: string) {
  // The token is an HMAC of this address, so the link cannot be edited to
  // unsubscribe somebody else.
  if (!verifyUnsubscribeToken(email, token)) return { ok: false, status: 403 };

  const supabase = getServiceSupabase();
  const field = channel === "sms" ? { sms_consent: false } : { email_consent: false };
  const { error } = await supabase
    .from("contacts")
    .update({ ...field, updated_at: new Date().toISOString() })
    .ilike("email", email.trim());
  if (error) return { ok: false, status: 500 };
  return { ok: true, status: 200 };
}

function page(title: string, message: string, ok: boolean): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:48px 16px;">
<table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td align="center" bgcolor="#1B2A4A" style="padding:24px;">
<img src="https://teamtrainersrescuegroup.com/ttrg/ttrg-logo-circle.png" width="64" height="64" style="border-radius:32px;display:block;" alt="TTRG">
<p style="margin:12px 0 0;color:#fff;font-weight:bold;letter-spacing:1px;font-size:14px;">TEAM TRAINERS RESCUE GROUP</p>
</td></tr>
<tr><td style="padding:32px;text-align:center;">
<h1 style="margin:0 0 12px;font-size:22px;color:${ok ? "#1B2A4A" : "#C41E2A"};">${title}</h1>
<p style="margin:0 0 20px;font-size:15px;line-height:24px;color:#555;">${message}</p>
<a href="https://teamtrainersrescuegroup.com" style="display:inline-block;background:#C41E2A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-weight:bold;font-size:14px;">Back to our site</a>
</td></tr></table></td></tr></table></body></html>`;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e") || "";
  const token = req.nextUrl.searchParams.get("t") || "";
  const channel = req.nextUrl.searchParams.get("c") || "email";

  const result = await unsubscribe(email, token, channel);
  const html = result.ok
    ? page("You're unsubscribed", `We've removed <b>${email.replace(/</g, "&lt;")}</b> from our ${channel === "sms" ? "text" : "email"} list. You won't hear from us this way again.`, true)
    : page("That link isn't valid", "We couldn't verify this unsubscribe link. Please reply to any of our messages and we'll remove you by hand.", false);

  return new NextResponse(html, {
    status: result.ok ? 200 : result.status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/** RFC 8058 one-click: Gmail/Apple POST to this same URL. */
export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e") || "";
  const token = req.nextUrl.searchParams.get("t") || "";
  const channel = req.nextUrl.searchParams.get("c") || "email";
  const result = await unsubscribe(email, token, channel);
  return NextResponse.json({ ok: result.ok }, { status: result.ok ? 200 : result.status });
}
