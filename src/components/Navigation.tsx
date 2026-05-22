"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Training", href: "#services" },
  { label: "Results", href: "#testimonials" },
  { label: "Our Team", href: "#trainers" },
  { label: "Our Story", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const locations = [
  "Ohio", "California", "Florida", "Georgia", "Indiana",
  "Kentucky", "Massachusetts", "Michigan", "New Hampshire", "Texas",
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-navy/95 backdrop-blur-xl shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-[var(--font-heading)] font-bold text-lg">L</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-[var(--font-heading)] font-bold text-sm leading-tight tracking-wide">
                LORENZO&apos;S
              </p>
              <p className="text-white/70 text-[10px] font-[var(--font-body)] tracking-[0.2em] uppercase">
                Dog Training Team
              </p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-[var(--font-body)] font-medium tracking-wide animated-underline transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="relative" onMouseLeave={() => setLocationsOpen(false)}>
              <button
                onMouseEnter={() => setLocationsOpen(true)}
                className="text-white/80 hover:text-white text-sm font-[var(--font-body)] font-medium tracking-wide flex items-center gap-1 transition-colors"
              >
                Locations <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {locationsOpen && (
                <div className="absolute top-full mt-2 right-0 glass-dark rounded-xl p-3 min-w-[180px]">
                  {locations.map((loc) => (
                    <a
                      key={loc}
                      href="#"
                      className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors"
                    >
                      {loc}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:8664364959"
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-[var(--font-body)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              (866) 436-4959
            </a>
            <a
              href="#contact"
              className="bg-red hover:bg-red-light text-white px-6 py-2.5 rounded-full text-sm font-[var(--font-heading)] font-semibold tracking-wide transition-all hover:shadow-glow-red hover:scale-105"
            >
              Free Consultation
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy-dark/98 backdrop-blur-xl flex flex-col justify-center items-center gap-6 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white text-2xl font-[var(--font-heading)] font-semibold tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:8664364959"
            className="flex items-center gap-2 text-white/80 text-lg mt-4"
          >
            <Phone className="w-5 h-5" />
            (866) 436-4959
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="bg-red text-white px-8 py-3.5 rounded-full text-lg font-[var(--font-heading)] font-bold tracking-wide mt-4 animate-pulse-glow"
          >
            Free Consultation
          </a>
        </div>
      )}
    </>
  );
}
