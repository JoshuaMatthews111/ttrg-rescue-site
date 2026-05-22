"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { getLeads, updateLead, type ConsultationLead, type LeadStatus } from "@/lib/lorenzo-store";

const statusColors: Record<string, string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-amber-100 text-amber-700", scheduled: "bg-emerald-100 text-emerald-700", won: "bg-green-100 text-green-700", lost: "bg-red-100 text-red-700", archived: "bg-slate-100 text-slate-500" };
const statusOptions: LeadStatus[] = ["new", "contacted", "scheduled", "won", "lost", "archived"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setLeads(getLeads()); }, []);

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !`${l.name} ${l.dogName} ${l.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const changeStatus = (id: string, status: LeadStatus) => {
    updateLead(id, { status });
    setLeads(getLeads());
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0B1D3A] mb-6">Consultation Leads</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm">
          <option value="all">All Status</option>
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-slate-400 text-sm">No leads found. Consultation requests from the public site will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0B1D3A] text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.email} · {lead.phone}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-slate-500">{lead.dogName || "No dog name"} · {lead.behaviorIssue || "No issue specified"}</p>
                    <p className="text-[10px] text-slate-400">{lead.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[lead.status]}`}>{lead.status}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 ml-3 transition-transform ${expanded === lead.id ? "rotate-180" : ""}`} />
              </button>
              {expanded === lead.id && (
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                    <div><span className="text-slate-400 text-xs">Dog Name:</span><p className="font-medium text-[#0B1D3A]">{lead.dogName || "—"}</p></div>
                    <div><span className="text-slate-400 text-xs">Breed:</span><p className="font-medium text-[#0B1D3A]">{lead.breed || "—"}</p></div>
                    <div><span className="text-slate-400 text-xs">Age:</span><p className="font-medium text-[#0B1D3A]">{lead.age || "—"}</p></div>
                    <div><span className="text-slate-400 text-xs">Behavior Issue:</span><p className="font-medium text-[#0B1D3A]">{lead.behaviorIssue || "—"}</p></div>
                    <div><span className="text-slate-400 text-xs">Training Goal:</span><p className="font-medium text-[#0B1D3A]">{lead.trainingGoal || "—"}</p></div>
                    <div><span className="text-slate-400 text-xs">Location:</span><p className="font-medium text-[#0B1D3A]">{lead.location || "—"}</p></div>
                    <div><span className="text-slate-400 text-xs">Preferred Contact:</span><p className="font-medium text-[#0B1D3A] capitalize">{lead.preferredContact}</p></div>
                  </div>
                  {lead.message && <div className="mb-4"><span className="text-slate-400 text-xs">Message:</span><p className="text-sm text-[#0B1D3A] mt-1">{lead.message}</p></div>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 mr-2">Change status:</span>
                    {statusOptions.map((s) => (
                      <button key={s} onClick={() => changeStatus(lead.id, s)} className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize transition-colors ${lead.status === s ? statusColors[s] : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
