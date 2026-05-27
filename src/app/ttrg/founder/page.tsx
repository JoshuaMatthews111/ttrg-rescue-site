"use client";

import Link from "next/link";
import { Heart, ArrowRight, Quote, PawPrint, Shield, Users, Sparkles } from "lucide-react";

export default function FounderPage() {
  return (
    <div className="bg-white">
      {/* ═══ A. HERO — CINEMATIC WIDE ═══ */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-end overflow-hidden">
        <img
          src="/ttrg/founder-lorenzo.jpg"
          alt="Lorenzo Miller — Founder of TTRG"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/60 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 pt-32 sm:pt-48 w-full">
          <div className="inline-flex items-center gap-2 bg-[#C41E2A] rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.15em]">Founder &amp; Lead Trainer</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-4 leading-[0.95]">Lorenzo Miller</h1>
          <p className="text-white/60 text-base sm:text-xl max-w-xl mb-3">40+ years dedicated to dogs — from training to rescue to changing lives.</p>
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

      {/* ═══ B1. THE JOURNEY BEGAN EARLY ═══ */}
      <section className="py-16 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-6">
            <PawPrint className="w-3.5 h-3.5 text-[#C41E2A]" />
            <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">The Full Story</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-8 leading-tight">Lorenzo Miller&hellip; Founder</h2>
          <div className="space-y-6 text-[#1B2A4A]/70 text-base sm:text-lg leading-relaxed">
            <p>
              Lorenzo Miller&apos;s journey with dogs began long before he ever built a company, trained professionals, or developed a nationally recognized system. It began as a child growing up in the inner city with a deep compassion for the stray dogs wandering the neighborhoods around him.
            </p>
            <p>
              At just six years old, Lorenzo could not ignore what others walked past. He watched hungry dogs knock over garbage cans searching for food and shelter, and while most people saw a problem, he saw responsibility. He began bringing stray dogs home whenever he could. Knowing his parents would not allow him to keep them, Lorenzo secretly hid the dogs in his bedroom — training them to remain calm and quiet so they would not be discovered.
            </p>
            <p>
              What looked like childhood curiosity quickly revealed itself as something much deeper.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ B2. PROFESSIONAL DEVELOPMENT ═══ */}
      <section className="py-16 sm:py-28 bg-[#eef4ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/ttrg/about/DSC08379.jpg"
                alt="Lorenzo working with a dog"
                className="w-full h-[350px] sm:h-[520px] object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] mb-6 leading-tight">A Life Built Around Dogs</h2>
              <div className="space-y-5 text-[#1B2A4A]/70 text-base sm:text-lg leading-relaxed">
                <p>
                  By the age of ten, Lorenzo&apos;s parents recognized that his connection to dogs was more than a passing phase. They began sending him to work with professional dog trainers, where he immersed himself in the study of dog behavior, obedience, communication, and structure.
                </p>
                <p>
                  Over the years, Lorenzo trained under multiple professionals throughout the 1970s and 1980s, studying a wide range of techniques and philosophies across different disciplines of dog training.
                </p>
                <p className="font-bold text-[#1B2A4A]">
                  But Lorenzo noticed something important:<br />
                  <span className="text-[#C41E2A]">every system had strengths, and every system had weaknesses.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ B3. DEVELOPING HIS OWN SYSTEM ═══ */}
      <section className="py-16 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] mb-8 leading-tight">Developing His Own System</h2>
          <div className="space-y-6 text-[#1B2A4A]/70 text-base sm:text-lg leading-relaxed">
            <p>
              Driven by a relentless commitment to results, he began combining the most effective elements from the various methods he studied while eliminating the limitations he repeatedly observed in the field. Through decades of hands-on experience, refinement, and real-world application, Lorenzo developed his own distinctive philosophy and training system — one built around clarity, communication, structure, accountability, and lasting transformation between dogs and their owners.
            </p>
            <p>
              While attending college, Lorenzo supported himself by providing in-home dog training services, continuing to sharpen both his technique and his understanding of human behavior, leadership, and communication inside the home environment.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PULL QUOTE ═══ */}
      <section className="py-12 sm:py-20 bg-[#1B2A4A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-10 h-10 text-[#C41E2A] mx-auto mb-6" />
          <p className="text-white text-xl sm:text-3xl font-black italic leading-relaxed mb-6">
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

      {/* ═══ B4. BUILDING THE COMPANY ═══ */}
      <section className="py-16 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] mb-6 leading-tight">From Training to Rescue</h2>
              <div className="space-y-5 text-[#1B2A4A]/70 text-base sm:text-lg leading-relaxed">
                <p>
                  He officially founded <a href="https://lorenzosdogtrainingteam.com" target="_blank" rel="noopener noreferrer" className="text-[#C41E2A] font-semibold hover:underline">Lorenzo&apos;s Dog Training Team</a> — a mission unchanged to this day: happy dogs, capable owners, transformed families.
                </p>
                <p>
                  The company has been able to have brought thousands of families in the Cleveland area and beyond a permanent solution. His management philosophy evolved from individual service to a highly specialized organization — producing consistent, life-changing, practical results that don&apos;t stop at obedience.
                </p>
                <p>
                  But Lorenzo didn&apos;t stop at training. He needed qualified, strong people to help him scale, and he developed programs designed to not only recruit but civilize a class of carriers. The team expanded by identifying individuals who exhibited the commitment that comes with relevance.
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/ttrg/about/IMG_1348.jpg"
                alt="Lorenzo holding a puppy"
                className="w-full h-[350px] sm:h-[520px] object-cover object-[center_30%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ B5. THE RESCUE MISSION ═══ */}
      <section className="py-16 sm:py-28 bg-[#eef4ee]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] mb-8 leading-tight">The Rescue Mission</h2>
          <div className="space-y-6 text-[#1B2A4A]/70 text-base sm:text-lg leading-relaxed">
            <p>
              Now operating on a larger scale — centered around rescue, rehabilitation, education, and impact — the boy who started bringing strays home from the streets has grown to create a full staffing system equipped with skill and purpose.
            </p>
            <p>
              This isn&apos;t simply about dogs. His mission has always been the same: <span className="font-bold text-[#1B2A4A]">Rescue. Train. Rehome. Repeat.</span>
            </p>
            <p>
              Team Trainers Rescue Group represents the culmination of a lifetime of work. Every dog that comes through TTRG receives the same level of care, training, and dedication that Lorenzo gave to those first strays he hid in his childhood bedroom — professional medical attention, behavioral rehabilitation, structured training, and the promise of a loving forever home.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ C. WHY TTRG EXISTS ═══ */}
      <section className="py-16 sm:py-24 bg-[#0a1628]">
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
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
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
      <section className="py-16 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Heart className="w-14 h-14 text-[#C41E2A] mx-auto mb-6" />
          <h2 className="text-2xl sm:text-5xl font-black text-[#1B2A4A] mb-5 leading-tight">Support the Mission</h2>
          <p className="text-[#1B2A4A]/50 text-base sm:text-lg max-w-lg mx-auto mb-10">
            Lorenzo&apos;s mission continues every day. Help us rescue, train, and rehome the next dog waiting for their second chance.
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
