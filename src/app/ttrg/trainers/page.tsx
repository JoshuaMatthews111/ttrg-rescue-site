"use client";

import Link from "next/link";
import { Heart, Award, Shield, CheckCircle2, Sparkles, Target, BookOpen, ChevronRight, MapPin, Calendar } from "lucide-react";

const leadTrainers = [
  {
    name: "Lorenzo Miller",
    role: "Lead Trainer &\nRehabilitation Specialist",
    exp: "40+",
    cert: "Lead Rehabilitation Specialist",
    bio: "Lorenzo leads our rehab program with over 40 years of experience in behavior modification, trust-building, and positive reinforcement.",
    photo: "/ttrg/trainers/lorenzo-miller-candid.jpg",
  },
  {
    name: "Jasmine Bland",
    role: "Behavior & Enrichment\nTrainer",
    exp: "8+",
    cert: "CPDT-KA Certified",
    bio: "Jasmine specializes in positive reinforcement and enrichment training that helps dogs gain confidence and joy.",
    photo: "/ttrg/trainers/jasmine-bland-candid.jpg",
  },
  {
    name: "Daniel Bainbridge",
    role: "Canine Specialist\n& Trainer",
    exp: "10+",
    cert: "CPDT-KA Certified",
    bio: "Daniel focuses on advanced obedience and behavior support for dogs with complex needs.",
    photo: "/ttrg/trainers/daniel-bainbridge-rd-candid.jpg",
  },
  {
    name: "Bailey Brown",
    role: "Puppy Trainer\n& Socialization Expert",
    exp: "6+",
    cert: "CPDT-KA Certified",
    bio: "Bailey helps young dogs build confidence and strong foundations for a lifetime of success.",
    photo: "/ttrg/trainers/bailey-brown-candid.jpg",
  },
];

const philosophy = [
  { icon: Heart, title: "Compassion First", desc: "We lead with empathy, patience, and respect for every dog." },
  { icon: Sparkles, title: "Positive Reinforcement", desc: "Reward-based methods build trust and lasting behavior change." },
  { icon: Shield, title: "Safety & Trust", desc: "We create safe spaces where dogs can heal and learn." },
  { icon: Target, title: "Personalized Plans", desc: "Every dog gets a tailored plan to meet their unique needs and goals." },
  { icon: BookOpen, title: "Lifelong Impact", desc: "We equip families with tools for long-term success together." },
];

const teamBullets = [
  "Experienced professionals with proven results",
  "Ongoing education to stay at the forefront of best practices",
  "Committed to ethical, force-free training methods",
  "Passionate advocates for every dog in our care",
];

export default function TrainersPage() {
  return (
    <div className="bg-white">
      {/* ═══ HERO ═══ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/ttrg/trainers/clark-patton-candid.jpg" alt="Trainers" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B2A4A] leading-tight mb-2">
            Meet Our<br />Trainers <Heart className="inline w-8 h-8 text-[#C41E2A] fill-[#C41E2A]/20" />
          </h1>
          <p className="text-[#1B2A4A]/60 text-base sm:text-lg leading-relaxed max-w-lg mt-4 mb-8">
            Our team of experienced, compassionate trainers is the heart of every rescue, rehab, and rehome story. We combine expertise with empathy to help dogs heal, learn, and thrive.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#philosophy" className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105">
              OUR TRAINING APPROACH
            </Link>
            <Link href="/ttrg/journeys" className="inline-flex items-center gap-2 border-2 border-[#1B2A4A] text-[#1B2A4A] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#1B2A4A] hover:text-white transition-all">
              <Heart className="w-4 h-4" /> SEE OUR IMPACT
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ OUR LEAD TRAINERS ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PawIcon />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">OUR LEAD TRAINERS</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadTrainers.map((trainer) => (
              <div key={trainer.name} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group">
                <div className="h-64 overflow-hidden">
                  <img src={trainer.photo} alt={trainer.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1B2A4A] text-lg">{trainer.name}</h3>
                  <p className="text-[#C41E2A] text-xs font-semibold whitespace-pre-line leading-tight mt-0.5">{trainer.role}</p>

                  <div className="flex items-center gap-4 mt-3 mb-3 text-[11px] text-[#1B2A4A]/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {trainer.exp} years experience
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#1B2A4A]/50 mb-3">
                    <Award className="w-3 h-3 text-[#C41E2A]" /> {trainer.cert}
                  </div>

                  <p className="text-sm text-[#1B2A4A]/60 leading-relaxed">{trainer.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRAINING PHILOSOPHY ═══ */}
      <section id="philosophy" className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] uppercase tracking-wider">Our Training Philosophy &amp; Approach</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {philosophy.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <item.icon className="w-6 h-6 text-[#C41E2A]" />
                </div>
                <p className="font-bold text-[#1B2A4A] text-sm">{item.title}</p>
                <p className="text-[11px] text-[#1B2A4A]/40 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY OUR TEAM MATTERS ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Photo */}
            <div className="rounded-2xl overflow-hidden h-[450px]">
              <img src="/ttrg/trainers/emilio-marotta-candid-2022.jpg" alt="Team" className="w-full h-full object-cover object-top" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl font-bold text-[#1B2A4A] uppercase tracking-wider mb-4">Why Our Team Matters</h2>
              <p className="text-[#1B2A4A]/60 text-base leading-relaxed mb-6">
                Behind every transformed life is a trainer who cared enough to show up. Our team brings expertise, heart, and countless hours of dedication to help dogs overcome their past and step into a brighter future.
              </p>
              <ul className="space-y-3 mb-8">
                {teamBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-[#1B2A4A]/70">
                    <CheckCircle2 className="w-4 h-4 text-[#C41E2A] mt-0.5 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Quote card */}
              <div className="bg-[#FFF0F0] rounded-xl p-5 border border-[#C41E2A]/10">
                <Heart className="w-6 h-6 text-[#C41E2A] fill-[#C41E2A]/20 mb-2" />
                <p className="text-[#1B2A4A] font-bold text-sm italic">
                  We don&apos;t just train dogs. We build second chances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ + VISIT CTA ═══ */}
      <section className="py-16 bg-[#FAFAF8] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#C41E2A]" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2A4A]">Have Questions About Our Training Programs?</h3>
              </div>
              <p className="text-sm text-[#1B2A4A]/50 mb-6">
                We&apos;re here to help! Find answers to common questions or reach out to our team.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-[#C41E2A] hover:bg-[#A01825] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1">
                  VIEW FAQS <ChevronRight className="w-3 h-3" />
                </button>
                <Link href="/ttrg/contact" className="border border-slate-200 text-[#1B2A4A] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1">
                  CONTACT US <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-100">
              <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Visit Us In Person</h3>
              <p className="text-sm text-[#1B2A4A]/50 mb-4">
                Come meet our team and see our training in action. Tours by appointment.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#1B2A4A]/60 mb-6">
                <MapPin className="w-4 h-4 text-[#C41E2A]" />
                4805 Orchard Rd, Cleveland, OH 44128
              </div>
              <Link href="/ttrg" className="text-[#C41E2A] text-xs font-bold hover:underline flex items-center gap-1">
                SCHEDULE A VISIT <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PawIcon() {
  return (
    <svg className="w-5 h-5 text-[#C41E2A]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 18.5c-2.5 0-5-1.5-5-4 0-1.5 1-3 2.5-4s3-.5 2.5 1c-.5 1.5.5 2.5 0 3.5S14.5 18.5 12 18.5zM7 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM10 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM14 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM17 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  );
}
