"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, MessageCircle, Video, Megaphone,
  BookOpen, Settings, Shield, Menu, X, LogOut, Phone, Mail, UserPlus,
} from "lucide-react";
import { lorenzoGetSession, lorenzoClearSession, type LorenzoRole } from "@/lib/lorenzo-store";

const navItems = [
  { label: "Dashboard", href: "/lorenzo/admin", icon: LayoutDashboard, roles: ["super_admin", "admin", "trainer", "office_staff"] },
  { label: "Consultation Leads", href: "/lorenzo/admin/leads", icon: Phone, roles: ["super_admin", "admin", "office_staff"] },
  { label: "Contact Messages", href: "/lorenzo/admin/contacts", icon: MessageCircle, roles: ["super_admin", "admin", "office_staff"] },
  { label: "Trainers", href: "/lorenzo/admin/trainers", icon: Users, roles: ["super_admin", "admin"] },
  { label: "Testimonials", href: "/lorenzo/admin/testimonials", icon: Video, roles: ["super_admin", "admin"] },
  { label: "Announcements", href: "/lorenzo/admin/announcements", icon: Megaphone, roles: ["super_admin", "admin"] },
  { label: "Programs", href: "/lorenzo/admin/programs", icon: BookOpen, roles: ["super_admin", "admin"] },
  { label: "Email Leads", href: "/lorenzo/admin/email-leads", icon: Mail, roles: ["super_admin", "admin", "office_staff"] },
  { label: "Users & Roles", href: "/lorenzo/admin/users", icon: UserPlus, roles: ["super_admin", "admin"] },
  { label: "Settings", href: "/lorenzo/admin/settings", icon: Settings, roles: ["super_admin", "admin"] },
];

export default function LorenzoAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof lorenzoGetSession>>(null);

  useEffect(() => {
    if (pathname === "/lorenzo/admin/login") return;
    const session = lorenzoGetSession();
    if (!session) { router.push("/lorenzo/admin/login"); return; }
    setUser(session);
  }, [pathname, router]);

  if (pathname === "/lorenzo/admin/login") return <>{children}</>;
  if (!user) return null;

  const visibleNav = navItems.filter((n) => n.roles.includes(user.role));

  const handleLogout = () => { lorenzoClearSession(); router.push("/lorenzo/admin/login"); };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-[#0B1D3A] text-white fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-white/10">
          <Link href="/lorenzo/admin" className="flex items-center gap-2">
            <img src="/lorenzo/logo.jpeg" alt="Lorenzo's" className="h-9 w-auto object-contain" />
            <span className="text-white/40 text-[10px] font-medium">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {visibleNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${active ? "bg-white/10 text-white font-semibold border-r-2 border-[#C8102E]" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold">{user.name[0]}</div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-[10px] text-white/40 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#0B1D3A] px-4 py-3 flex items-center justify-between">
        <Link href="/lorenzo/admin" className="flex items-center gap-2">
          <img src="/lorenzo/logo.jpeg" alt="Lorenzo's" className="h-8 w-auto object-contain" />
          <span className="text-white font-bold text-sm">Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="text-white"><Menu className="w-6 h-6" /></button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0B1D3A] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-bold text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-white/60" /></button>
            </div>
            <nav className="flex-1 py-4">
              {visibleNav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-5 py-3 text-sm ${pathname === item.href ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:text-white"}`}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 text-xs"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
