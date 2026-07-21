"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, PawPrint, ChevronRight, Play, X, Shield, Stethoscope, Home, HandHeart, Repeat, Loader2 } from "lucide-react";
import { fetchDogs } from "@/lib/admin-store";
import type { AdminDog } from "@/lib/admin-store";

const journeySteps = [
  { num: 1, label: "Rescue", icon: Shield, desc: "We save dogs from high-risk situations, shelters, and emergency surrenders — safety is their first step." },
  { num: 2, label: "Rehabilitate", icon: Stethoscope, desc: "Medical care, nutrition, behavior work, and emotional healing to restore each dog." },
  { num: 3, label: "Foster", icon: Home, desc: "Foster families provide stability and a calm home environment while dogs await placement." },
  { num: 4, label: "Adopt", icon: HandHeart, desc: "We carefully match each dog with a loving, permanent forever family." },
  { num: 5, label: "Repeat", icon: Repeat, desc: "Every dog adopted means we can save the next one. The mission continues." },
];

// Map journey stage to display stage and color
const getStageDisplay = (dog: AdminDog) => {
  const stageMap: Record<string, { stage: string; stageColor: string }> = {
    "Intake": { stage: "Rescue", stageColor: "bg-red-500" },
    "Assessment": { stage: "Rescue", stageColor: "bg-red-500" },
    "Medical Care": { stage: "Rehabilitate", stageColor: "bg-amber-500" },
    "Training": { stage: "Rehabilitate", stageColor: "bg-amber-500" },
    "Behavioral Rehabilitation": { stage: "Rehabilitate", stageColor: "bg-amber-500" },
    "Foster Placement": { stage: "Foster", stageColor: "bg-emerald-500" },
    "Adoption Preparation": { stage: "Adopt", stageColor: "bg-violet-500" },
    "Ready for Adoption": { stage: "Adopt", stageColor: "bg-violet-500" },
    "Adopted": { stage: "Adopted", stageColor: "bg-blue-500" },
    "Long-Term Support": { stage: "Adopted", stageColor: "bg-blue-500" },
  };
  return stageMap[dog.journeyStage || "Intake"] || { stage: "Rescue", stageColor: "bg-red-500" };
};

