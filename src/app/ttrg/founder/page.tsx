"use client";

import Link from "next/link";
import { Users, Heart, ArrowRight } from "lucide-react";

export default function FounderPage() {
  return (
    <div className="bg-white">

      {/* ═══ 1. HERO — Two-column founder section ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            {/* Left — Photo + caption */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/ttrg/founder-lorenzo.jpg"
                  alt="Lorenzo Miller — Founder of TTRG"
                  className="w-full aspect-[4/5] object-cover object-top"
                />
              </div>
              <div className="mt-5 text-center">
                <p className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Founder &amp; Lead Trainer</p>
                <p className="text-[#1B2A4A] text-xl font-black mt-1">Lorenzo Miller</p>
              </div>
            </div>

            {/* Right — Heading + opening story */}
            <div className="lg:col-span-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] leading-tight mb-4">Lorenzo Miller&hellip; Founder</h1>
              <p className="text-[#1B2A4A]/60 text-base sm:text-lg mb-2">40+ years dedicated to dogs — from training to rescue to changing lives.</p>
              <p className="text-[#1B2A4A]/40 text-sm mb-6">Founder of Team Trainers Rescue Group · Cleveland, OH · 501(c)(3) · EIN: 46-1426142</p>
              <div className="space-y-4 text-[#1B2A4A]/70 text-base leading-relaxed">
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
          </div>
        </div>
      </section>

      {/* ═══ 2. BIO — Single flowing story ═══ */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p>
              By the age of ten, Lorenzo&apos;s parents recognized that his connection to dogs was more than a passing phase. They began sending him to work with professional dog trainers, where he immersed himself in the study of dog behavior, obedience, communication, and structure. Over the years, Lorenzo trained under multiple professionals throughout the 1970s and 1980s, studying a wide range of techniques and philosophies across different disciplines of dog training.
            </p>
            <p className="font-semibold text-[#1B2A4A]">
              But Lorenzo noticed something important: every system had strengths, and every system had weaknesses.
            </p>
            <p>
              Driven by a relentless commitment to results, he began combining the most effective elements from the various methods he studied while eliminating the limitations he repeatedly observed in the field. Through decades of hands-on experience, refinement, and real-world application, Lorenzo developed his own distinctive philosophy and training system — one built around clarity, communication, structure, accountability, and lasting transformation between dogs and their owners.
            </p>
            <p>
              While attending college, Lorenzo supported himself by providing in-home dog training services, continuing to sharpen both his technique and his understanding of human behavior, leadership, and communication inside the home environment.
            </p>
          </div>

          {/* Blockquote */}
          <blockquote className="my-12 border-l-4 border-[#C41E2A] pl-6 py-4">
            <p className="text-[#1B2A4A] text-xl sm:text-2xl font-black italic leading-relaxed">
              &ldquo;Every dog I&apos;ve ever worked with has taught me something. They don&apos;t give up on us — we shouldn&apos;t give up on them.&rdquo;
            </p>
            <p className="text-[#1B2A4A]/50 text-sm font-medium mt-3">— Lorenzo Miller, Founder</p>
          </blockquote>

          <div className="space-y-6 text-[#1B2A4A]/70 text-base sm:text-lg leading-relaxed">
            <p>
              He officially founded <a href="https://lorenzosdogtrainingteam.com" target="_blank" rel="noopener noreferrer" className="text-[#C41E2A] font-semibold hover:underline">Lorenzo&apos;s Dog Training Team</a> — a mission unchanged to this day: happy dogs, capable owners, transformed families. The company has brought thousands of families in the Cleveland area and beyond a permanent solution.
            </p>
            <p>
              Now operating on a larger scale — centered around rescue, rehabilitation, education, and impact — Team Trainers Rescue Group represents the culmination of a lifetime of work. Every dog that comes through TTRG receives the same level of care, training, and dedication that Lorenzo gave to those first strays he hid in his childhood bedroom — professional medical attention, behavioral rehabilitation, structured training, and the promise of a loving forever home.
            </p>
            <p className="font-bold text-[#1B2A4A]">
              This isn&apos;t simply about dogs. His mission has always been the same: <span className="text-[#C41E2A]">Rescue. Train. Rehome. Repeat.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 3. TWO CTAs ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* CTA 1 — Meet Our Team */}
            <Link href="/ttrg/trainers" className="group block bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#1B2A4A]/5 flex items-center justify-center mb-5 group-hover:bg-[#1B2A4A]/10 transition-colors">
                <Users className="w-6 h-6 text-[#1B2A4A]" />
              </div>
              <h3 className="text-xl font-black text-[#1B2A4A] mb-2">Meet Our Team</h3>
              <p className="text-[#1B2A4A]/50 text-sm leading-relaxed mb-4">See the trainers and specialists behind every rescue story.</p>
              <span className="inline-flex items-center gap-1 text-[#C41E2A] text-sm font-bold group-hover:gap-2 transition-all">
                View Team <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* CTA 2 — Donate */}
            <Link href="/ttrg/donate" className="group block bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#C41E2A]/5 flex items-center justify-center mb-5 group-hover:bg-[#C41E2A]/10 transition-colors">
                <Heart className="w-6 h-6 text-[#C41E2A]" />
              </div>
              <h3 className="text-xl font-black text-[#1B2A4A] mb-2">Donate to Our Rescue Mission</h3>
              <p className="text-[#1B2A4A]/50 text-sm leading-relaxed mb-4">Help us rescue, train, and rehome the next dog waiting for their second chance.</p>
              <span className="inline-flex items-center gap-1 text-[#C41E2A] text-sm font-bold group-hover:gap-2 transition-all">
                Donate Now <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
