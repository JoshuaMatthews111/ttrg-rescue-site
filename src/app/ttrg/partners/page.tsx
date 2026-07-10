"use client";

import Link from "next/link";
import { Building2, Heart, GraduationCap, Users, ArrowRight, MapPin, ExternalLink } from "lucide-react";

const partnerCategories = [
  {
    title: "Training Partners",
    icon: GraduationCap,
    color: "from-[#1B2A4A] to-[#2a3d66]",
    type: "Partner",
    partners: [
      { name: "Lorenzo's Dog Training Team", desc: "Primary training and rehabilitation partner", location: "Cleveland, OH", url: "https://lorenzosdogtrainingteam.com" },
    ],
  },
];

export default function PartnersPage() {
  return (
    <div className="bg-[#FDFCFA]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B2A4A] via-[#1a3a2a] to-[#1B2A4A] py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <Users className="w-3.5 h-3.5 text-[#C41E2A]" />
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Community Affiliates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">Our Partners</h1>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            The organizations, professionals, and community members who make our rescue mission possible. Together, we save lives.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] text-amber-700 text-center font-medium">
            Only organizations that have given explicit approval are listed below. This page is being updated as partnerships are confirmed.
          </p>
        </div>
      </div>

      {/* Partner Categories */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partnerCategories.map((cat) => (
            <div key={cat.title} className="mb-16 last:mb-0">
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1B2A4A]">{cat.title}</h2>
                  <p className="text-xs text-[#1B2A4A]/40">{cat.type} · {cat.partners.length} listed</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.partners.map((p) => (
                  <div key={p.name} className="bg-white rounded-2xl border border-[#2d5a3d]/8 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-[#1B2A4A]/5 flex items-center justify-center mb-4">
                      <cat.icon className="w-7 h-7 text-[#1B2A4A]/30" />
                    </div>
                    <h3 className="font-bold text-[#1B2A4A] text-lg mb-1">{p.name}</h3>
                    <p className="text-sm text-[#1B2A4A]/50 mb-3">{p.desc}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#2d5a3d]/60 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {p.location}
                    </div>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C41E2A] hover:underline">
                        <ExternalLink className="w-3 h-3" /> Visit Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#f7f5f0] via-[#f0ece4] to-[#eef3ee]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="w-12 h-12 text-[#2d5a3d] mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-4">Become a Partner</h2>
          <p className="text-[#1B2A4A]/50 text-base max-w-lg mx-auto mb-8">
            Whether you&apos;re a veterinarian, groomer, trainer, shelter, or business — partner with TTRG to make a direct impact on dog rescue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ttrg/contact" className="inline-flex items-center justify-center gap-2 bg-[#2d5a3d] hover:bg-[#1a3a2a] text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg">
              Partner With Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg">
              <Heart className="w-4 h-4 fill-white" /> Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
