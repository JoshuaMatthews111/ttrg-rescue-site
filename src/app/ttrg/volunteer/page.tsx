"use client";

import { useState } from "react";
import { Heart, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);

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
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" required className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <input type="text" placeholder="Last Name *" required className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <input type="email" placeholder="Email *" required className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <input type="tel" placeholder="Phone *" required className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <select required className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
              <option value="">How would you like to help? *</option>
              <option>Dog walking & exercise</option>
              <option>Event support</option>
              <option>Transport & logistics</option>
              <option>Photography & social media</option>
              <option>Administrative support</option>
              <option>Fundraising</option>
              <option>Other</option>
            </select>
            <textarea placeholder="Tell us about yourself and why you want to volunteer..." rows={4} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-white" /> SUBMIT APPLICATION
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
