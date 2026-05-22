"use client";

import { Brand } from "@/lib/brands";
import { getBrandLogo } from "./BrandLogos";
import {
  Search,
  Bell,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

interface TopNavProps {
  activeBrand: Brand | null;
  onBackToOverview: () => void;
}

export default function TopNav({ activeBrand, onBackToOverview }: TopNavProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        {activeBrand ? (
          <>
            <button
              onClick={onBackToOverview}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-3">
              {getBrandLogo(activeBrand.id, "w-7 h-7")}
              <div>
                <p className="text-sm font-semibold text-slate-900">{activeBrand.name}</p>
                <p className="text-[11px] text-slate-400">{activeBrand.domain}</p>
              </div>
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                activeBrand.status === "live"
                  ? "bg-emerald-50 text-emerald-600"
                  : activeBrand.status === "development"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {activeBrand.status}
            </span>
          </>
        ) : (
          <div>
            <p className="text-sm font-semibold text-slate-900">Ecosystem Overview</p>
            <p className="text-[11px] text-slate-400">All brands at a glance</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>

        <button className="relative w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {activeBrand && activeBrand.previewUrl !== "#" && (
          <a
            href={activeBrand.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3 rounded-lg bg-indigo-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </a>
        )}
      </div>
    </header>
  );
}
