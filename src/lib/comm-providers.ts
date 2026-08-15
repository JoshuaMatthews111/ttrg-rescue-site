// ═══════════════════════════════════════════════════════════════════════════
// Outbound providers: Resend (email) and SimpleTexting (SMS/MMS).
//
// Both are treated with the same scepticism: read the BODY, not just the HTTP
// status, and report per-recipient failures honestly. Never report a success
// count larger than what actually succeeded.
// ═══════════════════════════════════════════════════════════════════════════

import { normalisePhone } from "./messaging";

export interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// ─── Email · Resend ─────────────────────────────────────────────────────────

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl: string;
  from?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set" };

  const from = opts.from || process.env.RESEND_FROM ||
    "Team Trainers Rescue Group <give@teamtrainersrescuegroup.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        // Native unsubscribe button in Gmail / Apple Mail — the single biggest
        // deliverability win at volume.
        headers: {
          "List-Unsubscribe": `<${opts.unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok || body?.error) {
      const msg = body?.error?.message || body?.message || `Resend returned ${res.status}`;
      return { ok: false, error: String(msg) };
    }
    return { ok: true, id: body?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network error" };
  }
}

// ─── Text · SimpleTexting ───────────────────────────────────────────────────

export function smsConfigured(): boolean {
  return !!process.env.SIMPLETEXTING_API_KEY;
}

/**
 * IMPORTANT: SimpleTexting answers HTTP 200 even when it REFUSES a message.
 * The real outcome is in the JSON body:
 *   { code: 1, message: "The request succeeded", smsid: "..." }  -> sent
 *   { code: -5, message: "Invalid contact" }                     -> refused
 * Checking only the HTTP status reports every refusal to staff as a success.
 */
export async function sendSms(opts: {
  phone: string;
  text: string;
  mediaUrl?: string;
}): Promise<SendResult> {
  const key = process.env.SIMPLETEXTING_API_KEY;
  if (!key) return { ok: false, error: "SIMPLETEXTING_API_KEY is not set" };

  const phone = normalisePhone(opts.phone);
  if (!phone) return { ok: false, error: `Not a valid 10-digit number: ${opts.phone}` };

  try {
    let res: Response;

    if (opts.mediaUrl) {
      // MMS uses the older form-encoded v1 endpoint.
      const form = new URLSearchParams({
        token: key,
        phone,
        message: opts.text,
        mediaUrl: opts.mediaUrl,
      });
      res = await fetch("https://app2.simpletexting.com/v1/sendmms", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
    } else {
      const base = process.env.SIMPLETEXTING_BASE || "https://api-app2.simpletexting.com/v2/api";
      res = await fetch(`${base}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        // mode AUTO creates the contact on their side — no list upload needed,
        // so donor PII is not copied into another system.
        body: JSON.stringify({ contactPhone: phone, mode: "AUTO", text: opts.text }),
      });
    }

    const raw = await res.text();
    let body: Record<string, unknown> = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { /* non-JSON reply */ }

    const code = typeof body.code === "number" ? body.code : undefined;
    if (code !== undefined && code < 0) {
      return { ok: false, error: `${body.message || "refused"} (code ${code})` };
    }
    if (!res.ok) {
      return { ok: false, error: String(body.message || `SimpleTexting returned ${res.status}`) };
    }
    // A 200 with neither a success code nor an id is not a confirmed send.
    const id = (body.smsid || body.id || body.messageId) as string | undefined;
    if (code === undefined && !id) {
      return { ok: false, error: `Unrecognised reply from SimpleTexting: ${raw.slice(0, 120)}` };
    }
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network error" };
  }
}
