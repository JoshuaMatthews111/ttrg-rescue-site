"use client";

import { useState } from "react";
import { Search, FileText, CheckCircle2, XCircle, Clock, ChevronRight, Mail, Phone, Filter } from "lucide-react";

type AppCategory = "adoption" | "foster" | "trainer" | "volunteer" | "recommend" | "partner";
type AppStatus = "new" | "pending" | "follow_up" | "approved" | "rejected" | "archived";

interface Application {
  id: string;
  category: AppCategory;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: AppStatus;
  details: string;
  dog?: string;
  urgent?: boolean;
}

const applications: Application[] = [
  { id: "A-2401", category: "adoption", name: "Amanda Foster", email: "amanda@email.com", phone: "(216) 555-0101", date: "2026-05-21", status: "new", details: "Interested in adopting K9 Rocky. Has prior dog experience.", dog: "K9 Rocky" },
  { id: "A-2402", category: "foster", name: "Michael Thompson", email: "michael.t@email.com", phone: "(216) 555-0102", date: "2026-05-21", status: "new", details: "Available for emergency foster placements.", dog: "K9 Luna" },
  { id: "A-2403", category: "adoption", name: "Jessica Martinez", email: "jessica.m@email.com", phone: "(216) 555-0103", date: "2026-05-21", status: "pending", details: "Family of 4, large backyard, no other pets.", dog: "K9 Daisy" },
  { id: "A-2404", category: "foster", name: "David Anderson", email: "david.a@email.com", phone: "(216) 555-0104", date: "2026-05-20", status: "pending", details: "Experienced with high-energy dogs.", dog: "K9 Max" },
  { id: "A-2405", category: "trainer", name: "Robert White", email: "robert.w@email.com", phone: "(216) 555-0105", date: "2026-05-20", status: "new", details: "10 years training experience, CCPDT-KA certified.", urgent: true },
  { id: "A-2406", category: "volunteer", name: "Lisa Brown", email: "lisa.b@email.com", phone: "(216) 555-0106", date: "2026-05-19", status: "pending", details: "Available weekends. Interested in event support and transport.", },
  { id: "A-2407", category: "recommend", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(216) 555-0107", date: "2026-05-19", status: "new", details: "Recommending Bella, 4yo German Shepherd. Owner can no longer care for her.", dog: "Bella", urgent: true },
  { id: "A-2408", category: "partner", name: "K9 Solutions Inc.", email: "partnerships@k9solutions.com", phone: "(216) 555-0108", date: "2026-05-18", status: "approved", details: "Corporate sponsor inquiry — $25,000 annual commitment.", },
  { id: "A-2409", category: "recommend", name: "Houston Animal Shelter", email: "shelter@houstonas.org", phone: "(713) 555-0109", date: "2026-05-18", status: "pending", details: "3 dogs need immediate placement. Capacity issue.", urgent: true },
  { id: "A-2410", category: "volunteer", name: "Mark Wilson", email: "mark.w@email.com", phone: "(216) 555-0110", date: "2026-05-17", status: "approved", details: "Social media content support.", },
];

const categoryMeta: Record<AppCategory, { label: string; color: string; icon: string }> = {
  adoption: { label: "Adoption", color: "from-red-500 to-red-700", icon: "❤️" },
  foster: { label: "Foster", color: "from-orange-500 to-red-600", icon: "🏠" },
  trainer: { label: "Trainer", color: "from-amber-500 to-orange-600", icon: "🎓" },
  volunteer: { label: "Volunteer", color: "from-blue-500 to-indigo-600", icon: "🤝" },
  recommend: { label: "Recommend a Dog", color: "from-emerald-500 to-teal-600", icon: "🐾" },
  partner: { label: "Partner / Corporate", color: "from-violet-500 to-purple-700", icon: "🏢" },
};

const statusColors: Record<AppStatus, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  follow_up: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
  archived: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function ApplicationsPage() {
  const [tab, setTab] = useState<AppCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);

  const filtered = applications.filter((a) => {
    if (tab !== "all" && a.category !== tab) return false;
    if (search && !`${a.name} ${a.email} ${a.dog || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = (Object.keys(categoryMeta) as AppCategory[]).reduce((acc, cat) => {
    acc[cat] = applications.filter((a) => a.category === cat).length;
    return acc;
  }, {} as Record<AppCategory, number>);

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">APPLICATIONS</h1>
          <p className="text-white/40 text-xs mt-1">Manage adoption, foster, trainer, volunteer, recommendations, and partner inquiries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === "all" ? "bg-[#C41E2A] text-white" : "bg-white/5 text-white/60 hover:text-white border border-white/10"}`}>
          All ({applications.length})
        </button>
        {(Object.keys(categoryMeta) as AppCategory[]).map((cat) => {
          const meta = categoryMeta[cat];
          return (
            <button key={cat} onClick={() => setTab(cat)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === cat ? "bg-[#C41E2A] text-white" : "bg-white/5 text-white/60 hover:text-white border border-white/10"}`}>
              {meta.label} ({counts[cat]})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or dog..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30" />
      </div>

      {/* Applications List */}
      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl overflow-hidden">
        <div className="hidden md:grid md:grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <div className="col-span-3">Applicant</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Dog / Subject</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>
        {filtered.map((app) => {
          const meta = categoryMeta[app.category];
          return (
            <button key={app.id} onClick={() => setSelected(app)} className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors text-left">
              <div className="col-span-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-[10px] font-black flex-shrink-0`}>{app.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-bold truncate flex items-center gap-1">{app.name} {app.urgent && <span className="text-red-400 text-[10px]">●</span>}</p>
                  <p className="text-white/40 text-[10px] truncate">{app.email}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-white/70 text-xs">{meta.label}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-white/60 text-xs">{app.dog || "—"}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-white/40 text-xs">{app.date}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className={`text-[9px] font-bold px-2 py-1 rounded border capitalize ${statusColors[app.status]}`}>{app.status.replace("_", " ")}</span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <div className="p-12 text-center text-white/30 text-sm">No applications match your filter.</div>}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-[#0f1b30] border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusColors[selected.status]}`}>{categoryMeta[selected.category].label.toUpperCase()}</span>
                  <h2 className="text-2xl font-black text-white mt-2">{selected.name}</h2>
                  <p className="text-white/40 text-xs">Application #{selected.id} · {selected.date}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/40" />
                  <span className="text-white/80 text-xs truncate">{selected.email}</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/40" />
                  <span className="text-white/80 text-xs">{selected.phone}</span>
                </div>
              </div>

              {selected.dog && (
                <div className="bg-[#C41E2A]/10 border border-[#C41E2A]/20 rounded-xl p-3 mb-5">
                  <p className="text-[#C41E2A] text-[10px] font-bold uppercase tracking-wider">Attached Dog</p>
                  <p className="text-white text-sm font-bold">{selected.dog}</p>
                </div>
              )}

              <div className="mb-5">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Details</p>
                <p className="text-white/80 text-sm bg-white/5 rounded-xl p-4">{selected.details}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4" /> Follow Up
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5">
                  <Mail className="w-4 h-4" /> Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
