"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { getEmailLeads, type EmailCaptureLead } from "@/lib/lorenzo-store";

export default function EmailLeadsPage() {
  const [leads, setLeads] = useState<EmailCaptureLead[]>([]);
  useEffect(() => { setLeads(getEmailLeads()); }, []);

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0B1D3A] mb-6">Email Capture Leads</h1>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <Mail className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No email leads yet. Submissions from the popup will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100"><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Date</th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-slate-50"><td className="px-5 py-3 text-[#0B1D3A] font-medium">{l.email}</td><td className="px-5 py-3 text-slate-400">{l.date}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
