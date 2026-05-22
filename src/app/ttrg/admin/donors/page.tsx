"use client";

import { Search, TrendingUp, Heart, DollarSign, Users } from "lucide-react";

const donors = [
  { name: "Lauren Mitchell", email: "lauren@email.com", type: "Monthly", amount: "$50/mo", dog: "Tucker", since: "Jan 2025", total: "$250" },
  { name: "John Kim", email: "john@email.com", type: "Monthly", amount: "$100/mo", dog: "Daisy", since: "Mar 2025", total: "$300" },
  { name: "Corporate Paws Inc.", email: "corp@paws.com", type: "Corporate", amount: "$500/mo", dog: "General Fund", since: "Dec 2024", total: "$3,000" },
  { name: "Sarah Adams", email: "sarah@email.com", type: "One-time", amount: "$250", dog: "Shadow (Surgery)", since: "May 2025", total: "$250" },
  { name: "Mike Torres", email: "mike@email.com", type: "Monthly", amount: "$25/mo", dog: "Bailey", since: "Apr 2025", total: "$50" },
  { name: "Emily Chen", email: "emily@email.com", type: "Monthly", amount: "$35/mo", dog: "Prince", since: "May 2025", total: "$35" },
];

const stats = [
  { label: "Total Donors", value: "156", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Monthly Revenue", value: "$4,850", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  { label: "Avg. Donation", value: "$62", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  { label: "Sponsor Rate", value: "73%", icon: Heart, color: "bg-pink-50 text-pink-600" },
];

export default function DonorsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Donor Management</h1>
        <p className="text-sm text-[#1B2A4A]/50">Track sponsors, donors, and contributions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-[#1B2A4A]">{s.value}</p>
            <p className="text-xs text-[#1B2A4A]/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search donors..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Donor</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Amount</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden md:table-cell">Sponsoring</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden lg:table-cell">Since</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden lg:table-cell">Total Given</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#1B2A4A]">{d.name}</p>
                    <p className="text-[10px] text-[#1B2A4A]/40">{d.email}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${d.type === "Monthly" ? "bg-emerald-100 text-emerald-700" : d.type === "Corporate" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{d.type}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#1B2A4A]">{d.amount}</td>
                  <td className="px-5 py-3 text-[#1B2A4A]/60 hidden md:table-cell">{d.dog}</td>
                  <td className="px-5 py-3 text-[#1B2A4A]/40 text-xs hidden lg:table-cell">{d.since}</td>
                  <td className="px-5 py-3 font-semibold text-emerald-600 hidden lg:table-cell">{d.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
