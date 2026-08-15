// ═══════════════════════════════════════════════════════════════════════════
// Message Center — shared logic for personalising and sending campaigns.
//
// Everything here is pure and server-safe. Personalisation MUST run on the
// server, once per recipient — never in the browser, never one pre-rendered
// body reused for everybody.
// ═══════════════════════════════════════════════════════════════════════════

export const NAME_FALLBACK = "Friend";

/** Names that are placeholders rather than people. */
const JUNK_NAMES = new Set(["n/a", "na", "none", "unknown", "client", "test", "owner", "null", "undefined"]);

/**
 * Turn an imported name into something safe to greet a donor with.
 * "MARY ANN" -> "Mary Ann"   (never shout at a donor)
 * "bob"      -> "Bob"
 * "mcdonald" -> "McDonald"
 * junk/blank -> null (caller substitutes NAME_FALLBACK)
 */
export function cleanName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (trimmed.length > 40) return null;
  if (/\d/.test(trimmed)) return null;          // "unknown2", "Donor123"
  if (trimmed.includes("@")) return null;        // an email landed in the name column
  if (JUNK_NAMES.has(trimmed.toLowerCase())) return null;

  const titled = trimmed
    .toLowerCase()
    .split(/\s+/)
    .map(word =>
      word
        // Hyphenated and apostrophed parts each get capitalised: mary-jane, o'brien
        .split(/([-'])/)
        .map(part => (part === "-" || part === "'" ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join("")
    )
    .join(" ");

  // Scottish/Irish forms: mcdonald -> McDonald, macleod -> MacLeod, o'brien -> O'Brien
  return titled
    .replace(/\bMc([a-z])/g, (_, c: string) => `Mc${c.toUpperCase()}`)
    .replace(/\bMac([a-z])(?=[a-z]{2,})/g, (_, c: string) => `Mac${c.toUpperCase()}`)
    .replace(/\bO'([a-z])/g, (_, c: string) => `O'${c.toUpperCase()}`);
}

/** A cleaned first name, or "Friend" when the source is unusable. */
export function greetingName(raw: string | null | undefined): string {
  return cleanName(raw) ?? NAME_FALLBACK;
}

/** Digits only; drop a leading US country code. */
export function normalisePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? digits : null;
}

export interface MergeContact {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  city?: string | null;
  state?: string | null;
  email?: string | null;
}

/**
 * Replace merge tags for ONE recipient, then strip any tag we don't know.
 * A donor must never see raw {{braces}} — that is the most embarrassing
 * failure mode of a mail merge.
 */
export function personalise(body: string, contact: MergeContact, unsubscribeUrl = ""): string {
  const first = greetingName(contact.first_name);
  const last = cleanName(contact.last_name) ?? "";
  const composed = [first === NAME_FALLBACK ? "" : first, last].filter(Boolean).join(" ");
  const full = cleanName(contact.full_name) ?? (composed || NAME_FALLBACK);

  const values: Record<string, string> = {
    first_name: first,
    last_name: last,
    full_name: full,
    city: contact.city?.trim() || "",
    state: contact.state?.trim() || "",
    unsubscribe: unsubscribeUrl,
  };

  let out = body.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    const k = key.toLowerCase();
    return k in values ? values[k] : match;
  });

  // Anything still wrapped in braces was never a real tag — remove it.
  out = out.replace(/\{\{[^}]*\}\}/g, "");
  return out;
}

// ─── SMS helpers ────────────────────────────────────────────────────────────

/** GSM-7 is 160 chars/segment; anything with unicode drops to 70. */
export function smsSegments(text: string): { chars: number; segments: number; unicode: boolean } {
  const chars = text.length;
  const unicode = /[^\x00-\x7F]/.test(text);
  const per = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153; // concatenated messages lose room to the header
  const segments = chars === 0 ? 0 : chars <= per ? 1 : Math.ceil(chars / multi);
  return { chars, segments, unicode };
}

/** Phones only draw a rich preview when the message ENDS with the link. */
export function linkIsLast(text: string): boolean {
  const urls = text.match(/https?:\/\/\S+/g);
  if (!urls) return true;
  return text.trim().endsWith(urls[urls.length - 1]);
}
