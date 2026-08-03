"use client";

// Partners & Outreach — real data only.
// Previously this page showed a hardcoded demo list (K9 Solutions Inc. etc.)
// and invented statistics. Everything here now comes from the `partners`
// table, and the "Add Partner" button actually creates records.

import { useState, useEffect, useCallback } from "react";
import { Building2, Plus, Mail, ExternalLink, Heart, Users, DollarSign, X, Save, Loader2, Trash2, Edit, Phone } from "lucide-react";
import { fetchPartners, upsertPartner, deletePartner } from "@/lib/supabase-store";
import type { Partner } from "@/lib/admin-store";

const TYPES = ["Corporate", "Nonprofit", "Business", "Veterinary", "Individual", "Other"];
const TIERS = ["Gold", "Silver", "Bronze", "Active"];

const tierColors: Record<string, string> = {
  Gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Silver: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  Bronze: "bg-orange-600/20 text-orange-300 border-orange-600/30",
  Active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function emptyPartner(): Partner {
  return {
    id: `partner-${Date.now()}`, name: "", type: "Corporate", tier: "Active",
    region: "", contribution: 0, contactName: "", email: "", phone: "",
    website: "", logoUrl: "", notes: "", active: true,
  };
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchPartners();
    setPartners(rows);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!edit || !edit.name.trim()) { alert("Partner name is required."); return; }
    setSaving(true);
    const ok = await upsertPartner(edit);
    setSaving(false);
    if (!ok) { setTableMissing(true); return; }
    setEdit(null);
    load();
  }

  async function remove(p: Partner) {
    if (!confirm(`Remove ${p.name} from partners?`)) return;
    await deletePartner(p.id);
    load();
  }

  // Real numbers, computed from real rows — no invented stats.
  const totalContribution = partners.reduce((s, p) => s + (p.contribution || 0), 0);
  const stats = [
    { label: "Total Partners", value: partners.length, icon: Building2, color: "from-blue-500 to-blue-700" },
    { label: "Active", value: partners.filter(p => p.active).length, icon: Heart, color: "from-emerald-500 to-emerald-700" },
    { label: "Corporate", value: partners.filter(p => p.type === "Corporate").length, icon: Users, color: "from-amber-500 to-orange-600" },
    { label: "Total Contributions", value: `$${totalContribution.toLocaleString()}`, icon: DollarSign, color: "from-violet-500 to-purple-700" },
  ];

  const inp = "w-full px-3 py-2 rounded-lg bg-[#0b1524] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#C41E2A]";

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PARTNERS &amp; OUTREACH</h1>
          <p className="text-white/40 text-xs mt-1">Manage corporate partners, sponsors, and referral pipelines</p>
        </div>
        <button onClick={() => setEdit(emptyPartner())} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {tableMissing && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-amber-200 text-xs leading-relaxed">
          <b>One-time setup needed.</b> The <code>partners</code> table doesn&apos;t exist yet. Open Supabase → SQL Editor,
          paste the contents of <code>supabase-admin-upgrade.sql</code> from the repo, and press Run. Then reload this page.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((card) => (
          <div key={card.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-2xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-[#C41E2A]" /> PARTNER DIRECTORY</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/40 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading partners…
          </div>
        ) : partners.length === 0 ? (
          <div className="p-10 text-center">
            <Building2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/50 text-sm font-bold">No partners yet</p>
            <p className="text-white/30 text-xs mt-1 mb-4">Add your real partners — nothing here is pre-filled.</p>
            <button onClick={() => setEdit(emptyPartner())} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" /> Add Your First Partner
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
              <div className="col-span-3">Partner</div>
              <div className="col-span-2">Type / Tier</div>
              <div className="col-span-2">Region</div>
              <div className="col-span-2">Contribution</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {partners.map((p) => (
              <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] items-center">
                <div className="col-span-3">
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#C41E2A] hover:underline inline-flex items-center gap-1">
                      Website <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full border ${tierColors[p.tier] || tierColors.Active}`}>{p.tier}</span>
                  <p className="text-[10px] text-white/40 mt-1">{p.type}</p>
                </div>
                <div className="col-span-2 text-xs text-white/60">{p.region || "—"}</div>
                <div className="col-span-2 text-sm font-bold text-emerald-400">${(p.contribution || 0).toLocaleString()}</div>
                <div className="col-span-2">
                  <p className="text-xs text-white/70">{p.contactName || "—"}</p>
                  {p.email && <a href={`mailto:${p.email}`} className="text-[10px] text-white/40 hover:text-white flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {p.email}</a>}
                  {p.phone && <p className="text-[10px] text-white/40 flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {p.phone}</p>}
                </div>
                <div className="col-span-1 flex md:justify-end gap-1">
                  <button onClick={() => setEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(p)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add / Edit modal */}
      {edit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-10 overflow-y-auto p-4">
          <div className="bg-[#0f1b30] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C41E2A]" />
                {partners.find(p => p.id === edit.id) ? "Edit Partner" : "Add Partner"}
              </h2>
              <button onClick={() => setEdit(null)}><X className="w-5 h-5 text-white/40 hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Partner Name *</label>
                <input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} className={inp} placeholder="Lorenzo's Dog Training Team" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Type</label>
                  <select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value })} className={inp}>
                    {TYPES.map(t => <option key={t} value={t} className="bg-[#0b1524]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Tier</label>
                  <select value={edit.tier} onChange={e => setEdit({ ...edit, tier: e.target.value })} className={inp}>
                    {TIERS.map(t => <option key={t} value={t} className="bg-[#0b1524]">{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Region</label>
                  <input value={edit.region} onChange={e => setEdit({ ...edit, region: e.target.value })} className={inp} placeholder="OH – Cleveland" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Contribution ($)</label>
                  <input type="number" value={edit.contribution} onChange={e => setEdit({ ...edit, contribution: Number(e.target.value) })} className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Contact Name</label>
                  <input value={edit.contactName} onChange={e => setEdit({ ...edit, contactName: e.target.value })} className={inp} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Email</label>
                  <input value={edit.email} onChange={e => setEdit({ ...edit, email: e.target.value })} className={inp} placeholder="name@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Phone</label>
                  <input value={edit.phone || ""} onChange={e => setEdit({ ...edit, phone: e.target.value })} className={inp} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Website</label>
                  <input value={edit.website || ""} onChange={e => setEdit({ ...edit, website: e.target.value })} className={inp} placeholder="https://" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Notes</label>
                <textarea value={edit.notes || ""} onChange={e => setEdit({ ...edit, notes: e.target.value })} rows={2} className={inp} />
              </div>
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={edit.active} onChange={e => setEdit({ ...edit, active: e.target.checked })} className="accent-emerald-500" /> Active partner
              </label>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setEdit(null)} className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving} className="bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
