"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Heart, PawPrint, Users, ArrowRight, Play, X,
  Home, Stethoscope, Shield,
  AlertTriangle, Clock, CheckCircle2, Repeat, ShieldCheck,
  HandHeart, Building2, ChevronRight, Quote, Share2,
  Star, TrendingUp, Award, MapPin,
  HeartHandshake, FileSearch, Camera, DollarSign, CheckCircle,
} from "lucide-react";
import { dogs as dogData } from "@/lib/dogs";
import { fetchPublishedDogs, fetchTickerItems, subscribeToDogs, type TickerItem } from "@/lib/admin-store";
import DogCard from "@/components/ttrg/DogCard";

/* ─── HERO DATA — single video, rotating headlines ─── */
const heroVideo = "/ttrg/video/lo-walkin-web.mp4";
const heroHeadlines = [
  { words: ["We", "Make", "Training", "Affordable."], accentIdx: 2 },
  { words: ["Rescue.", "Train.", "Rehome.", "Repeat."], accentIdx: 2 },
  { words: ["Every", "Dog", "Deserves", "A", "Happy", "Home."], accentIdx: 4 },
  { words: ["Follow", "Real", "Rescue", "Journeys."], accentIdx: 1 },
  { words: ["Support", "A", "Dog's", "Transformation."], accentIdx: 3 },
];
const heroSubtitles = [
  "For people with limited resources — we provide training, support, and real results.",
  "Every dog deserves a second chance. Join our mission to rescue, heal, and find forever homes for dogs in need.",
  "From shelters to forever families — we provide rescue, medical care, training, and love every step of the way.",
  "Track every dog's transformation from rescue to rehome. Real stories, real impact, real results.",
  "Your donation funds medical care, professional training, and safe shelter — giving every rescue dog the life they deserve.",
];

/* ─── TICKER DATA (generated from real dogs) ─── */
function buildDynamicTicker(dogList: typeof dogData): { text: string }[] {
  const items: { text: string }[] = [];
  const urgentDogs = dogList.filter(d => d.urgent);
  const names = dogList.map(d => d.name).slice(0, 5);

  if (dogList.length > 0) {
    items.push({ text: `${dogList.length} Dogs Currently in Our Program — Each One Needs Your Support!` });
  }
  if (urgentDogs.length > 0) {
    items.push({ text: `URGENT: ${urgentDogs.map(d => d.name).join(", ")} ${urgentDogs.length === 1 ? "needs" : "need"} immediate support!` });
  }
  if (names.length > 0) {
    items.push({ text: `SUPPORT: ${names.join(", ")} — Real dogs that need your help today!` });
  }
  items.push({ text: "THANK YOU: Incredible Donors & Foster Families Making It Possible" });
  items.push({ text: "IMPACT: Every Donation Directly Funds Training, Medical Care & Rescue" });

  return items;
}
const missionUpdates = [
  { text: "Dogs Currently in Our Program — Your Support Saves Lives!" },
  { text: "THANK YOU: Incredible Donors & Foster Families Making It Possible" },
  { text: "IMPACT: Every Donation Directly Funds Training, Medical Care & Rescue" },
];

/* ─── IMPACT STATS ─── */
const impactStats = [
  { label: "Active Trainers", value: 25, suffix: "+", icon: Award },
  { label: "Foster Families", value: 7, suffix: "+", icon: HandHeart },
  { label: "Community Partners", value: 250, suffix: "+", icon: Building2 },
  { label: "Trained & Rehabbed", value: 400, suffix: "+", icon: Stethoscope },
  { label: "Dogs Rescued", value: 400, suffix: "+", icon: ShieldCheck },
  { label: "Dogs Rehomed", value: 200, suffix: "+", icon: Home },
];

// Testimonial videos removed — will be populated via admin media library when added back

