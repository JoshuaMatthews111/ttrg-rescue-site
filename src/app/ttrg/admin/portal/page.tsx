"use client";

import Link from "next/link";
import { Heart, PawPrint, DollarSign, Bell, ChevronRight } from "lucide-react";

const sponsoredDogs = [
  { name: "Bailey", image: "", amount: "$35/mo", since: "Jan 2025", lastUpdate: "Bailey took her first walk off-leash today! She stayed close and responded to recall." },
  { name: "Shadow", image: "", amount: "$45/mo", since: "Mar 2025", lastUpdate: "Shadow's surgery is scheduled for next week. His spirits are high and he's eating well." },
];

const recentUpdates = [
  { dog: "Bailey", update: "Bailey completed her first full week of leash training with no reactivity!", date: "May 16" },
  { dog: "Shadow", update: "Shadow had his pre-surgery checkup — all vitals look great.", date: "May 15" },
  { dog: "Bailey", update: "Bailey played with another dog for the first time — tail wagging the whole time!", date: "May 14" },
];

export default function PortalPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">My Dashboard</h1>
        <p className="text-sm text-[#1B2A4A]/50">Welcome back! Here are your sponsored dogs and latest updates.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Heart, label: "Dogs Sponsored", value: "2", color: "bg-pink-50 text-pink-600" },
          { icon: DollarSign, label: "Monthly Giving", value: "$80", color: "bg-emerald-50 text-emerald-600" },
          { icon: PawPrint, label: "Total Given", value: "$480", color: "bg-blue-50 text-blue-600" },
          { icon: Bell, label: "New Updates", value: "3", color: "bg-amber-50 text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-[#1B2A4A]">{s.value}</p>
            <p className="text-xs text-[#1B2A4A]/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sponsored Dogs */}
      <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">My Sponsored Dogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {sponsoredDogs.map((dog) => (
          <div key={dog.name} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="h-40 overflow-hidden bg-[#1B2A4A] flex items-center justify-center">
              {dog.image ? <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" /> : <PawPrint className="w-10 h-10 text-white/30" />}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#1B2A4A]">{dog.name}</h3>
                <span className="text-xs font-semibold text-emerald-600">{dog.amount}</span>
              </div>
              <p className="text-[10px] text-[#1B2A4A]/40 mb-2">Sponsoring since {dog.since}</p>
              <div className="bg-[#FAFAF8] rounded-lg p-3 mb-3">
                <p className="text-xs text-[#1B2A4A]/60">{dog.lastUpdate}</p>
              </div>
              <Link href="/ttrg/dogs/bailey" className="text-[#C41E2A] text-xs font-bold hover:underline flex items-center gap-1">
                View Full Journey <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Updates Feed */}
      <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">Recent Updates</h2>
      <div className="space-y-3 mb-8">
        {recentUpdates.map((u, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-4 h-4 text-[#C41E2A]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#1B2A4A]"><span className="font-bold">{u.dog}</span> — {u.update}</p>
              <p className="text-[10px] text-[#1B2A4A]/30 mt-1">{u.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Donate CTA */}
      <div className="bg-[#C41E2A] rounded-2xl p-6 text-white text-center">
        <Heart className="w-8 h-8 mx-auto mb-3 fill-white/20" />
        <h3 className="text-lg font-bold mb-2">Want to Help More Dogs?</h3>
        <p className="text-white/70 text-sm mb-4">Increase your monthly giving or sponsor another dog in need.</p>
        <Link href="/ttrg/donate" className="inline-flex items-center gap-2 bg-white text-[#C41E2A] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
          <Heart className="w-4 h-4 fill-[#C41E2A]" /> DONATE MORE
        </Link>
      </div>
    </div>
  );
}
