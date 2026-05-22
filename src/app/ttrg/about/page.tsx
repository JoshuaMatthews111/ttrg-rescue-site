"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ═══ HERO ═══ */}
      <section className="relative h-[60vh] min-h-[420px] sm:min-h-[480px] overflow-hidden">
        <img
          src="/ttrg/about/80318673_3358135937591078_8666674546499125248_n.jpg"
          alt="Team Trainers Rescue Group team photo"
          className="w-full h-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#1B2A4A]/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              About Team Trainers Rescue Group
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
              A mission built on training, rescue support, community impact, and second chances for dogs and families.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FOUNDER / LEADERSHIP ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/ttrg/about/18082.jpeg"
                alt="Trained dogs sitting together - TTRG"
                className="w-full h-72 sm:h-80 md:h-[420px] object-cover object-[center_70%]"
              />
            </div>
            <div>
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Our Story</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-2 mb-4">
                Founded Through a Vision to Help Dogs and People
              </h2>
              <p className="text-[#1B2A4A]/60 text-sm leading-relaxed">
                Team Trainers Rescue Group was created to extend the mission of professional dog training into the lives of families, shelters, and dogs who need support. Connected to the leadership and training experience of Lorenzo&apos;s Dog Training Team, TTRG exists to make help more accessible for people with limited resources while giving more dogs a chance to be trained, restored, and placed into safer environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRAINING CREDIBILITY ═══ */}
      <section className="py-16 sm:py-20 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Our Approach</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-2 mb-4">
                Training Is at the Center of the Mission
              </h2>
              <p className="text-[#1B2A4A]/60 text-sm leading-relaxed">
                TTRG believes lasting change begins with proper training. Through education, hands-on instruction, and practical support, the organization helps people better understand dog behavior, responsibility, structure, and rehabilitation.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/ttrg/about/DSC08379.jpg"
                alt="Lorenzo working with a trained dog — trust and command"
                className="w-full h-72 sm:h-80 md:h-[420px] object-cover object-[center_30%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY IMPACT ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/ttrg/about/86385484_3542372492500754_1275238982036226048_n.jpg"
                alt="Community impact - dog affection"
                className="w-full h-64 sm:h-80 md:h-96 object-cover object-top"
              />
            </div>
            <div>
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Giving Back</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-2 mb-4">
                Community Impact in Action
              </h2>
              <p className="text-[#1B2A4A]/60 text-sm leading-relaxed">
                The work of Team Trainers Rescue Group reaches beyond training alone. Through partnerships, support, and community giving, TTRG helps strengthen the relationship between dogs, families, shelters, and the people working to protect them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM / CULTURE ═══ */}
      <section className="py-16 sm:py-20 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Our Team</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-2 mb-4">
                A Team Committed to Better Outcomes
              </h2>
              <p className="text-[#1B2A4A]/60 text-sm leading-relaxed">
                Behind every dog&apos;s progress is a team committed to patience, structure, compassion, and results. TTRG works to support dogs and families with practical guidance, responsible training, and a mission-driven approach to rescue and rehabilitation.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/ttrg/about/IMG_1348.jpg"
                alt="TTRG training team"
                className="w-full h-64 sm:h-80 md:h-96 object-cover object-[center_30%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OPTIONAL ACHIEVEMENT ═══ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/ttrg/about/69050767_3013354085402600_8305477902963572736_n.jpg"
              alt="TTRG conference and certification"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══ EMOTIONAL CLOSING ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/ttrg/about/DSC08379.jpg"
                alt="Lorenzo with a dog - every dog deserves a chance"
                className="w-full h-64 sm:h-80 md:h-96 object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A] mb-4">
                Every Dog Deserves a Chance
              </h2>
              <p className="text-[#1B2A4A]/60 text-sm leading-relaxed mb-8">
                Some dogs need training. Some need rescue. Some need patience, structure, and a safe path forward. TTRG exists to help create that path.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/ttrg/sponsor" className="flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white py-3 rounded-xl text-xs font-bold transition-colors">
                  <Heart className="w-3.5 h-3.5 fill-white" /> Sponsor a Dog
                </Link>
                <Link href="/ttrg/submit" className="flex items-center justify-center gap-2 border border-slate-200 text-[#1B2A4A] py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                  Recommend a Dog
                </Link>
                <Link href="/ttrg/foster" className="flex items-center justify-center gap-2 border border-slate-200 text-[#1B2A4A] py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                  Volunteer
                </Link>
                <Link href="/ttrg/contact" className="flex items-center justify-center gap-2 border border-slate-200 text-[#1B2A4A] py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                  Contact TTRG <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
