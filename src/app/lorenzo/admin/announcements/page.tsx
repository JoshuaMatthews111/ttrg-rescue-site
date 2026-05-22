"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, X } from "lucide-react";
import { getAnnouncements, upsertAnnouncement, type Announcement } from "@/lib/lorenzo-store";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setAnnouncements(getAnnouncements()); }, []);

  const openNew = () => { setEditing({ id: `a-${Date.now()}`, text: "", active: true, startDate: new Date().toISOString().split("T")[0], endDate: "2026-12-31" }); setShowModal(true); };
  const openEdit = (a: Announcement) => { setEditing({ ...a }); setShowModal(true); };
  const save = () => { if (!editing) return; upsertAnnouncement(editing); setAnnouncements(getAnnouncements()); setShowModal(false); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#0B1D3A]">Announcement / Promotion Manager</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C8102E] text-white px-4 py-2.5 rounded-lg text-sm font-bold"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0B1D3A] font-medium truncate">{a.text}</p>
              <p className="text-[10px] text-slate-400 mt-1">{a.startDate} → {a.endDate}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{a.active ? "Active" : "Inactive"}</span>
              <button onClick={() => openEdit(a)} className="text-slate-400 hover:text-[#C8102E]"><Edit className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-black text-[#0B1D3A] mb-4">Edit Announcement</h2>
            <div className="space-y-3">
              <textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} placeholder="Announcement text" rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500">Start Date</label><input type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
                <div><label className="text-xs text-slate-500">End Date</label><input type="date" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="rounded" /> Active</label>
            </div>
            <button onClick={save} className="w-full mt-4 bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
