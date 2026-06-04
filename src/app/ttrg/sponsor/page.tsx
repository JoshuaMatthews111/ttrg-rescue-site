"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, PawPrint, ChevronRight, ChevronDown, Filter, Gift, Stethoscope, GraduationCap, Home, Eye } from "lucide-react";
import { dogs as staticDogs } from "@/lib/dogs";
import { fetchPublishedDogs, subscribeToDogs } from "@/lib/admin-store";
import DogCard from "@/components/ttrg/DogCard";

const filters = ["All Dogs", "Urgent Cases", "Puppies", "In Rehab", "Ready for Home"];

const howItWorks = [
  { icon: PawPrint, title: "Choose a dog", desc: "Browse dogs in need of sponsorship." },
  { icon: Gift, title: "Give Monthly", desc: "Your recurring support makes a lasting impact." },
  { icon: Heart, title: "Follow Their Journey", desc: "Get updates, photos & see their progress." },
];

const sponsorshipHelps = [
  { num: 1, icon: Stethoscope, title: "Provides Essential Care", desc: "Food, vet care, medications, and safe shelter." },
  { num: 2, icon: Heart, title: "Supports Healing & Training", desc: "Rehabilitation, behavior training, and socialization." },
  { num: 3, icon: Home, title: "Prepares for a Forever Home", desc: "Helping dogs become happy, healthy, and adoptable." },
];

export default function SponsorPage() {
  const [activeFilter, setActiveFilter] = useState("All Dogs");
  const [dogs, setDogs] = useState(staticDogs);

  useEffect(() => {
    fetchPublishedDogs().then((published) => {
      if (published.length > 0) setDogs(published as unknown as typeof staticDogs);
    });
    const unsub = subscribeToDogs((dogs) => {
      if (dogs.length > 0) setDogs(dogs as unknown as typeof staticDogs);
    });
    return () => { unsub(); };
  }, []);

  return (
    <div className="bg-white">
      {/* ═══ HERO ═══ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF8] to-[#f0f0ec]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B2A4A] leading-tight mb-2">
                Sponsor a Dog
              </h1>
              <p className="text-2xl sm:text-3xl text-[#C41E2A] italic font-semibold mb-4">
                Change a life. Every month. <Heart className="inline w-6 h-6 fill-[#C41E2A]" />
              </p>
              <p className="text-[#1B2A4A]/60 text-base sm:text-lg leading-relaxed mb-6 max-w-lg">
                Your monthly support provides food, medical care, training, and love for a dog in need. You&apos;ll follow their journey from rescue to recovery—and beyond.
              </p>
              <div className="flex items-center gap-6 mb-6">
                {[
                  { icon: PawPrint, label: "Rescue", desc: "Saving dogs from high-risk situations." },
                  { icon: Heart, label: "Rehabilitate", desc: "Providing medical care, training & love." },
                  { icon: Home, label: "Rehome", desc: "Matching them with forever families." },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-[#C41E2A]" />
                    <div>
                      <p className="text-sm font-bold text-[#1B2A4A]">{item.label}</p>
                      <p className="text-[10px] text-[#1B2A4A]/40 hidden sm:block">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-6">How It Works</h3>
                <div className="space-y-5">
                  {howItWorks.map((step, i) => (
                    <div key={step.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-[#C41E2A]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1B2A4A] text-sm">{step.title}</p>
                        <p className="text-[12px] text-[#1B2A4A]/50">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FILTERS ═══ */}
      <section className="border-y border-slate-100 bg-white sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    activeFilter === f
                      ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                      : "bg-white text-[#1B2A4A]/70 border-slate-200 hover:border-[#1B2A4A]/30"
                  }`}
                >
                  {f === "Urgent Cases" && "🚨 "}{f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-[#1B2A4A]/50">
                <span>Monthly Amount</span>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[#1B2A4A] font-medium">
                  Any Amount <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1B2A4A]/50">
                <span>Sort By</span>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[#1B2A4A] font-medium">
                  Most Urgent <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DOG GRID ═══ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-xs text-[#1B2A4A]/40 mb-2">🐾 Each dog is on a journey. Your support helps write a better ending. 🐾</p>
          </div>
        </div>
      </section>

      {/* ═══ URGENT + HOW SPONSORSHIP HELPS ═══ */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Urgent */}
            <div className="bg-[#C41E2A] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Urgent Needs Right Now</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                These dogs need extra support for medical care, recovery, and safety. Your sponsorship can make all the difference today.
              </p>
              <button className="bg-white text-[#C41E2A] px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
                VIEW URGENT CASES
              </button>
            </div>

            {/* How Sponsorship Helps */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100">
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-6">How Your Sponsorship Helps</h3>
              <div className="grid grid-cols-3 gap-4">
                {sponsorshipHelps.map((step) => (
                  <div key={step.num} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center mx-auto mb-3 relative">
                      <step.icon className="w-5 h-5 text-[#C41E2A]" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C41E2A] text-white text-[9px] font-bold flex items-center justify-center">{step.num}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1B2A4A]">{step.title}</p>
                    <p className="text-[10px] text-[#1B2A4A]/40 mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL QUOTE ═══ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAFAF8] rounded-2xl p-8 sm:p-12 border border-slate-100 flex flex-col sm:flex-row items-center gap-8">
            <div className="text-4xl text-[#C41E2A] font-serif leading-none">&ldquo;</div>
            <div className="flex-1">
              <p className="text-[#1B2A4A]/70 text-lg leading-relaxed italic">
                Sponsoring Tucker has been one of the most rewarding things I&apos;ve ever done. Getting updates and seeing his progress reminds me why this mission matters.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#1B2A4A] flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#C41E2A] fill-[#C41E2A]" />
              </div>
              <div>
                <p className="font-bold text-[#1B2A4A] text-sm">— TTRG Sponsor</p>
                <p className="text-[11px] text-[#C41E2A]">Monthly Supporter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MONTHLY CTA ═══ */}
      <section className="py-12 bg-[#C41E2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Heart className="w-10 h-10 text-white fill-white/20 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">Be Their Hero. Every Month.</h3>
              <p className="text-white/70 text-sm">Your monthly gift gives a dog the second chance they deserve.</p>
            </div>
          </div>
          <button className="bg-white text-[#C41E2A] px-8 py-3.5 rounded-full text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Heart className="w-4 h-4 fill-[#C41E2A]" />
            BECOME A MONTHLY SPONSOR
          </button>
        </div>
      </section>
    </div>
  );
}
