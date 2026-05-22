"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Heart, PawPrint, Users, ArrowRight, Play, X,
  Home, Stethoscope, GraduationCap, Shield,
  AlertTriangle, Clock, CheckCircle2, Repeat, ShieldCheck,
  HandHeart, Building2, ChevronRight, Quote, Share2,
  Camera, Star, TrendingUp, Sparkles,
} from "lucide-react";
import { dogs as dogData } from "@/lib/dogs";
import { getPublishedDogs } from "@/lib/admin-store";

/* ─── DATA ─── */
const stats = [
  { icon: Shield, value: 2300, suffix: "+", label: "Dogs Rescued", desc: "From high-risk situations" },
  { icon: Heart, value: 1850, suffix: "+", label: "Dogs Rehabilitated", desc: "Healing with care" },
  { icon: Home, value: 1600, suffix: "+", label: "Dogs Rehomed", desc: "Forever families" },
  { icon: Users, value: 2000, suffix: "+", label: "Supporters", desc: "Making it possible" },
];

const missionUpdates = [
  { type: "rescue", text: "New dog recommended for review" },
  { type: "foster", text: "A foster application was submitted" },
  { type: "training", text: "A dog moved into training" },
  { type: "story", text: "A new success story was published" },
  { type: "donation", text: "A donor supported vet care" },
  { type: "urgent", text: "Urgent case added — Houston, TX" },
  { type: "adopt", text: "K9 Bella matched with a forever home" },
];

const testimonialVideos = [
  { id: 1, src: "/ttrg/videos/britta-testimonial.mp4", title: "From Fear to Family", quote: "Luna's journey from heartbreak to thriving.", category: "Rescue Story" },
  { id: 2, src: "/ttrg/videos/testimonial-2.mp4", title: "Second Chances Work", quote: "Max went from neglected to thriving.", category: "Training Story" },
  { id: 3, src: "/ttrg/videos/trefz-family.mp4", title: "A Bond That Heals", quote: "How Rex helped a family heal too.", category: "Client Testimonial" },
];

const journey = [
  { num: 1, label: "Rescue", icon: ShieldCheck, desc: "We save dogs from high-risk situations and transport them to safety.", detail: "Our rescue network spans shelters, owner surrenders, and emergency situations. Every dog is evaluated, stabilized, and moved to safety within 24–72 hours.", cta: "Recommend a Dog", ctaHref: "/ttrg/submit", stat: "2,300+ dogs rescued" },
  { num: 2, label: "Rehabilitate", icon: Stethoscope, desc: "Medical care, healing, and behavior work to restore each dog.", detail: "Full vet exams, vaccinations, spay/neuter, dental work, and behavioral assessment. Dogs receive one-on-one rehabilitation with our certified trainers.", cta: "Fund Vet Care", ctaHref: "/ttrg/donate", stat: "Avg 45 days rehab" },
  { num: 3, label: "Foster", icon: Home, desc: "Foster families provide stability and a calm home environment.", detail: "Foster homes give dogs a chance to decompress, socialize, and learn house manners in a real home. We provide supplies, vet care, and 24/7 support.", cta: "Become a Foster", ctaHref: "/ttrg/foster", stat: "200+ foster families" },
  { num: 4, label: "Adopt", icon: HandHeart, desc: "We match every dog with a loving, permanent forever family.", detail: "Our matching process considers lifestyle, experience, and temperament. Every adoption includes training guidance and lifetime support.", cta: "View Adoptable Dogs", ctaHref: "/ttrg/sponsor", stat: "1,600+ forever homes" },
  { num: 5, label: "Repeat", icon: Repeat, desc: "Every dog adopted means we can save the next one. The mission continues.", detail: "Each successful placement frees a spot — and every donor, foster, and volunteer makes the next rescue possible. The cycle never stops.", cta: "Donate Now", ctaHref: "/ttrg/donate", stat: "Mission ongoing" },
];

