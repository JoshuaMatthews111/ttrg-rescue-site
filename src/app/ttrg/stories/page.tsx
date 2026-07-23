"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Play, X, ChevronDown, PawPrint, ChevronRight, Sparkles, HandHeart, Users } from "lucide-react";

const categories = [
  { label: "All Stories", icon: PawPrint, active: true },
  { label: "Rescue Stories", icon: Heart, active: false },
  { label: "Training Stories", icon: Sparkles, active: false },
  { label: "Adoption Stories", icon: HandHeart, active: false },
  { label: "Client Testimonials", icon: Users, active: false },
];

const featuredVideo = {
  id: 0,
  src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/britta-testimonial.mp4",
  title: "Luna's Journey: From Fear to Family",
  quote: "A story of rescue, trust, and transformation.",
  duration: "3:24",
  category: "Rescue Story",
};

const videos = [
  { id: 1, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/testimonial-2.mp4", title: "Tucker's Second Chance", quote: "From neglect to thriving — a training success story.", duration: "2:18", category: "Training Story" },
  { id: 2, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/trefz-family.mp4", title: "A Bond That Heals", quote: "How one family and one dog changed each other forever.", duration: "2:07", category: "Adoption Story" },
  { id: 3, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/just-the-2-of-us.mp4", title: "Braveheart's New Beginning", quote: "Patience, training, and a second chance at life.", duration: "1:56", category: "Rescue Story" },
  { id: 4, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/britta-testimonial.mp4", title: "Healing Together", quote: "Rehabilitation gave this dog — and this family — hope again.", duration: "2:31", category: "Client Testimonial" },
  { id: 5, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/testimonial-2.mp4", title: "Tucker's Training Journey", quote: "Watch how professional training transformed Tucker's behavior.", duration: "2:15", category: "Training Story" },
  { id: 6, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/trefz-family.mp4", title: "The Trefz Family's Rescue", quote: "A rescue story that changed this family forever.", duration: "2:05", category: "Rescue Story" },
];

export default function StoriesPage() {
  const [videoModal, setVideoModal] = useState<null | { src: string; title: string; quote: string }>(null);
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [visibleCount, setVisibleCount] = useState(3);

  return (
    <div className="bg-white">
      {/* ═══ HERO ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B2A4A] leading-tight mb-4">
                Success Stories
              </h1>
              <Heart className="w-8 h-8 text-[#C41E2A] fill-[#C41E2A]/20 mb-4" />
              <p className="text-lg font-bold text-[#1B2A4A] mb-1">Real people. Real dogs.</p>
              <p className="text-lg font-bold text-[#1B2A4A] mb-4">Real second chances.</p>
              <p className="text-[#1B2A4A]/50 text-base leading-relaxed max-w-md">
                Watch inspiring stories from adopters, supporters, and volunteers whose lives were changed forever.
              </p>
            </div>

            {/* Right — Featured Video */}
            <div>
              <button
                onClick={() => setVideoModal(featuredVideo)}
                className="group relative w-full rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <video muted loop playsInline preload="metadata" poster={featuredVideo.src.replace(/\.(mp4|mov)$/, '-poster.jpg')} className="w-full h-full object-cover brightness-75 group-hover:brightness-50 group-hover:scale-105 transition-all duration-700" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}>
                    <source src={featuredVideo.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-[#C41E2A] ml-1" fill="#C41E2A" />
                    </div>
                  </div>
                  <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">{featuredVideo.duration}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block bg-[#C41E2A]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2">{featuredVideo.category}</span>
                  <p className="text-white font-bold text-lg">{featuredVideo.title}</p>
                  <p className="text-white/60 text-sm mt-1">{featuredVideo.quote}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY FILTERS ═══ */}
      <section className="border-y border-slate-100 bg-white sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  activeCategory === cat.label
                    ? "bg-[#C41E2A] text-white border-[#C41E2A]"
                    : "bg-white text-[#1B2A4A]/70 border-slate-200 hover:border-[#C41E2A]/30"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO GRID ═══ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.filter((vid) => {
              if (activeCategory === "All Stories") return true;
              if (activeCategory === "Client Testimonials") return vid.category === "Client Testimonial";
              const key = activeCategory.replace(" Stories", "").toLowerCase();
              return vid.category.toLowerCase().includes(key);
            }).slice(0, visibleCount).map((vid) => (
              <button
                key={vid.id}
                onClick={() => setVideoModal(vid)}
                className="group text-left rounded-2xl overflow-hidden bg-white border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <video muted loop playsInline preload="metadata" poster={vid.src.replace(/\.(mp4|mov)$/, '-poster.jpg')} className="w-full h-full object-cover brightness-90 group-hover:brightness-60 group-hover:scale-105 transition-all duration-700" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}>
                    <source src={vid.src} type={vid.src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-[#C41E2A] group-hover:scale-110 transition-all duration-300">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded">{vid.duration}</span>
                </div>
                <div className="p-5">
                  <span className="inline-block bg-[#C41E2A]/10 text-[#C41E2A] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2">{vid.category}</span>
                  <p className="font-bold text-[#1B2A4A] text-base mb-1">{vid.title}</p>
                  <p className="text-sm text-[#1B2A4A]/50 leading-relaxed">{vid.quote}</p>
                </div>
              </button>
            ))}
          </div>

          {visibleCount < videos.filter((vid) => {
            if (activeCategory === "All Stories") return true;
            if (activeCategory === "Client Testimonials") return vid.category === "Client Testimonial";
            const key = activeCategory.replace(" Stories", "").toLowerCase();
            return vid.category.toLowerCase().includes(key);
          }).length && (
            <div className="text-center mt-12">
              <button onClick={() => setVisibleCount((c) => c + 3)} className="inline-flex items-center gap-2 border-2 border-slate-200 text-[#1B2A4A] px-8 py-3 rounded-full text-sm font-semibold hover:border-[#1B2A4A] transition-colors">
                LOAD MORE STORIES <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-16 bg-[#FAFAF8] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-2">Be Part of More Happy Endings</h3>
              <p className="text-sm text-[#1B2A4A]/50 leading-relaxed">
                Every story you watch is made possible by people like you. Together, we can save more lives.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center mx-auto mb-3">
                <PawPrint className="w-6 h-6 text-[#C41E2A]" />
              </div>
              <p className="font-bold text-[#1B2A4A] text-sm mb-1">Sponsor a Dog</p>
              <p className="text-[11px] text-[#1B2A4A]/40 mb-4">Provide the care, training, and second chance they deserve.</p>
              <Link href="/ttrg/sponsor" className="inline-flex items-center gap-1 text-[#C41E2A] text-xs font-bold hover:underline">
                SPONSOR A DOG <Heart className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EFF0FF] flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#1B2A4A]" />
              </div>
              <p className="font-bold text-[#1B2A4A] text-sm mb-1">Get Involved</p>
              <p className="text-[11px] text-[#1B2A4A]/40 mb-4">Volunteer, foster, or support our mission in meaningful ways.</p>
              <Link href="/ttrg/get-involved" className="inline-flex items-center gap-1 text-[#1B2A4A] text-xs font-bold hover:underline">
                GET INVOLVED <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EMAIL CAPTURE ═══ */}
      <section className="py-5 bg-[#C41E2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-white fill-white/20 flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">Never Miss a Success Story</p>
                <p className="text-white/70 text-[11px]">Subscribe to get new rescue stories, updates, and heartwarming moments—straight to your inbox.</p>
              </div>
            </div>
            <form className="flex items-center gap-2 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="First Name" className="w-full sm:w-36 h-10 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none" />
              <input type="email" placeholder="Email Address" className="w-full sm:w-44 h-10 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none" />
              <button className="h-10 px-5 bg-white text-[#C41E2A] rounded-lg text-sm font-bold whitespace-nowrap flex items-center gap-1 hover:bg-white/90 transition-colors">
                SUBSCRIBE <Heart className="w-3 h-3 fill-[#C41E2A]" />
              </button>
            </form>
          </div>
          <p className="text-white/40 text-[10px] text-center mt-2">We respect your privacy. You can unsubscribe at any time.</p>
        </div>
      </section>

      {/* ═══ VIDEO LIGHTBOX ═══ */}
      {videoModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoModal(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoModal(null)} className="absolute -top-12 right-0 text-white/60 hover:text-white"><X className="w-8 h-8" /></button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video controls autoPlay playsInline className="w-full aspect-video">
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
    </div>
  );
}
