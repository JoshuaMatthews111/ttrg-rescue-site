"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, MapPin, Mail, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "About", href: "/lorenzo#about" },
  { label: "Training Programs", href: "/lorenzo#programs" },
  { label: "Success Stories", href: "/lorenzo#stories" },
  { label: "Trainers", href: "/lorenzo#trainers" },
  { label: "Resources", href: "/lorenzo#resources" },
  { label: "Contact", href: "/lorenzo#contact" },
];

function LorenzoNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0B1D3A] shadow-xl py-2" : "bg-[#0B1D3A]/95 backdrop-blur-md py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/lorenzo" className="flex items-center gap-2 flex-shrink-0">
            <img src="/lorenzo/logo.jpeg" alt="Lorenzo's Dog Training Team" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="tel:+18664364959" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
              <Phone className="w-4 h-4" />
              (866) 436-4959
            </a>
            <a href="#contact" className="hidden sm:flex items-center gap-2 bg-[#C8102E] hover:bg-[#A50D24] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all">
              Book Consultation
            </a>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-[#0B1D3A] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="text-white font-bold text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-white/60" /></button>
            </div>
            <div className="flex-1 py-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block px-6 py-3.5 text-white/80 text-[15px] font-medium hover:bg-white/5 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="p-5 space-y-3 border-t border-white/10">
              <a href="tel:+18664364959" className="flex items-center justify-center gap-2 border border-white/20 text-white py-3 rounded-lg text-sm font-bold w-full">
                <Phone className="w-4 h-4" /> Call (866) 436-4959
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-[#C8102E] text-white py-3 rounded-lg text-sm font-bold w-full">
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LorenzoFooter() {
  return (
    <footer className="bg-[#060F1F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-4">
              <img src="/lorenzo/logo.jpeg" alt="Lorenzo's Dog Training Team" className="h-14 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Serious Training. Serious Results. Over 40 years of keeping dogs out of shelters and in safe, happy homes.</p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
            {[
              { label: "Training Programs", href: "/lorenzo#programs" },
              { label: "Success Stories", href: "/lorenzo#stories" },
              { label: "Meet the Trainers", href: "/lorenzo#trainers" },
              { label: "Our Story", href: "/lorenzo#about" },
              { label: "Contact Us", href: "/lorenzo#contact" },
              { label: "Book Consultation", href: "/lorenzo#contact" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="block text-white/40 hover:text-white text-sm py-1.5 transition-colors">{link.label}</a>
            ))}
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Service Areas</p>
            {["Ohio", "California", "Florida", "Georgia", "Indiana", "Kentucky", "Massachusetts", "Michigan", "New Hampshire", "Texas"].map((state) => (
              <span key={state} className="inline-block text-white/40 text-sm py-0.5 mr-3">{state}</span>
            ))}
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Contact Us</p>
            <div className="space-y-3 text-white/40 text-sm">
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> 4815 Orchard Rd<br />Cleveland, OH</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" /> <a href="tel:+18664364959" className="hover:text-white transition-colors">(866) 436-4959</a></p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" /> <a href="mailto:info@lorenzosdogtrainingteam.com" className="hover:text-white transition-colors">info@lorenzosdogtrainingteam.com</a></p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Lorenzo&apos;s Dog Training Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0B1D3A] border-t border-white/10 px-4 py-3 flex gap-3">
      <a href="tel:+18664364959" className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white py-3 rounded-lg text-sm font-bold">
        <Phone className="w-4 h-4" /> Call Now
      </a>
      <a href="#contact" className="flex-1 flex items-center justify-center gap-2 bg-[#C8102E] text-white py-3 rounded-lg text-sm font-bold">
        Book Consultation
      </a>
    </div>
  );
}

export default function LorenzoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <LorenzoNav />
      <main>{children}</main>
      <LorenzoFooter />
      <StickyMobileCTA />
    </div>
  );
}
