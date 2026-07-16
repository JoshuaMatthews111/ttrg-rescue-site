"use client";

import { useState, useEffect, createContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Dog, FileText, Heart, BookOpen, Users, Building2, Settings,
  Bell, ChevronRight, Menu, X, LogOut, Shield, GraduationCap,
  Activity, ChevronDown, Image as ImageIcon, Megaphone, Paintbrush, HeartHandshake,
} from "lucide-react";
import { getSession, clearSession } from "@/lib/admin-store";

type Role = "super_admin" | "admin" | "trainer" | "org_partner";

const navByRole: Record<Role, { label: string; href: string; icon: typeof LayoutDashboard; badge?: number }[]> = {
  super_admin: [
    { label: "Dashboard", href: "/ttrg/admin", icon: LayoutDashboard },
    { label: "Dogs", href: "/ttrg/admin/dogs", icon: Dog },
    { label: "Family Profiles", href: "/ttrg/admin/family-profiles", icon: HeartHandshake },
    { label: "Applications", href: "/ttrg/admin/applications", icon: FileText },
    { label: "Donations", href: "/ttrg/admin/donations", icon: Heart },
    { label: "Stories & Videos", href: "/ttrg/admin/media", icon: BookOpen },
    { label: "Partners", href: "/ttrg/admin/partners", icon: Building2 },
    { label: "Ticker / Banner", href: "/ttrg/admin/ticker", icon: Megaphone },
    { label: "Site Builder", href: "/ttrg/admin/site-builder", icon: Paintbrush },
    { label: "Users & Roles", href: "/ttrg/admin/users", icon: Users },
    { label: "Notifications", href: "/ttrg/admin/notifications", icon: Bell },
    { label: "Settings", href: "/ttrg/admin/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/ttrg/admin", icon: LayoutDashboard },
    { label: "Dogs", href: "/ttrg/admin/dogs", icon: Dog },
    { label: "Family Profiles", href: "/ttrg/admin/family-profiles", icon: HeartHandshake },
    { label: "Applications", href: "/ttrg/admin/applications", icon: FileText },
    { label: "Stories & Videos", href: "/ttrg/admin/media", icon: BookOpen },
    { label: "Partners", href: "/ttrg/admin/partners", icon: Building2 },
    { label: "Ticker / Banner", href: "/ttrg/admin/ticker", icon: Megaphone },
    { label: "Site Builder", href: "/ttrg/admin/site-builder", icon: Paintbrush },
    { label: "Notifications", href: "/ttrg/admin/notifications", icon: Bell },
  ],
  trainer: [
    { label: "Dashboard", href: "/ttrg/admin", icon: LayoutDashboard },
    { label: "My Assigned Dogs", href: "/ttrg/admin/trainer", icon: Dog },
    { label: "Training Schedule", href: "/ttrg/admin/trainer", icon: GraduationCap },
    { label: "Notifications", href: "/ttrg/admin/notifications", icon: Bell },
  ],
  org_partner: [
    { label: "Dashboard", href: "/ttrg/admin", icon: LayoutDashboard },
    { label: "Referrals", href: "/ttrg/admin/partners", icon: FileText },
    { label: "Shared Dogs", href: "/ttrg/admin/dogs", icon: Dog },
    { label: "Notifications", href: "/ttrg/admin/notifications", icon: Bell },
  ],
};

const roleMeta: Record<Role, { label: string; sublabel: string; color: string }> = {
  super_admin: { label: "Super Admin", sublabel: "Full System Access", color: "from-red-600 to-red-800" },
  admin: { label: "Operations Admin", sublabel: "Manages Operations", color: "from-blue-600 to-blue-800" },
  trainer: { label: "Trainer", sublabel: "Training Team Portal", color: "from-emerald-600 to-emerald-800" },
  org_partner: { label: "Partner", sublabel: "Outreach Portal", color: "from-violet-600 to-violet-800" },
};

