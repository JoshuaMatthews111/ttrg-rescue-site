"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Eye, Search } from "lucide-react";
import { getSubmissions, saveSubmissions, type Submission } from "@/lib/admin-store";

const urgencyColors: Record<string, string> = { Critical: "bg-red-100 text-red-700", Urgent: "bg-amber-100 text-amber-700", Standard: "bg-slate-100 text-slate-600", Low: "bg-slate-50 text-slate-500" };
const statusColors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", approved: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700", more_info: "bg-blue-100 text-blue-700" };

export default function SubmissionsPage() {
  const [filter, setFilter] = useState("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => { setSubmissions(getSubmissions()); }, []);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    const updated = submissions.map((s) => s.id === id ? { ...s, status: action as Submission["status"], actionBy: `Admin (You) — just now` } : s);
    setSubmissions(updated);
    saveSubmissions(updated);
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Dog Submissions</h1>
        <p className="text-sm text-[#1B2A4A]/50">Review and approve dog submissions from shelters, trainers, and individuals.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search submissions..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? "bg-[#1B2A4A] text-white" : "bg-white border border-slate-200 text-[#1B2A4A]/60 hover:bg-slate-50"}`}>
              {f} {f !== "all" && <span className="ml-1 opacity-50">({submissions.filter((s) => s.status === f).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((sub) => (
          <div key={sub.id} className={`bg-white rounded-2xl border p-5 transition-all ${sub.status === "pending" ? "border-amber-200" : "border-slate-100"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] flex items-center justify-center font-bold text-[#1B2A4A] text-lg">
                  {sub.dogName[0]}
                </div>
                <div>
                  <p className="font-bold text-[#1B2A4A]">{sub.dogName}</p>
                  <p className="text-[11px] text-[#1B2A4A]/40">{sub.breed} · {sub.age}{sub.gender ? ` · ${sub.gender}` : ""} · Ref: {sub.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${urgencyColors[sub.urgency]}`}>{sub.urgency}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[sub.status]}`}>{sub.status}</span>
              </div>
            </div>

            <p className="text-sm text-[#1B2A4A]/60 mb-3">{sub.story}</p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#1B2A4A]/40 mb-3">
              <span>From: <strong className="text-[#1B2A4A]/60">{sub.submitterName}</strong> ({sub.submitterType})</span>
              <span>Contact: {sub.submitterEmail}{sub.submitterPhone ? ` · ${sub.submitterPhone}` : ""}</span>
              <span>Submitted: {sub.date}</span>
            </div>

            {sub.actionBy && (
              <p className="text-[10px] text-[#1B2A4A]/40 mb-3 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {sub.status === "approved" ? "Approved" : "Rejected"} by {sub.actionBy}
              </p>
            )}

            {sub.status === "pending" && (
              <div className="flex gap-2">
                <button onClick={() => handleAction(sub.id, "approved")} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                  <CheckCircle2 className="w-3 h-3" /> Approve
                </button>
                <button onClick={() => handleAction(sub.id, "rejected")} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                  <XCircle className="w-3 h-3" /> Reject
                </button>
                <button className="flex items-center gap-1.5 border border-slate-200 text-[#1B2A4A] px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors">
                  <Eye className="w-3 h-3" /> Request Edits
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#1B2A4A]/30 text-sm">No submissions match this filter.</div>
        )}
      </div>
    </div>
  );
}
