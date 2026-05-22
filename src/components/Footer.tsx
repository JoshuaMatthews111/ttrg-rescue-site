"use client";

import { Phone, Mail, MapPin, Clock, ArrowUp } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const footerLinks = {
  training: [
    { label: "Basic Obedience", href: "#services" },
    { label: "Behavioral Modification", href: "#services" },
    { label: "Service Dog Training", href: "#services" },
    { label: "Specialty Training", href: "#services" },
  ],
  company: [
    { label: "Our Story", href: "#about" },
    { label: "Meet the Trainers", href: "#trainers" },
    { label: "Our Facility", href: "#" },
    { label: "Careers", href: "#" },
  ],
  locations: [
    "Ohio", "California", "Florida", "Georgia", "Indiana",
    "Kentucky", "Massachusetts", "Michigan", "New Hampshire", "Texas",
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center">
                <span className="text-white font-[var(--font-heading)] font-bold text-lg">L</span>
              </div>
              <div>
                <p className="font-[var(--font-heading)] font-bold text-sm tracking-wide">
                  LORENZO&apos;S
                </p>
                <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase">
                  Dog Training Team
                </p>
              </div>
            </div>
            <p className="text-white/45 text-sm font-[var(--font-body)] leading-relaxed mb-6">
              Serious Training, Serious Results. Over 40 years of keeping dogs
              out of shelters and keeping them in safe and happy homes.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/lorenzosdogtrainingteam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-white/60" />
              </a>
              <a
                href="https://www.facebook.com/LorenzosDogTrainingTeam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <FacebookIcon className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>

          {/* Training Programs */}
          <div>
            <h4 className="font-[var(--font-heading)] font-semibold text-sm uppercase tracking-wider mb-6">
              Training Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.training.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/45 hover:text-white text-sm font-[var(--font-body)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-[var(--font-heading)] font-semibold text-sm uppercase tracking-wider mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/45 hover:text-white text-sm font-[var(--font-body)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[var(--font-heading)] font-semibold text-sm uppercase tracking-wider mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:8664364959"
                  className="flex items-center gap-3 text-white/45 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  (866) 436-4959
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@lorenzosdogtrainingteam.com"
                  className="flex items-center gap-3 text-white/45 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  info@lorenzosdogtraining.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/45 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Serving 10 States Nationwide
              </li>
              <li className="flex items-start gap-3 text-white/45 text-sm">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Mon – Sat: 8am – 6pm
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-[var(--font-body)]">
            © {new Date().getFullYear()} Lorenzo&apos;s Dog Training Team. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/30 text-xs">Serious Training, Serious Results</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowUp className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