const journey = [
  { num: 1, label: "Rescue", icon: ShieldCheck, desc: "We save dogs from high-risk situations and transport them to safety.", detail: "Our rescue network spans shelters, owner surrenders, and emergency situations. Every dog is evaluated, stabilized, and moved to safety within 24–72 hours.", cta: "Recommend a Dog for Rescue", ctaHref: "/ttrg/submit", stat: "2,300+ dogs rescued" },
  { num: 2, label: "Train & Rehabilitate", icon: Stethoscope, desc: "Medical care, training, and behavior work to restore each dog.", detail: "Full vet exams, vaccinations, spay/neuter, dental work, and behavioral assessment. Dogs receive one-on-one training and rehabilitation with our certified trainers.", cta: "Apply to Volunteer", ctaHref: "/ttrg/volunteer", stat: "Avg 45 days rehab" },
  { num: 3, label: "Foster", icon: Home, desc: "Foster families provide stability and a calm home environment.", detail: "Foster homes give dogs a chance to decompress, socialize, and learn house manners in a real home. We provide supplies, vet care, and 24/7 support.", cta: "Apply to Foster", ctaHref: "/ttrg/foster", stat: "200+ foster families" },
  { num: 4, label: "Adopt", icon: HandHeart, desc: "We match every dog with a loving, permanent forever family.", detail: "Our matching process considers lifestyle, experience, and temperament. Every adoption includes training guidance and lifetime support.", cta: "Apply to Adopt", ctaHref: "/ttrg/adopt", stat: "1,600+ forever homes" },
  { num: 5, label: "Repeat", icon: Repeat, desc: "Every dog adopted means we can save the next one. The mission continues.", detail: "Each successful placement frees a spot — and every donor, foster, and volunteer makes the next rescue possible. The cycle never stops.", cta: "Donate to Save the Next Dog", ctaHref: "/ttrg/donate", stat: "Mission ongoing" },
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

const getInvolved = [
  { icon: HandHeart, label: "Adopt a Dog", desc: "Open your home to a rescue dog permanently.", href: "/ttrg/adopt", color: "from-red-500 to-red-700" },
  { icon: Home, label: "Foster a Dog", desc: "Provide a temporary home while we find them a family.", href: "/ttrg/foster", color: "from-orange-500 to-red-600" },
  { icon: Heart, label: "Sponsor a Dog", desc: "Fund a dog's care, training, and rehabilitation.", href: "/ttrg/sponsor", color: "from-pink-500 to-rose-600" },
  { icon: Users, label: "Volunteer", desc: "Share your time, skills, and heart with our mission.", href: "/ttrg/volunteer", color: "from-blue-500 to-indigo-600" },
  { icon: PawPrint, label: "Recommend a Dog", desc: "Know a dog that needs rescue? Send us their story.", href: "/ttrg/submit", color: "from-emerald-500 to-teal-600" },
  { icon: Building2, label: "Partner With TTRG", desc: "Corporate sponsorship and rescue partnership.", href: "/ttrg/get-involved#partner", color: "from-violet-500 to-purple-700" },
];

/* ─── SHARE HELPER ─── */
function shareStory(title: string, text: string) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (typeof navigator !== "undefined" && navigator.share) {
    navigator.share({ title, text, url }).catch(() => {});
  } else if (typeof navigator !== "undefined") {
    navigator.clipboard.writeText(url);
  }
}

