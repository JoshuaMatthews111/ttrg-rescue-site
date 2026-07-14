"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, Menu, X, ChevronDown, PawPrint, Home, Users, GraduationCap, Building2, HandHeart, BookOpen, Award, HeartHandshake } from "lucide-react";

const dogsDropdown = [
  { label: "Meet Our Dogs", href: "/ttrg/sponsor", icon: Heart },
  { label: "Dog Journeys", href: "/ttrg/journeys", icon: PawPrint },
  { label: "Success Stories", href: "/ttrg/stories", icon: HandHeart },
];

const involvedDropdown = [
  { label: "Adopt a Dog", href: "/ttrg/adopt", icon: HandHeart },
  { label: "Foster a Dog", href: "/ttrg/foster", icon: Home },
  { label: "Volunteer", href: "/ttrg/volunteer", icon: Users },
  { label: "Become a Trainer", href: "/ttrg/get-involved#trainer", icon: GraduationCap },
  { label: "Partner With Us", href: "/ttrg/get-involved#partner", icon: Building2 },
  { label: "Recommend a Dog", href: "/ttrg/submit", icon: PawPrint },
];

const aboutDropdown = [
  { label: "About TTRG", href: "/ttrg/about", icon: BookOpen },
  { label: "Meet the Founder", href: "/ttrg/founder", icon: Award },
  { label: "Our Trainers", href: "/ttrg/trainers", icon: GraduationCap },
];

function Dropdown({ label, items, open, onToggle, onClose }: { label: string; items: typeof dogsDropdown; open: boolean; onToggle: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // Use click (not mousedown) so Link clicks register first
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [onClose, open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-[#1B2A4A] text-sm font-semibold hover:text-[#C41E2A] transition-colors py-2"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
          <div className="relative w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-fade-up">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-100 rotate-45 pointer-events-none" />
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => { onClose(); }}
                className="relative z-10 flex items-center gap-3 px-4 py-2.5 text-[#1B2A4A] text-sm hover:bg-[#FFF0F0] hover:text-[#C41E2A] transition-colors"
              >
                <item.icon className="w-4 h-4 text-[#C41E2A]/60" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TTRGNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 shadow-md py-2 backdrop-blur-md"
            : "bg-white/40 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/ttrg" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full overflow-hidden shadow-md flex-shrink-0">
              <img src="/ttrg/ttrg-logo.png" alt="Team Trainers Rescue Group" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-[#1B2A4A] font-black text-sm tracking-tight">TEAM TRAINERS</p>
              <p className="text-[#C41E2A] font-black text-sm tracking-tight -mt-0.5">RESCUE GROUP</p>
            </div>
          </Link>

          {/* Desktop Nav — simplified */}
          <div className="hidden lg:flex items-center gap-7">
            <Link href="/ttrg" className="text-[#1B2A4A] text-sm font-semibold hover:text-[#C41E2A] transition-colors">
              Home
            </Link>
            <Dropdown
              label="Dogs"
              items={dogsDropdown}
              open={openDrop === "dogs"}
              onToggle={() => setOpenDrop(openDrop === "dogs" ? null : "dogs")}
              onClose={() => setOpenDrop(null)}
            />
            <Dropdown
              label="Get Involved"
              items={involvedDropdown}
              open={openDrop === "involved"}
              onToggle={() => setOpenDrop(openDrop === "involved" ? null : "involved")}
              onClose={() => setOpenDrop(null)}
            />
            <Dropdown
              label="About"
              items={aboutDropdown}
              open={openDrop === "about"}
              onToggle={() => setOpenDrop(openDrop === "about" ? null : "about")}
              onClose={() => setOpenDrop(null)}
            />
            <Link href="/ttrg/make-training-affordable" className="text-[#D97706] text-sm font-semibold hover:text-[#B45309] transition-colors flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" /> Make Training Affordable
            </Link>
            <Link href="/ttrg/contact" className="text-[#1B2A4A] text-sm font-semibold hover:text-[#C41E2A] transition-colors">
              Contact
            </Link>
          </div>

          {/* Donate Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/ttrg/donate"
              className="hidden sm:flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-red-500/20"
            >
              <Heart className="w-4 h-4 fill-white" />
              DONATE
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#1B2A4A]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C41E2A]/20">
                  <img src="/ttrg/ttrg-logo.png" alt="TTRG" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold text-[#1B2A4A]">TTRG</span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <Link href="/ttrg" onClick={() => setMobileOpen(false)} className="block px-6 py-3 text-[#1B2A4A] text-[15px] font-medium hover:bg-slate-50 hover:text-[#C41E2A] transition-colors">
                Home
              </Link>

              {/* Dogs accordion */}
              <button onClick={() => setMobileExpand(mobileExpand === "dogs" ? null : "dogs")} className="w-full flex items-center justify-between px-6 py-3 text-[#1B2A4A] text-[15px] font-medium hover:bg-slate-50">
                Dogs <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpand === "dogs" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpand === "dogs" && dogsDropdown.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-10 py-2.5 text-[#1B2A4A]/70 text-sm hover:text-[#C41E2A] hover:bg-slate-50 transition-colors">
                  <item.icon className="w-4 h-4 text-[#C41E2A]/50" /> {item.label}
                </Link>
              ))}

              {/* Get Involved accordion */}
              <button onClick={() => setMobileExpand(mobileExpand === "involved" ? null : "involved")} className="w-full flex items-center justify-between px-6 py-3 text-[#1B2A4A] text-[15px] font-medium hover:bg-slate-50">
                Get Involved <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpand === "involved" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpand === "involved" && involvedDropdown.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-10 py-2.5 text-[#1B2A4A]/70 text-sm hover:text-[#C41E2A] hover:bg-slate-50 transition-colors">
                  <item.icon className="w-4 h-4 text-[#C41E2A]/50" /> {item.label}
                </Link>
              ))}

              {/* About accordion */}
              <button onClick={() => setMobileExpand(mobileExpand === "about" ? null : "about")} className="w-full flex items-center justify-between px-6 py-3 text-[#1B2A4A] text-[15px] font-medium hover:bg-slate-50">
                About <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpand === "about" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpand === "about" && aboutDropdown.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-10 py-2.5 text-[#1B2A4A]/70 text-sm hover:text-[#C41E2A] hover:bg-slate-50 transition-colors">
                  <item.icon className="w-4 h-4 text-[#C41E2A]/50" /> {item.label}
                </Link>
              ))}

              <Link href="/ttrg/make-training-affordable" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-6 py-3 text-[#D97706] text-[15px] font-medium hover:bg-amber-50 transition-colors">
                <HeartHandshake className="w-4 h-4" /> Make Training Affordable
              </Link>
              <Link href="/ttrg/contact" onClick={() => setMobileOpen(false)} className="block px-6 py-3 text-[#1B2A4A] text-[15px] font-medium hover:bg-slate-50 hover:text-[#C41E2A] transition-colors">
                Contact
              </Link>
            </div>
            <div className="p-5 border-t border-slate-100">
              <Link
                href="/ttrg/donate"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#C41E2A] text-white py-3 rounded-full text-sm font-bold w-full"
              >
                <Heart className="w-4 h-4 fill-white" />
                DONATE NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
