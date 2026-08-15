// Crypto-backed helpers for unsubscribe links. SERVER ONLY — importing this
// into a client component would pull node:crypto into the browser bundle.

import crypto from "crypto";

// ─── Unsubscribe links ──────────────────────────────────────────────────────

/** HMAC-SHA256 of the lower-cased email, truncated — so links can't be edited. */
export function unsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || "";
  return crypto.createHmac("sha256", secret).update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = unsubscribeToken(email);
  const a = Buffer.from(token.toLowerCase(), "utf8");
  const b = Buffer.from(expected.toLowerCase(), "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function publicBaseUrl(): string {
  return (process.env.PUBLIC_BASE_URL || "https://teamtrainersrescuegroup.com").replace(/\/$/, "");
}

export function unsubscribeUrl(email: string, channel: "email" | "sms" = "email"): string {
  const qs = new URLSearchParams({ e: email, t: unsubscribeToken(email) });
  if (channel === "sms") qs.set("c", "sms");
  return `${publicBaseUrl()}/api/ttrg/unsubscribe?${qs.toString()}`;
}

