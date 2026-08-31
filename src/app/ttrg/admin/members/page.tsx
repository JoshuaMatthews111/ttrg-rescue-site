"use client";

// The client list: everyone who joined through the opt-in page, showing which
// path they took (updates only, or a monthly Rescue Mission gift), exactly what
// they consented to, and which link brought them.

import { useState, useEffect } from "react";
import {
  Users, Heart, Mail, MessageSquare, Search, Loader2, X, ShieldCheck,
  DollarSign, Clock, Download,
} from "lucide-react";

type Member = {
  id: number;
  first_name: string; last_name: string; full_name: string;
  email: string | null; phone: string | null;
  city: string | null; state: string | null;
  email_consent: boolean; sms_consent: boolean;
  email_consent_at: string | null; sms_consent_at: string | null;
  membership_type: "updates" | "mission";
  membership_level: number | null;
  membership_active: boolean;
  membership_started_at: string | null;
  source: string | null; utm_campaign: string | null; referrer: string | null;
  consent_text: string | null; consent_ip: string | null;
  signed_up_at: string | null; status: string | null;
};

type Stats = {
  total: number; mission: number; updatesOnly: number;
  pledgedMonthly: number; activeMonthly: number; awaitingPayment: number;
  emailConsented: number; smsConsented: number;
};

