"use client";

// Opt-in landing page for people who tap the link in Lorenzo's text.
//
// Built mobile-first: essentially everyone arrives here on a phone, from a
// text message. It captures who they are, records WHICH link brought them,
// and takes explicit, separate permission for email and text — storing the
// exact wording they agreed to as evidence.
//
// There are two ways in, and the choice is made up front:
//
//   Stay in the Loop      — updates by email/text, no money asked for
//   Join the Rescue Mission — a monthly gift at a level they pick
//
// Both finish on a thank-you pop-up. The mission path saves the person and
// their consent FIRST, then hands them to the secure donation form — so if
// they abandon at the card screen the office still has the lead and the
// permission to follow up.

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, Check, Loader2, ShieldCheck, PawPrint, Mail, ArrowRight, X, Sparkles,
} from "lucide-react";

// The exact sentence stored against each person as proof of consent.
const CONSENT_TEXT =
  "I want to hear from Team Trainers Rescue Group about rescue dogs, training programs and ways to help. " +
  "I understand I can stop at any time by replying STOP to a text or clicking unsubscribe in an email. " +
  "Message and data rates may apply. Message frequency varies. TTRG will never sell or share my information.";

const RECURRING_CONSENT =
  " I authorize Team Trainers Rescue Group to charge my chosen monthly gift to my payment method until I cancel, " +
  "and I understand I can change or cancel it at any time by contacting TTRG.";

/** Monthly giving levels. Each says what the money actually does. */
const LEVELS = [
  { amount: 10, name: "Friend", blurb: "Feeds a rescue dog for a week" },
  { amount: 25, name: "Supporter", blurb: "Covers a training session", popular: true },
  { amount: 50, name: "Champion", blurb: "Vaccines and vet care for one dog" },
  { amount: 100, name: "Guardian", blurb: "Sponsors a full week of training" },
];

type Path = "updates" | "mission";

