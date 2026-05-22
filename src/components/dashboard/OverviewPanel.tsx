"use client";

import { brands, tlmEnterprise } from "@/lib/brands";
import { getBrandLogo } from "./BrandLogos";
import {
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  ArrowUpRight,
  ExternalLink,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";

interface OverviewPanelProps {
  onSelectBrand: (id: string) => void;
}

const recentActivity = [
  { brand: "lorenzos", action: "New booking confirmed", user: "Sarah M.", time: "2 min ago", type: "success" as const },
  { brand: "ttrg", action: "Donation received — $250", user: "Michael R.", time: "15 min ago", type: "success" as const },
  { brand: "lorenzos", action: "Trainer schedule updated", user: "Admin", time: "1 hr ago", type: "info" as const },
  { brand: "selectnetwork", action: "New member application", user: "David K.", time: "2 hrs ago", type: "info" as const },
  { brand: "ttrg", action: "Dog journey updated — Max", user: "Rescue Team", time: "3 hrs ago", type: "success" as const },
  { brand: "lorenzos", action: "Payment processed — $450", user: "System", time: "5 hrs ago", type: "success" as const },
];

const notifications = [
  { title: "TTRG site deployment ready", desc: "Review and approve changes", urgent: true },
  { title: "3 pending trainer approvals", desc: "Lorenzo's Dog Training", urgent: false },
  { title: "Monthly report generated", desc: "All brands — May 2026", urgent: false },
];

export default function OverviewPanel({ onSelectBrand }: OverviewPanelProps) {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {tlmEnterprise.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{tlmEnterprise.tagline}</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Visitors", value: "45,662", change: "+12.3%", icon: Globe, color: "indigo" },
          { label: "Total Revenue", value: "$92,270", change: "+21.8%", icon: DollarSign, color: "emerald" },
          { label: "Total Users", value: "2,535", change: "+15.4%", icon: Users, color: "violet" },
          { label: "Avg Growth", value: "+24.8%", change: "+3.2%", icon: TrendingUp, color: "amber" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === "indigo"
                    ? "bg-indigo-50 text-indigo-600"
                    : stat.color === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : stat.color === "violet"
                    ? "bg-violet-50 text-violet-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Website Preview Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Your Brands</h2>
          <span className="text-xs text-slate-400">{brands.length} connected</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300 cursor-pointer"
              onClick={() => onSelectBrand(brand.id)}
            >
              {/* Preview Window */}
              <div className="relative h-44 overflow-hidden bg-slate-50">
                {/* Browser Chrome */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5 z-10">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="ml-3 flex-1 h-4 bg-white rounded-sm flex items-center px-2">
                    <span className="text-[8px] text-slate-400 truncate">{brand.domain}</span>
                  </div>
                </div>

                {/* Site Preview Content */}
                <div
                  className="absolute inset-0 mt-7"
                  style={{ backgroundColor: brand.colors.bgDark }}
                >
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    {getBrandLogo(brand.id, "w-12 h-12 mb-2")}
                    <p className="text-white text-[10px] font-bold tracking-wider text-center">
                      {brand.name.toUpperCase()}
                    </p>
                    <p className="text-white/50 text-[8px] mt-1">{brand.tagline}</p>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 mt-7 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBrand(brand.id);
                    }}
                    className="flex items-center gap-1.5 bg-white text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Manage
                  </button>
                  {brand.previewUrl !== "#" && (
                    <a
                      href={brand.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Site
                    </a>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {getBrandLogo(brand.id, "w-6 h-6")}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{brand.shortName}</p>
                      <p className="text-[10px] text-slate-400">{brand.systemType}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      brand.status === "live"
                        ? "bg-emerald-50 text-emerald-600"
                        : brand.status === "development"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {brand.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-slate-900">{brand.stats.visitors}</p>
                    <p className="text-[10px] text-slate-400">Visitors</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-slate-900">{brand.stats.revenue}</p>
                    <p className="text-[10px] text-slate-400">Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Activity + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((item, i) => {
              const brand = brands.find((b) => b.id === item.brand);
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {getBrandLogo(item.brand, "w-6 h-6")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{item.action}</p>
                    <p className="text-[11px] text-slate-400">
                      {brand?.shortName} · {item.user}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      <Clock className="w-3 h-3 inline mr-0.5" />
                      {item.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
              {notifications.length} new
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {notifications.map((note, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                {note.urgent ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm text-slate-700">{note.title}</p>
                  <p className="text-[11px] text-slate-400">{note.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 w-full text-center">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
