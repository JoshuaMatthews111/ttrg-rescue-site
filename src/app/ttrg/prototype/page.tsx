"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart, PawPrint, Play, ChevronRight, X, ArrowRight,
  AlertTriangle, Clock, Shield, Award, Users, Phone,
  MapPin, Mail, CheckCircle2, Sparkles,
} from "lucide-react";

/* ─── DATA ─── */

const dogs = [
  { id: "bailey", name: "Bailey", age: "3 yrs", breed: "Mixed Breed", gender: "Female", image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80", story: "Found abandoned in a parking lot with a broken leg. Bailey has undergone surgery and is learning to trust humans again.", price: 35, funded: 35, urgent: true, daysInRescue: 47, stage: 2, label: "Needs Surgery" },
  { id: "tucker", name: "Tucker", age: "5 yrs", breed: "Labrador Mix", gender: "Male", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80", story: "Surrendered after his family lost their home. Tucker is gentle, house-trained, and desperately misses being loved.", price: 40, funded: 60, urgent: false, daysInRescue: 23, stage: 3, label: "In Training" },
  { id: "daisy", name: "Daisy", age: "2 yrs", breed: "Pit Bull Mix", gender: "Female", image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80", story: "Rescued from a hoarding situation with 30+ dogs. Daisy was malnourished but her spirit never broke.", price: 30, funded: 45, urgent: false, daysInRescue: 31, stage: 3, label: "Recovering" },
  { id: "shadow", name: "Shadow", age: "7 yrs", breed: "Labrador Retriever", gender: "Male", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80", story: "A senior dog found wandering a highway at night. Shadow needs eye surgery and a warm, patient foster home.", price: 45, funded: 30, urgent: true, daysInRescue: 62, stage: 1, label: "Emergency Rescue" },
  { id: "prince", name: "Prince", age: "1 yr", breed: "Doberman Mix", gender: "Male", image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&q=80", story: "Saved from euthanasia with hours to spare. Prince is young, eager, and ready to become someone's best friend.", price: 35, funded: 20, urgent: true, daysInRescue: 12, stage: 2, label: "Waiting for Sponsor" },
  { id: "luna", name: "Luna", age: "4 yrs", breed: "Staffordshire Mix", gender: "Female", image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80", story: "Luna was found protecting her puppies under a bridge. Her babies are safe — now it's her turn to heal.", price: 40, funded: 55, urgent: false, daysInRescue: 38, stage: 4, label: "Ready for Adoption" },
];

const stages = ["Rescued", "Medical Care", "Rehabilitation", "Training", "Rehomed"];

const testimonials = [
  { id: 1, title: "Britta's Transformation", quote: "They didn't just save Britta. They gave our whole family a second chance.", thumb: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80" },
  { id: 2, title: "From Shelter to Home", quote: "Watching Rocky go from terrified to tail-wagging changed my life forever.", thumb: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80" },
  { id: 3, title: "A Senior Dog's Journey", quote: "They told us he was too old. TTRG proved everyone wrong.", thumb: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80" },
];

const impactStats = [
  { icon: PawPrint, value: 247, suffix: "+", label: "Dogs Rescued", desc: "Lives saved and transformed" },
  { icon: Heart, value: 189, suffix: "+", label: "Dogs Rehomed", desc: "Found loving forever homes" },
  { icon: Users, value: 1200, suffix: "+", label: "Supporters", desc: "People powering rescue" },
  { icon: Award, value: 98, suffix: "%", label: "Success Rate", desc: "Of dogs fully rehabilitated" },
];

/* ─── SCROLL ANIMATION HOOK ─── */
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

/* ─── ANIMATED COUNTER ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => { start += step; if (start >= target) { setCount(target); clearInterval(timer); } else { setCount(start); } }, 25);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── MAIN COMPONENT ─── */
export default function TTRGHomepage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [videoModal, setVideoModal] = useState<null | typeof testimonials[0]>(null);

  // Popup trigger: after 6s or 35% scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ttrg-popup-closed")) return;

    const timer = setTimeout(() => { if (!popupDismissed) setPopupOpen(true); }, 6000);

    const onScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.35 && !popupDismissed) { setPopupOpen(true); window.removeEventListener("scroll", onScroll); }
    };
    window.addEventListener("scroll", onScroll);

    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [popupDismissed]);

  const closePopup = () => { setPopupOpen(false); setPopupDismissed(true); sessionStorage.setItem("ttrg-popup-closed", "1"); };

  const hero = useInView();
  const journeys = useInView();
  const urgency = useInView();
  const trust = useInView();
  const impact = useInView();

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════ NAVIGATION ═══════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/ttrg/ttrg-logo.jpeg" alt="TTRG" className="w-10 h-10 rounded-full object-cover" />
            <div className="hidden sm:block">
              <p className="text-[#1B2A4A] font-bold text-sm leading-tight">Team Trainers</p>
              <p className="text-[#C41E2A] text-[10px] font-semibold tracking-wider uppercase">Rescue Group</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Our Dogs", "Journeys", "Impact", "About"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="text-[#1B2A4A]/60 hover:text-[#1B2A4A] text-sm font-medium transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold text-[#1B2A4A] hover:text-[#C41E2A] transition-colors hidden sm:block">Report a Dog</button>
            <a href="#our-dogs" className="bg-[#C41E2A] hover:bg-[#A01825] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all btn-glow">
              HELP SAVE DOGS
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section ref={hero.ref} className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background with slow cinematic zoom */}
        <div className="absolute inset-0 animate-slow-zoom">
          <img
            src="/ttrg/hero-trainer.png"
            alt="TTRG trainer with rescue dog"
            className="w-full h-full object-cover object-right"
          />
        </div>
        {/* Dark emotional overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/80 to-[#0a1628]/20 md:from-[#0a1628]/90 md:via-[#0a1628]/60 md:to-transparent" />

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${hero.visible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="max-w-2xl py-12 sm:py-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C41E2A] animate-pulse" />
              <span className="text-white/70 text-xs font-medium">3 dogs rescued this week</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-3 tracking-tight">
              Rescue.<br />
              Rehab.<br />
              <span className="text-[#C41E2A]">Rehome.</span>
            </h1>
            <p className="text-xl sm:text-2xl font-light text-white/50 mb-2">Repeat. <Heart className="inline w-5 h-5 text-[#C41E2A] fill-[#C41E2A] align-middle" /></p>

            {/* Emotional microcopy */}
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg mt-6 mb-8">
              Every rescue dog deserves safety, healing, and a second chance. We transform the forgotten into the unforgettable.
            </p>

            {/* CTA Buttons with glow */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#our-dogs" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] text-white px-8 py-4 rounded-full text-sm font-bold transition-all btn-glow animate-pulse-glow">
                <Heart className="w-4 h-4 fill-white" /> HELP SAVE DOGS
              </a>
              <a href="#journeys" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-white/10 transition-all btn-glow-secondary">
                <Play className="w-4 h-4" /> VIEW RESCUE JOURNEYS
              </a>
            </div>

            {/* Micro trust */}
            <div className="flex items-center gap-6 mt-10 text-white/30 text-xs">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 501(c)(3) Nonprofit</span>
              <span className="flex items-center gap-1"><PawPrint className="w-3 h-3" /> 247+ Dogs Rescued</span>
            </div>
          </div>
        </div>

        {/* Floating paw accent */}
        <div className="absolute bottom-10 right-10 hidden lg:block animate-float opacity-20">
          <PawPrint className="w-20 h-20 text-white" />
        </div>
      </section>

      {/* ═══════════════════════════════ EMOTIONAL TRANSITION ═══════════════════════════════ */}
      <section className="relative py-6 bg-[#1B2A4A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/50 text-sm sm:text-base italic">
            &ldquo;The greatness of a nation can be judged by the way its animals are treated.&rdquo;
            <span className="text-white/30 ml-2">— Mahatma Gandhi</span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════ DOG JOURNEYS (CINEMATIC) ═══════════════════════════════ */}
      <section id="journeys" ref={journeys.ref} className="py-24 sm:py-32 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${journeys.visible ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#C41E2A]/10 rounded-full px-4 py-1.5 mb-4">
              <PawPrint className="w-3.5 h-3.5 text-[#C41E2A]" />
              <span className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider">Transformation Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] leading-tight mb-4">
              Every Dog Has a Journey
            </h2>
            <p className="text-[#1B2A4A]/50 text-base sm:text-lg max-w-2xl mx-auto">
              From rescue to rehome — follow the real stories of transformation, hope, and second chances.
            </p>
          </div>

          {/* Journey Timeline Legend */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-12">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-red-500" : i === 4 ? "bg-emerald-500" : "bg-amber-400"}`} />
                <span className="text-[10px] sm:text-xs text-[#1B2A4A]/40 font-medium">{s}</span>
              </div>
            ))}
          </div>

          {/* Dog Journey Cards — Cinematic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog, idx) => (
              <div
                key={dog.id}
                className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${journeys.visible ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img src={dog.image} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Urgent badge */}
                  {dog.urgent && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> URGENT
                    </div>
                  )}

                  {/* Stage badge */}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-semibold">
                    {dog.label}
                  </div>

                  {/* Days counter */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-[10px]">
                    <Clock className="w-3 h-3" /> {dog.daysInRescue} days in rescue
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-3 right-3">
                    <p className="text-white font-bold text-lg">{dog.name}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[11px] text-[#1B2A4A]/40 mb-2">{dog.age} · {dog.breed} · {dog.gender}</p>
                  <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-4 line-clamp-2">{dog.story}</p>

                  {/* Journey Progress */}
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {stages.map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < dog.stage ? "bg-[#C41E2A]" : i === dog.stage ? "bg-[#C41E2A]/40" : "bg-slate-100"}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-[#1B2A4A]/30 mt-1">{stages[dog.stage]}</p>
                  </div>

                  {/* Funding */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[#1B2A4A]/40">Funded</span>
                      <span className="font-bold text-[#C41E2A]">{dog.funded}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#C41E2A] to-[#ff4757] rounded-full transition-all duration-1000" style={{ width: `${dog.funded}%` }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-[#1B2A4A] hover:bg-[#2a3d66] text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 btn-glow-secondary">
                    <Heart className="w-3.5 h-3.5" /> SPONSOR {dog.name.toUpperCase()} — ${dog.price}/MO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ DOGS WHO NEED SUPPORT (URGENCY) ═══════════════════════════════ */}
      <section id="our-dogs" ref={urgency.ref} className="py-24 sm:py-32 bg-[#1B2A4A] relative overflow-hidden">
        {/* Background paw pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='15' y='35' font-size='24'%3E🐾%3C/text%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${urgency.visible ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#C41E2A] rounded-full px-4 py-1.5 mb-4 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Dogs Need You Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              These Dogs Are Running<br />Out of Time
            </h2>
            <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto">
              Every dollar funded brings them closer to safety, surgery, and a second chance at life.
            </p>
          </div>

          {/* Urgent dogs - horizontal scroll on mobile */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible">
            {dogs.filter(d => d.urgent).map((dog, idx) => (
              <div
                key={dog.id}
                className={`snap-center flex-shrink-0 w-[85vw] sm:w-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 ${urgency.visible ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {dog.label}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-bold text-xl">{dog.name}</p>
                    <p className="text-white/50 text-xs">{dog.daysInRescue} days waiting</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{dog.story}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-white/30">${Math.round(dog.price * 12 * dog.funded / 100)} raised</span>
                      <span className="font-bold text-[#C41E2A]">{dog.funded}% funded</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#C41E2A] to-[#ff4757] rounded-full" style={{ width: `${dog.funded}%` }} />
                    </div>
                  </div>
                  <button className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-xs font-bold transition-all btn-glow flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 fill-white" /> SAVE {dog.name.toUpperCase()} NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ VIDEO TESTIMONIALS ═══════════════════════════════ */}
      <section ref={trust.ref} className="py-24 sm:py-32 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${trust.visible ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#1B2A4A]/10 rounded-full px-4 py-1.5 mb-4">
              <Play className="w-3.5 h-3.5 text-[#1B2A4A]" />
              <span className="text-[#1B2A4A] text-xs font-bold uppercase tracking-wider">Video Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] leading-tight mb-4">
              Real Stories. Real Transformations.
            </h2>
            <p className="text-[#1B2A4A]/50 text-base sm:text-lg max-w-2xl mx-auto">
              See how rescue, rehabilitation, and training changed lives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => setVideoModal(vid)}
                className={`group relative rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 text-left ${trust.visible ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="relative h-64 sm:h-72">
                  <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover brightness-75 group-hover:brightness-50 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#C41E2A] group-hover:scale-110 transition-all duration-300">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Quote overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-bold text-sm mb-1">{vid.title}</p>
                    <p className="text-white/60 text-xs italic leading-relaxed">&ldquo;{vid.quote}&rdquo;</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ IMPACT STATS ═══════════════════════════════ */}
      <section id="impact" ref={impact.ref} className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${impact.visible ? "animate-fade-up" : "opacity-0"}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] leading-tight mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-[#1B2A4A]/50 text-base sm:text-lg max-w-2xl mx-auto">
              Behind every number is a dog who was given a second chance.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`text-center p-8 rounded-3xl bg-[#FAFAF8] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${impact.visible ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C41E2A]/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-[#C41E2A]" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[#1B2A4A] mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm font-bold text-[#1B2A4A]">{stat.label}</p>
                <p className="text-[11px] text-[#1B2A4A]/40 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FINAL CTA ═══════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80" alt="Dogs running" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1B2A4A]/90" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <Heart className="w-12 h-12 text-[#C41E2A] fill-[#C41E2A]/30 mx-auto mb-6 animate-float" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Be the Reason a Dog<br />Gets a Second Chance
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Sponsor a dog&apos;s recovery, report a dog in need, or join our rescue network. Every action saves a life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#our-dogs" className="inline-flex items-center justify-center gap-2 bg-[#C41E2A] text-white px-8 py-4 rounded-full text-sm font-bold transition-all btn-glow animate-pulse-glow">
              <Heart className="w-4 h-4 fill-white" /> SPONSOR A DOG
            </a>
            <button className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
              <PawPrint className="w-4 h-4" /> REPORT A DOG IN NEED
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
      <footer className="bg-[#0a1628] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/ttrg/ttrg-logo.jpeg" alt="TTRG" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-white font-bold text-sm">Team Trainers Rescue Group</p>
                  <p className="text-white/30 text-[10px]">Rescue. Rehab. Rehome. Repeat.</p>
                </div>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">A 501(c)(3) nonprofit dedicated to rescuing, rehabilitating, and rehoming dogs in need.</p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
              <div className="space-y-2 text-white/40 text-sm">
                <a href="#our-dogs" className="block hover:text-white transition-colors">Our Dogs</a>
                <a href="#journeys" className="block hover:text-white transition-colors">Rescue Journeys</a>
                <a href="#impact" className="block hover:text-white transition-colors">Our Impact</a>
                <a href="#" className="block hover:text-white transition-colors">Report a Dog</a>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Get Involved</p>
              <div className="space-y-2 text-white/40 text-sm">
                <a href="#our-dogs" className="block hover:text-white transition-colors">Sponsor a Dog</a>
                <a href="#" className="block hover:text-white transition-colors">Volunteer</a>
                <a href="#" className="block hover:text-white transition-colors">Foster</a>
                <a href="#" className="block hover:text-white transition-colors">Donate</a>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Contact Us</p>
              <div className="space-y-3 text-white/40 text-sm">
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> 4805 Orchard Rd<br />Cleveland, OH 44128</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" /> (866) 436-4959</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" /> <a href="mailto:info@teamtrainersrescuegroup.com" className="hover:text-white transition-colors">info@teamtrainersrescuegroup.com</a></p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Team Trainers Rescue Group. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════ VIDEO LIGHTBOX ═══════════════════════════════ */}
      {videoModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={() => setVideoModal(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
          <div className="relative z-10 max-w-3xl w-full bg-[#1B2A4A] rounded-3xl overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoModal(null)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-center text-white/50">
                <Play className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Video Player Placeholder</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-white font-bold text-lg">{videoModal.title}</h3>
              <p className="text-white/50 text-sm mt-2 italic">&ldquo;{videoModal.quote}&rdquo;</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ RESCUE POPUP ═══════════════════════════════ */}
      {popupOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closePopup} />
          <div className="relative z-10 max-w-md w-full bg-white rounded-3xl overflow-hidden animate-scale-in shadow-2xl">
            {/* Popup hero image */}
            <div className="relative h-44 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80" alt="Rescue dog" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <button onClick={closePopup} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-6 -mt-6 relative">
              {/* Paw heartbeat accent */}
              <div className="w-12 h-12 rounded-full bg-[#C41E2A] flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>

              {!popupSubmitted ? (
                <>
                  <h3 className="text-xl font-black text-[#1B2A4A] text-center mb-2">
                    A Rescue Dog Needs<br />Someone Like You
                  </h3>
                  <p className="text-[#1B2A4A]/50 text-sm text-center mb-6 leading-relaxed">
                    Know a dog that needs rescue, rehabilitation, or a second chance? Join our rescue network and help save lives.
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); setPopupSubmitted(true); }} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={popupEmail}
                      onChange={(e) => setPopupEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30 focus:border-[#C41E2A]"
                    />
                    <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white h-12 rounded-xl text-sm font-bold transition-all btn-glow flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4 fill-white" /> JOIN THE RESCUE MISSION
                    </button>
                  </form>
                  <p className="text-[10px] text-[#1B2A4A]/30 text-center mt-3">We respect your privacy. No spam, ever.</p>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-[#1B2A4A] mb-2">Thank You for Joining<br />the Rescue Mission</h3>
                  <p className="text-[#1B2A4A]/50 text-sm mb-6 leading-relaxed">
                    Together we can help save dogs, support rehabilitation, and create more second chances.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={closePopup} className="flex-1 bg-[#C41E2A] text-white py-3 rounded-xl text-xs font-bold transition-all btn-glow flex items-center justify-center gap-2">
                      <PawPrint className="w-3.5 h-3.5" /> REPORT A DOG
                    </button>
                    <a href="#journeys" onClick={closePopup} className="flex-1 border border-slate-200 text-[#1B2A4A] py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> SEE DOG JOURNEYS
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
