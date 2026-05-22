"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Eye, EyeOff, X } from "lucide-react";
import { getTrainers, upsertTrainer, type Trainer } from "@/lib/lorenzo-store";

const emptyTrainer: Omit<Trainer, "id"> = { name: "", photo: "", role: "", bio: "", specialties: [], location: "", yearsExperience: 0, visible: true };

export default function TrainersAdminPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [specInput, setSpecInput] = useState("");

  useEffect(() => { setTrainers(getTrainers()); }, []);

  const openNew = () => { setEditing({ ...emptyTrainer, id: `t-${Date.now()}` } as Trainer); setShowModal(true); };
  const openEdit = (t: Trainer) => { setEditing({ ...t }); setShowModal(true); };
  const save = () => { if (!editing) return; upsertTrainer(editing); setTrainers(getTrainers()); setShowModal(false); };
  const addSpec = () => { if (!specInput.trim() || !editing) return; setEditing({ ...editing, specialties: [...editing.specialties, specInput.trim()] }); setSpecInput(""); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#0B1D3A]">Trainer Management</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C8102E] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#A50D24] transition-colors"><Plus className="w-4 h-4" /> Add Trainer</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="h-48 bg-slate-100 overflow-hidden">
              {t.photo ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full bg-[#0B1D3A] flex items-center justify-center text-white/30 text-4xl font-bold">{t.name[0]}</div>}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[#0B1D3A]">{t.name}</h3>
                {t.visible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <p className="text-xs text-[#C8102E] font-semibold mb-2">{t.role}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">{t.bio}</p>
              <button onClick={() => openEdit(t)} className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-black text-[#0B1D3A] mb-4">{editing.name ? "Edit Trainer" : "Add Trainer"}</h2>
            <div className="space-y-3">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Name" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input value={editing.photo} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} placeholder="Photo URL" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Role" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} placeholder="Bio" rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-none" />
              <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Location" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input type="number" value={editing.yearsExperience} onChange={(e) => setEditing({ ...editing, yearsExperience: Number(e.target.value) })} placeholder="Years of Experience" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Specialties</p>
                <div className="flex flex-wrap gap-1 mb-2">{editing.specialties.map((s, i) => <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">{s}<button onClick={() => setEditing({ ...editing, specialties: editing.specialties.filter((_, j) => j !== i) })} className="text-slate-400 hover:text-red-500">&times;</button></span>)}</div>
                <div className="flex gap-2"><input value={specInput} onChange={(e) => setSpecInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())} placeholder="Add specialty" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" /><button onClick={addSpec} className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-bold">Add</button></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} className="rounded" /> Visible on public site</label>
            </div>
            <button onClick={save} className="w-full mt-4 bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm">Save Trainer</button>
          </div>
        </div>
      )}
    </div>
  );
}
