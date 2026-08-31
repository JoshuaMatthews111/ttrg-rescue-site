"use client";

// The small name + email sign-up that appears in the footer and on the stories
// page. Every one of these used to be a dead form — `onSubmit` called
// preventDefault and nothing else, so anyone who typed their details in got no
// response and the office never heard about them. This posts to the same
// endpoint as the full join page, so these people land in the client list with
// their consent recorded.

import { useState } from "react";
import Link from "next/link";
import { Heart, Check, Loader2 } from "lucide-react";

const CONSENT_TEXT =
  "I want to hear from Team Trainers Rescue Group about rescue dogs, training programs and ways to help. " +
  "I understand I can stop at any time by clicking unsubscribe in an email. " +
  "TTRG will never sell or share my information.";

export default function JoinInline({
  buttonLabel = "JOIN THE RESCUE MISSION",
  source,
  variant = "dark",
}: {
  buttonLabel?: string;
  /** Where this form lives, so staff can see what brought each person in. */
  source: string;
  /** "dark" sits on a navy/red band; "light" on a white card. */
  variant?: "dark" | "light";
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) { setError("Please add your first name."); return; }
    if (!email.trim()) { setError("Please add your email address."); return; }

    setBusy(true);
    try {
      const res = await fetch("/api/ttrg/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          emailConsent: true,
          smsConsent: false,
          membershipType: "updates",
          consentText: CONSENT_TEXT,
          source,
          landingPage: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else setError(data.error || "Something went wrong. Please try again.");
    } catch { setError("We couldn't reach the server. Please try again."); }
    setBusy(false);
  }

  const dark = variant === "dark";

  if (done) {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-3 ${dark ? "text-white" : "text-[#1B2A4A]"}`}>
        <span className="inline-flex items-center gap-2 font-bold text-sm">
          <Check className={`w-5 h-5 ${dark ? "text-emerald-400" : "text-emerald-600"}`} />
          You&apos;re in{firstName ? `, ${firstName.trim()}` : ""} — watch your inbox.
        </span>
        <Link
          href="/ttrg/join"
          className={`h-10 px-5 rounded-lg text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
            dark ? "bg-white text-[#C41E2A] hover:bg-white/90" : "bg-[#C41E2A] text-white hover:bg-[#A01825]"
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" /> Add a monthly gift
        </Link>
      </div>
    );
  }

  const field = dark
    ? "h-10 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/50"
    : "h-10 px-4 rounded-lg bg-white border border-slate-200 text-[#1B2A4A] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30";

  return (
    <div className="w-full md:w-auto">
      <form onSubmit={submit} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <input
          type="text" placeholder="First Name" value={firstName}
          onChange={e => setFirstName(e.target.value)} autoComplete="given-name"
          className={`w-full sm:w-36 ${field}`}
        />
        <input
          type="email" placeholder="Email Address" value={email}
          onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email"
          className={`w-full sm:w-48 ${field}`}
        />
        <button
          type="submit" disabled={busy}
          className={`h-10 px-6 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto disabled:opacity-60 ${
            dark ? "bg-[#C41E2A] hover:bg-[#A01825] text-white" : "bg-[#C41E2A] hover:bg-[#A01825] text-white"
          }`}
        >
          {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Joining…</> : buttonLabel}
        </button>
      </form>
      {error && (
        <p className={`text-xs font-medium mt-2 ${dark ? "text-red-300" : "text-[#C41E2A]"}`}>{error}</p>
      )}
    </div>
  );
}
