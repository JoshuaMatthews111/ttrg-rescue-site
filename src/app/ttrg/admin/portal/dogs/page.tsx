"use client";

import Link from "next/link";
import { Heart, ChevronRight, PawPrint } from "lucide-react";
import { dogs as dogData } from "@/lib/dogs";

const myDogs = dogData.slice(0, 2);

export default function PortalDogsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">My Sponsored Dogs</h1>
        <p className="text-sm text-[#1B2A4A]/50">Follow their journey from rescue to forever home</p>
      </div>

      <div className="space-y-6">
        {myDogs.map((dog) => (
          <div key={dog.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
              <div className="h-48 sm:h-auto">
                <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] text-xl">{dog.name}</h3>
                    <p className="text-[11px] text-[#1B2A4A]/40">{dog.age} · {dog.breed} · {dog.gender}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">${dog.price}/mo</span>
                </div>

                <p className="text-sm text-[#1B2A4A]/60 mb-4">{dog.story}</p>

                {/* Journey Progress */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-[#1B2A4A]/40 uppercase tracking-wider mb-2">Journey Progress</p>
                  <div className="flex gap-1">
                    {["rescue", "rehabilitate", "train", "recover", "rehome"].map((stage) => {
                      const stages = ["rescue", "rehabilitate", "train", "recover", "rehome"];
                      const current = stages.indexOf(dog.stage);
                      const idx = stages.indexOf(stage);
                      return (
                        <div key={stage} className={`flex-1 h-2 rounded-full ${idx <= current ? "bg-[#C41E2A]" : "bg-slate-100"}`} />
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#1B2A4A]/40 mt-1 capitalize">Currently: {dog.stage}</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/ttrg/dogs/${dog.id}`} className="flex items-center gap-1.5 bg-[#C41E2A] hover:bg-[#A01825] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    <PawPrint className="w-3 h-3" /> View Full Journey
                  </Link>
                  <Link href="/ttrg/donate" className="flex items-center gap-1.5 border border-slate-200 text-[#1B2A4A] px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors">
                    <Heart className="w-3 h-3" /> Increase Donation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsor Another */}
      <div className="mt-8 bg-[#FAFAF8] rounded-2xl border border-slate-100 p-6 text-center">
        <h3 className="font-bold text-[#1B2A4A] mb-2">Want to sponsor another dog?</h3>
        <p className="text-sm text-[#1B2A4A]/50 mb-4">Browse all dogs in need of sponsorship.</p>
        <Link href="/ttrg/sponsor" className="inline-flex items-center gap-2 bg-[#C41E2A] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#A01825] transition-colors">
          Browse Dogs <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