export const RoleContext = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: "super_admin", setRole: () => {} });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("super_admin");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [sessionName, setSessionName] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/ttrg/admin/login") { setChecking(false); return; }
    const session = getSession();
    if (!session) { router.replace("/ttrg/admin/login"); return; }
    setSessionName(session.name);
    // Honor session role unless user switched via demo switcher
    const savedRole = localStorage.getItem("ttrg-demo-role") as Role | null;
    setRole(savedRole || (session.role as Role));
    setChecking(false);
  }, [pathname, router]);

  useEffect(() => {
    if (!checking) localStorage.setItem("ttrg-demo-role", role);
  }, [role, checking]);

  if (pathname === "/ttrg/admin/login") return <>{children}</>;
  if (pathname.startsWith("/ttrg/admin/site-builder")) return <>{children}</>;
  if (checking) return <div className="min-h-screen bg-[#0a1628] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C41E2A]/30 border-t-[#C41E2A] rounded-full animate-spin" /></div>;

  const nav = navByRole[role];
  const meta = roleMeta[role];
  const handleLogout = () => { clearSession(); localStorage.removeItem("ttrg-demo-role"); router.push("/ttrg/admin/login"); };
  const isActive = (href: string) => pathname === href || (href !== "/ttrg/admin" && pathname.startsWith(href));

  const Sidebar = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <img src="/ttrg/ttrg-logo.png" alt="TTRG" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C41E2A]/30 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-white font-black text-sm tracking-tight">TEAM TRAINERS</p>
          <p className="text-[#C41E2A] text-[10px] font-bold tracking-wider">RESCUE GROUP</p>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="p-3 border-b border-white/5">
        <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)} className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-md`}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-white text-xs font-bold truncate">{meta.label}</p>
            <p className="text-white/40 text-[10px] truncate">{meta.sublabel}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showRoleSwitcher ? "rotate-180" : ""}`} />
        </button>
        {showRoleSwitcher && (
          <div className="mt-2 space-y-1 bg-black/30 rounded-xl p-1.5">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider px-2 py-1">Demo: Switch Role</p>
            {(Object.keys(roleMeta) as Role[]).map((r) => {
              const rm = roleMeta[r];
              return (
                <button key={r} onClick={() => { setRole(r); setShowRoleSwitcher(false); setMobileOpen(false); }} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all ${role === r ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${rm.color}`} />
                  <span className="flex-1 text-left">{rm.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map((item) => (
          <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${isActive(item.href) ? "bg-white/5 text-white font-semibold border-[#C41E2A]" : "text-white/50 hover:text-white hover:bg-white/5 border-transparent"}`}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="bg-[#C41E2A] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider">System Status</p>
        <div className="space-y-1.5">
          {[
            { label: "All Systems", status: "Operational", color: "bg-emerald-500" },
            { label: "Database", status: "Operational", color: "bg-emerald-500" },
            { label: "Email Services", status: "Operational", color: "bg-emerald-500" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between text-[10px]">
              <span className="text-white/50">{s.label}</span>
              <span className="flex items-center gap-1.5 text-white/40">
                <span className={`w-1.5 h-1.5 rounded-full ${s.color} animate-pulse`} /> {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-md flex-shrink-0`}>
            <span className="text-white text-xs font-black">{(sessionName || "A")[0]}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-bold truncate">{sessionName || "Admin"}</p>
            <p className="text-white/40 text-[10px] truncate">{meta.label}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white text-xs transition-colors py-2 border border-white/10 rounded-lg hover:bg-white/5">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
        <Link href="/ttrg" className="block text-center text-white/30 hover:text-white text-[10px] mt-2 transition-colors">← Back to Public Site</Link>
      </div>
    </>
  );

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div className="flex min-h-screen bg-[#0a1628]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col bg-[#0f1b30] border-r border-white/5 w-[260px] flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f1b30] h-14 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="/ttrg/ttrg-logo.png" alt="TTRG" className="w-9 h-9 rounded-full object-cover" />
            <span className="text-white text-sm font-bold">{meta.label}</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0f1b30] flex flex-col">
              <Sidebar />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pt-0 pt-14 min-w-0 bg-[#0a1628]">
          {children}
        </main>
      </div>
    </RoleContext.Provider>
  );
}
