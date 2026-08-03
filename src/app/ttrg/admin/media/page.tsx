"use client";

// Stories & Videos — the same records the public /ttrg/stories page reads.
// Previously this was a hardcoded demo list that had no connection to the
// public site, and "Add Story" opened nothing. Now every story lives in the
// `stories` table, the Add/Edit flow works, and each video URL is health-
// checked so dead links can be spotted and removed.

import { useState, useEffect, useCallback } from "react";
import { Plus, Star, Play, Trash2, Edit, X, Save, Loader2, Upload, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { fetchStories, upsertStory, deleteStory, checkMediaAlive, uploadFile } from "@/lib/supabase-store";
import { getVideoEmbedUrl } from "@/lib/video-embed";
import type { Story } from "@/lib/admin-store";

const CATEGORIES = ["Rescue Story", "Training Story", "Adoption Story", "Client Testimonial", "Family Story"];

function emptyStory(): Story {
  return {
    id: `story-${Date.now()}`, title: "", description: "", quote: "",
    type: "video", dogName: "", category: "Rescue Story", thumbnail: "",
    videoSrc: "", duration: "", published: true, featured: false, sortOrder: 99,
  };
}

export default function MediaPage() {
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Story | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  // id -> true (alive) | false (dead link)
  const [health, setHealth] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchStories();
    setItems(rows);
    setLoading(false);
    // Check each video link so staff can remove dead ones.
    rows.forEach(async (s) => {
      if (!s.videoSrc) return;
      // Hosted embeds (YouTube/Drive/Vimeo) can't be HEAD-checked cross-origin.
      if (getVideoEmbedUrl(s.videoSrc)) { setHealth(h => ({ ...h, [s.id]: true })); return; }
      const alive = await checkMediaAlive(s.videoSrc);
      setHealth(h => ({ ...h, [s.id]: alive }));
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!edit || !edit.title.trim()) { alert("Story title is required."); return; }
    setSaving(true);
    const ok = await upsertStory(edit);
    setSaving(false);
    if (!ok) { setTableMissing(true); return; }
    setEdit(null);
    load();
  }

  async function remove(s: Story) {
    if (!confirm(`Delete "${s.title}"? This removes it from the public Stories page too.`)) return;
    await deleteStory(s.id);
    load();
  }

  async function quickToggle(s: Story, field: "featured" | "published") {
    const updated = { ...s, [field]: !s[field] };
    setItems(items.map(i => i.id === s.id ? updated : i)); // optimistic
    const ok = await upsertStory(updated);
    if (!ok) { setTableMissing(true); load(); }
  }

  async function uploadMedia(file: File, field: "videoSrc" | "thumbnail") {
    if (!edit) return;
    setUploading(true);
    const url = await uploadFile("media", `stories/${edit.id}/${Date.now()}-${file.name}`, file);
    setUploading(false);
    if (url) setEdit({ ...edit, [field]: url });
    else alert("Upload failed. For large videos, paste a YouTube or Google Drive link instead.");
  }

  const deadCount = Object.values(health).filter(v => v === false).length;
  const inp = "w-full px-3 py-2 rounded-lg bg-[#0b1524] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#C41E2A]";

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">STORIES &amp; VIDEOS</h1>
          <p className="text-white/40 text-xs mt-1">
            These are the stories shown on the public Success Stories page
            {items.length > 0 && <> · {items.length} total · {items.filter(i => i.published).length} live</>}
          </p>
        </div>
        <button onClick={() => setEdit(emptyStory())} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Story
        </button>
      </div>

      {tableMissing && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-amber-200 text-xs leading-relaxed">
          <b>One-time setup needed.</b> The <code>stories</code> table doesn&apos;t exist yet. Open Supabase → SQL Editor,
          paste the contents of <code>supabase-admin-upgrade.sql</code> from the repo, and press Run. It also imports the
          four stories currently on the site. Then reload this page.
        </div>
      )}

      {deadCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span><b>{deadCount} video link{deadCount > 1 ? "s are" : " is"} dead</b> — marked below. Fix the link or delete the story.</span>
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-white/40 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading stories…
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-10 text-center">
          <Play className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/50 text-sm font-bold">No stories yet</p>
          <p className="text-white/30 text-xs mt-1 mb-4">Add a story and it appears on the public Success Stories page.</p>
          <button onClick={() => setEdit(emptyStory())} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Add Your First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((s) => {
            const alive = health[s.id];
            return (
              <div key={s.id} className={`bg-[#0f1b30] border rounded-2xl overflow-hidden transition-colors ${alive === false ? "border-red-500/40" : "border-white/5 hover:border-white/10"}`}>
                <div className="aspect-video relative overflow-hidden bg-[#1B2A4A]">
                  {s.thumbnail
                    ? <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-white/10"><Play className="w-10 h-10" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    {s.featured && <span className="bg-amber-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" /> FEATURED</span>}
                    {!s.published && <span className="bg-slate-700/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">DRAFT</span>}
                  </div>
                  <div className="absolute top-2 right-2">
                    {alive === false && <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> DEAD LINK</span>}
                    {alive === true && <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> LIVE</span>}
                  </div>
                  {s.videoSrc && (
                    <a href={s.videoSrc} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center group">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                      </div>
                    </a>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-white text-sm font-bold mb-1">{s.title}</p>
                  {s.dogName && <p className="text-[#C41E2A] text-[10px] font-bold uppercase tracking-wider mb-2">Dog: {s.dogName}</p>}
                  <p className="text-white/40 text-xs line-clamp-2 mb-2">{s.description}</p>
                  <p className="text-white/30 text-[10px] mb-3">{s.category}{s.duration ? ` · ${s.duration}` : ""}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button onClick={() => quickToggle(s, "featured")} className={`text-[10px] font-bold py-2 rounded-lg ${s.featured ? "bg-amber-500/20 text-amber-300" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>Feature</button>
                    <button onClick={() => quickToggle(s, "published")} className={`text-[10px] font-bold py-2 rounded-lg ${s.published ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>{s.published ? "Live" : "Draft"}</button>
                    <button onClick={() => setEdit(s)} className="text-[10px] font-bold py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 flex items-center justify-center"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(s)} className="text-[10px] font-bold py-2 rounded-lg bg-white/5 text-white/60 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit modal */}
      {edit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-10 overflow-y-auto p-4">
          <div className="bg-[#0f1b30] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-[#C41E2A]" />
                {items.find(i => i.id === edit.id) ? "Edit Story" : "Add Story"}
              </h2>
              <button onClick={() => setEdit(null)}><X className="w-5 h-5 text-white/40 hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Title *</label>
                <input value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} className={inp} placeholder="Tucker's Second Chance" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Description / Quote</label>
                <textarea value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} rows={2} className={inp} placeholder="From neglect to thriving — a training success story." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Category</label>
                  <select value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })} className={inp}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0b1524]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Dog Name</label>
                  <input value={edit.dogName || ""} onChange={e => setEdit({ ...edit, dogName: e.target.value })} className={inp} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Video</label>
                <div className="flex gap-2 mb-2">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${uploading ? "bg-white/5 text-white/30" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                    <Upload className="w-3.5 h-3.5" /> {uploading ? "Uploading…" : "Upload"}
                    <input type="file" accept="video/*" className="hidden" disabled={uploading}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadMedia(f, "videoSrc"); e.target.value = ""; }} />
                  </label>
                  <span className="text-[10px] text-white/30 self-center">under 48 MB — or paste a YouTube / Drive link below</span>
                </div>
                <input value={edit.videoSrc || ""} onChange={e => setEdit({ ...edit, videoSrc: e.target.value })} className={inp} placeholder="https://youtube.com/... or https://drive.google.com/..." />
                {edit.videoSrc && (
                  <a href={edit.videoSrc} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#C41E2A] hover:underline inline-flex items-center gap-1 mt-1">
                    Test this link <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Thumbnail Image</label>
                <div className="flex gap-2 mb-2">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${uploading ? "bg-white/5 text-white/30" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadMedia(f, "thumbnail"); e.target.value = ""; }} />
                  </label>
                </div>
                <input value={edit.thumbnail || ""} onChange={e => setEdit({ ...edit, thumbnail: e.target.value })} className={inp} placeholder="https://..." />
                {edit.thumbnail && <img src={edit.thumbnail} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Duration</label>
                  <input value={edit.duration || ""} onChange={e => setEdit({ ...edit, duration: e.target.value })} className={inp} placeholder="2:18" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase mb-1 block">Order</label>
                  <input type="number" value={edit.sortOrder ?? 0} onChange={e => setEdit({ ...edit, sortOrder: Number(e.target.value) })} className={inp} />
                </div>
              </div>

              <div className="flex gap-5">
                <label className="flex items-center gap-2 text-xs text-white/70">
                  <input type="checkbox" checked={edit.published} onChange={e => setEdit({ ...edit, published: e.target.checked })} className="accent-emerald-500" /> Published (live on site)
                </label>
                <label className="flex items-center gap-2 text-xs text-white/70">
                  <input type="checkbox" checked={edit.featured} onChange={e => setEdit({ ...edit, featured: e.target.checked })} className="accent-amber-500" /> Featured
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setEdit(null)} className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving} className="bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
