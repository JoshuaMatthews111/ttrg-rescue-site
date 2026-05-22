"use client";

import { useState } from "react";
import Link from "next/link";
import { Dog, Edit, Eye, CheckCircle2, Clock, Save, X } from "lucide-react";
import { dogs as dogData } from "@/lib/dogs";

const assignedDogs = dogData.slice(0, 3).map((d) => ({
  ...d,
  assignedTrainer: "Lorenzo Miller",
  lastNote: "Responding well to leash training. Reduced reactivity around other dogs.",
  lastNoteDate: "May 16, 2025",
}));

export default function TrainerPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (id: string) => {
    setSaved(id);
    setEditingId(null);
    setNoteText("");
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">My Assigned Dogs</h1>
        <p className="text-sm text-[#1B2A4A]/50">Dogs currently in your training program</p>
      </div>

      <div className="space-y-4">
        {assignedDogs.map((dog) => (
          <div key={dog.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] text-lg">{dog.name}</h3>
                    <p className="text-[11px] text-[#1B2A4A]/40">{dog.age} · {dog.breed} · {dog.gender}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${dog.stage === "train" ? "bg-emerald-100 text-emerald-700" : dog.stage === "rehabilitate" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                    {dog.stage}
                  </span>
                </div>

                <div className="bg-[#FAFAF8] rounded-xl p-3 mb-3">
                  <p className="text-[10px] text-[#1B2A4A]/40 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Latest Training Note — {dog.lastNoteDate}</p>
                  <p className="text-sm text-[#1B2A4A]/70">{dog.lastNote}</p>
                </div>

                {saved === dog.id && (
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-3">
                    <CheckCircle2 className="w-4 h-4" /> Note saved! Change logged to admin.
                  </div>
                )}

                {editingId === dog.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add training update, behavior note, or progress..."
                      className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(dog.id)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                        <Save className="w-3 h-3" /> Save Note
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 border border-slate-200 text-[#1B2A4A] px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors">
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(dog.id); setNoteText(""); }} className="flex items-center gap-1.5 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                      <Edit className="w-3 h-3" /> Add Training Note
                    </button>
                    <Link href={`/ttrg/dogs/${dog.id}`} className="flex items-center gap-1.5 border border-slate-200 text-[#1B2A4A] px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors">
                      <Eye className="w-3 h-3" /> View Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
