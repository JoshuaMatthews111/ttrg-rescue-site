"use client";

import Link from "next/link";
import { Heart, ArrowRight, Quote, PawPrint, Shield, Users, Sparkles } from "lucide-react";

export default function FounderPage() {
  return (
    <div className="bg-white">
      {/* ═══ A. HERO — CINEMATIC WIDE ═══ */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <img
          src="/ttrg/founder-lorenzo.jpg"
          alt="Lorenzo Miller — Founder of TTRG"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/60 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-48 w-full">
          <div className="inline-flex items-center gap-2 bg-[#C41E2A] rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.15em]">Founder &amp; Lead Trainer</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-4 leading-[0.95]">Lorenzo Miller</h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-xl mb-3">40+ years dedicated to dogs — from training to rescue to changing lives.</p>
          <p className="text-white/40 text-sm max-w-md mb-8">Founder of Team Trainers Rescue Group · Cleveland, OH · 501(c)(3)</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-7 py-4 rounded-full text-sm font-bold transition-all shadow-2xl shadow-red-900/40">
              <Heart className="w-4 h-4 fill-white" /> Support the Mission
            </Link>
            <Link href="/ttrg/sponsor" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-4 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
              <PawPrint className="w-4 h-4" /> Meet the Dogs
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ B1. THE MISSION STARTED EARLY ═══ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-6">
            <PawPrint className="w-3.5 h-3.5 text-[#C41E2A]" />
            <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Chapter One</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-8 leading-tight">The Mission Started Early</h2>
          <div className="space-y-6 text-[#1B2A4A]/70 text-lg leading-relaxed">
            <p>
              Lorenzo Miller didn&apos;t wait for adulthood to start helping dogs. At just six years old, growing up in Cleveland, Ohio, he noticed the stray and abandoned dogs that most people walked past. He couldn&apos;t ignore them.
            </p>
            <p>
              While other kids played sports, Lorenzo was bringing home dogs that needed food, shelter, and care. He taught himself how to calm fearful dogs, how to earn trust, and how to give them a reason to believe in people again. That instinct became his life&apos;s work.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ B2. A LIFE BUILT AROUND DOGS — alternating image/text ═══ */}
      <section className="py-20 sm:py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/ttrg/about/DSC08379.jpg"
                alt="Lorenzo working with a dog"
                className="w-full h-[450px] sm:h-[520px] object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-6 leading-tight">A Life Built Around Dogs</h2>
              <div className="space-y-5 text-[#1B2A4A]/70 text-lg leading-relaxed">
                <p>
                  Over four decades, Lorenzo built a reputation as one of the most experienced and trusted dog trainers in the region. His approach centers on patience, positive reinforcement, and a deep understanding of canine behavior.
                </p>
                <p>
                  He has worked with thousands of dogs — from puppies to aggressive rescues, from family pets to dogs that other trainers refused to take on. His methods are rooted in compassion and proven results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PULL QUOTE ═══ */}
      <section className="py-16 sm:py-20 bg-[#1B2A4A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-10 h-10 text-[#C41E2A] mx-auto mb-6" />
          <p className="text-white text-2xl sm:text-3xl font-black italic leading-relaxed mb-6">
            &ldquo;Every dog I&apos;ve ever worked with has taught me something. They don&apos;t give up on us — we shouldn&apos;t give up on them.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
              <img src="/ttrg/trainers/lorenzo-miller-candid.jpg" alt="Lorenzo" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Lorenzo Miller</p>
              <p className="text-white/40 text-xs">Founder, Team Trainers Rescue Group</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ B3. FROM TRAINING TO RESCUE — alternating text/image ═══ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-6 leading-tight">From Training to Rescue</h2>
              <div className="space-y-5 text-[#1B2A4A]/70 text-lg leading-relaxed">
                <p>
                  After decades of professional training through Lorenzo&apos;s Dog Training Team, Lorenzo realized that training alone wasn&apos;t enough. Dogs were being euthanized in shelters, abandoned by families, and left without options. He saw a gap — and decided to fill it.
                </p>
                <p>
                  Lorenzo transitioned from trainer to rescuer, launching Team Trainers Rescue Group as a 501(c)(3) nonprofit. TTRG combines his training expertise with a full rescue infrastructure: intake, veterinary care, rehabilitation, foster placement, and adoption matching.
                </p>
                <p className="font-bold text-[#1B2A4A]">
                  This isn&apos;t just a rescue. It&apos;s a system.<br />
                  <span className="text-[#C41E2A]">Rescue. Rehabilitate. Rehome. Repeat.</span>
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/ttrg/about/IMG_1348.jpg"
                alt="Lorenzo holding a puppy"
                className="w-full h-[450px] sm:h-[520px] object-cover object-[center_30%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ B4. THE VISION MOVING FORWARD ═══ */}
      <section className="py-20 sm:py-28 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-8 leading-tight">The Vision Moving Forward</h2>
          <div className="space-y-6 text-[#1B2A4A]/70 text-lg leading-relaxed">
            <p>
              Lorenzo&apos;s vision for TTRG extends far beyond individual rescues. He sees a future where every dog in need has a clear path to safety, rehabilitation, and a loving home — supported by a community that refuses to look away.
            </p>
            <p>
              Through expanded foster networks, deeper partnerships with shelters, and a growing team of dedicated trainers and volunteers, TTRG is building the infrastructure to save more dogs, faster, and with better outcomes.
            </p>
            <p>
              The mission is simple. The work is hard. But Lorenzo has spent a lifetime proving that when people show up for dogs, extraordinary things happen.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ C. WHY TTRG EXISTS ═══ */}
      <section className="py-20 sm:py-24 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Why TTRG Exists</h2>
            <p className="text-white/50 text-base mt-3 max-w-xl mx-auto">
              Because every dog deserves a fair chance — and most just need someone willing to fight for them.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "To Save Lives", desc: "Dogs are pulled from high-risk situations, shelters, and the streets — giving them a chance when no one else will." },
              { icon: Heart, title: "To Heal", desc: "Medical care, behavioral rehabilitation, and emotional recovery — so every dog can become the best version of themselves." },
              { icon: Users, title: "To Build Community", desc: "Fosters, adopters, trainers, donors, and volunteers all play a role. This mission belongs to all of us." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#C41E2A] flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-black text-white text-xl mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ D. CLOSING CTA ═══ */}
      <section className="py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Heart className="w-14 h-14 text-[#C41E2A] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black text-[#1B2A4A] mb-5 leading-tight">Support the Mission</h2>
          <p className="text-[#1B2A4A]/50 text-lg max-w-lg mx-auto mb-10">
            Lorenzo&apos;s mission continues every day. Help us rescue, rehabilitate, and rehome the next dog waiting for their second chance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-500/20">
              <Heart className="w-4 h-4 fill-white" /> Support the Mission
            </Link>
            <Link href="/ttrg/sponsor" className="inline-flex items-center justify-center gap-2 border-2 border-[#1B2A4A]/20 text-[#1B2A4A] px-8 py-4 rounded-full text-sm font-bold hover:bg-[#1B2A4A]/5 transition-all">
              <PawPrint className="w-4 h-4" /> Meet the Dogs
            </Link>
            <Link href="/ttrg/get-involved" className="inline-flex items-center justify-center gap-2 border-2 border-[#1B2A4A]/20 text-[#1B2A4A] px-8 py-4 rounded-full text-sm font-bold hover:bg-[#1B2A4A]/5 transition-all">
              Get Involved <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