const urgentLabels: Record<string, string> = { rescue: "Emergency Rescue", rehabilitate: "Needs Medical Care", train: "In Training", recover: "Recovering", rehome: "Ready for Adoption", foster: "In Foster", adopt: "Ready to Adopt" };
const daysInRescue: Record<string, number> = { bailey: 47, tucker: 23, daisy: 31, shadow: 62, prince: 12, luna: 38 };
const urgencyNeeds: Record<string, { label: string; cta: string; href: string }> = {
  rescue: { label: "Urgent Foster Needed", cta: "Apply to Foster", href: "/ttrg/foster" },
  rehabilitate: { label: "Medical Support Needed", cta: "Support Medical Care", href: "/ttrg/donate" },
  train: { label: "Sponsor This Stage", cta: "Sponsor Training", href: "/ttrg/donate" },
  recover: { label: "Needs Placement Soon", cta: "Sponsor This Stage", href: "/ttrg/donate" },
  rehome: { label: "Ready for Adoption", cta: "Apply to Adopt", href: "/ttrg/adopt" },
  foster: { label: "In Foster Care", cta: "Sponsor This Stage", href: "/ttrg/donate" },
  adopt: { label: "Ready for Adoption", cta: "Apply to Adopt", href: "/ttrg/adopt" },
};

const beforeAfter = [
  {
    name: "Bailey",
    beforeImg: "https://images.unsplash.com/photo-1596854273338-cbf078ec7071?w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80",
    caption: "From terrified and underweight to tail-wagging and trusting.",
    outcome: "In Rehabilitation",
    id: "bailey",
  },
  {
    name: "Tucker",
    beforeImg: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    caption: "From heartbroken and shut down to playful and confident.",
    outcome: "In Training",
    id: "tucker",
  },
  {
    name: "Shadow",
    beforeImg: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80",
    caption: "From neglected stray to loyal companion ready for a home.",
    outcome: "Ready to Adopt",
    id: "shadow",
  },
];

const missionMilestones = [
  { label: "Rescued This Month", value: "12", icon: Shield },
  { label: "Adopted This Month", value: "8", icon: HandHeart },
  { label: "In Foster Care", value: "23", icon: Home },
  { label: "Urgent Cases", value: "4", icon: AlertTriangle },
];

