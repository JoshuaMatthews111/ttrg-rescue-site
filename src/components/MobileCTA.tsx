"use client";

import { useState, useEffect } from "react";
import { Phone, Calendar } from "lucide-react";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-navy-dark/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <a
            href="tel:8664364959"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-[var(--font-heading)] font-semibold text-sm transition-colors hover:bg-white/15"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
          <a
            href="#contact"
            className="flex-[2] flex items-center justify-center gap-2 bg-red text-white py-3 rounded-xl font-[var(--font-heading)] font-bold text-sm transition-all hover:bg-red-light animate-pulse-glow"
          >
            <Calendar className="w-4 h-4" />
            Free Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
