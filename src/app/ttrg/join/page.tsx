"use client";

// Opt-in landing page for people who tap the link in Lorenzo's text.
//
// Built mobile-first: essentially everyone arrives here on a phone, from a
// text message. The flow itself lives in JoinFlow, so the footer button and
// the homepage welcome pop-up open exactly the same two paths.

import { Suspense } from "react";
import { Heart, ShieldCheck, PawPrint } from "lucide-react";
import JoinFlow from "@/components/ttrg/JoinFlow";

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
          <JoinFlow />
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
