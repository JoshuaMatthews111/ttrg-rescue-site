"use client";

// Opt-in landing page for people who tap the link in Lorenzo's text.
//
// Built mobile-first: essentially everyone arrives here on a phone, from a
// text message. It captures who they are, records WHICH link brought them,
// and takes explicit, separate permission for email and text — storing the
// exact wording they agreed to as evidence.
//
// Two buttons, two ways in:
//
//   Stay in the Loop        — updates by email/text, no money asked for
//   Join the Rescue Mission — a gift, chosen inside the thank-you pop-up
//
// Both save the person and their consent FIRST, then show a thank-you pop-up.
// Everything after that — picking an amount, entering a card — happens inside
// that pop-up, so nobody is thrown onto the full donation page mid-decision.
// If they abandon at the card step the office still has the lead and the
// permission to follow up.

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Heart, Check, Loader2, ShieldCheck, PawPrint, Mail, X, Sparkles, Lock,
} from "lucide-react";
import Confetti from "@/components/ttrg/Confetti";

// The exact sentence stored against each person as proof of consent.
const CONSENT_TEXT =
  "I want to hear from Team Trainers Rescue Group about rescue dogs, training programs and ways to help. " +
  "I understand I can stop at any time by replying STOP to a text or clicking unsubscribe in an email. " +
  "Message and data rates may apply. Message frequency varies. TTRG will never sell or share my information.";

const RECURRING_CONSENT =
  " I authorize Team Trainers Rescue Group to charge my chosen monthly gift to my payment method until I cancel, " +
  "and I understand I can change or cancel it at any time by contacting TTRG.";

/** Monthly giving levels. Each says what the money actually does. */
const MONTHLY_LEVELS = [
  { amount: 10, name: "Friend", blurb: "Feeds a dog for a week" },
  { amount: 25, name: "Supporter", blurb: "Covers a training session", popular: true },
  { amount: 50, name: "Champion", blurb: "Vaccines and vet care" },
  { amount: 100, name: "Guardian", blurb: "A full week of training" },
];

/** Small one-time amounts, for people not ready to commit monthly. */
const ONCE_LEVELS = [10, 25, 50, 100];

type Path = "updates" | "mission";
type Give = "monthly" | "once";

