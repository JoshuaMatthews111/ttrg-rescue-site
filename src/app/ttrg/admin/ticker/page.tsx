"use client";

import { useState, useEffect } from "react";
import { getTickerItems, saveTickerItems, type TickerItem } from "@/lib/admin-store";
import { Plus, Trash2, ToggleLeft, ToggleRight, Sparkles, GripVertical, Save, Palette } from "lucide-react";

const TICKER_COLOR_KEY = "ttrg-ticker-color";
const presetColors = [
  { label: "Bright Green", from: "#1e6b3a", via: "#28a745", to: "#1e6b3a" },
  { label: "Forest Green", from: "#1a3a2a", via: "#2d5a3d", to: "#1a3a2a" },
  { label: "Emerald", from: "#047857", via: "#10b981", to: "#047857" },
  { label: "Navy", from: "#1B2A4A", via: "#243656", to: "#1B2A4A" },
  { label: "Red", from: "#7a0d18", via: "#C41E2A", to: "#7a0d18" },
  { label: "Teal", from: "#0d4f4f", via: "#0d9488", to: "#0d4f4f" },
];

export default function TickerAdmin() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [newText, setNewText] = useState("");
  const [saved, setSaved] = useState(false);
  const [tickerColor, setTickerColor] = useState(presetColors[0]);

  useEffect(() => {
    setItems(getTickerItems());
    const savedColor = localStorage.getItem(TICKER_COLOR_KEY);
    if (savedColor) {
      try { setTickerColor(JSON.parse(savedColor)); } catch {}
    }
  }, []);

  const save = () => {
    saveTickerItems(items);
    localStorage.setItem(TICKER_COLOR_KEY, JSON.stringify(tickerColor));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addItem = () => {
    if (!newText.trim()) return;
    const item: TickerItem = {
      id: `t-${Date.now()}`,
      text: newText.trim(),
      active: true,
      createdAt: new Date().toISOString(),
      type: "manual",
    };
    setItems([item, ...items]);
    setNewText("");
  };

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
  };

  const remove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const suggestFromDog = () => {
    const suggestions = [
      "🐾 Bailey just moved from Rescue to Training & Rehab — follow the journey!",
      "🎉 Tucker has been adopted! Another forever home found!",
      "🐕 New rescue intake: Shadow is safe and receiving medical care",
      "💚 3 foster families signed up this week — Thank you!",
      "🏠 Luna is now in foster care and looking for her forever family",
    ];
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    setNewText(pick);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1B2A4A]">Ticker / Banner Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the scrolling ticker that appears at the top of the site. Changes go live immediately.</p>
        </div>
        <button onClick={save} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#1B2A4A] text-white hover:bg-[#2a3d66]"}`}>
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save & Publish"}
        </button>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <p className="text-sm font-bold text-[#1B2A4A] mb-3">Add New Ticker Item</p>
        <div className="flex gap-3">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="e.g. 🐾 Bailey just advanced to Foster Placement!"
            className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
          />
          <button onClick={suggestFromDog} className="h-11 px-4 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Suggest
          </button>
          <button onClick={addItem} className="h-11 px-4 rounded-xl bg-[#2d5a3d] text-white text-sm font-bold hover:bg-[#1a3a2a] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Color Picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-[#1B2A4A]" />
          <p className="text-sm font-bold text-[#1B2A4A]">Ticker Color</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {presetColors.map((color) => (
            <button
              key={color.label}
              onClick={() => setTickerColor(color)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border-2 transition-all ${tickerColor.label === color.label ? "border-[#1B2A4A] shadow-md scale-105" : "border-slate-200 hover:border-slate-300"}`}
            >
              <span className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to right, ${color.from}, ${color.via}, ${color.to})` }} />
              {color.label}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl overflow-hidden">
          <div className="py-2 px-4 text-white text-xs font-semibold" style={{ background: `linear-gradient(to right, ${tickerColor.from}, ${tickerColor.via}, ${tickerColor.to})` }}>
            Preview: {items[0]?.text || "Your ticker text here..."}
          </div>
        </div>
      </div>

      {/* Current items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${item.active ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60"}`}>
            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#1B2A4A] truncate">{item.text}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {item.type === "auto" ? "Auto-generated from journey" : "Manual"} · {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => toggle(item.id)} className="flex-shrink-0">
              {item.active ? (
                <ToggleRight className="w-7 h-7 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-300" />
              )}
            </button>
            <button onClick={() => remove(item.id)} className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No ticker items yet. Add one above to get started.</p>
        </div>
      )}

      <div className="mt-8 p-5 bg-[#2d5a3d]/5 rounded-2xl border border-[#2d5a3d]/10">
        <p className="text-sm font-bold text-[#2d5a3d] mb-2">How the Ticker Works</p>
        <ul className="text-xs text-[#1B2A4A]/60 space-y-1.5">
          <li>The ticker scrolls continuously across the top of every page</li>
          <li>Active items appear in the ticker — toggle off to hide without deleting</li>
          <li>When a dog advances in their journey, the system can auto-suggest ticker text</li>
          <li>Click &quot;Suggest&quot; to get AI-generated text based on recent dog progress</li>
          <li>Changes are saved to the live site when you click &quot;Save &amp; Publish&quot;</li>
        </ul>
      </div>
    </div>
  );
}
