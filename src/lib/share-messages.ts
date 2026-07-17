// Personalized share messages for dog and family campaigns.
// Each subject gets a stable but distinct message: a hash of its name/id
// picks from a pool of psychology-driven templates (urgency, identifiable
// victim, progress/goal proximity, hero framing, social proof) so no two
// campaigns read the same and none feel like a generic blast.

// ── Stage-aware default share titles ────────────────────────────────────────
// Each campaign's headline reflects where the dog actually is in the journey,
// so a fundraising-stage share reads "Fund Drako's Training", not a generic
// "Help Drako Stay With…". Admin-set custom titles always win over these.

export function dogStageTitle(name: string, stage?: string): string {
  switch (stage) {
    case "rescue": return `Just Rescued: Help Us Save ${name}`;
    case "rehabilitate": return `Help ${name} Heal — Fund Their Rehabilitation`;
    case "train": return `Fund ${name}'s Training`;
    case "recover": return `${name} Is Recovering — Help Finish the Journey`;
    case "rehome": return `${name} Is Ready for a Forever Home`;
    default: return `Help Us Save ${name}`;
  }
}

/** stage 1–5 of the family journey (see FAMILY_STAGES on the profile page) */
export function familyStageTitle(name: string, familyName: string, stage: number): string {
  switch (stage) {
    case 1: return `${familyName} Needs Help Keeping ${name}`;
    case 2: return `TTRG Is Stepping In for ${name}`;
    case 3: return `Meet ${name} — Their Campaign Just Launched`;
    case 4: return `Fund ${name}'s Training`;
    case 5: return `${name}'s Training Is Complete — See the Outcome`;
    default: return `Help ${name} Stay With ${familyName}`;
  }
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function firstSentence(text: string, max = 110): string {
  if (!text) return "";
  const period = text.indexOf(". ");
  let s = period > 20 && period < max ? text.slice(0, period + 1) : text.slice(0, max);
  if (s.length === max && text.length > max) s = s.slice(0, s.lastIndexOf(" ")) + "…";
  return s.trim();
}

export interface ShareSubject {
  id: string;
  name: string;          // dog's name
  story: string;         // short story / summary
  urgent?: boolean;
  goalAmount?: number;
  raisedAmount?: number;
  donorCount?: number;
  familyName?: string;   // set for family campaigns
  location?: string;
  /** admin-set custom headline; overrides the default title wording */
  customTitle?: string;
}

export function buildShareMessage(s: ShareSubject, url: string): { title: string; text: string; url: string } {
  const hook = firstSentence(s.story);
  const pct = s.goalAmount && s.goalAmount > 0 && s.raisedAmount !== undefined
    ? Math.min(100, Math.round((s.raisedAmount / s.goalAmount) * 100))
    : undefined;
  const remaining = s.goalAmount && s.raisedAmount !== undefined
    ? Math.max(0, s.goalAmount - s.raisedAmount)
    : undefined;

  const templates: Array<() => string> = [
    // Identifiable victim + direct ask
    () => `Meet ${s.name}. ${hook} Every share gets ${s.name} one step closer to a happy ending — will you take 10 seconds to help?`,
    // Urgency + agency
    () => `${s.name} needs help right now. ${hook} It only takes a minute to change this story — be the reason it ends well.`,
    // Goal proximity (people give more when a goal is nearly met)
    () => pct !== undefined && pct >= 40
      ? `${s.name} is already ${pct}% of the way there — just $${remaining} to go. ${hook} Help close the gap?`
      : `${s.name}'s journey is just beginning. ${hook} Early support matters most — be one of the first to stand with ${s.name}.`,
    // Social proof
    () => s.donorCount && s.donorCount > 3
      ? `${s.donorCount} people have already stepped up for ${s.name}. ${hook} Will you join them?`
      : `${hook} ${s.name} doesn't have a crowd behind them yet — that's exactly why your share matters.`,
    // Hero framing
    () => `You could be the reason ${s.name} makes it. ${hook} One tap to read the story, one share to save a life.`,
    // Emotional contrast / hope
    () => `${hook} With the right help, ${s.name}'s story can end in a warm bed instead of a shelter. Take a look:`,
  ];

  const pick = templates[hashString(s.id + s.name) % templates.length]();
  const title = s.customTitle
    || (s.familyName ? `Help ${s.name} stay with ${s.familyName}` : `Help us save ${s.name}`);
  return { title, text: pick, url };
}

// Share with the native sheet when available; otherwise copy the full
// message (text + link) so the user can paste it anywhere.
export async function shareSubject(s: ShareSubject, shareUrl: string): Promise<"shared" | "copied" | "failed"> {
  const { title, text, url } = buildShareMessage(s, shareUrl);
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      // text and url MUST be separate fields: iMessage only renders the
      // rich photo preview card when the URL arrives as its own component;
      // a URL embedded in the text shows as a bare domain chip instead.
      await navigator.share({ title, text, url });
      return "shared";
    } catch {
      /* user cancelled or unsupported — fall through to copy */
    }
  }
  const full = `${text}\n\n${url}`;
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(full);
      return "copied";
    } catch { /* ignore */ }
  }
  if (typeof window !== "undefined") prompt("Copy this message:", full);
  return "failed";
}