const getInvolved = [
  { icon: HandHeart, label: "Adopt a Dog", desc: "Open your home to a rescue dog permanently.", href: "/ttrg/adopt", color: "from-red-500 to-red-700" },
  { icon: Home, label: "Foster a Dog", desc: "Provide a temporary home while we find them a family.", href: "/ttrg/foster", color: "from-orange-500 to-red-600" },
  { icon: Heart, label: "Sponsor a Dog", desc: "Fund a dog's care, training, and rehabilitation.", href: "/ttrg/sponsor", color: "from-pink-500 to-rose-600" },
  { icon: Users, label: "Volunteer", desc: "Share your time, skills, and heart with our mission.", href: "/ttrg/volunteer", color: "from-blue-500 to-indigo-600" },
  { icon: PawPrint, label: "Recommend a Dog", desc: "Know a dog that needs rescue? Send us their story.", href: "/ttrg/submit", color: "from-emerald-500 to-teal-600" },
  { icon: Building2, label: "Partner With TTRG", desc: "Corporate sponsorship and rescue partnership.", href: "/ttrg/get-involved#partner", color: "from-violet-500 to-purple-700" },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        let current = 0;
        const inc = target / steps;
        const t = setInterval(() => {
          current += inc;
          if (current >= target) { setCount(target); clearInterval(t); } else { setCount(Math.floor(current)); }
        }, stepTime);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── PAGE ─── */
export default function TTRGHome() {
  const [videoModal, setVideoModal] = useState<null | typeof testimonialVideos[0]>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [dogs, setDogs] = useState(dogData);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [boVideoOpen, setBoVideoOpen] = useState(false);

  useEffect(() => {
    const published = getPublishedDogs();
    if (published.length > 0) setDogs(published as unknown as typeof dogData);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % missionUpdates.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ttrg-popup-closed")) return;
    const timer = setTimeout(() => { if (!popupDismissed) setPopupOpen(true); }, 8000);
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct > 0.4 && !popupDismissed) { setPopupOpen(true); window.removeEventListener("scroll", onScroll); }
    };
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [popupDismissed]);

  const closePopup = () => { setPopupOpen(false); setPopupDismissed(true); sessionStorage.setItem("ttrg-popup-closed", "1"); };

  const heroSec = useInView();
  const journeySec = useInView();
  const dogsSec = useInView();
  const founderSec = useInView();

  return (
    <div className="bg-white">

      {/* ═══════ 1. HERO — VIDEO BACKGROUND ═══════ */}
      <section ref={heroSec.ref} className="relative min-h-[92vh] flex items-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          poster="/ttrg/hero-trainer.png"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/ttrg/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${heroSec.visible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="max-w-3xl py-12 sm:py-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10 backdrop-blur-md flex-shrink-0">
                <img src="/ttrg/ttrg-logo.jpeg" alt="TTRG" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white/60 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase">501(c)(3) Nonprofit Rescue Mission</p>
                <p className="text-white font-black text-xl sm:text-2xl tracking-tight">TEAM TRAINERS RESCUE GROUP</p>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[0.95] mb-5 tracking-tight">
              Rescue.<br />
              Rehabilitate.<br />
              <span className="text-[#C41E2A]">Rehome.</span>{" "}
              <span className="text-white/40 italic font-light text-3xl sm:text-5xl">Repeat.</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mb-9">
              Every dog deserves a second chance. Join our mission to rescue, heal, and find forever homes for dogs in need.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-7 py-4 rounded-full text-sm font-bold transition-all shadow-2xl shadow-red-900/40">
                <Heart className="w-4 h-4 fill-white" /> DONATE NOW
              </Link>
              <Link href="/ttrg/sponsor" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-4 rounded-full text-sm font-bold hover:bg-white/10 backdrop-blur-sm transition-all">
                <PawPrint className="w-4 h-4" /> MEET OUR DOGS
              </Link>
              <Link href="/ttrg/get-involved" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 px-6 py-4 rounded-full text-sm font-semibold hover:bg-white/5 transition-all">
                GET INVOLVED
              </Link>
            </div>
          </div>
        </div>

        {/* Mission Updates Ticker */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#0a1628]/80 backdrop-blur-md border-t border-white/10 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 overflow-hidden">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#C41E2A] animate-pulse" />
              <span className="text-[#C41E2A] text-[11px] font-bold tracking-wider uppercase">Mission Updates</span>
            </div>
            <div className="flex-1 overflow-hidden h-5">
              <div key={tickerIdx} className="animate-fade-up text-white/80 text-xs sm:text-sm">
                {missionUpdates[tickerIdx].text}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. IMPACT STATS ═══════ */}
      <section className="py-14 bg-[#FAFAF8] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-5 sm:p-7 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[#C41E2A]" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-[#1B2A4A] mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#1B2A4A]">{stat.label}</p>
                <p className="text-[10px] sm:text-[11px] text-[#1B2A4A]/40 mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3. RESCUE JOURNEY PROCESS — INTERACTIVE ═══════ */}
      <section ref={journeySec.ref} className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 ${journeySec.visible ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-4">
              <PawPrint className="w-3.5 h-3.5 text-[#C41E2A]" />
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">The Rescue Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] tracking-tight">Every Dog Follows This Path</h2>
            <p className="text-base text-[#1B2A4A]/50 mt-3 max-w-2xl mx-auto">Click any stage to learn more. A proven framework that moves every dog from rescue to a permanent loving home.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#C41E2A]/10 via-[#C41E2A]/40 to-[#C41E2A]/10" />
            <div className="flex flex-col md:flex-row items-stretch md:items-start justify-between gap-6 md:gap-2">
              {journey.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <button
                    key={step.label}
                    onClick={() => setActiveStep(isActive ? null : i)}
                    className={`flex items-center gap-4 md:flex-col md:gap-3 md:text-center flex-1 cursor-pointer group ${journeySec.visible ? "animate-fade-up" : "opacity-0"}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isActive ? "bg-[#C41E2A] border-2 border-[#C41E2A] scale-110 shadow-xl shadow-red-500/20" : "bg-white border-2 border-[#C41E2A]/30 group-hover:shadow-xl group-hover:scale-105 group-hover:border-[#C41E2A]/60"}`}>
                        <step.icon className={`w-10 h-10 transition-colors ${isActive ? "text-white" : "text-[#C41E2A]"}`} strokeWidth={1.8} />
                      </div>
                      <span className={`absolute -top-1 -right-1 w-8 h-8 rounded-full text-xs font-black flex items-center justify-center shadow-md transition-all ${isActive ? "bg-[#1B2A4A] text-white" : "bg-[#C41E2A] text-white"}`}>
                        {step.num}
                      </span>
                    </div>
                    <div className="md:mt-2 text-left md:text-center">
                      <p className={`font-black text-lg transition-colors ${isActive ? "text-[#C41E2A]" : "text-[#1B2A4A]"}`}>{step.label}</p>
                      <p className="text-xs text-[#1B2A4A]/55 mt-1.5 max-w-[200px] leading-relaxed">{step.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {activeStep !== null && (
            <div className="mt-10 animate-fade-up">
              <div className="relative bg-gradient-to-br from-[#1B2A4A] to-[#0a1628] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-[#C41E2A] flex items-center justify-center shadow-lg">
                    {(() => { const Icon = journey[activeStep].icon; return <Icon className="w-10 h-10 text-white" />; })()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Step {journey[activeStep].num}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-white/40 text-xs">{journey[activeStep].stat}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{journey[activeStep].label}</h3>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">{journey[activeStep].detail}</p>
                  <Link
                    href={journey[activeStep].ctaHref}
                    className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-900/30"
                  >
                    {journey[activeStep].cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <button onClick={() => setActiveStep(null)} className="md:flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-14">
            <p className="text-xs text-[#1B2A4A]/40 uppercase tracking-wider mb-3">Training is a status, not a destination — every dog graduates to Foster &amp; Adoption</p>
            <Link href="/ttrg/journeys" className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-8 py-4 rounded-full text-sm font-bold transition-all">
              <PawPrint className="w-4 h-4" /> SEE FULL DOG JOURNEYS
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 4. FEATURED DOGS ═══════ */}
      <section id="dogs-in-need" ref={dogsSec.ref} className="py-20 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${dogsSec.visible ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-4">
              <Heart className="w-3.5 h-3.5 text-[#C41E2A]" />
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Dogs In Our Care</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B2A4A]">Dogs Who Need Your Support</h2>
            <p className="text-sm text-[#1B2A4A]/50 mt-2 max-w-xl mx-auto">Sponsor, foster, adopt, or share. Every action moves a dog closer to a permanent home.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.slice(0, 6).map((dog, idx) => {
              const days = daysInRescue[dog.id] ?? 0;
              return (
                <div key={dog.id} className={`bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group ${dogsSec.visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: `${idx * 0.08}s` }}>
                  <Link href={`/ttrg/dogs/${dog.id}`} className="block">
                    <div className="relative h-52 overflow-hidden">
                      <img src={dog.image} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {dog.urgent && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> URGENT
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-semibold">
                        {urgentLabels[dog.stage]}
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-[10px]">
                        <Clock className="w-3 h-3" /> {days} days in rescue
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <p className="text-white font-bold text-lg">{dog.name}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <p className="text-[11px] text-[#1B2A4A]/40 mb-2">{dog.age} · {dog.breed} · {dog.gender}</p>
                    <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-4 line-clamp-2">{dog.story}</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      <Link href={`/ttrg/dogs/${dog.id}`} className="text-center px-2 py-2.5 rounded-lg bg-[#C41E2A] text-white text-[10px] font-bold hover:bg-[#A01825] transition-colors">
                        SPONSOR
                      </Link>
                      <Link href="/ttrg/foster" className="text-center px-2 py-2.5 rounded-lg border border-slate-200 text-[#1B2A4A] text-[10px] font-bold hover:bg-slate-50 transition-colors">
                        FOSTER
                      </Link>
                      <Link href="/ttrg/adopt" className="text-center px-2 py-2.5 rounded-lg border border-slate-200 text-[#1B2A4A] text-[10px] font-bold hover:bg-slate-50 transition-colors">
                        ADOPT
                      </Link>
                      <button onClick={(e) => { e.preventDefault(); if (navigator.share) navigator.share({ title: `Help ${dog.name}`, url: `/ttrg/dogs/${dog.id}` }); else navigator.clipboard.writeText(window.location.origin + `/ttrg/dogs/${dog.id}`); }} className="text-center px-2 py-2.5 rounded-lg border border-slate-200 text-[#1B2A4A] text-[10px] font-bold hover:bg-slate-50 transition-colors">
                        SHARE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/ttrg/sponsor" className="inline-flex items-center gap-2 border-2 border-[#C41E2A] text-[#C41E2A] px-7 py-3.5 rounded-full text-sm font-bold hover:bg-[#C41E2A] hover:text-white transition-all">
              VIEW ALL DOGS <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 5. BEFORE & AFTER ═══════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-4">
              <Camera className="w-3.5 h-3.5 text-[#C41E2A]" />
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Real Transformation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">Before &amp; After: Real Transformation Stories</h2>
            <p className="text-sm text-[#1B2A4A]/50 mt-2 max-w-xl mx-auto">Every rescue has a journey. See how care, rehabilitation, training, and the right environment can change a dog&apos;s life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beforeAfter.map((dog) => (
              <div key={dog.name} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="grid grid-cols-2 h-48 sm:h-56">
                  <div className="relative overflow-hidden">
                    <img src={dog.beforeImg} alt={`${dog.name} before`} className="w-full h-full object-cover brightness-75" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">BEFORE</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img src={dog.afterImg} alt={`${dog.name} after`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute bottom-2 left-2 bg-[#C41E2A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">AFTER</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#1B2A4A] text-lg">{dog.name}</h3>
                    <span className="text-[10px] font-bold text-[#C41E2A] bg-[#C41E2A]/10 px-2 py-0.5 rounded-full">{dog.outcome}</span>
                  </div>
                  <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-3">{dog.caption}</p>
                  <Link href={`/ttrg/dogs/${dog.id}`} className="inline-flex items-center gap-1.5 text-[#C41E2A] text-sm font-bold hover:gap-2.5 transition-all">
                    View Journey <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 6. SUCCESS STORIES + BO & BRADY ═══════ */}
      <section className="py-20 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#1B2A4A]/10 rounded-full px-4 py-1.5 mb-4">
              <Play className="w-3.5 h-3.5 text-[#1B2A4A]" />
              <span className="text-[#1B2A4A] text-xs font-bold uppercase tracking-wider">Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">Real Dogs. Real Transformation.</h2>
            <p className="text-sm text-[#1B2A4A]/50 mt-2 max-w-xl mx-auto">Watch the journeys of dogs we&apos;ve rescued, healed, and placed in forever homes.</p>
          </div>

          {/* Bo & Brady Featured Video */}
          <button onClick={() => setBoVideoOpen(true)} className="group w-full text-left mb-10 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 bg-[#1B2A4A]">
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-video md:w-1/2 overflow-hidden">
                <video muted loop playsInline preload="metadata" className="w-full h-full object-cover brightness-75 group-hover:brightness-50 group-hover:scale-105 transition-all duration-700" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}>
                  <source src="/ttrg/video/bo-brady.mov" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-[#C41E2A]/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
                <span className="absolute top-4 left-4 bg-[#C41E2A] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" /> Featured Rescue</span>
              </div>
              <div className="md:w-1/2 p-7 sm:p-10 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">Watch the Amazing Rescue Journey of Bo &amp; Brady</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">From fear and uncertainty to trust, healing, and transformation. A powerful story of what&apos;s possible when people and dogs find each other.</p>
                <div className="flex gap-3">
                  <span className="inline-flex items-center gap-2 bg-[#C41E2A] text-white px-5 py-2.5 rounded-full text-sm font-bold">
                    <Play className="w-4 h-4 fill-white" /> Watch Their Story
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); if (navigator.share) navigator.share({ title: "Bo & Brady's Rescue Story", url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }} className="inline-flex items-center gap-2 border border-white/20 text-white/80 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialVideos.map((vid) => (
              <button key={vid.id} onClick={() => setVideoModal(vid)} className="group text-left rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <video muted loop playsInline preload="metadata" className="w-full h-full object-cover brightness-75 group-hover:brightness-50 group-hover:scale-105 transition-all duration-700" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}>
                    <source src={vid.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#C41E2A] group-hover:scale-110 transition-all shadow-lg">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block bg-[#C41E2A]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2">{vid.category}</span>
                    <p className="text-white font-bold text-sm">{vid.title}</p>
                    <p className="text-white/60 text-xs italic mt-1">&ldquo;{vid.quote}&rdquo;</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/ttrg/stories" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B2A4A] hover:text-[#C41E2A] transition-colors">
              VIEW ALL SUCCESS STORIES <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 7. FOUNDER PREVIEW ═══════ */}
      <section ref={founderSec.ref} className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={`relative ${founderSec.visible ? "animate-fade-up" : "opacity-0"}`}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img src="/ttrg/founder-lorenzo.jpg" alt="Lorenzo Miller - Founder" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-1">Founder &amp; Lead Trainer</p>
                  <p className="text-white text-3xl font-black">Lorenzo Miller</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#C41E2A] rounded-3xl flex flex-col items-center justify-center shadow-2xl">
                <p className="text-white text-4xl font-black">40+</p>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Years</p>
              </div>
            </div>

            <div className={`${founderSec.visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
              <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-5">
                <Quote className="w-3.5 h-3.5 text-[#C41E2A]" />
                <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Meet the Founder</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#1B2A4A] tracking-tight mb-6 leading-[1.05]">
                A lifetime mission<br /><span className="text-[#C41E2A]">that started at age six.</span>
              </h2>
              <div className="space-y-4 text-[#1B2A4A]/70 text-base leading-relaxed">
                <p>
                  Lorenzo Miller&apos;s journey with dogs began before most people considered animal welfare a career. At just six years old, he could not ignore the hungry, abandoned, and forgotten dogs in his neighborhood.
                </p>
                <p>
                  After 40+ years of training, rescuing, and transforming dogs, Lorenzo founded <strong>Team Trainers Rescue Group</strong> — a nonprofit dedicated to rescue, rehabilitation, and rehoming. <strong>Rescue. Rehabilitate. Rehome. Repeat.</strong>
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/ttrg/founder" className="inline-flex items-center justify-center gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-7 py-3.5 rounded-full text-sm font-bold transition-all">
                  Read Lorenzo&apos;s Full Story <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/ttrg/trainers" className="inline-flex items-center justify-center gap-2 border-2 border-[#1B2A4A]/20 text-[#1B2A4A] px-7 py-3.5 rounded-full text-sm font-bold hover:bg-[#1B2A4A]/5 transition-all">
                  Meet the Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 8. GET INVOLVED ═══════ */}
      <section className="py-20 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-4">
              <PawPrint className="w-3.5 h-3.5 text-[#C41E2A]" />
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Choose Your Path</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">Get Involved</h2>
            <p className="text-sm text-[#1B2A4A]/50 mt-2">Every contribution saves lives.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {getInvolved.map((item) => (
              <Link key={item.label} href={item.href} className="group bg-white rounded-3xl border border-slate-100 p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-black text-[#1B2A4A] text-xl mb-2">{item.label}</h3>
                <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-[#C41E2A] text-sm font-bold group-hover:gap-2.5 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 9. MISSION MILESTONES ═══════ */}
      <section className="py-8 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {missionMilestones.map((m) => (
              <div key={m.label} className="text-center py-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <m.icon className="w-4 h-4 text-[#C41E2A]" />
                  <span className="text-2xl font-black text-[#1B2A4A]">{m.value}</span>
                </div>
                <p className="text-[10px] text-[#1B2A4A]/50 font-semibold uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 10. FINAL CTA ═══════ */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-[#0a1628]">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <Heart className="w-14 h-14 text-[#C41E2A] fill-[#C41E2A]/30 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            Be the Reason a Dog Gets a Second Chance
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Sponsor a dog, foster a life, recommend a rescue, or partner with our mission. Every action saves a life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-2xl shadow-red-900/40">
              <Heart className="w-4 h-4 fill-white" /> DONATE NOW
            </Link>
            <button onClick={() => scrollToId("dogs-in-need")} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
              <PawPrint className="w-4 h-4" /> SPONSOR A DOG
            </button>
          </div>
        </div>
      </section>

      {/* ═══ VIDEO LIGHTBOX ═══ */}
      {videoModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoModal(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoModal(null)} className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video controls autoPlay className="w-full aspect-video">
                <source src={videoModal.src} type="video/mp4" />
              </video>
              <div className="p-5 bg-[#1B2A4A]">
                <p className="text-white font-bold text-lg">{videoModal.title}</p>
                <p className="text-white/50 text-sm mt-1">{videoModal.quote}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BO & BRADY VIDEO LIGHTBOX ═══ */}
      {boVideoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setBoVideoOpen(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setBoVideoOpen(false)} className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video controls autoPlay className="w-full aspect-video">
                <source src="/ttrg/video/bo-brady.mov" type="video/mp4" />
              </video>
              <div className="p-5 bg-[#1B2A4A]">
                <p className="text-white font-bold text-lg">Bo &amp; Brady&apos;s Rescue Journey</p>
                <p className="text-white/50 text-sm mt-1">From fear and uncertainty to trust, healing, and transformation.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EMAIL POPUP ═══ */}
      {popupOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative z-10 max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button onClick={closePopup} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="px-7 pt-8 pb-7">
              <div className="w-16 h-16 rounded-full bg-[#C41E2A] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/20">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              {!popupSubmitted ? (
                <>
                  <h3 className="text-xl font-black text-[#1B2A4A] text-center mb-2">
                    Stay in the Loop
                  </h3>
                  <p className="text-[#1B2A4A]/50 text-sm text-center mb-6 leading-relaxed">
                    Get mission updates, urgent cases, and heartwarming success stories.
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); setPopupSubmitted(true); }} className="space-y-3">
                    <input type="email" required value={popupEmail} onChange={(e) => setPopupEmail(e.target.value)} placeholder="Your email address" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30 focus:border-[#C41E2A]" />
                    <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white h-12 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                      <PawPrint className="w-4 h-4" /> Join the Mission
                    </button>
                  </form>
                  <p className="text-[10px] text-[#1B2A4A]/30 text-center mt-3">No spam. Just rescue.</p>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-[#1B2A4A] mb-2">You&apos;re in the mission.</h3>
                  <p className="text-[#1B2A4A]/50 text-sm mb-6 leading-relaxed">Watch your inbox for rescue updates and ways to help.</p>
                  <button onClick={closePopup} className="w-full bg-[#1B2A4A] text-white py-3 rounded-xl text-sm font-bold transition-colors">CLOSE</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
