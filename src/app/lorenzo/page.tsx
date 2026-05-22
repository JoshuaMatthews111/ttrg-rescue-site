"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Phone, Play, X, ChevronRight, ChevronLeft, Shield, Target, Users, Award,
  AlertTriangle, CheckCircle2, ArrowRight, Search, BookOpen, Lightbulb,
  Sparkles, Heart, Star, Clock, MapPin, Mail, Send, Upload, MessageCircle,
} from "lucide-react";
import {
  getActiveAnnouncements, getVisibleTestimonials, getPrograms,
  getVisibleTrainers, addLead, addEmailLead, addContact,
  type Testimonial, type TrainingProgram, type Trainer,
} from "@/lib/lorenzo-store";

// ── Announcement Ticker ──
function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<{ id: string; text: string }[]>([]);
  useEffect(() => {
    const a = getActiveAnnouncements();
    if (a.length) setAnnouncements(a);
  }, []);
  if (!announcements.length) return null;
  return (
    <div className="fixed top-[60px] sm:top-[68px] left-0 right-0 z-40 bg-[#C8102E] overflow-hidden">
      <div className="py-2 animate-marquee whitespace-nowrap">
        {announcements.map((a) => (
          <span key={a.id} className="inline-block text-white text-xs sm:text-sm font-medium mx-8">{a.text}</span>
        ))}
        {announcements.map((a) => (
          <span key={a.id + "-dup"} className="inline-block text-white text-xs sm:text-sm font-medium mx-8">{a.text}</span>
        ))}
      </div>
    </div>
  );
}

