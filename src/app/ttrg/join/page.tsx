"use client";

// Opt-in landing page for people who tap the link in Lorenzo's text.
//
// Built mobile-first: essentially everyone arrives here on a phone, from a
// text message. It captures who they are, records WHICH link brought them,
// and takes explicit, separate permission for email and text — storing the
// exact wording they agreed to as evidence.

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Heart, Check, Loader2, ShieldCheck, PawPrint } from "lucide-react";

// The exact sentence stored against each person as proof of consent.
const CONSENT_TEXT =
  "I want to hear from Team Trainers Rescue Group about rescue dogs, training programs and ways to help. " +
  "I understand I can stop at any time by replying STOP to a text or clicking unsubscribe in an email. " +
  "Message and data rates may apply. Message frequency varies. TTRG will never sell or share my information.";

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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!emailConsent && !smsConsent) { setError("Please tick at least one box so we know how to reach you."); return; }

    setBusy(true);
    try {
      const res = await fetch("/api/ttrg/join", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, city, state,
          emailConsent, smsConsent,
          consentText: CONSENT_TEXT,
          ...attribution,
        }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else setError(data.error || "Something went wrong. Please try again.");
    } catch { setError("We couldn't reach the server. Please check your connection."); }
    setBusy(false);
  }

  const inp = "w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-[#1B2A4A] text-base focus:outline-none focus:border-[#C41E2A] transition-colors";

  if (done) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-[#1B2A4A] mb-3">You&apos;re in{firstName ? `, ${firstName}` : ""}!</h1>
        <p className="text-[#1B2A4A]/60 leading-relaxed mb-8 max-w-md mx-auto">
          Welcome to the Team Trainers Rescue Group family. We&apos;ll keep you posted on the dogs
          you&apos;re helping — the rescues, the training, and the happy endings.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-7 py-4 rounded-full font-bold transition-colors">
            <Heart className="w-5 h-5 fill-white" /> Make a Donation
          </Link>
          <Link href="/ttrg/sponsor" className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-[#1B2A4A] px-7 py-4 rounded-full font-bold hover:bg-slate-50 transition-colors">
            Meet the Dogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name *" required className={inp} autoComplete="given-name" />
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
        </p>
      </div>

      {error && <p className="text-sm text-[#C41E2A] font-medium">{error}</p>}

      <button type="submit" disabled={busy}
        className="w-full bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-60 text-white py-4 rounded-full font-black text-lg transition-colors flex items-center justify-center gap-2">
        {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining…</> : <><Heart className="w-5 h-5 fill-white" /> Count Me In</>}
      </button>

      <p className="text-[11px] text-center text-[#1B2A4A]/40 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" /> 501(c)(3) nonprofit · Your details stay with TTRG
      </p>
    </form>
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
