// ═══════════════════════════════════════════════════════════════════════════
// Server-verifiable admin session.
//
// The rest of the portal gates on a localStorage flag, which the browser owns
// and anyone can set. That is tolerable for screens that only read data, but
// the Message Center can spend money and mail 30,000 people — so its API is
// protected by a signed, httpOnly cookie the browser cannot forge or read.
// ═══════════════════════════════════════════════════════════════════════════

import crypto from "crypto";
import type { NextRequest } from "next/server";

const COOKIE = "ttrg_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY  // always present in this deployment
    || "";
}

/** value = base64(payload).hmac  — payload holds the user and an expiry. */
export function createSessionValue(name: string, role: string): string {
  const payload = JSON.stringify({ name, role, exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const b64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(b64).digest("hex");
  return `${b64}.${sig}`;
}

export interface AdminSession { name: string; role: string; exp: number }

export function readSessionValue(value: string | undefined): AdminSession | null {
  if (!value || !secret()) return null;
  const [b64, sig] = value.split(".");
  if (!b64 || !sig) return null;

  const expected = crypto.createHmac("sha256", secret()).update(b64).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as AdminSession;
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch { return null; }
}

export function sessionCookie(value: string): string {
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}
export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

/** Returns the session, or null when the caller is not an authenticated admin. */
export function requireAdmin(req: NextRequest): AdminSession | null {
  return readSessionValue(req.cookies.get(COOKIE)?.value);
}

/** Only these roles may run the Message Center. */
export function canSendMessages(session: AdminSession | null): boolean {
  return !!session && (session.role === "super_admin" || session.role === "admin");
}