// ── Email Popup ──
function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("lorenzo_popup_closed")) return;
    const timer = setTimeout(() => {
      if (!dismissed.current) setShow(true);
    }, 7000);
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (pct > 0.35 && !dismissed.current && !sessionStorage.getItem("lorenzo_popup_closed")) setShow(true);
    };
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  const close = () => { setShow(false); dismissed.current = true; sessionStorage.setItem("lorenzo_popup_closed", "1"); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addEmailLead(email);
    setSubmitted(true);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        {!submitted ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#C8102E]/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#C8102E]" />
            </div>
            <h3 className="text-xl font-black text-[#0B1D3A] mb-2">Is Your Dog&apos;s Behavior Getting Worse?</h3>
            <p className="text-sm text-slate-500 mb-6">Get expert training guidance, success stories, and consultation updates from Lorenzo&apos;s Dog Training Team.</p>
            <form onSubmit={submit} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" required />
              <button type="submit" className="bg-[#C8102E] hover:bg-[#A50D24] text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">Get Training Help</button>
            </form>
            <p className="text-[10px] text-slate-400 mt-3">No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-[#0B1D3A] mb-2">Thank You</h3>
            <p className="text-sm text-slate-500 mb-6">Our team will keep you updated with training tips, success stories, and ways to start your dog&apos;s transformation.</p>
            <button onClick={close} className="bg-[#0B1D3A] text-white px-6 py-3 rounded-lg text-sm font-bold">Close</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LorenzoHomePage() {
  const [videoModal, setVideoModal] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [consultForm, setConsultForm] = useState({
    name: "", email: "", phone: "", dogName: "", age: "", breed: "",
    behaviorIssue: "", trainingGoal: "", location: "", preferredContact: "phone", message: "",
  });
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const u = (field: string, value: string) => setConsultForm((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    setTestimonials(getVisibleTestimonials());
    setPrograms(getPrograms());
    setTrainers(getVisibleTrainers());
  }, []);

  const handleConsult = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({ ...consultForm, photoUrl: "" });
    setConsultSubmitted(true);
  };

  return (
    <div className="bg-white">
      <AnnouncementBar />
      <EmailPopup />

      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 sm:pt-24">
        <div className="absolute inset-0">
          <img src="/lorenzo/team-group.jpg" alt="Lorenzo's Dog Training Team - Full Team" className="w-full h-full object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D3A]/95 via-[#0B1D3A]/75 to-[#0B1D3A]/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" /> TRUSTED BY THOUSANDS OF DOG OWNERS
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Serious Training.<br />
              <span className="text-[#C8102E]">Serious Results.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-lg">
              Transforming aggressive, anxious, and untrained dogs into obedient, confident companions — for life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#A50D24] text-white px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg shadow-red-900/30">
                Book Consultation <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#stories" className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl text-base font-bold transition-all">
                <Play className="w-5 h-5" /> Watch Transformations
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#C8102E]" />
              <a href="tel:+18664364959" className="text-white/80 hover:text-white text-lg font-semibold transition-colors">(866) 436-4959</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. TRUST STRIP ═══════════ */}
      <section className="bg-[#0B1D3A] py-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "40+", label: "Years of Experience" },
              { num: "Thousands", label: "Dogs Transformed" },
              { num: "10", label: "States Served" },
              { num: "In-Home", label: "Personalized Training" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-black text-white">{s.num}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. PROBLEM SECTION ═══════════ */}
      <section className="py-20 sm:py-24 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3">Why Most Training Fails</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">Most dog owners have tried everything. Here&apos;s why it didn&apos;t work — and why our approach is different.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: AlertTriangle, title: "No Real Experience", desc: "Weekend certification courses don't prepare trainers for real behavioral challenges." },
              { icon: Target, title: "One-Size-Fits-All", desc: "Cookie-cutter programs ignore your dog's unique temperament, history, and triggers." },
              { icon: Clock, title: "Lack of Follow-Through", desc: "Training without ongoing support leads to regression and frustration." },
              { icon: Users, title: "No Owner Education", desc: "If the owner isn't trained, the dog's behavior won't change long-term." },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#C8102E]/10 flex items-center justify-center mb-4 group-hover:bg-[#C8102E] transition-colors">
                  <c.icon className="w-6 h-6 text-[#C8102E] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-[#0B1D3A] text-base mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. SUCCESS STORIES / VIDEO TESTIMONIALS ═══════════ */}
      <section id="stories" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Success Stories</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3">Real Transformations. Real Results.</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">Watch how dogs and families were transformed through Lorenzo&apos;s proven training methods.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <button key={t.id} onClick={() => setVideoModal(t)} className="group text-left rounded-2xl overflow-hidden bg-white border border-slate-100 hover:shadow-xl transition-all">
                <div className="relative aspect-video bg-[#0B1D3A] overflow-hidden">
                  <video src={t.videoSrc} muted className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#C8102E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-[10px] font-bold px-3 py-1 rounded-full">{t.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0B1D3A] text-base mb-1">{t.title}</h3>
                  <p className="text-sm text-slate-500 italic">&ldquo;{t.quote}&rdquo;</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setVideoModal(null)} />
          <div className="relative max-w-4xl w-full">
            <button onClick={() => setVideoModal(null)} className="absolute -top-12 right-0 text-white"><X className="w-8 h-8" /></button>
            <video src={videoModal.videoSrc} controls autoPlay className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* ═══════════ 5. TRAINING PROGRAMS ═══════════ */}
      <section id="programs" className="py-20 sm:py-24 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Training Programs</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3">Training for Dogs of All Ages, Sizes, Breeds & Temperaments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1D3A] mb-2">{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{p.description}</p>
                    <p className="text-xs text-[#C8102E] font-semibold">Who it&apos;s for: <span className="text-slate-500 font-normal">{p.whoIsItFor}</span></p>
                  </div>
                  <a href="#contact" className="inline-flex items-center gap-2 text-[#C8102E] font-bold text-sm mt-4 hover:underline">
                    {p.cta} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. THE LORENZO DIFFERENCE ═══════════ */}
      <section id="about" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Why Lorenzo&apos;s</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3 mb-6">The Lorenzo Difference</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Lorenzo&apos;s love of dogs began at age six. Growing up in the inner city, his heart went out to stray dogs in the neighborhood. By age ten, his parents sent him to train with professional dog trainers. He paid his way through college providing in-home dog training. Since 1987, Lorenzo&apos;s Dog Training Team has trained thousands of dogs and trainers, with the main goal of keeping dogs out of shelters and in happy homes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Award, title: "40+ Years Experience", desc: "Proven expertise since 1987" },
                  { icon: Target, title: "Custom Programs", desc: "Tailored to your dog's unique needs" },
                  { icon: Users, title: "Family-Centered", desc: "We train the whole family" },
                  { icon: Shield, title: "Real Behavior Solutions", desc: "Aggression, anxiety, reactivity" },
                  { icon: BookOpen, title: "Owner Education", desc: "Learn to lead your companion" },
                  { icon: MapPin, title: "In-Home Training", desc: "We come to you, 10 states" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-[#C8102E]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0B1D3A] text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src="/lorenzo/lorenzo-with-dogs.jpg" alt="Lorenzo with trained dogs" className="w-full h-[400px] sm:h-[500px] object-cover object-center" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. TRAINING PROCESS ═══════════ */}
      <section className="py-20 sm:py-24 bg-[#0B1D3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Our Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">How It Works</h2>
            <p className="text-white/50 text-sm mt-3 max-w-lg mx-auto">A proven step-by-step process to transform your dog&apos;s behavior.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { num: "01", title: "Evaluate", desc: "We assess your dog's behavior, triggers, and temperament.", icon: Search },
              { num: "02", title: "Plan", desc: "A customized training plan built around your dog and family.", icon: Target },
              { num: "03", title: "Train", desc: "Hands-on, in-home sessions with experienced trainers.", icon: Sparkles },
              { num: "04", title: "Transform", desc: "Watch your dog's behavior change from the first session.", icon: Star },
              { num: "05", title: "Support", desc: "Ongoing guidance to maintain results long-term.", icon: Heart },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#C8102E] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-[#C8102E] text-xs font-bold mb-1">STEP {step.num}</p>
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 8. MEET THE TRAINERS ═══════════ */}
      <section id="trainers" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3">Meet the Trainers</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">Experienced professionals dedicated to transforming dogs and educating owners.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group">
                <div className="h-72 overflow-hidden">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#0B1D3A] text-lg">{t.name}</h3>
                  <p className="text-[#C8102E] text-xs font-semibold mb-2">{t.role}</p>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-3">{t.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] font-medium bg-[#0B1D3A]/5 text-[#0B1D3A] px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Group Photo */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-xl">
            <img src="/lorenzo/team-group.jpg" alt="Lorenzo's full training team" className="w-full h-64 sm:h-80 md:h-96 object-cover object-[center_35%]" />
          </div>
        </div>
      </section>

      {/* ═══════════ 9. RESOURCES ═══════════ */}
      <section id="resources" className="py-20 sm:py-24 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Training Resources</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3">Expert Training Tips</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">Helpful insights from our team of professional trainers.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Understanding Dog Aggression", desc: "Learn the difference between fear-based and dominance-based aggression and how to address each.", icon: AlertTriangle, category: "Behavior" },
              { title: "The First Week with Your New Dog", desc: "Setting rules, boundaries, and structure from day one is critical for long-term success.", icon: BookOpen, category: "New Owners" },
              { title: "Why Off-Leash Obedience Matters", desc: "Off-leash training builds trust, safety, and a deeper bond between you and your dog.", icon: Lightbulb, category: "Training" },
            ].map((r) => (
              <div key={r.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold text-[#C8102E] bg-[#C8102E]/10 px-3 py-1 rounded-full">{r.category}</span>
                </div>
                <h3 className="font-bold text-[#0B1D3A] text-base mb-2">{r.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 10. PHONE CTA ═══════════ */}
      <section className="py-12 bg-[#C8102E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Ready to Transform Your Dog?</h2>
            <p className="text-white/70 text-sm mt-1">Talk to a trainer today. We&apos;re here to help.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+18664364959" className="flex items-center gap-2 bg-white text-[#C8102E] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
              <Phone className="w-4 h-4" /> (866) 436-4959
            </a>
            <a href="#contact" className="flex items-center gap-2 border-2 border-white text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
              Book Online
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ 11. CONSULTATION FORM ═══════════ */}
      <section id="contact" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest">Get Started</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1D3A] mt-3 mb-6">Book Your Consultation</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Fill out the form and a member of our team will contact you to schedule your consultation. Every dog is different — we&apos;ll build a plan that&apos;s right for yours.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#C8102E]" /><a href="tel:+18664364959" className="text-[#0B1D3A] font-semibold">(866) 436-4959</a></div>
                <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-[#C8102E]" /><a href="mailto:info@lorenzosdogtrainingteam.com" className="text-[#0B1D3A] font-semibold">info@lorenzosdogtrainingteam.com</a></div>
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#C8102E] mt-0.5" /><p className="text-[#0B1D3A] font-semibold">4815 Orchard Rd, Cleveland, OH</p></div>
              </div>
              <img src="/lorenzo/facility.jpg" alt="Lorenzo's facility" className="rounded-2xl w-full h-48 sm:h-56 object-cover" />
            </div>

            <div className="bg-[#F7F8FA] rounded-2xl p-6 sm:p-8">
              {!consultSubmitted ? (
                <form onSubmit={handleConsult} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={consultForm.name} onChange={(e) => u("name", e.target.value)} placeholder="Your Name *" required className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                    <input value={consultForm.email} onChange={(e) => u("email", e.target.value)} type="email" placeholder="Email *" required className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={consultForm.phone} onChange={(e) => u("phone", e.target.value)} placeholder="Phone *" required className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                    <input value={consultForm.dogName} onChange={(e) => u("dogName", e.target.value)} placeholder="Dog's Name" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={consultForm.age} onChange={(e) => u("age", e.target.value)} placeholder="Dog's Age" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                    <input value={consultForm.breed} onChange={(e) => u("breed", e.target.value)} placeholder="Breed" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                  </div>
                  <select value={consultForm.behaviorIssue} onChange={(e) => u("behaviorIssue", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white text-slate-600">
                    <option value="">Main Behavior Issue</option>
                    <option>Aggression</option>
                    <option>Anxiety / Fear</option>
                    <option>Pulling / Leash Reactivity</option>
                    <option>Destructive Behavior</option>
                    <option>Jumping / Mouthing</option>
                    <option>Housebreaking</option>
                    <option>Off-Leash Training</option>
                    <option>Puppy Training</option>
                    <option>Service Dog Needs</option>
                    <option>Other</option>
                  </select>
                  <select value={consultForm.trainingGoal} onChange={(e) => u("trainingGoal", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white text-slate-600">
                    <option value="">Training Goal</option>
                    <option>Basic Obedience</option>
                    <option>Behavioral Modification</option>
                    <option>Service Dog Training</option>
                    <option>Specialty / Advanced Training</option>
                    <option>Not Sure — Need Evaluation</option>
                  </select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={consultForm.location} onChange={(e) => u("location", e.target.value)} placeholder="Location / State" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white" />
                    <select value={consultForm.preferredContact} onChange={(e) => u("preferredContact", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white text-slate-600">
                      <option value="phone">Prefer Phone Call</option>
                      <option value="email">Prefer Email</option>
                      <option value="text">Prefer Text</option>
                    </select>
                  </div>
                  <textarea value={consultForm.message} onChange={(e) => u("message", e.target.value)} placeholder="Tell us about your dog and situation..." rows={4} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 bg-white resize-none" />
                  <button type="submit" className="w-full bg-[#C8102E] hover:bg-[#A50D24] text-white py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Submit Consultation Request
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-[#0B1D3A] mb-2">Consultation Request Received</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">A member of our team will contact you shortly to schedule your consultation. In the meantime, feel free to call us at <a href="tel:+18664364959" className="text-[#C8102E] font-semibold">(866) 436-4959</a>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* bottom padding for sticky mobile CTA */}
      <div className="h-20 sm:hidden" />

      {/* marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
}