function formatCard(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function JoinForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [emailConsent, setEmailConsent] = useState(true);
  const [smsConsent, setSmsConsent] = useState(true);

  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Path | null>(null);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState<Path | null>(null);

  // Pop-up giving state.
  const [give, setGive] = useState<Give>("monthly");
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [paid, setPaid] = useState<{ amount: number; give: Give } | null>(null);

  const chosenAmount = customAmount.trim() ? Number(customAmount) : amount;

  // Both boxes start ticked, so most people leave one ticked without filling
  // the matching field. That must not block them: record the permission we can
  // actually act on, and nudge for the missing detail.
  const canEmail = emailConsent && !!email.trim();
  const canSms = smsConsent && !!phone.trim();

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
    fetch("/api/ttrg/track-visit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attr),
    }).catch(() => {});
  }, []);

  /** Save the person and their consent, then open the thank-you pop-up. */
  async function join(path: Path) {
    setError("");
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!emailConsent && !smsConsent) { setError("Please tick at least one box so we know how to reach you."); return; }
    if (!canEmail && !canSms) {
      setError(emailConsent && smsConsent
        ? "Please add your email address or mobile number so we can reach you."
        : emailConsent
          ? "Please add your email address so we can reach you."
          : "Please add your mobile number so we can text you.");
      return;
    }
    if (path === "mission" && !email.trim()) {
      setError("We need your email address to send your donation receipt.");
      return;
    }

    setBusy(path);
    try {
      const res = await fetch("/api/ttrg/join", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, city, state,
          emailConsent: canEmail, smsConsent: canSms,
          membershipType: path,
          // The level is chosen in the pop-up; record the default for now and
          // update it when they actually give.
          membershipLevel: path === "mission" ? amount : null,
          consentText: CONSENT_TEXT + (path === "mission" ? RECURRING_CONSENT : ""),
          ...attribution,
        }),
      });
      const data = await res.json();
      if (data.ok) setJoined(path);
      else setError(data.error || "Something went wrong. Please try again.");
    } catch { setError("We couldn't reach the server. Please check your connection."); }
    setBusy(null);
  }

  /** Charge the chosen gift without ever leaving this page. */
  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setPayError("");
    if (!lastName.trim()) { setPayError("Please add your last name — the bank needs it."); return; }
    if (!(chosenAmount >= 1)) { setPayError("Please choose an amount."); return; }
    const exp = expiry.replace(/\D/g, "");
    if (exp.length !== 4) { setPayError("Please enter the expiry date as MM/YY."); return; }

    setPaying(true);
    try {
      const res = await fetch("/api/ttrg/charge", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: chosenAmount,
          cardNumber: cardNumber.replace(/\s/g, ""),
          expDate: exp,
          cvv,
          firstName, lastName, email,
          phone: phone || undefined,
          city: city || undefined,
          state: state || undefined,
          zip: zip || undefined,
          donationType: give === "monthly" ? "monthly" : "once",
          referralSource: attribution.source || "Join page",
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Server re-checks that a payment really exists before trusting this.
        if (give === "monthly") {
          fetch("/api/ttrg/membership-activate", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, level: chosenAmount }),
          }).catch(() => {});
        }
        setPaid({ amount: chosenAmount, give });
      } else {
        setPayError(data.error || "That payment didn't go through. Please check the card details.");
      }
    } catch { setPayError("We couldn't reach the payment system. Please try again."); }
    setPaying(false);
  }

  const inp = "w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-[#1B2A4A] text-base focus:outline-none focus:border-[#C41E2A] transition-colors";
  const smallInp = "w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-[#1B2A4A] focus:outline-none focus:border-[#C41E2A]";

  function closeAll() {
    setJoined(null); setPayOpen(false); setPaid(null); setPayError("");
    setCardNumber(""); setExpiry(""); setCvv(""); setZip("");
  }

  return (
    <>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name *" className={inp} autoComplete="given-name" />
          <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className={inp} autoComplete="family-name" />
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className={inp} autoComplete="email" inputMode="email" />
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile Number" className={inp} autoComplete="tel" inputMode="tel" />
        <div className="grid grid-cols-3 gap-3">
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={`${inp} col-span-2`} autoComplete="address-level2" />
          <input value={state} onChange={e => setState(e.target.value.toUpperCase())} maxLength={2} placeholder="State" className={inp} autoComplete="address-level1" />
        </div>

        {/* Consent — deliberately separate, never bundled into one box. */}
        <div className="bg-[#FAFAF8] border border-slate-200 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-black text-[#1B2A4A]/50 uppercase tracking-wider">How would you like to hear from us?</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={emailConsent} onChange={e => setEmailConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-[#C41E2A] flex-shrink-0" />
            <span className="text-sm text-[#1B2A4A]/80 leading-relaxed">
              <b>Email me</b> about rescue dogs, training programs and ways to help.
              {emailConsent && !email.trim() && (
                <em className="block text-[11px] text-[#1B2A4A]/45 not-italic mt-0.5">
                  Add your email address above and we&apos;ll switch this on.
                </em>
              )}
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-[#C41E2A] flex-shrink-0" />
            <span className="text-sm text-[#1B2A4A]/80 leading-relaxed">
              <b>Text me</b> updates about dogs who need help.
              {smsConsent && !phone.trim() && (
                <em className="block text-[11px] text-[#1B2A4A]/45 not-italic mt-0.5">
                  Add your mobile number above and we&apos;ll switch this on.
                </em>
              )}
            </span>
          </label>
          <p className="text-[11px] text-[#1B2A4A]/45 leading-relaxed pt-1 border-t border-slate-200">
            You can stop any time — reply STOP to a text or click unsubscribe in an email.
            Message and data rates may apply; message frequency varies.
            TTRG will never sell or share your information.
          </p>
        </div>

        {error && <p className="text-sm text-[#C41E2A] font-medium">{error}</p>}

        {/* ── The two ways in ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button" onClick={() => join("updates")} disabled={busy !== null}
            className="text-left p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#1B2A4A] hover:shadow-lg disabled:opacity-60 transition-all"
          >
            <Mail className="w-6 h-6 mb-2 text-[#1B2A4A]" />
            <p className="font-black text-[#1B2A4A] flex items-center gap-2">
              {busy === "updates" && <Loader2 className="w-4 h-4 animate-spin" />} Stay in the Loop
            </p>
            <p className="text-xs mt-1 leading-relaxed text-[#1B2A4A]/55">
              Free. Texts and emails about the dogs — no donation needed.
            </p>
          </button>

          <button
            type="button" onClick={() => join("mission")} disabled={busy !== null}
            className="relative text-left p-4 rounded-2xl border-2 border-[#C41E2A] bg-[#C41E2A] text-white hover:bg-[#A01825] hover:shadow-lg disabled:opacity-60 transition-all"
          >
            <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5B841] text-[#1B2A4A]">
              Most impact
            </span>
            <Heart className="w-6 h-6 mb-2 text-white fill-white" />
            <p className="font-black text-white flex items-center gap-2">
              {busy === "mission" && <Loader2 className="w-4 h-4 animate-spin" />} Join the Rescue Mission
            </p>
            <p className="text-xs mt-1 leading-relaxed text-white/80">
              Give monthly at a level you choose — plus all the updates.
            </p>
          </button>
        </div>

        <p className="text-[11px] text-center text-[#1B2A4A]/40 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 501(c)(3) nonprofit · Your details stay with TTRG
        </p>
      </div>

      {/* ── Thank-you pop-up, shown for BOTH buttons ────────────────── */}
      {joined && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog" aria-modal="true" aria-labelledby="join-thanks-title"
        >
          {paid && <Confetti />}
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 text-center relative shadow-2xl max-h-[92vh] overflow-y-auto">
            <button onClick={closeAll} aria-label="Close"
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            {/* 1. Gift completed */}
            {paid ? (
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 id="join-thanks-title" className="text-2xl font-black text-[#1B2A4A] mb-3">
                  Thank you{firstName ? `, ${firstName}` : ""}!
                </h2>
                <p className="text-[#1B2A4A]/65 leading-relaxed mb-6">
                  Your <b className="text-[#C41E2A]">${paid.amount}{paid.give === "monthly" ? "/month" : ""}</b> gift
                  is confirmed{paid.give === "monthly" ? " — you're officially part of the Rescue Mission" : ""}.
                  A receipt is on its way to your email.
                </p>
                <Link href="/ttrg/sponsor"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-7 py-3.5 rounded-full font-bold transition-colors">
                  Meet the Dogs You&apos;re Helping
                </Link>
              </>

            /* 2. Card details */
            ) : payOpen ? (
              <form onSubmit={pay} className="text-left">
                <p className="text-center text-xs font-black text-[#1B2A4A]/40 uppercase tracking-wider mb-1">
                  {give === "monthly" ? "Monthly gift" : "One-time gift"}
                </p>
                <p className="text-center text-3xl font-black text-[#C41E2A] mb-5">
                  ${chosenAmount}{give === "monthly" && <span className="text-base text-[#1B2A4A]/40">/mo</span>}
                </p>
                <div className="space-y-3">
                  {!lastName.trim() && (
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name *" className={smallInp} autoComplete="family-name" />
                  )}
                  <input value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
                    placeholder="Card Number" inputMode="numeric" autoComplete="cc-number" className={smallInp} />
                  <div className="grid grid-cols-3 gap-2">
                    <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" className={smallInp} />
                    <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="CVV" inputMode="numeric" autoComplete="cc-csc" className={smallInp} />
                    <input value={zip} onChange={e => setZip(e.target.value)}
                      placeholder="ZIP" inputMode="numeric" autoComplete="postal-code" className={smallInp} />
                  </div>
                </div>
                {payError && <p className="text-sm text-[#C41E2A] font-medium mt-3">{payError}</p>}
                <button type="submit" disabled={paying}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-60 text-white px-7 py-4 rounded-full font-black transition-colors">
                  {paying ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    : <><Lock className="w-4 h-4" /> Give ${chosenAmount}{give === "monthly" ? "/month" : ""}</>}
                </button>
                <button type="button" onClick={() => { setPayOpen(false); setPayError(""); }}
                  className="w-full mt-2 text-sm text-[#1B2A4A]/45 hover:text-[#1B2A4A]/70 transition-colors">
                  Back to amounts
                </button>
                <p className="text-[10px] text-center text-[#1B2A4A]/35 mt-3 leading-relaxed">
                  {give === "monthly"
                    ? "Charged monthly until you cancel. Cancel any time by contacting TTRG."
                    : "A single secure charge to your card."}
                </p>
              </form>

            /* 3. Mission — pick an amount, right here */
            ) : joined === "mission" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-[#C41E2A]/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#C41E2A] fill-[#C41E2A]" />
                </div>
                <h2 id="join-thanks-title" className="text-2xl font-black text-[#1B2A4A] mb-2">
                  Thank you{firstName ? `, ${firstName}` : ""}!
                </h2>
                <p className="text-[#1B2A4A]/60 text-sm leading-relaxed mb-5">
                  You&apos;re on the list and your updates are switched on. Now choose the gift
                  that keeps the rescues going.
                </p>

                <div className="inline-flex bg-slate-100 rounded-full p-1 mb-4">
                  {(["monthly", "once"] as Give[]).map(g => (
                    <button key={g} type="button"
                      onClick={() => { setGive(g); setCustomAmount(""); setAmount(g === "monthly" ? 25 : 25); }}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        give === g ? "bg-[#C41E2A] text-white shadow" : "text-[#1B2A4A]/60"
                      }`}>
                      {g === "monthly" ? "Monthly" : "One time"}
                    </button>
                  ))}
                </div>

                {give === "monthly" ? (
                  <div className="grid grid-cols-2 gap-2.5 text-left">
                    {MONTHLY_LEVELS.map(l => {
                      const active = !customAmount.trim() && amount === l.amount;
                      return (
                        <button key={l.amount} type="button"
                          onClick={() => { setAmount(l.amount); setCustomAmount(""); }}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            active ? "border-[#C41E2A] bg-[#C41E2A]/5 shadow-md" : "border-slate-200 hover:border-slate-300"
                          }`}>
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
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {ONCE_LEVELS.map(a => {
                      const active = !customAmount.trim() && amount === a;
                      return (
                        <button key={a} type="button"
                          onClick={() => { setAmount(a); setCustomAmount(""); }}
                          className={`py-3 rounded-xl border-2 font-black text-[#1B2A4A] transition-all ${
                            active ? "border-[#C41E2A] bg-[#C41E2A]/5 shadow-md" : "border-slate-200 hover:border-slate-300"
                          }`}>
                          ${a}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm font-bold text-[#1B2A4A]/50">Or</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2A4A]/40 font-bold">$</span>
                    <input type="number" min={1} inputMode="decimal" value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)} placeholder="Your own amount"
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-200 text-[#1B2A4A] focus:outline-none focus:border-[#C41E2A]" />
                  </div>
                  {give === "monthly" && <span className="text-sm font-bold text-[#1B2A4A]/50">/mo</span>}
                </div>

                <button type="button" onClick={() => { setPayError(""); setPayOpen(true); }}
                  disabled={!(chosenAmount >= 1)}
                  className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-40 text-white px-7 py-4 rounded-full font-black transition-colors">
                  <Heart className="w-5 h-5 fill-white" />
                  Give ${chosenAmount > 0 ? chosenAmount : 0}{give === "monthly" ? "/month" : ""}
                </button>
                <button type="button" onClick={closeAll}
                  className="mt-2 text-sm text-[#1B2A4A]/45 hover:text-[#1B2A4A]/70 transition-colors">
                  I&apos;ll give later
                </button>
                <p className="text-[11px] text-[#1B2A4A]/35 mt-3 leading-relaxed">
                  Either way you&apos;re on the list — we&apos;ve saved your details.
                </p>
              </>

            /* 4. Stay in the Loop — thank you, with a gentle invitation */
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 id="join-thanks-title" className="text-2xl font-black text-[#1B2A4A] mb-3">
                  Thank you{firstName ? `, ${firstName}` : ""}!
                </h2>
                <p className="text-[#1B2A4A]/65 leading-relaxed mb-5">
                  You&apos;re on the list. We&apos;ll keep you posted on the dogs you&apos;re helping —
                  the rescues, the training, and the happy endings.
                </p>
                <div className="bg-[#FAFAF8] border border-slate-200 rounded-2xl p-4 mb-5 text-left">
                  <p className="text-sm font-bold text-[#1B2A4A] flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#F5B841]" /> Want to do more?
                  </p>
                  <p className="text-xs text-[#1B2A4A]/55 leading-relaxed">
                    Monthly supporters are what let us say yes to the next dog — and you can
                    start from $10.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <button type="button"
                    onClick={() => { if (email.trim()) setJoined("mission"); }}
                    disabled={!email.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-40 text-white px-7 py-3.5 rounded-full font-bold transition-colors">
                    <Heart className="w-4 h-4 fill-white" /> Join the Rescue Mission
                  </button>
                  {!email.trim() && (
                    <p className="text-[11px] text-[#1B2A4A]/40">
                      Add an email address to give — we need somewhere to send the receipt.
                    </p>
                  )}
                  <Link href="/ttrg/sponsor"
                    className="w-full inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-[#1B2A4A] px-7 py-3.5 rounded-full font-bold hover:bg-slate-50 transition-colors">
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
