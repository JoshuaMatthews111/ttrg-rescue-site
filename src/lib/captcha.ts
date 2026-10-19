// CAPTCHA for the card forms. NMI Payments (TTRG's processor) blocked the
// terminal in Oct 2026 after bots used /api/ttrg/charge to test stolen card
// numbers, and required a CAPTCHA on the checkout page before reinstating it.
//
// This is a self-hosted ALTCHA challenge: the donor ticks "I'm not a robot",
// their browser solves a signed proof-of-work puzzle, and the charge route
// refuses any request that doesn't carry a fresh, valid, unused solution.
// No third-party account or API key is involved.

import crypto from "crypto";
import { create, CappedMap } from "altcha-lib/frameworks/nextjs";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

// Prefer a dedicated secret; otherwise derive one from the gateway key that
// production already has, so the site never runs with a guessable secret.
function secret(label: string): string {
  const base = process.env.ALTCHA_HMAC_SECRET || process.env.AUTHNET_TRANSACTION_KEY || "";
  if (!base) throw new Error("No secret configured for CAPTCHA signing.");
  return crypto.createHmac("sha256", base).update(`ttrg-captcha:${label}`).digest("hex");
}

// A solved challenge can be spent once. This lives per server instance, and
// the five-minute expiry below covers the gap between instances.
const used = new CappedMap<string, boolean>({ maxSize: 10_000 });

let instance: ReturnType<typeof create> | null = null;
export function captcha() {
  instance ??= create({
    deriveKey,
    hmacSignatureSecret: secret("signature"),
    hmacKeySignatureSecret: secret("key"),
    store: used,
    createChallengeParameters: () => ({
      algorithm: "PBKDF2/SHA-256",
      cost: 5_000,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }),
  });
  return instance;
}

/** True only for a fresh, correctly signed, never-before-used solution. */
export async function verifyCaptcha(payload: unknown): Promise<boolean> {
  if (typeof payload !== "string" || !payload) return false;
  try {
    const { error } = await captcha().verify(
      payload, deriveKey, secret("signature"), secret("key"), used,
    );
    return !error;
  } catch {
    return false;
  }
}

// Card testers hammer the endpoint from one address; a real donor retrying a
// typo needs a handful of attempts at most.
const attempts = new Map<string, number[]>();
export function tooManyAttempts(ip: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter(t => now - t < windowMs);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 10_000) attempts.clear();
  return recent.length > limit;
}
