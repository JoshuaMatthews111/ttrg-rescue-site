"use client";

import { Building2, Plus, Mail, ExternalLink, TrendingUp, Heart, Users, Dog, DollarSign } from "lucide-react";

const partners = [
  { name: "K9 Solutions Inc.", type: "Corporate", status: "Gold", region: "TX – Houston", contribution: "$12,500", contact: "Sarah Mitchell", email: "sarah@k9sol.com" },
  { name: "Paws & Purpose Foundation", type: "Nonprofit", status: "Active", region: "FL – Orlando", contribution: "$7,250", contact: "James Carter", email: "james@pawsnpurpose.org" },
  { name: "Guardian Pet Nutrition", type: "Corporate", status: "Silver", region: "Nationwide", contribution: "$5,000", contact: "Linda Nguyen", email: "linda@guardianpet.com" },
  { name: "K9 Strong Gym", type: "Business", status: "Active", region: "CA – San Diego", contribution: "$2,400", contact: "Mark Rodriguez", email: "mark@k9strong.com" },
  { name: "Hero's Veterinary Clinic", type: "Veterinary", status: "Active", region: "TX – Austin", contribution: "$3,850", contact: "Dr. Emily Hart", email: "drhart@herovet.com" },
  { name: "Patriot Logistics", type: "Corporate", status: "Bronze", region: "Nationwide", contribution: "$1,500", contact: "Brian O'Neill", email: "brian@patriotlog.com" },
];

const statusColors: Record<string, string> = {
  Gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Silver: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  Bronze: "bg-orange-600/20 text-orange-300 border-orange-600/30",
  Active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const partnerStats = [
  { label: "Corporate Partners", value: 48, sub: "+4 this month", icon: Building2, color: "from-blue-500 to-blue-700" },
  { label: "Monthly Sponsors", value: 128, sub: "+15 this month", icon: Heart, color: "from-red-500 to-red-700" },
  { label: "Referral Leads", value: 76, sub: "+12 this month", icon: Users, color: "from-amber-500 to-orange-600" },
  { label: "Dogs Shared", value: 34, sub: "+6 this month", icon: Dog, color: "from-emerald-500 to-emerald-700" },
  { label: "Funds Raised", value: "$87,450", sub: "+18.7% vs last month", icon: DollarSign, color: "from-violet-500 to-purple-700" },
];

export default function PartnersPage() {
  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PARTNERS &amp; OUTREACH</h1>
          <p className="text-white/40 text-xs mt-1">Manage corporate partners, sponsors, and referral pipelines</p>
        </div>
        <button className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {partnerStats.map((card) => (
          <div key={card.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {card.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-[#C41E2A]" /> PARTNER DIRECTORY</h2>
        </div>
        <div className="hidden md:grid md:grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <div className="col-span-3">Partner</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Region</div>
          <div className="col-span-2">Contribution (YTD)</div>
          <div className="col-span-2">Contact</div>
        </div>
        {partners.map((p) => (
          <div key={p.name} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <div className="col-span-3 flex items-center">
              <p className="text-white text-xs font-bold truncate">{p.name}</p>
            </div>
            <div className="col-span-2 flex items-center"><span className="text-white/60 text-xs">{p.type}</span></div>
            <div className="col-span-1 flex items-center"><span className={`text-[9px] font-bold px-2 py-1 rounded border ${statusColors[p.status]}`}>{p.status}</span></div>
            <div className="col-span-2 flex items-center"><span className="text-white/60 text-xs">{p.region}</span></div>
            <div className="col-span-2 flex items-center"><span className="text-emerald-400 text-sm font-black">{p.contribution}</span></div>
            <div className="col-span-2 flex items-center gap-2">
              <p className="text-white/60 text-xs truncate">{p.contact}</p>
              <a href={`mailto:${p.email}`} className="text-white/40 hover:text-[#C41E2A]"><Mail className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
