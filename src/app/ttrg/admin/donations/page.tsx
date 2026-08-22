"use client";

import { useState, useEffect } from "react";
import { DollarSign, Heart, TrendingUp, Search, Building2, Repeat, Filter, Info, Archive } from "lucide-react";
import { fetchDonations as fetchRealDonations } from "@/lib/admin-store";

function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1.5" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <Info className="w-3.5 h-3.5 text-white/30 hover:text-white/60 cursor-help transition-colors" />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#1B2A4A] border border-white/20 text-white/80 text-[10px] leading-relaxed p-2.5 rounded-lg shadow-xl z-50 pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

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
  status: "paid" | "pending" | "archived";
  archiveReason?: string;
  archivedAt?: string;
  receipt: boolean;
  /* full details captured on the giving form */
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  referralSource?: string;
  trainerName?: string;
  transactionId?: string;
  subscriptionId?: string;
  last4?: string;
  frequency?: string;
}


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
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [viewing, setViewing] = useState<Donation | null>(null);
  const [view, setView] = useState<"active" | "archived">("active");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [archiveReason, setArchiveReason] = useState("Test donation");

  async function archiveDonation(d: Donation, restore = false) {
    if (!restore && !confirm(
      `Remove ${d.donor}'s $${d.amount} donation from the totals?\n\nReason: ${archiveReason}\n\n` +
      `This is bookkeeping only — it does NOT refund or void the payment at Authorize.net. ` +
      `You can put it back at any time.`
    )) return;

    setBusy(true); setNotice(null);
    try {
      const res = await fetch("/api/ttrg/archive-donation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId: d.id, reason: archiveReason, restore }),
      });
      const data = await res.json();
      if (data.ok) {
        const next = data.status === "archived" ? "archived" as const
          : data.status === "completed" ? "paid" as const : "pending" as const;
        setNotice({ ok: true, text: data.message });
        setAllDonations(prev => prev.map(x => x.id === d.id
          ? { ...x, status: next, archiveReason: restore ? "" : archiveReason }
          : x));
        setViewing(null);
      } else {
        setNotice({ ok: false, text: data.error || "That didn't work." });
      }
    } catch { setNotice({ ok: false, text: "Could not reach the server." }); }
    setBusy(false);
  }

  useEffect(() => {
    fetchRealDonations().then((real) => {
      const mapped: Donation[] = real.map((r) => ({
        id: r.id,
        donor: r.name,
        email: r.email,
        amount: r.amount,
        type: r.frequency === "monthly" ? "monthly" as DonationType : "one_time" as DonationType,
        category: r.dogName ? `Dog Sponsor – ${r.dogName}` : "General Donation",
        dog: r.dogName,
        date: r.date ? r.date.split("T")[0] : "",
        status: r.status === "archived" ? "archived" as const
          : r.status === "completed" ? "paid" as const : "pending" as const,
        archiveReason: r.archiveReason,
        archivedAt: r.archivedAt,
        receipt: false,
        phone: r.phone, address: r.address, city: r.city, state: r.state, zip: r.zip,
        referralSource: r.referralSource, trainerName: r.trainerName,
        transactionId: r.transactionId, subscriptionId: r.subscriptionId,
        last4: r.last4, frequency: r.frequency,
      }));
      setAllDonations(mapped);
    });
  }, []);

  // Voided and refunded gifts stay visible but never count in the numbers.
  const liveDonations = allDonations.filter(d => d.status !== "archived");
  const archivedDonations = allDonations.filter(d => d.status === "archived");
  const totalRaised = liveDonations.reduce((sum, d) => sum + d.amount, 0);
  const monthlyRecurring = liveDonations.filter(d => d.type === "monthly").reduce((sum, d) => sum + d.amount, 0);
  const oneTime = liveDonations.filter(d => d.type === "one_time").reduce((sum, d) => sum + d.amount, 0);
  const summary = [
    { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, sub: `${liveDonations.length} donations`, icon: DollarSign, color: "from-emerald-500 to-emerald-700" },
    { label: "Monthly Recurring", value: `$${monthlyRecurring.toLocaleString()}`, sub: `${liveDonations.filter(d => d.type === "monthly").length} active`, icon: Repeat, color: "from-blue-500 to-blue-700" },
    { label: "One-Time Gifts", value: `$${oneTime.toLocaleString()}`, sub: `${liveDonations.filter(d => d.type === "one_time").length} gifts`, icon: Heart, color: "from-red-500 to-red-700" },
    { label: "Avg Donation", value: `$${liveDonations.length > 0 ? Math.round(totalRaised / liveDonations.length) : 0}`, sub: "Per donation", icon: TrendingUp, color: "from-violet-500 to-purple-700" },
  ];

  const filtered = allDonations.filter((d) => {
    if (view === "archived" ? d.status !== "archived" : d.status === "archived") return false;
    if (filter !== "all" && d.type !== filter) return false;
    if (search && !`${d.donor} ${d.email} ${d.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">DONATIONS <InfoTip text="Shows all real donations processed through the site. Numbers reflect actual payments. Connect Authorize.net reporting API for historical transaction data." /></h1>
          <p className="text-white/40 text-xs mt-1">
            {view === "active"
              ? `${liveDonations.length} donations counting toward your totals`
              : `${archivedDonations.length} archived — not counted`}
          </p>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          <button onClick={() => setView("active")} className={`px-4 py-2 text-xs font-bold ${view === "active" ? "bg-[#C41E2A] text-white" : "text-white/60 hover:bg-white/5"}`}>
            Active ({liveDonations.length})
          </button>
          <button onClick={() => setView("archived")} className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 ${view === "archived" ? "bg-[#C41E2A] text-white" : "text-white/60 hover:bg-white/5"}`}>
            <Archive className="w-3.5 h-3.5" /> Archived ({archivedDonations.length})
          </button>
        </div>
      </div>

      {notice && (
        <div className={`rounded-xl px-4 py-3 mb-5 text-xs ${notice.ok ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
          {notice.text}
        </div>
      )}

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
          <div className="col-span-1">More Details</div>
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
            <div className="col-span-2 flex items-center gap-2">
              <span className={`text-base font-black ${d.status === "archived" ? "text-white/30 line-through" : "text-emerald-400"}`}>${d.amount.toLocaleString()}</span>
              {d.status === "archived" && d.archiveReason && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/50">{d.archiveReason}</span>
              )}
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
              <button
                onClick={() => setViewing(d)}
                className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full donor details */}
      {viewing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-10 overflow-y-auto p-4" onClick={() => setViewing(null)}>
          <div className="bg-[#0f1b30] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-black">
                  {viewing.donor.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-base font-black text-white">{viewing.donor}</h2>
                  <p className="text-white/40 text-[11px]">Donation details</p>
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="text-white/40 hover:text-white text-xl leading-none px-2">&times;</button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Gift */}
              <div className="bg-[#0b1524] rounded-xl p-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">The Gift</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Amount" value={`$${viewing.amount.toLocaleString()}`} strong />
                  <Field label="Frequency" value={viewing.frequency === "monthly" ? "Monthly (recurring)" : "One-time"} />
                  <Field label="Designation" value={viewing.dog ? `Dog Sponsor — ${viewing.dog}` : viewing.category} />
                  <Field label="Status" value={viewing.status === "paid" ? "Completed" : "Pending"} />
                  <Field label="Date" value={viewing.date} />
                  <Field label="Card" value={viewing.last4 ? `•••• ${viewing.last4}` : "—"} />
                </div>
              </div>

              {/* Donor */}
              <div className="bg-[#0b1524] rounded-xl p-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Donor &amp; Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full name" value={viewing.donor} />
                  <Field label="Email" value={viewing.email} link={`mailto:${viewing.email}`} />
                  <Field label="Phone" value={viewing.phone} link={viewing.phone ? `tel:${viewing.phone}` : undefined} />
                  <Field label="Referred by" value={viewing.referralSource} />
                  <Field label="Trainer named" value={viewing.trainerName} />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Mailing address</p>
                  {viewing.address || viewing.city || viewing.zip ? (
                    <p className="text-white text-sm leading-relaxed">
                      {viewing.address}<br />
                      {[viewing.city, viewing.state].filter(Boolean).join(", ")} {viewing.zip}
                    </p>
                  ) : (
                    <p className="text-white/30 text-sm italic">Not captured for this donation</p>
                  )}
                </div>
              </div>

              {/* Payment references */}
              <div className="bg-[#0b1524] rounded-xl p-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Payment References</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Record ID" value={viewing.id} mono />
                  <Field label="Transaction ID" value={viewing.transactionId} mono />
                  <Field label="Subscription ID" value={viewing.subscriptionId} mono />
                </div>
              </div>

              <p className="text-[10px] text-white/30 leading-relaxed">
                Address, phone and referral details are stored for donations made after the donor-details
                update. Older records show &ldquo;Not captured&rdquo;.
              </p>
            </div>

            <div className="p-5 border-t border-white/10 space-y-3">
              {viewing.status === "archived" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs font-bold text-white/60">Archived{viewing.archiveReason ? ` — ${viewing.archiveReason}` : ""}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">Not counted in any total. The payment at Authorize.net was never changed.</p>
                  </div>
                  <button onClick={() => archiveDonation(viewing, true)} disabled={busy}
                    className="border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50 text-xs font-bold px-4 py-2 rounded-lg">
                    {busy ? "Working…" : "Put Back in Totals"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[190px]">
                    <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Reason for archiving</label>
                    <select value={archiveReason} onChange={e => setArchiveReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0b1524] border border-white/10 text-white text-xs">
                      {["Test donation", "Refunded in Authorize.net", "Duplicate charge", "Chargeback", "Entered by mistake", "Other"]
                        .map(r => <option key={r} value={r} className="bg-[#0b1524]">{r}</option>)}
                    </select>
                  </div>
                  <button onClick={() => archiveDonation(viewing)} disabled={busy}
                    className="border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 disabled:opacity-50 text-xs font-bold px-4 py-2 rounded-lg">
                    {busy ? "Working…" : "Archive — Remove from Totals"}
                  </button>
                </div>
              )}
              <p className="text-[10px] text-white/30 leading-relaxed">
                Archiving is bookkeeping only. It does not refund or void the card payment —
                do that in Authorize.net if money needs to go back.
              </p>
              <div className="flex justify-end gap-3 pt-1">
                <a href={`mailto:${viewing.email}`} className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white">Email Donor</a>
                <button onClick={() => { setViewing(null); setNotice(null); }} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, link, mono, strong }: { label: string; value?: string; link?: string; mono?: boolean; strong?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">{label}</p>
      {value ? (
        link ? (
          <a href={link} className={`text-[#C41E2A] hover:underline break-all ${mono ? "font-mono text-xs" : "text-sm"}`}>{value}</a>
        ) : (
          <p className={`text-white break-all ${mono ? "font-mono text-xs" : strong ? "text-lg font-black text-emerald-400" : "text-sm"}`}>{value}</p>
        )
      ) : (
        <p className="text-white/30 text-sm italic">—</p>
      )}
    </div>
  );
}
