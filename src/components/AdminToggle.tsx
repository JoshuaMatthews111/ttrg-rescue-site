"use client";

import { useState } from "react";
import { LayoutDashboard, X, Globe, Settings, BarChart3 } from "lucide-react";

export default function AdminToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 p-4 w-64 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-white tracking-wide">TLM Enterprises</p>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Master Dashboard
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <Settings className="w-4 h-4" />
              Site Settings
            </a>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <Globe className="w-4 h-4" />
              View Live Site
            </a>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] text-white/30 text-center">Super Admin · Joshua B.</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          open
            ? "bg-white text-[#0f172a]"
            : "bg-[#0f172a] text-white border border-white/10"
        }`}
      >
        {open ? <X className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
      </button>
    </div>
  );
}
