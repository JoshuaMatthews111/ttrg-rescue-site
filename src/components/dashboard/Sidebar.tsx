"use client";

import { brands } from "@/lib/brands";
import { getBrandLogo, TLMLogo } from "./BrandLogos";
import {
  LayoutDashboard,
  Globe,
  Users,
  CreditCard,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
  Megaphone,
} from "lucide-react";

interface SidebarProps {
  activeBrand: string | null;
  onBrandSelect: (id: string | null) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const mainNav = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Globe, label: "Websites", id: "websites" },
  { icon: Users, label: "Users", id: "users" },
  { icon: CreditCard, label: "Payments", id: "payments" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Activity, label: "Analytics", id: "analytics" },
  { icon: Megaphone, label: "Announcements", id: "announcements" },
  { icon: Shield, label: "Security", id: "security" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export default function Sidebar({ activeBrand, onBrandSelect, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`relative flex flex-col bg-[#0f172a] text-white transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-7 w-6 h-6 bg-[#0f172a] border border-slate-700 rounded-full flex items-center justify-center z-20 hover:bg-slate-800 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-400" />
        )}
      </button>

      {/* TLM Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <TLMLogo className="w-9 h-9 flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tracking-wide truncate">TLM Enterprises</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Master Admin</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 py-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Navigation
          </p>
        )}
        {mainNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onBrandSelect(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
              !activeBrand && item.id === "overview"
                ? "bg-indigo-500/15 text-indigo-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}

        {/* Brands Section */}
        <div className="pt-4">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Brands
            </p>
          )}
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onBrandSelect(brand.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                activeBrand === brand.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                {getBrandLogo(brand.id, "w-7 h-7")}
              </div>
              {!collapsed && (
                <div className="min-w-0 text-left flex-1">
                  <p className="truncate text-sm leading-tight">{brand.shortName}</p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        brand.status === "live"
                          ? "bg-emerald-400"
                          : brand.status === "development"
                          ? "bg-amber-400"
                          : "bg-slate-500"
                      }`}
                    />
                    <span className="text-[10px] text-slate-500 capitalize">{brand.status}</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className={`border-t border-white/5 px-3 py-4 ${collapsed ? "text-center" : ""}`}>
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            JB
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Joshua B.</p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
