"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  );
}

export default function TTRGFooter() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  return (
    <>
      {/* Email Capture Bar */}
      <section className="bg-[#1B2A4A] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C41E2A] flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">A Rescue Dog Needs Someone Like You</p>
                <p className="text-white/50 text-xs">Join our rescue network and help save lives.</p>
              </div>
            </div>
            <form className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full sm:w-40 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/50"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-48 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/50"
              />
              <button className="h-10 px-6 bg-[#C41E2A] hover:bg-[#A01825] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
                JOIN THE RESCUE MISSION
              </button>
            </form>
            <p className="text-white/30 text-[10px] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1b30] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C41E2A]/30 shadow-lg bg-white">
                  <img src="/ttrg/ttrg-logo.jpeg" alt="Team Trainers Rescue Group" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-white font-black text-sm tracking-tight mb-2">RESCUE. REHABILITATE. REHOME. REPEAT.</p>
              <p className="text-white/40 text-sm leading-relaxed mb-3">
                Team Trainers Rescue Group is a rescue mission ecosystem helping dogs move from rescue to rehabilitation, training, foster care, and permanent homes.
              </p>
              <p className="text-white/30 text-xs">EIN: [Pending from client]</p>
              <p className="text-white/30 text-xs mt-1">501(c)(3) · All donations are tax-deductible.</p>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
              {[
                { label: "Our Mission", href: "/ttrg" },
                { label: "Adopt a Dog", href: "/ttrg/adopt" },
                { label: "Foster a Dog", href: "/ttrg/foster" },
                { label: "Sponsor a Dog", href: "/ttrg/sponsor" },
                { label: "Dog Journeys", href: "/ttrg/journeys" },
                { label: "Success Stories", href: "/ttrg/stories" },
                { label: "Donate", href: "/ttrg/donate" },
                { label: "Founder Story", href: "/ttrg/founder" },
                { label: "Our Trainers", href: "/ttrg/trainers" },
                { label: "Contact", href: "/ttrg/contact" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="block text-white/40 hover:text-white text-sm py-1.5 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Contact Us</p>
              <div className="space-y-3 text-white/40 text-sm">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  4805 Orchard Rd<br />Cleveland, OH 44128
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+18664364959" className="hover:text-white transition-colors">(866) 436-4959</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:Teamtrainersrescue@gmail.com" className="hover:text-white transition-colors">Teamtrainersrescue@gmail.com</a>
                </p>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Follow Us</p>
              <div className="flex items-center gap-3 mb-6">
                <a href="https://www.facebook.com/TeamTrainersRescueGroup" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all" aria-label="Facebook">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all" aria-label="YouTube">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
              <p className="text-white/30 text-[10px] mb-4">Instagram &amp; YouTube links coming soon — ask client to confirm accounts.</p>
              <Link
                href="/ttrg/donate"
                className="flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white py-2.5 px-5 rounded-full text-sm font-bold transition-colors w-full"
              >
                <Heart className="w-4 h-4 fill-white" />
                DONATE
              </Link>
              <p className="text-white/30 text-[11px] mt-3 text-center">Every gift saves a life.</p>
            </div>
          </div>

          <div className="border-t border-white/5 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">
              © {new Date().getFullYear()} Team Trainers Rescue Group. All rights reserved.
            </p>
            <Link href="/ttrg/admin/login" className="text-white/30 hover:text-white/60 text-xs font-medium transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </footer>

      {/* Chat Bubble (Crisp-style) */}
      <div className="fixed bottom-5 right-5 z-50">
        <button className="w-12 h-12 bg-[#1B2A4A] hover:bg-[#2a3d66] rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110">
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      </div>
    </>
  );
}
