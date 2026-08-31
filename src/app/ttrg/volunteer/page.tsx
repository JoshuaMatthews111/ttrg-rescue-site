"use client";

import { useState } from "react";
import { Heart, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  // None of these fields were bound to anything: the form said "Application
  // Received!" while sending nothing anywhere, so every volunteer application
  // ever filled in was silently discarded.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [helpWith, setHelpWith] = useState("");
  const [about, setAbout] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Lands in the office's Messages and emails the team, same as the
      // contact form.
      const res = await fetch("/api/ttrg/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          subject: `Volunteer Application — ${helpWith || "General"}`,
          message: `How they'd like to help: ${helpWith || "Not specified"}\n\n${about || "(no message)"}`,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError(data.error || "We couldn't send that. Please try again.");
    } catch { setError("We couldn't reach the server. Please check your connection."); }
    setBusy(false);
  }

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Application Received!</h1>
        <p className="text-[#1B2A4A]/60 mb-6">Thank you for wanting to volunteer with TTRG. Our team will review your application and reach out within 48 hours.</p>
        <Link href="/ttrg" className="text-[#C41E2A] font-semibold hover:underline">← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Users className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Volunteer With Us</h1>
          <p className="text-white/60 max-w-lg mx-auto">Share your time and skills to help rescue dogs find their way home. Every hour you give changes a life.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <form className="space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" required value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <input type="text" placeholder="Last Name *" required value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <input type="email" placeholder="Email *" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <input type="tel" placeholder="Phone *" required value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <select required value={helpWith} onChange={e => setHelpWith(e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
              <option value="">How would you like to help? *</option>
              <option>Dog walking & exercise</option>
              <option>Event support</option>
              <option>Transport & logistics</option>
              <option>Photography & social media</option>
              <option>Administrative support</option>
              <option>Fundraising</option>
              <option>Other</option>
            </select>
            <textarea placeholder="Tell us about yourself and why you want to volunteer..." rows={4} value={about} onChange={e => setAbout(e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            {error && <p className="text-sm text-[#C41E2A] font-medium">{error}</p>}
            <button type="submit" disabled={busy} className="w-full bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-white" /> {busy ? "SENDING…" : "SUBMIT APPLICATION"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