function JoinForm() {
  const router = useRouter();

  const [path, setPath] = useState<Path>("updates");
  const [level, setLevel] = useState<number>(25);
  const [customLevel, setCustomLevel] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [emailConsent, setEmailConsent] = useState(true);
  const [smsConsent, setSmsConsent] = useState(true);

  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { path: Path; level: number | null }>(null);

  const chosenLevel = customLevel.trim() ? Number(customLevel) : level;

  // Capture where they came from, then log the visit.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const visitId = `v${Date.now()}${Math.floor(Math.random() * 1e6)}`;
    const attr = {
      visitId,
      // Short code for texts: /ttrg/join?src=lorenzo-text
      source: p.get("src") || p.get("source") || p.get("utm_source") || "direct",
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || p.get("c") || "",
      utm_content: p.get("utm_content") || "",
      referrer: document.referrer || "",
      landingPage: window.location.href,
    };
    setAttribution(attr);
    // A link can preselect the monthly path: /ttrg/join?join=mission
    if ((p.get("join") || "").toLowerCase() === "mission") setPath("mission");
    fetch("/api/ttrg/track-visit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attr),
    }).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!emailConsent && !smsConsent) { setError("Please tick at least one box so we know how to reach you."); return; }
    if (path === "mission") {
      if (!(chosenLevel > 0)) { setError("Please choose a monthly amount."); return; }
      if (!email.trim()) { setError("We need your email address to send your monthly receipts."); return; }
    }

    setBusy(true);
    try {
      const res = await fetch("/api/ttrg/join", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, city, state,
          emailConsent, smsConsent,
          membershipType: path,
          membershipLevel: path === "mission" ? chosenLevel : null,
          consentText: CONSENT_TEXT + (path === "mission" ? RECURRING_CONSENT : ""),
          ...attribution,
        }),
      });
      const data = await res.json();
      if (data.ok) setDone({ path, level: path === "mission" ? chosenLevel : null });
      else setError(data.error || "Something went wrong. Please try again.");
    } catch { setError("We couldn't reach the server. Please check your connection."); }
    setBusy(false);
  }

  /** Hand a new monthly member to the secure card form, prefilled. */
  function continueToPayment() {
    const q = new URLSearchParams({
      amount: String(done?.level ?? chosenLevel),
      type: "monthly",
      firstName, lastName, email, phone,
      source: attribution.source || "join-page",
    });
    router.push(`/ttrg/donate?${q.toString()}`);
  }

  const inp = "w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-[#1B2A4A] text-base focus:outline-none focus:border-[#C41E2A] transition-colors";

  return (
    <>
      <form onSubmit={submit} className="space-y-5">
        {/* ── The choice, made first ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPath("updates")}
            aria-pressed={path === "updates"}
            className={`text-left p-4 rounded-2xl border-2 transition-all ${
              path === "updates"
                ? "border-[#1B2A4A] bg-[#1B2A4A] text-white shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <Mail className={`w-6 h-6 mb-2 ${path === "updates" ? "text-white" : "text-[#1B2A4A]"}`} />
            <p className={`font-black ${path === "updates" ? "text-white" : "text-[#1B2A4A]"}`}>Stay in the Loop</p>
            <p className={`text-xs mt-1 leading-relaxed ${path === "updates" ? "text-white/70" : "text-[#1B2A4A]/55"}`}>
              Free. Texts and emails about the dogs — no donation needed.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPath("mission")}
            aria-pressed={path === "mission"}
            className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
              path === "mission"
                ? "border-[#C41E2A] bg-[#C41E2A] text-white shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5B841] text-[#1B2A4A]">
              Most impact
            </span>
            <Heart className={`w-6 h-6 mb-2 ${path === "mission" ? "text-white fill-white" : "text-[#C41E2A]"}`} />
            <p className={`font-black ${path === "mission" ? "text-white" : "text-[#1B2A4A]"}`}>Join the Rescue Mission</p>
            <p className={`text-xs mt-1 leading-relaxed ${path === "mission" ? "text-white/80" : "text-[#1B2A4A]/55"}`}>
              Give monthly at a level you choose — plus all the updates.
            </p>
          </button>
        </div>

        {/* ── Giving levels, only for the mission path ────────────────── */}
        {path === "mission" && (
          <div className="bg-[#FAFAF8] border-2 border-[#C41E2A]/20 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-[#1B2A4A]/50 uppercase tracking-wider">Choose your monthly level</p>
            <div className="grid grid-cols-2 gap-2.5">
              {LEVELS.map(l => {
                const active = !customLevel.trim() && level === l.amount;
                return (
                  <button
                    key={l.amount}
                    type="button"
                    onClick={() => { setLevel(l.amount); setCustomLevel(""); }}
                    aria-pressed={active}
                    className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                      active ? "border-[#C41E2A] bg-white shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {l.popular && (
                      <span className="absolute -top-2 right-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#F5B841] text-[#1B2A4A]">
                        Popular
                      </span>
                    )}
                    <p className="font-black text-[#1B2A4A] text-lg leading-none">
                      ${l.amount}<span className="text-xs font-bold text-[#1B2A4A]/40">/mo</span>
                    </p>
                    <p className="text-[11px] font-bold text-[#C41E2A] mt-1">{l.name}</p>
                    <p className="text-[10px] text-[#1B2A4A]/50 leading-snug mt-0.5">{l.blurb}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1B2A4A]/60">Or</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2A4A]/40 font-bold">$</span>
                <input
                  type="number" min={1} inputMode="decimal"
                  value={customLevel}
                  onChange={e => setCustomLevel(e.target.value)}
                  placeholder="Your own amount"
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-200 text-[#1B2A4A] focus:outline-none focus:border-[#C41E2A]"
                />
              </div>
              <span className="text-sm font-bold text-[#1B2A4A]/60">/mo</span>
            </div>
          </div>
        )}

        {/* ── Who they are ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name *" required className={inp} autoComplete="given-name" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className={inp} autoComplete="family-name" />
          </div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={path === "mission" ? "Email Address *" : "Email Address"} className={inp} autoComplete="email" inputMode="email" />
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile Number" className={inp} autoComplete="tel" inputMode="tel" />
          <div className="grid grid-cols-3 gap-3">
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={`${inp} col-span-2`} autoComplete="address-level2" />
            <input value={state} onChange={e => setState(e.target.value.toUpperCase())} maxLength={2} placeholder="State" className={inp} autoComplete="address-level1" />
          </div>
        </div>

        {/* Consent — deliberately separate, never bundled into one box. */}
        <div className="bg-[#FAFAF8] border border-slate-200 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-black text-[#1B2A4A]/50 uppercase tracking-wider">How would you like to hear from us?</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={emailConsent} onChange={e => setEmailConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-[#C41E2A] flex-shrink-0" />
            <span className="text-sm text-[#1B2A4A]/80 leading-relaxed">
              <b>Email me</b> about rescue dogs, training programs and ways to help.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-[#C41E2A] flex-shrink-0" />
            <span className="text-sm text-[#1B2A4A]/80 leading-relaxed">
              <b>Text me</b> updates about dogs who need help.
            </span>
          </label>
          <p className="text-[11px] text-[#1B2A4A]/45 leading-relaxed pt-1 border-t border-slate-200">
            You can stop any time — reply STOP to a text or click unsubscribe in an email.
            Message and data rates may apply; message frequency varies.
            TTRG will never sell or share your information.
            {path === "mission" && (
              <> Your monthly gift continues until you cancel; change or cancel it any time by contacting us.</>
            )}
          </p>
        </div>

        {error && <p className="text-sm text-[#C41E2A] font-medium">{error}</p>}

        <button type="submit" disabled={busy}
          className={`w-full text-white py-4 rounded-full font-black text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${
            path === "mission" ? "bg-[#C41E2A] hover:bg-[#A01825]" : "bg-[#1B2A4A] hover:bg-[#0F1B33]"
          }`}>
          {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining…</>
            : path === "mission"
              ? <><Heart className="w-5 h-5 fill-white" /> Join the Rescue Mission — ${chosenLevel > 0 ? chosenLevel : 0}/mo</>
              : <><Mail className="w-5 h-5" /> Stay in the Loop</>}
        </button>

        <p className="text-[11px] text-center text-[#1B2A4A]/40 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 501(c)(3) nonprofit · Your details stay with TTRG
        </p>
      </form>

      {/* ── Thank-you pop-up, shown for BOTH paths ───────────────────── */}
      {done && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog" aria-modal="true" aria-labelledby="join-thanks-title"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-7 text-center relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDone(null)} aria-label="Close"
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
              done.path === "mission" ? "bg-[#C41E2A]/10" : "bg-emerald-100"
            }`}>
              {done.path === "mission"
                ? <Heart className="w-10 h-10 text-[#C41E2A] fill-[#C41E2A]" />
                : <Check className="w-10 h-10 text-emerald-600" />}
            </div>

            <h2 id="join-thanks-title" className="text-2xl font-black text-[#1B2A4A] mb-3">
              Thank you{firstName ? `, ${firstName}` : ""}!
            </h2>

            {done.path === "mission" ? (
              <>
                <p className="text-[#1B2A4A]/65 leading-relaxed mb-2">
                  You&apos;ve joined the Rescue Mission at <b className="text-[#C41E2A]">${done.level}/month</b>.
                  You&apos;re now one of the people who keeps this going all year, not just once.
                </p>
                <p className="text-sm text-[#1B2A4A]/50 leading-relaxed mb-6">
                  One last step — enter your payment details on our secure form to start your monthly gift.
                </p>
                <button
                  onClick={continueToPayment}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-7 py-4 rounded-full font-black transition-colors"
                >
                  Continue to Secure Payment <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDone(null)}
                  className="mt-3 text-sm text-[#1B2A4A]/45 hover:text-[#1B2A4A]/70 transition-colors"
                >
                  I&apos;ll set up payment later
                </button>
                <p className="text-[11px] text-[#1B2A4A]/35 mt-4 leading-relaxed">
                  We&apos;ve saved your details and your updates are switched on either way.
                </p>
              </>
            ) : (
              <>
                <p className="text-[#1B2A4A]/65 leading-relaxed mb-6">
                  You&apos;re on the list. We&apos;ll keep you posted on the dogs you&apos;re helping —
                  the rescues, the training, and the happy endings.
                </p>
                <div className="bg-[#FAFAF8] border border-slate-200 rounded-2xl p-4 mb-5 text-left">
                  <p className="text-sm font-bold text-[#1B2A4A] flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#F5B841]" /> Want to do more?
                  </p>
                  <p className="text-xs text-[#1B2A4A]/55 leading-relaxed">
                    Monthly supporters are what let us say yes to the next dog. You can join the
                    Rescue Mission any time.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => { setDone(null); setPath("mission"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-7 py-3.5 rounded-full font-bold transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-white" /> Join the Rescue Mission
                  </button>
                  <Link
                    href="/ttrg/sponsor"
                    className="w-full inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-[#1B2A4A] px-7 py-3.5 rounded-full font-bold hover:bg-slate-50 transition-colors"
                  >
                    Meet the Dogs
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function JoinPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#1B2A4A] px-4 py-10 sm:py-14 text-center">
        <img src="/ttrg/ttrg-logo-circle.png" alt="Team Trainers Rescue Group" className="w-20 h-20 rounded-full mx-auto mb-4" />
        <p className="text-[#C41E2A] text-xs font-black uppercase tracking-[0.2em] mb-2">Join the mission</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight max-w-xl mx-auto">
          Become part of the team that gives dogs a second chance
        </h1>
        <p className="text-white/60 mt-4 max-w-lg mx-auto leading-relaxed">
          Lorenzo sent you here because you care about dogs. Join the supporters who make our
          rescue, training and rehoming work possible.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        <Suspense fallback={<div className="text-center py-10 text-[#1B2A4A]/40">Loading…</div>}>
          <JoinForm />
        </Suspense>
      </div>

      {/* Why */}
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="border-t border-slate-100 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          {[
            { icon: PawPrint, title: "Real dogs", text: "Follow the dogs you help, by name" },
            { icon: Heart, title: "Every dollar", text: "Food, medical care and training" },
            { icon: ShieldCheck, title: "No spam", text: "Only what matters, never sold on" },
          ].map(b => (
            <div key={b.title}>
              <b.icon className="w-6 h-6 text-[#C41E2A] mx-auto mb-2" />
              <p className="font-bold text-[#1B2A4A] text-sm">{b.title}</p>
              <p className="text-[#1B2A4A]/50 text-xs mt-1">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