function ShareButtons({ title, className = "" }: { title: string; className?: string }) {
  const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const t = encodeURIComponent(title);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2]/20 flex items-center justify-center transition-colors" title="Share on Facebook">
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href={`https://api.whatsapp.com/send?text=${t}%20${url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors" title="Share on WhatsApp">
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button onClick={() => shareStory(title, "Check out this rescue story!")} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" title="Copy Link">
        <Share2 className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}

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

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── PAGE ─── */
export default function TTRGHome() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [dogs, setDogs] = useState(dogData);
  const [boVideoOpen, setBoVideoOpen] = useState(false);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [flipKey, setFlipKey] = useState(0);
  const [tickerColor, setTickerColor] = useState({ from: "#1e6b3a", via: "#28a745", to: "#1e6b3a" });

  useEffect(() => {
    async function loadData() {
      const published = await fetchPublishedDogs();
      if (published.length > 0) setDogs(published as unknown as typeof dogData);
      const items = await fetchTickerItems();
      const active = items.filter((t) => t.active);
      if (active.length > 0) setTickerItems(active);
    }
    loadData();
    const savedColor = localStorage.getItem("ttrg-ticker-color");
    if (savedColor) { try { setTickerColor(JSON.parse(savedColor)); } catch {} }
    const unsub = subscribeToDogs((dogs) => {
      if (dogs.length > 0) setDogs(dogs as unknown as typeof dogData);
    });
    return () => { unsub(); };
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

  /* ─── Hero text rotation (video plays continuously) ─── */
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFading, setHeroFading] = useState(false);

  const advanceHero = useCallback(() => {
    setHeroFading(true);
    setTimeout(() => {
      setHeroIdx((i) => (i + 1) % heroHeadlines.length);
      setFlipKey((k) => k + 1);
      setHeroFading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const t = setInterval(advanceHero, 7000);
    return () => clearInterval(t);
  }, [advanceHero]);

  const heroSec = useInView();
  const journeySec = useInView();
  const familySec = useInView();
  const dogsSec = useInView();
  const founderSec = useInView();
  const statsSec = useInView();

  return (
    <div className="bg-[#FDFCFA]">
      {/* Nav height spacer */}
      <div className="h-14 sm:h-16" />

      {/* ═══════ 0. PERSISTENT SLIDING TICKER ═══════ */}
      <div className="py-2.5 overflow-hidden relative z-30 shadow-md" style={{ background: `linear-gradient(to right, ${tickerColor.from}, ${tickerColor.via}, ${tickerColor.to})` }}>
        <div className="flex animate-marquee whitespace-nowrap" style={{ "--marquee-duration": "35s" } as React.CSSProperties}>
          {[...((tickerItems.length > 0 ? tickerItems : (dogs.length > 0 ? buildDynamicTicker(dogs) : missionUpdates).map((m, i) => ({ id: `d${i}`, text: m.text, active: true, createdAt: "", type: "manual" as const }))).filter(t => t.active)), ...((tickerItems.length > 0 ? tickerItems : (dogs.length > 0 ? buildDynamicTicker(dogs) : missionUpdates).map((m, i) => ({ id: `d${i}`, text: m.text, active: true, createdAt: "", type: "manual" as const }))).filter(t => t.active))].map((item, i) => (
            <span key={`${item.id}-${i}`} className="inline-flex items-center mx-8 sm:mx-12 text-white text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-white/80 mr-3 ticker-glow flex-shrink-0" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ 1. HERO — SINGLE VIDEO + ROTATING TEXT ═══════ */}
      <section ref={heroSec.ref} className="relative min-h-[80vh] sm:min-h-[92vh] flex items-center overflow-hidden">
        {/* Single continuous video — Lo Walkin */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a]/15 via-transparent to-transparent" />

        {/* Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${heroSec.visible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="max-w-3xl py-12 sm:py-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0">
                <img src="/ttrg/ttrg-logo.png" alt="TTRG" className="w-full h-full object-cover scale-110" />
              </div>
              <div>
                <p className="text-white/60 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">501(c)(3) Nonprofit Rescue Mission</p>
                <p className="text-white font-black text-lg sm:text-2xl tracking-tight">TEAM TRAINERS RESCUE GROUP</p>
              </div>
            </div>

            {/* Flipping word headline */}
            <div className={`transition-all duration-700 ${heroFading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`} style={{ perspective: "800px" }}>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[0.95] mb-5 tracking-tight flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
                {heroHeadlines[heroIdx].words.map((word, wi) => (
                  <span key={`${flipKey}-${wi}`} className={`flip-letter ${wi === heroHeadlines[heroIdx].accentIdx ? "text-[#C41E2A]" : ""}`} style={{ animationDelay: `${wi * 0.08}s` }}>
                    {word}
                  </span>
                ))}
              </h1>
              <p className="text-white/70 text-sm sm:text-lg leading-relaxed max-w-xl mb-9">
                {heroSubtitles[heroIdx]}
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-3 mb-8 transition-all duration-700 ${heroFading ? "opacity-0" : "opacity-100"}`}>
              <Link href="/ttrg/donate" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm font-bold transition-all shadow-2xl shadow-red-900/40">
                <Heart className="w-4 h-4 fill-white" /> DONATE NOW
              </Link>
              <Link href="/ttrg/sponsor" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm font-bold hover:bg-white/10 backdrop-blur-sm transition-all">
                MEET OUR DOGS
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="flex gap-2">
              {heroHeadlines.map((_, i) => (
                <button key={i} onClick={() => { setHeroFading(true); setTimeout(() => { setHeroIdx(i); setFlipKey((k) => k + 1); setHeroFading(false); }, 600); }} className={`h-1 rounded-full transition-all duration-500 ${i === heroIdx ? "w-10 bg-[#C41E2A]" : "w-4 bg-white/30 hover:bg-white/50"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════ 2B. IMPACT STATS ═══════ */}
      <section ref={statsSec.ref} className="py-16 sm:py-20 bg-gradient-to-br from-[#eef4ee] via-[#e8f0e4] to-[#f0f5ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#2d5a3d]/10 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-[#2d5a3d]" />
              <span className="text-[#2d5a3d] text-xs font-bold uppercase tracking-wider">Our Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">Making a Measurable Difference</h2>
            <p className="text-[#1B2A4A]/50 text-sm mt-2 max-w-xl mx-auto">Real numbers. Real lives saved. Every statistic represents a dog that found safety, healing, and a home.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {impactStats.map((stat) => {
              const count = useCountUp(stat.value, 2200, statsSec.visible);
              return (
                <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center border border-[#2d5a3d]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5a3d]/10 to-[#4a7c5c]/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-[#2d5a3d]" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-[#1B2A4A]">{count.toLocaleString()}{stat.suffix}</p>
                  <p className="text-xs font-semibold text-[#1B2A4A]/50 mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ 3. RESCUE JOURNEY PROCESS — INTERACTIVE ═══════ */}
      <section ref={journeySec.ref} className="py-20 sm:py-24 bg-white">
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
            <p className="text-xs text-[#1B2A4A]/40 uppercase tracking-wider mb-3">Every dog receives an individualized training and rehabilitation plan. When appropriate and responsible, dogs may progress toward foster care, adoption, or another safe long-term placement.</p>
            <Link href="/ttrg/journeys" className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-8 py-4 rounded-full text-sm font-bold transition-all">
              <PawPrint className="w-4 h-4" /> SEE FULL DOG JOURNEYS
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 3B. FAMILY PRESERVATION JOURNEY ═══════ */}
      <section id="make-training-affordable" ref={familySec.ref} className="py-20 sm:py-24 bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EB] to-[#FFFAF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 ${familySec.visible ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#D97706]/10 rounded-full px-4 py-1.5 mb-4">
              <HeartHandshake className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="text-[#D97706] text-xs font-bold uppercase tracking-wider">The Family Preservation Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] tracking-tight">We Make Training Affordable for People with Limited Resources</h2>
            <p className="text-base text-[#1B2A4A]/50 mt-3 max-w-2xl mx-auto">Not every dog needs to be rescued from a shelter. Some dogs need help before they lose their home. When a family cannot afford the training needed to keep their dog, TTRG helps evaluate the situation, tell the story, raise support, fund the training, and report the results back to donors.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#D97706]/10 via-[#D97706]/40 to-[#D97706]/10" />
            <div className="flex flex-col md:flex-row items-stretch md:items-start justify-between gap-6 md:gap-2">
              {[
                { num: 1, label: "Family in Need", icon: HeartHandshake, desc: "A family with limited resources needs help keeping their dog." },
                { num: 2, label: "Situation Evaluated", icon: FileSearch, desc: "TTRG reviews the family, the dog, the behavior issues, and the training need." },
                { num: 3, label: "Support Profile Created", icon: Camera, desc: "Photos, videos, and the family's story are gathered into an individual fundraising profile." },
                { num: 4, label: "Training Funds Raised", icon: DollarSign, desc: "The campaign is shared with donors until the needed training support is funded." },
                { num: 5, label: "Training Completed", icon: CheckCircle, desc: "The dog receives training, the family gives a final testimony, and donors see the outcome." },
              ].map((step, i) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-4 md:flex-col md:gap-3 md:text-center flex-1 group ${familySec.visible ? "animate-fade-up" : "opacity-0"}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg bg-white border-2 border-[#D97706]/30 group-hover:shadow-xl group-hover:scale-105 group-hover:border-[#D97706]/60 transition-all duration-300">
                      <step.icon className="w-10 h-10 text-[#D97706]" strokeWidth={1.8} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full text-xs font-black flex items-center justify-center shadow-md bg-[#D97706] text-white">
                      {step.num}
                    </span>
                  </div>
                  <div className="md:mt-2 text-left md:text-center">
                    <p className="font-black text-lg text-[#1B2A4A]">{step.label}</p>
                    <p className="text-xs text-[#1B2A4A]/55 mt-1.5 max-w-[200px] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <p className="text-xs text-[#1B2A4A]/40 uppercase tracking-wider mb-3 font-bold">Every family helped means one more dog stays home</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/ttrg/make-training-affordable" className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg shadow-amber-500/20">
                <HeartHandshake className="w-4 h-4" /> HELP A FAMILY KEEP THEIR DOG
              </Link>
              <Link href="/ttrg/make-training-affordable" className="inline-flex items-center gap-2 border-2 border-[#1B2A4A]/15 text-[#1B2A4A] px-6 py-3.5 rounded-full text-sm font-bold hover:bg-white transition-all">
                VIEW FAMILY SUPPORT STORIES <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4. SUCCESS STORIES + BO & BRADY ═══════ */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#eef4ee] via-[#e8f0e4] to-[#f0f5ee]">
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
                <video muted loop playsInline preload="metadata" poster="/ttrg/video/bo-brady-poster.jpg" className="w-full h-full object-cover brightness-75 group-hover:brightness-50 group-hover:scale-105 transition-all duration-700" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}>
                  <source src="/ttrg/video/bo-brady-web.mp4" type="video/mp4" />
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

          <div className="text-center mt-10">
            <Link href="/ttrg/stories" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B2A4A] hover:text-[#C41E2A] transition-colors">
              VIEW ALL SUCCESS STORIES <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 5. FEATURED DOGS ═══════ */}
      <section id="dogs-in-need" ref={dogsSec.ref} className="py-20 sm:py-24 bg-gradient-to-br from-white via-[#f2f7f0] to-[#eef4ee]">
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
            {dogs.slice(0, 6).map((dog, idx) => (
              <div key={dog.id} className={`${dogsSec.visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: `${idx * 0.08}s` }}>
                <DogCard dog={dog} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-xs text-[#1B2A4A]/40 mb-4">🐾 Each dog is on a journey. Your support helps write a better ending. 🐾</p>
            <Link href="/ttrg/sponsor" className="inline-flex items-center gap-2 border-2 border-[#C41E2A] text-[#C41E2A] px-7 py-3.5 rounded-full text-sm font-bold hover:bg-[#C41E2A] hover:text-white transition-all">
              VIEW ALL DOGS <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 6. PARTNERS PREVIEW ═══════ */}
      <section className="py-12 bg-gradient-to-r from-[#eef4ee] via-white to-[#eef4ee] border-y border-[#2d5a3d]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-[#1B2A4A]/30 uppercase tracking-[0.2em] mb-6">Trusted By Our Community Partners</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50 hover:opacity-80 transition-opacity">
            {["Local Shelters", "Veterinary Partners", "Training Centers", "Foster Networks", "Community Sponsors"].map((p) => (
              <div key={p} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#1B2A4A]/5 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#1B2A4A]/30" />
                </div>
                <span className="text-sm font-semibold text-[#1B2A4A]/40">{p}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/ttrg/partners" className="text-xs font-bold text-[#2d5a3d] hover:text-[#C41E2A] transition-colors uppercase tracking-wider">
              View All Partners →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 7. FOUNDER PREVIEW ═══════ */}
      <section ref={founderSec.ref} className="py-20 sm:py-24 bg-gradient-to-br from-white via-[#f2f7f0] to-[#eef4ee]">
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
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#eef4ee] via-[#e8f0e4] to-[#f0f5ee]">
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
              <Link key={item.label} href={item.href} className="group bg-white rounded-3xl border border-[#2d5a3d]/8 p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
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


      {/* ═══════ 10. FINAL CTA ═══════ */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#122a1a] to-[#0a1628]">
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

      {/* ═══ BO & BRADY VIDEO LIGHTBOX ═══ */}
      {boVideoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setBoVideoOpen(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setBoVideoOpen(false)} className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video controls autoPlay className="w-full aspect-video">
                <source src="/ttrg/video/bo-brady-web.mp4" type="video/mp4" />
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
            {/* Sad puppy image */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-b from-slate-100 to-white">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=200&fit=crop&crop=faces&auto=format" alt="Puppy looking at you" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="px-7 pt-4 pb-7">
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