function when(v: string | null) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "mission" | "updates" | "awaiting">("all");
  const [detail, setDetail] = useState<Member | null>(null);

  useEffect(() => {
    fetch("/api/ttrg/members", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setMembers(d.members); setStats(d.stats); }
        else setError(d.error || "Could not load the client list.");
      })
      .catch(() => setError("Could not reach the server."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q
      || (m.full_name || "").toLowerCase().includes(q)
      || (m.email || "").toLowerCase().includes(q)
      || (m.phone || "").includes(q)
      || (m.source || "").toLowerCase().includes(q);
    if (filter === "mission") return matchSearch && m.membership_type === "mission";
    if (filter === "updates") return matchSearch && m.membership_type !== "mission";
    if (filter === "awaiting") return matchSearch && m.membership_type === "mission" && !m.membership_active;
    return matchSearch;
  });

  /** Spreadsheet export — what the office actually asks for. */
  function exportCsv() {
    const head = ["Name", "Email", "Phone", "City", "State", "Joined as", "Monthly $",
                  "Payment set up", "Email OK", "Text OK", "Source", "Campaign", "Signed up"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const body = filtered.map(m => [
      m.full_name, m.email, m.phone, m.city, m.state,
      m.membership_type === "mission" ? "Rescue Mission" : "Stay in the Loop",
      m.membership_level ?? "",
      m.membership_type === "mission" ? (m.membership_active ? "Yes" : "No") : "",
      m.email_consent ? "Yes" : "No", m.sms_consent ? "Yes" : "No",
      m.source, m.utm_campaign, when(m.signed_up_at),
    ].map(esc).join(","));
    const blob = new Blob([[head.map(esc).join(","), ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ttrg-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const cards: { label: string; value: string; icon: typeof Users; tone: string }[] = stats ? [
    { label: "Total Members", value: String(stats.total), icon: Users, tone: "text-[#1B2A4A]" },
    { label: "Rescue Mission", value: String(stats.mission), icon: Heart, tone: "text-[#C41E2A]" },
    { label: "Monthly Pledged", value: `$${stats.pledgedMonthly.toLocaleString()}`, icon: DollarSign, tone: "text-emerald-600" },
    { label: "Awaiting Payment", value: String(stats.awaitingPayment), icon: Clock, tone: "text-amber-600" },
    { label: "Email Consent", value: String(stats.emailConsented), icon: Mail, tone: "text-[#1B2A4A]" },
    { label: "Text Consent", value: String(stats.smsConsented), icon: MessageSquare, tone: "text-[#1B2A4A]" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#1B2A4A] flex items-center gap-2">
            <Users className="w-7 h-7 text-[#C41E2A]" /> Members &amp; Subscribers
          </h1>
          <p className="text-sm text-slate-400 mt-1">Everyone who opted in — and exactly what they agreed to</p>
        </div>
        <button onClick={exportCsv} disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#0F1B33] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map(c => (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-4">
              <c.icon className={`w-5 h-5 ${c.tone} mb-2`} />
              <p className={`text-2xl font-black ${c.tone}`}>{c.value}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ["all", "All"], ["mission", "Rescue Mission"],
            ["updates", "Stay in the Loop"], ["awaiting", "Awaiting Payment"],
          ] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === key ? "bg-[#C41E2A] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone, source..."
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm w-full sm:w-72" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading members…
          </div>
        ) : error ? (
          <div className="py-20 text-center text-[#C41E2A] font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">
              {members.length === 0 ? "No one has joined yet." : "No members match that search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Member</th>
                  <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Joined As</th>
                  <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Consent</th>
                  <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Source</th>
                  <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Signed Up</th>
                  <th className="text-right px-4 py-3 font-bold text-[#1B2A4A]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#1B2A4A]">{m.full_name || m.first_name || "—"}</p>
                      <p className="text-xs text-slate-400">{m.email || m.phone || "no contact details"}</p>
                      {(m.city || m.state) && (
                        <p className="text-[10px] text-slate-400">{[m.city, m.state].filter(Boolean).join(", ")}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {m.membership_type === "mission" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#C41E2A]/10 text-[#C41E2A] text-[10px] font-black uppercase">
                            <Heart className="w-3 h-3 fill-[#C41E2A]" /> Rescue Mission
                          </span>
                          <p className="text-xs font-bold text-[#1B2A4A] mt-1">
                            ${Number(m.membership_level || 0).toLocaleString()}/mo
                          </p>
                          <p className={`text-[10px] font-bold ${m.membership_active ? "text-emerald-600" : "text-amber-600"}`}>
                            {m.membership_active ? "Payment active" : "Awaiting payment"}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                          <Mail className="w-3 h-3" /> Stay in the Loop
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${m.email_consent ? "text-emerald-600" : "text-slate-300"}`}>
                          <Mail className="w-3 h-3" /> Email {m.email_consent ? "✓" : "✕"}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${m.sms_consent ? "text-emerald-600" : "text-slate-300"}`}>
                          <MessageSquare className="w-3 h-3" /> Text {m.sms_consent ? "✓" : "✕"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {m.source || "direct"}
                      </span>
                      {m.utm_campaign && <p className="text-[10px] text-slate-400 mt-1">{m.utm_campaign}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{when(m.signed_up_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetail(m)}
                        className="px-3 py-1.5 rounded-lg bg-[#C41E2A] text-white text-xs font-bold hover:bg-[#A01825] transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consent evidence — what to show a carrier or regulator who asks. */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-[#1B2A4A]">{detail.full_name || detail.first_name}</h2>
                <p className="text-sm text-slate-400">Joined {when(detail.signed_up_at)}</p>
              </div>
              <button onClick={() => setDetail(null)} aria-label="Close" className="text-slate-300 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Email", detail.email || "—"],
                  ["Phone", detail.phone || "—"],
                  ["City", detail.city || "—"],
                  ["State", detail.state || "—"],
                  ["Joined as", detail.membership_type === "mission" ? "Rescue Mission" : "Stay in the Loop"],
                  ["Monthly gift", detail.membership_level ? `$${detail.membership_level}/mo` : "—"],
                  ["Payment", detail.membership_type === "mission" ? (detail.membership_active ? "Active" : "Awaiting payment") : "—"],
                  ["Source", detail.source || "direct"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{k}</p>
                    <p className="text-[#1B2A4A] font-medium break-words">{v}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#FAFAF8] border border-slate-200 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Consent evidence
                </p>
                <div className="flex gap-4 mb-3">
                  <span className={`text-xs font-bold ${detail.email_consent ? "text-emerald-600" : "text-slate-400"}`}>
                    Email {detail.email_consent ? `✓ ${when(detail.email_consent_at)}` : "not given"}
                  </span>
                  <span className={`text-xs font-bold ${detail.sms_consent ? "text-emerald-600" : "text-slate-400"}`}>
                    Text {detail.sms_consent ? `✓ ${when(detail.sms_consent_at)}` : "not given"}
                  </span>
                </div>
                <p className="text-xs text-[#1B2A4A]/70 leading-relaxed italic">
                  &ldquo;{detail.consent_text || "No consent wording recorded."}&rdquo;
                </p>
                {detail.consent_ip && (
                  <p className="text-[10px] text-slate-400 mt-2">Agreed from IP {detail.consent_ip}</p>
                )}
              </div>

              {detail.referrer && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Came from</p>
                  <p className="text-xs text-[#1B2A4A]/70 break-all">{detail.referrer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
