"use client";

import { useState, useEffect } from "react";
import {
  HeartHandshake, Plus, Search, Edit, Eye, EyeOff, Trash2, Star,
  AlertTriangle, CheckCircle, Archive, DollarSign, Users, MapPin, X, Save, Loader2,
} from "lucide-react";
import {
  getFamilyProfiles, upsertFamilyProfile, deleteFamilyProfile,
  getSession, insertAuditLog,
  type FamilyProfile, type FamilyProfileStatus,
} from "@/lib/admin-store";
import { uploadFile } from "@/lib/supabase-store";

const statusColors: Record<FamilyProfileStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  funded: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-500",
};

const statusLabels: Record<FamilyProfileStatus, string> = {
  draft: "Draft",
  published: "Published",
  funded: "Fully Funded",
  completed: "Completed",
  archived: "Archived",
};

function emptyProfile(): FamilyProfile {
  return {
    id: `fam-${Date.now()}`,
    slug: "",
    familyName: "",
    dogName: "",
    dogBreed: "",
    location: "",
    image: "",
    gallery: [],
    story: "",
    shortSummary: "",
    behaviorIssues: "",
    trainingNeeded: "",
    goalAmount: 0,
    raisedAmount: 0,
    donorCount: 0,
    status: "draft",
    urgent: false,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function AdminFamilyProfiles() {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editProfile, setEditProfile] = useState<FamilyProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setProfiles(getFamilyProfiles()); }, []);

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.familyName.toLowerCase().includes(q) || p.dogName.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openNew = () => { setEditProfile(emptyProfile()); setShowModal(true); };
  const openEdit = (p: FamilyProfile) => { setEditProfile({ ...p }); setShowModal(true); };

  const saveProfile = async () => {
    if (!editProfile || !editProfile.familyName || !editProfile.dogName) return;
    setSaving(true);
    editProfile.updatedAt = new Date().toISOString();
    if (!editProfile.slug) {
      editProfile.slug = `${editProfile.familyName}-${editProfile.dogName}`
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    upsertFamilyProfile(editProfile);
    const session = getSession();
    try {
      await insertAuditLog({
        userName: session?.name || "Admin",
        userRole: session?.role || "admin",
        action: "save_family_profile",
        entityType: "family_profile",
        entityId: editProfile.id,
        entityName: `${editProfile.familyName} - ${editProfile.dogName}`,
      });
    } catch { /* audit log optional */ }
    setProfiles(getFamilyProfiles());
    setSaving(false);
    setShowModal(false);
    setEditProfile(null);
  };

  const setStatus = (id: string, status: FamilyProfileStatus) => {
    const p = profiles.find(x => x.id === id);
    if (!p) return;
    const updated = { ...p, status, updatedAt: new Date().toISOString() };
    if (status === "published" && !p.publishedAt) updated.publishedAt = new Date().toISOString();
    if (status === "completed") updated.completedAt = new Date().toISOString();
    upsertFamilyProfile(updated);
    setProfiles(getFamilyProfiles());
  };

  const toggleFeatured = (id: string) => {
    const p = profiles.find(x => x.id === id);
    if (!p) return;
    upsertFamilyProfile({ ...p, featured: !p.featured, updatedAt: new Date().toISOString() });
    setProfiles(getFamilyProfiles());
  };

  const toggleUrgent = (id: string) => {
    const p = profiles.find(x => x.id === id);
    if (!p) return;
    upsertFamilyProfile({ ...p, urgent: !p.urgent, updatedAt: new Date().toISOString() });
    setProfiles(getFamilyProfiles());
  };

  const removeProfile = (id: string) => {
    if (!confirm("Delete this family profile?")) return;
    deleteFamilyProfile(id);
    setProfiles(getFamilyProfiles());
  };

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706] outline-none";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1B2A4A] flex items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-[#D97706]" /> Family Support Profiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage family training assistance campaigns</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Family Profile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by family or dog name..." className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="funded">Fully Funded</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: profiles.length, color: "text-[#1B2A4A]" },
          { label: "Published", value: profiles.filter(p => p.status === "published").length, color: "text-green-600" },
          { label: "Funded", value: profiles.filter(p => p.status === "funded").length, color: "text-blue-600" },
          { label: "Completed", value: profiles.filter(p => p.status === "completed").length, color: "text-emerald-600" },
          { label: "Urgent", value: profiles.filter(p => p.urgent).length, color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Family / Dog</th>
                <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Funding</th>
                <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Status</th>
                <th className="text-left px-4 py-3 font-bold text-[#1B2A4A]">Flags</th>
                <th className="text-right px-4 py-3 font-bold text-[#1B2A4A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pct = p.goalAmount > 0 ? Math.min(100, Math.round((p.raisedAmount / p.goalAmount) * 100)) : 0;
                return (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <HeartHandshake className="w-5 h-5 text-[#D97706]" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#1B2A4A]">{p.familyName}</p>
                          <p className="text-xs text-slate-400">{p.dogName} · {p.dogBreed}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-[#1B2A4A]">${p.raisedAmount.toLocaleString()}</span>
                          <span className="text-slate-400">of ${p.goalAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : "bg-[#D97706]"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{pct}% · {p.donorCount} donors</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.urgent && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">URGENT</span>}
                        {p.featured && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-[10px] font-bold">FEATURED</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-slate-100 rounded" title="Edit"><Edit className="w-4 h-4 text-slate-500" /></button>
                        <button onClick={() => toggleFeatured(p.id)} className="p-1.5 hover:bg-amber-50 rounded" title="Toggle Featured"><Star className={`w-4 h-4 ${p.featured ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} /></button>
                        <button onClick={() => toggleUrgent(p.id)} className="p-1.5 hover:bg-red-50 rounded" title="Toggle Urgent"><AlertTriangle className={`w-4 h-4 ${p.urgent ? "text-red-500" : "text-slate-300"}`} /></button>
                        {p.status === "draft" && <button onClick={() => setStatus(p.id, "published")} className="p-1.5 hover:bg-green-50 rounded" title="Publish"><Eye className="w-4 h-4 text-green-600" /></button>}
                        {p.status === "published" && <button onClick={() => setStatus(p.id, "draft")} className="p-1.5 hover:bg-slate-100 rounded" title="Unpublish"><EyeOff className="w-4 h-4 text-slate-500" /></button>}
                        {(p.status === "published" || p.status === "funded") && <button onClick={() => setStatus(p.id, "completed")} className="p-1.5 hover:bg-emerald-50 rounded" title="Mark Completed"><CheckCircle className="w-4 h-4 text-emerald-600" /></button>}
                        <button onClick={() => setStatus(p.id, "archived")} className="p-1.5 hover:bg-slate-100 rounded" title="Archive"><Archive className="w-4 h-4 text-slate-400" /></button>
                        <button onClick={() => removeProfile(p.id)} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">No family profiles found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && editProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-[#1B2A4A] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#D97706]" />
                {editProfile.id.startsWith("fam-") && !profiles.find(p => p.id === editProfile.id) ? "New Family Profile" : "Edit Family Profile"}
              </h2>
              <button onClick={() => { setShowModal(false); setEditProfile(null); }}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Family Name *</label>
                  <input value={editProfile.familyName} onChange={e => setEditProfile({ ...editProfile, familyName: e.target.value })} className={inp} placeholder="The Johnson Family" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Dog Name *</label>
                  <input value={editProfile.dogName} onChange={e => setEditProfile({ ...editProfile, dogName: e.target.value })} className={inp} placeholder="Max" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Dog Breed</label>
                  <input value={editProfile.dogBreed} onChange={e => setEditProfile({ ...editProfile, dogBreed: e.target.value })} className={inp} placeholder="German Shepherd Mix" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Location</label>
                  <input value={editProfile.location} onChange={e => setEditProfile({ ...editProfile, location: e.target.value })} className={inp} placeholder="Cleveland, OH" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cover Image</label>
                <div className="flex gap-2 mb-2">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${uploading ? "bg-slate-100 text-slate-400" : "bg-[#D97706] hover:bg-[#B45309] text-white"}`}>
                    {uploading ? "Uploading..." : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !editProfile) return;
                      setUploading(true);
                      const path = `family-profiles/${editProfile.id}/${Date.now()}-${file.name}`;
                      const url = await uploadFile("media", path, file);
                      if (url) setEditProfile({ ...editProfile, image: url });
                      setUploading(false);
                      e.target.value = "";
                    }} />
                  </label>
                  <span className="text-[10px] text-slate-400 self-center">or paste URL below</span>
                </div>
                <input value={editProfile.image} onChange={e => setEditProfile({ ...editProfile, image: e.target.value })} className={inp} placeholder="https://..." />
                {editProfile.image && <img src={editProfile.image} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Short Summary</label>
                <input value={editProfile.shortSummary} onChange={e => setEditProfile({ ...editProfile, shortSummary: e.target.value })} className={inp} placeholder="Brief one-line summary for cards" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Story</label>
                <textarea value={editProfile.story} onChange={e => setEditProfile({ ...editProfile, story: e.target.value })} className={`${inp} h-28`} placeholder="The full family story..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Behavior Issues</label>
                  <input value={editProfile.behaviorIssues} onChange={e => setEditProfile({ ...editProfile, behaviorIssues: e.target.value })} className={inp} placeholder="Leash reactivity, barking" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Training Needed</label>
                  <input value={editProfile.trainingNeeded} onChange={e => setEditProfile({ ...editProfile, trainingNeeded: e.target.value })} className={inp} placeholder="6-week behavior mod program" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Goal Amount ($)</label>
                  <input type="number" value={editProfile.goalAmount} onChange={e => setEditProfile({ ...editProfile, goalAmount: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Raised Amount ($)</label>
                  <input type="number" value={editProfile.raisedAmount} onChange={e => setEditProfile({ ...editProfile, raisedAmount: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Donor Count</label>
                  <input type="number" value={editProfile.donorCount} onChange={e => setEditProfile({ ...editProfile, donorCount: Number(e.target.value) })} className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                  <select value={editProfile.status} onChange={e => setEditProfile({ ...editProfile, status: e.target.value as FamilyProfileStatus })} className={inp}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="funded">Fully Funded</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-end gap-4 pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editProfile.urgent} onChange={e => setEditProfile({ ...editProfile, urgent: e.target.checked })} className="accent-red-500" /> Urgent
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editProfile.featured} onChange={e => setEditProfile({ ...editProfile, featured: e.target.checked })} className="accent-amber-500" /> Featured
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Testimony (after completion)</label>
                <textarea value={editProfile.testimony || ""} onChange={e => setEditProfile({ ...editProfile, testimony: e.target.value })} className={`${inp} h-20`} placeholder="Optional: family testimony after training is complete..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
              <button onClick={() => { setShowModal(false); setEditProfile(null); }} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
              <button onClick={saveProfile} disabled={saving || !editProfile.familyName || !editProfile.dogName} className="flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
