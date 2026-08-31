"use client";

// The footer / stories sign-up bar. Typing an email here does NOT sign anyone
// up on the spot — pressing the button opens the same two-path window used on
// the join page, carried across with whatever they already typed. They then
// choose which path they consent to.

import { useState } from "react";
import { X } from "lucide-react";
import JoinFlow from "@/components/ttrg/JoinFlow";

export default function JoinLauncher({
  buttonLabel = "JOIN THE RESCUE MISSION",
  source,
  variant = "dark",
}: {
  buttonLabel?: string;
  /** Where the visitor started, recorded against the contact. */
  source: string;
  variant?: "dark" | "light";
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const dark = variant === "dark";
  const field = dark
    ? "h-10 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/50"
    : "h-10 px-4 rounded-lg bg-white border border-slate-200 text-[#1B2A4A] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30";

  return (
    <>
      <form
        onSubmit={e => { e.preventDefault(); setOpen(true); }}
        className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
      >
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
          type="submit"
          className="h-10 px-6 bg-[#C41E2A] hover:bg-[#A01825] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
        >
          {buttonLabel}
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          role="dialog" aria-modal="true" aria-labelledby="join-launcher-title"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full my-auto p-6 sm:p-7 relative shadow-2xl">
            <button onClick={() => setOpen(false)} aria-label="Close"
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <h2 id="join-launcher-title" className="text-2xl font-black text-[#1B2A4A]">
                Join the Rescue Mission
              </h2>
              <p className="text-sm text-[#1B2A4A]/55 mt-1 leading-relaxed">
                Choose how you want to help — updates only, or a monthly gift.
              </p>
            </div>
            <JoinFlow
              inModal
              source={source}
              prefill={{ firstName, email }}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