const storyVideos = [
  { id: 1, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/britta-testimonial.mp4", title: "From Fear to Family", duration: "2:18" },
  { id: 2, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/testimonial-2.mp4", title: "Second Chances Work", duration: "1:56" },
  { id: 3, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/trefz-family.mp4", title: "A Bond That Heals", duration: "2:07" },
  { id: 4, src: "https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/just-the-2-of-us.mp4", title: "Hope After Hardship", duration: "2:25" },
];

export default function JourneysPage() {
  const [videoModal, setVideoModal] = useState<null | typeof storyVideos[0]>(null);
  const [dogs, setDogs] = useState<AdminDog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDogs().then((allDogs) => {
      // Only show published dogs that are not adopted/archived
      const publishedDogs = allDogs.filter(d => 
        d.status === "published" || d.status === "urgent"
      );
      setDogs(publishedDogs.slice(0, 5)); // Show max 5 dogs
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white">
      {/* ═══ HERO ═══ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF8] to-[#f0f0ec]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B2A4A] leading-tight mb-2">
            Dog Journeys
          </h1>
          <p className="text-xl sm:text-2xl text-[#C41E2A] italic font-semibold mb-4">
            Every dog. Every step. Every second chance. <Heart className="inline w-5 h-5 fill-[#C41E2A]" />
          </p>
          <p className="text-[#1B2A4A]/60 text-base sm:text-lg leading-relaxed max-w-2xl">
            At Team Trainers Rescue Group, we believe every dog deserves a path to a better life. From rescue to adoption, we walk with them every step of the way.
          </p>
        </div>
      </section>

      {/* ═══ JOURNEY TIMELINE ═══ */}
      <section className="py-16 bg-[#FAFAF8] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Single connector line behind the icons (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-slate-200 z-0" />
            {journeySteps.map((step) => (
              <div key={step.label} className="relative z-10 flex items-center gap-3 md:flex-col md:text-center flex-1">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-[#C41E2A]" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#C41E2A] text-white text-[10px] font-bold flex items-center justify-center">{step.num}</span>
                  </div>
                </div>
                <div className="md:mt-3">
                  <p className="font-bold text-[#1B2A4A] text-sm">{step.label}</p>
                  <p className="text-[11px] text-[#1B2A4A]/40 mt-1 max-w-[180px] hidden md:block">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CURRENT JOURNEY STORIES ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Current Journey Stories</h2>
              <p className="text-sm text-[#1B2A4A]/50 mt-1">Real dogs. Real progress. Follow their journey.</p>
            </div>
            <Link href="/ttrg/sponsor" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#1B2A4A] hover:text-[#C41E2A] transition-colors">
              VIEW ALL DOGS IN CARE <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#C41E2A]" />
            </div>
          ) : dogs.length === 0 ? (
            <div className="text-center py-12 text-[#1B2A4A]/40">
              <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No published journey stories yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {dogs.map((dog) => {
                const stageInfo = getStageDisplay(dog);
                return (
                  <Link key={dog.id} href={`/ttrg/dogs/${dog.id}`} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all group">
                    <div className="relative h-48 overflow-hidden bg-[#1B2A4A] flex items-center justify-center">
                      {dog.image ? (
                        <img src={dog.image} alt={dog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                            <PawPrint className="w-8 h-8 text-white/60" />
                          </div>
                          <p className="text-white/80 text-lg font-bold">{dog.name}</p>
                        </div>
                      )}
                      <span className={`absolute bottom-3 left-3 ${stageInfo.stageColor} text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
                        {stageInfo.stage}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#1B2A4A] text-base">{dog.name}</h3>
                      <p className="text-[11px] text-[#1B2A4A]/50 leading-relaxed mt-1 line-clamp-3">{dog.rescueStory || dog.story}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="flex-1 border border-[#C41E2A] text-[#C41E2A] py-2 rounded-lg text-[11px] font-bold text-center group-hover:bg-[#C41E2A] group-hover:text-white transition-colors">
                          FOLLOW JOURNEY
                        </span>
                        <button className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <Heart className="w-4 h-4 text-[#C41E2A]" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ FEATURED STORY VIDEOS ═══ */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Featured Story Videos</h2>
              <p className="text-sm text-[#1B2A4A]/50 mt-1">Watch real stories of transformation and hope.</p>
            </div>
            <Link href="/ttrg/stories" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#1B2A4A] hover:text-[#C41E2A] transition-colors">
              VIEW ALL VIDEOS <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {storyVideos.map((vid) => (
              <button
                key={vid.id}
                onClick={() => setVideoModal(vid)}
                className="group text-left rounded-2xl overflow-hidden bg-white border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <video src={vid.src} muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-[#C41E2A] ml-0.5" fill="#C41E2A" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded">{vid.duration}</span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-[#1B2A4A] text-sm">{vid.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSIDE THE JOURNEY ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PawPrint className="w-5 h-5 text-[#C41E2A]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Inside the Journey</h2>
            </div>
            <p className="text-sm text-[#1B2A4A]/50">What happens at each stage of your dog&apos;s transformation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {journeySteps.map((step) => (
              <div key={step.label} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#FFF0F0] flex items-center justify-center mx-auto mb-3 relative">
                  <step.icon className="w-6 h-6 text-[#C41E2A]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C41E2A] text-white text-[9px] font-bold flex items-center justify-center">{step.num}</span>
                </div>
                <p className="font-bold text-[#1B2A4A] text-sm mb-1">{step.label}</p>
                <p className="text-[11px] text-[#1B2A4A]/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-10 bg-[#1B2A4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">You Can Be Part of the Journey <Heart className="inline w-4 h-4 text-[#C41E2A] fill-[#C41E2A]" /></h3>
            <p className="text-white/50 text-sm hidden md:block">Sponsor or follow a dog in our care and receive updates, photos, and stories.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/ttrg/sponsor" className="bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 py-3 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
              <Heart className="w-4 h-4 fill-white" /> SPONSOR A DOG
            </Link>
            <button className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
              <Heart className="w-4 h-4" /> FOLLOW A DOG
            </button>
          </div>
        </div>
      </section>

      {/* ═══ VIDEO LIGHTBOX ═══ */}
      {videoModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoModal(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoModal(null)} className="absolute -top-12 right-0 text-white/60 hover:text-white"><X className="w-8 h-8" /></button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video controls autoPlay className="w-full aspect-video">
                <source src={videoModal.src} type="video/mp4" />
              </video>
              <div className="p-5 bg-[#1B2A4A]">
                <p className="text-white font-bold text-lg">{videoModal.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
