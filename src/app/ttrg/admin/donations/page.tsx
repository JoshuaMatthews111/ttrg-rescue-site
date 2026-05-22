"use client";

import { useState } from "react";
import { DollarSign, Heart, TrendingUp, Search, Building2, Repeat, Filter } from "lucide-react";

type DonationType = "one_time" | "monthly" | "infrastructure" | "corporate" | "dog_sponsor";

interface Donation {
  id: string;
  donor: string;
  email: string;
  amount: number;
  type: DonationType;
  category: string;
  dog?: string;
  date: string;
  status: "paid" | "pending";
  receipt: boolean;
}

const donations: Donation[] = [
  { id: "D-2401", donor: "John Davis", email: "john@email.com", amount: 525, type: "one_time", category: "Vet Care", dog: "K9 Bella", date: "2026-05-21", status: "paid", receipt: true },
  { id: "D-2402", donor: "Sarah Miller", email: "sarah@email.com", amount: 250, type: "monthly", category: "Training Program", date: "2026-05-21", status: "paid", receipt: true },
  { id: "D-2403", donor: "Robert White", email: "robert@email.com", amount: 1000, type: "one_time", category: "Emergency Rescue Fund", date: "2026-05-21", status: "paid", receipt: true },
  { id: "D-2404", donor: "Emily Wilson", email: "emily@email.com", amount: 100, type: "monthly", category: "Transport", dog: "K9 Max", date: "2026-05-21", status: "paid", receipt: true },
  { id: "D-2405", donor: "The Garcia Family", email: "garcia@email.com", amount: 300, type: "monthly", category: "Foster Care Support", date: "2026-05-20", status: "paid", receipt: true },
  { id: "D-2406", donor: "K9 Solutions Inc.", email: "corp@k9solutions.com", amount: 5000, type: "corporate", category: "Corporate Sponsorship", date: "2026-05-19", status: "paid", receipt: true },
  { id: "D-2407", donor: "Patriot Logistics", email: "donate@patriotlog.com", amount: 1500, type: "infrastructure", category: "Kennel Expansion", date: "2026-05-18", status: "paid", receipt: true },
  { id: "D-2408", donor: "Anonymous", email: "—", amount: 50, type: "one_time", category: "General", date: "2026-05-18", status: "paid", receipt: false },
];

const summary = [
  { label: "Total Raised (YTD)", value: "$87,450", sub: "+18.7% vs last year", icon: DollarSign, color: "from-emerald-500 to-emerald-700" },
  { label: "Monthly Recurring", value: "$23,410", sub: "+12.3% vs last month", icon: Repeat, color: "from-blue-500 to-blue-700" },
  { label: "One-Time Gifts", value: "$64,040", sub: "+22.9% vs last month", icon: Heart, color: "from-red-500 to-red-700" },
  { label: "Corporate Partners", value: 48, sub: "+4 this month", icon: Building2, color: "from-violet-500 to-purple-700" },
];

const typeColors: Record<DonationType, string> = {
  one_time: "bg-blue-500/20 text-blue-300",
  monthly: "bg-emerald-500/20 text-emerald-300",
  infrastructure: "bg-amber-500/20 text-amber-300",
  corporate: "bg-violet-500/20 text-violet-300",
  dog_sponsor: "bg-red-500/20 text-red-300",
};

export default function DonationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DonationType | "all">("all");

  const filtered = donations.filter((d) => {
    if (filter !== "all" && d.type !== filter) return false;
    if (search && !`${d.donor} ${d.email} ${d.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">DONATIONS</h1>
          <p className="text-white/40 text-xs mt-1">Track all donations: one-time, monthly, dog sponsorship, infrastructure, and corporate</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {summary.map((s) => (
          <div key={s.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-black text-white mt-1">{s.value}</p>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search donor name, email, or category..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as DonationType | "all")} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white">
          <option value="all" className="bg-[#0f1b30]">All Types</option>
          <option value="one_time" className="bg-[#0f1b30]">One-Time</option>
          <option value="monthly" className="bg-[#0f1b30]">Monthly Sponsor</option>
          <option value="dog_sponsor" className="bg-[#0f1b30]">Dog Sponsor</option>
          <option value="infrastructure" className="bg-[#0f1b30]">Infrastructure</option>
          <option value="corporate" className="bg-[#0f1b30]">Corporate</option>
        </select>
      </div>

      {/* Donations Table */}
      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl overflow-hidden">
        <div className="hidden md:grid md:grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <div className="col-span-3">Donor</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Receipt</div>
        </div>
        {filtered.map((d) => (
          <div key={d.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                {d.donor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold truncate">{d.donor}</p>
                <p className="text-white/40 text-[10px] truncate">{d.email}</p>
              </div>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-emerald-400 text-base font-black">${d.amount.toLocaleString()}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className={`text-[9px] font-bold px-2 py-1 rounded capitalize ${typeColors[d.type]}`}>{d.type.replace("_", " ")}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-white/60 text-xs">{d.category} {d.dog && <span className="text-[#C41E2A] ml-1">· {d.dog}</span>}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-white/40 text-xs">{d.date}</span>
            </div>
            <div className="col-span-1 flex items-center">
              {d.receipt ? <span className="text-emerald-400 text-xs">✓ Sent</span> : <button className="text-[#C41E2A] text-[10px] font-bold">Send</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
