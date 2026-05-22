"use client";

import { useState, useEffect } from "react";
import { Edit, X } from "lucide-react";
import { getPrograms, upsertProgram, type TrainingProgram } from "@/lib/lorenzo-store";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [editing, setEditing] = useState<TrainingProgram | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setPrograms(getPrograms()); }, []);

  const openEdit = (p: TrainingProgram) => { setEditing({ ...p }); setShowModal(true); };
  const save = () => { if (!editing) return; upsertProgram(editing); setPrograms(getPrograms()); setShowModal(false); };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0B1D3A] mb-6">Training Programs Manager</h1>

      <div className="space-y-3">
        {programs.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {p.image && <img src={p.image} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
              <div className="min-w-0">
                <h3 className="font-bold text-[#0B1D3A] text-sm">{p.title}</h3>
                <p className="text-xs text-slate-500 truncate">{p.description}</p>
              </div>
            </div>
            <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-[#C8102E] flex-shrink-0"><Edit className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-black text-[#0B1D3A] mb-4">Edit Program</h2>
            <div className="space-y-3">
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Title" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-none" />
              <textarea value={editing.whoIsItFor} onChange={(e) => setEditing({ ...editing, whoIsItFor: e.target.value })} placeholder="Who it's for" rows={2} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-none" />
              <input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="Image URL" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input value={editing.cta} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} placeholder="CTA Text" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} placeholder="Display Order" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <button onClick={save} className="w-full mt-4 bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm">Save Program</button>
          </div>
        </div>
      )}
    </div>
  );
}
