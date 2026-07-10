"use client";

import Link from "next/link";
import { Heart, Home, Users, DollarSign, HandHeart, ArrowRight, Upload, GraduationCap, Building2, PawPrint } from "lucide-react";

const ways = [
  {
    icon: HandHeart,
    label: "Adopt a Dog",
    desc: "Give a rescue dog a permanent, loving home. Every adoption opens a spot to save another.",
    href: "/ttrg/adopt",
    color: "bg-red-50",
    cta: "Learn About Adoption",
    apply: "Apply to Adopt",
    applyHref: "/ttrg/adopt",
  },
  {
    icon: Home,
    label: "Foster a Dog",
    desc: "Open your home temporarily and provide a safe, loving environment while we find them a forever family. We cover all costs.",
    href: "/ttrg/foster",
    color: "bg-blue-50",
    cta: "Learn About Fostering",
    apply: "Apply to Foster",
    applyHref: "/ttrg/foster",
  },
  {
    icon: Heart,
    label: "Sponsor a Dog",
    desc: "Provide monthly support for a rescue dog's food, care, training, and rehabilitation. Choose any amount.",
    href: "/ttrg/sponsor",
    color: "bg-pink-50",
    cta: "See Dogs to Sponsor",
    apply: "Start Sponsoring",
    applyHref: "/ttrg/donate",
  },
  {
    icon: Users,
    label: "Volunteer",
    desc: "Share your time and skills — from dog walking to event support, photography, and transport.",
    href: "/ttrg/volunteer",
    color: "bg-emerald-50",
    cta: "Learn More",
    apply: "Apply to Volunteer",
    applyHref: "/ttrg/volunteer",
  },
  {
    icon: GraduationCap,
    label: "Become a Trainer",
    desc: "Interested in a career in dog training? Trainer positions are managed through Lorenzo's Dog Training Team. Contact us for more information about the application process.",
    href: "https://lorenzosdogtrainingteam.com",
    color: "bg-amber-50",
    cta: "Visit Lorenzo's Dog Training Team",
    apply: "Inquire About Training Careers",
    applyHref: "/ttrg/contact",
  },
  {
    icon: Upload,
    label: "Recommend a Dog",
    desc: "Shelters, trainers, owners, or concerned citizens — recommend a dog for our rescue program review.",
    href: "/ttrg/submit",
    color: "bg-orange-50",
    cta: "Learn More",
    apply: "Recommend Now",
    applyHref: "/ttrg/submit",
  },
  {
    icon: Building2,
    label: "Partner With TTRG",
    desc: "Businesses and organizations can make a lasting impact through corporate sponsorship and community giving.",
    href: "/ttrg/contact",
    color: "bg-violet-50",
    cta: "Learn More",
    apply: "Contact Us",
    applyHref: "/ttrg/contact",
  },
];

export default function GetInvolvedPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <PawPrint className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">Get Involved</h1>
          <p className="text-white/60 text-base max-w-lg mx-auto">There are many ways to make a lasting impact. Whether you adopt, foster, volunteer, or share our mission — every action saves a life.</p>
        </div>
      </section>

      {/* Pathways */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {ways.map((item, idx) => (
              <div
                key={item.label}
                id={item.label.toLowerCase().replace(/\s+/g, "-")}
                className="bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6 p-7 sm:p-8">
                  <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-8 h-8 text-[#C41E2A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-[#1B2A4A] text-xl mb-2">{item.label}</h3>
                    <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-5 max-w-xl">{item.desc}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={item.applyHref}
                        className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                      >
                        {item.apply} <ArrowRight className="w-4 h-4" />
                      </Link>
                      {item.href !== item.applyHref && (
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 border border-slate-200 text-[#1B2A4A] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          {item.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#0a1628] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Heart className="w-10 h-10 text-[#C41E2A] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Not Sure Where to Start?</h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto mb-8">Reach out and our team will help match you with the best way to support the rescue mission.</p>
          <Link href="/ttrg/contact" className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-8 py-4 rounded-full text-sm font-bold transition-all">
            Contact TTRG <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
