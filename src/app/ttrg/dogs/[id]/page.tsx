"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, MapPin, Shield, Stethoscope, GraduationCap, Home, ChevronRight, ChevronLeft, ArrowLeft, Share2,
  PawPrint, AlertTriangle, X, Phone, Mail, CheckCircle2, Clock, Star, Utensils, Dumbbell, Brain,
  Calendar, Users, Loader2, Play, Film,
} from "lucide-react";
import { getDogById, donationTiers, journeyStages, type Dog } from "@/lib/dogs";
import { fetchDogById, subscribeToTable } from "@/lib/admin-store";

/* ── stage helpers ── */
const stageOrder: Record<string, number> = { rescue: 0, medical: 1, rehab: 2, foster: 3, adopt: 4, home: 5 };
const needIcons: Record<string, typeof Stethoscope> = { nutrition: Utensils, vet: Stethoscope, training: Dumbbell, foster: Home };
const milestoneColor: Record<string, string> = { completed: "text-emerald-500", in_progress: "text-amber-500", upcoming: "text-slate-300", urgent: "text-red-500" };
const milestoneBg: Record<string, string> = { completed: "bg-emerald-500", in_progress: "bg-amber-500", upcoming: "bg-slate-200", urgent: "bg-red-500" };
const legendItems = [
  { label: "Completed", desc: "Stage completed", color: "bg-emerald-500" },
  { label: "In Progress", desc: "Currently in this stage", color: "bg-amber-500" },
  { label: "Upcoming", desc: "Not yet started", color: "bg-slate-200" },
  { label: "Urgent", desc: "Needs immediate attention", color: "bg-red-500" },
  { label: "Sponsored", desc: "Has a sponsor", color: "bg-violet-500" },
];

export default function DogProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const staticDog = getDogById(id);
  const [rawDog, setRawDog] = useState<(Dog & Record<string, unknown>) | undefined>(staticDog as (Dog & Record<string, unknown>) | undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDogById(id).then((supabaseDog) => {
      if (supabaseDog) setRawDog(supabaseDog as unknown as Dog & Record<string, unknown>);
      setLoading(false);
    });
    const unsub = subscribeToTable("dogs", () => {
      fetchDogById(id).then((supabaseDog) => {
        if (supabaseDog) setRawDog(supabaseDog as unknown as Dog & Record<string, unknown>);
      });
    });
    return () => { unsub(); };
  }, [id]);

  if (loading && !rawDog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C41E2A]" />
      </div>
    );
  }

  if (!rawDog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <PawPrint className="w-16 h-16 text-slate-200" />
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Dog not found</h1>
        <Link href="/ttrg/sponsor" className="text-[#C41E2A] font-semibold hover:underline">← View all dogs</Link>
      </div>
    );
  }

  /* safe defaults for legacy admin dogs missing extended fields */
  const oldStageMap: Record<string, string> = { rescue: "rescue", rehabilitate: "rehab", train: "rehab", recover: "medical", rehome: "adopt" };
  const dog: Dog = {
    ...rawDog,
    rescueDate: rawDog.rescueDate || "Unknown",
    daysInRescue: rawDog.daysInRescue || 0,
    currentJourneyStage: rawDog.currentJourneyStage || (oldStageMap[rawDog.stage] as Dog["currentJourneyStage"]) || "rescue",
    journeyDates: rawDog.journeyDates || {},
    progressPercent: rawDog.progressPercent || 0,
    currentStageLabel: rawDog.currentStageLabel || rawDog.stage || "In Progress",
    statusBadges: rawDog.statusBadges || (rawDog.urgent ? ["Urgent"] : []),
    milestones: rawDog.milestones || [],
    currentNeeds: rawDog.currentNeeds || [],
    careTeam: rawDog.careTeam || "TTRG Team",
    lastUpdate: rawDog.lastUpdate || "Recently",
    adminNote: rawDog.adminNote || "",
    sponsorStatus: rawDog.sponsorStatus || "none",
  };

  const currentIdx = stageOrder[dog.currentJourneyStage] ?? 0;
  const dogVideoUrl = (rawDog?.videoUrl as string) || (rawDog?.video_url as string) || "";

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-[#1B2A4A]/50">
            <Link href="/ttrg" className="hover:text-[#C41E2A]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/ttrg/sponsor" className="hover:text-[#C41E2A]">Our Dogs</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1B2A4A] font-medium">{dog.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ══════ HEADING ══════ */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B2A4A] flex items-center gap-3">
                {dog.name}&apos;s Rescue Journey <PawPrint className="w-8 h-8 text-[#C41E2A]" />
              </h1>
              <p className="text-[#1B2A4A]/50 text-base mt-2">Every step forward is possible because of people like you.</p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-slate-100">
              <Heart className="w-5 h-5 text-[#C41E2A] fill-[#C41E2A]/20" />
              <div>
                <span className="text-2xl font-black text-[#C41E2A]">{dog.progressPercent}%</span>
                <span className="text-xs text-[#1B2A4A]/50 ml-2">Stage {currentIdx + 1} of 6</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ JOURNEY TRACKER ══════ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-100">
          {/* current stage label */}
          <div className="text-center mb-6">
            <span className="inline-block bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">Current Stage</span>
          </div>
          <div className="flex items-center justify-between gap-0 overflow-x-auto pb-2">
            {journeyStages.map((stage, i) => {
              const isCompleted = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isUpcoming = i > currentIdx;
              const date = dog.journeyDates[stage.key];

              return (
                <div key={stage.key} className="flex items-center flex-1 min-w-0">
                  {i > 0 && (
                    <div className={`h-[3px] flex-1 min-w-4 ${isCompleted || isCurrent ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                  <div className="flex flex-col items-center gap-1.5 relative">
                    {isCurrent && (
                      <span className="absolute -top-7 text-[9px] font-bold text-amber-600 uppercase tracking-wider whitespace-nowrap hidden sm:block">Current Stage</span>
                    )}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-[3px] transition-all relative ${
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                      isCurrent ? "bg-amber-500 border-amber-500 text-white scale-110 shadow-lg shadow-amber-200" :
                      "bg-slate-100 border-slate-200 text-slate-400"
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-6 h-6" />}
                      {isCurrent && (() => {
                        const icons = [Shield, Stethoscope, Dumbbell, Home, Heart, Home];
                        const Icon = icons[i] || PawPrint;
                        return <Icon className="w-6 h-6" />;
                      })()}
                      {isUpcoming && (() => {
                        const icons = [Shield, Stethoscope, Dumbbell, Home, Heart, Home];
                        const Icon = icons[i] || PawPrint;
                        return <Icon className="w-6 h-6" />;
                      })()}
                      {isCompleted && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] sm:text-xs font-bold ${isCompleted ? "text-emerald-600" : isCurrent ? "text-amber-600" : "text-slate-400"}`}>
                        {stage.num}. {stage.label}
                      </p>
                      <p className={`text-[9px] ${isCurrent ? "text-amber-500 font-semibold" : "text-slate-400"}`}>
                        {isCurrent ? `Since ${date || "Now"}` : date || (isUpcoming ? "Upcoming" : "")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════ MAIN 3-COLUMN LAYOUT ══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── COL 1: Gallery + Status ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Video + Image gallery */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100">
              {/* Video section (if dog has video) */}
              {dogVideoUrl && (
                <div className="relative">
                  {showVideo ? (
                    <div className="relative aspect-video bg-black">
                      <video src={dogVideoUrl} controls autoPlay playsInline className="w-full h-full object-contain" />
                      <button onClick={() => setShowVideo(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setShowVideo(true)} className="w-full relative aspect-video bg-slate-900 group/vid">
                      <img src={dog.image} alt={dog.name} className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover/vid:scale-110 transition-transform">
                          <Play className="w-7 h-7 text-[#C41E2A] fill-[#C41E2A] ml-1" />
                        </div>
                        <span className="flex items-center gap-1.5 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                          <Film className="w-3.5 h-3.5" /> Watch {dog.name}&apos;s Video
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Photo gallery */}
              <div className="relative aspect-[4/3]">
                <img src={dog.gallery[activeImage] || dog.image} alt={dog.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {activeImage + 1} / {dog.gallery.length || 1}
                </div>
                {dog.gallery.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((p) => (p - 1 + dog.gallery.length) % dog.gallery.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setActiveImage((p) => (p + 1) % dog.gallery.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white/80 text-xs">The day we rescued {dog.name}.</p>
                  <p className="text-white/50 text-[10px]">{dog.rescueDate}</p>
                </div>
              </div>
              {dog.gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {dog.gallery.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === i ? "border-[#C41E2A]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2 block">Current Status</span>
              <h3 className="text-xl font-black text-[#1B2A4A] mb-3">{dog.currentStageLabel}</h3>
              <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-5">{dog.fullStory.slice(0, 200)}...</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#1B2A4A]/40 mt-0.5 flex-shrink-0" />
                  <div><span className="font-bold text-[#1B2A4A]">Last Update</span> <span className="text-[#1B2A4A]/50 ml-2">{dog.lastUpdate}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#1B2A4A]/40 mt-0.5 flex-shrink-0" />
                  <div><span className="font-bold text-[#1B2A4A]">Care Team</span> <span className="text-[#1B2A4A]/50 ml-2">{dog.careTeam}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <PawPrint className="w-4 h-4 text-[#1B2A4A]/40 mt-0.5 flex-shrink-0" />
                  <div><span className="font-bold text-[#1B2A4A]">Admin Note</span> <span className="text-[#1B2A4A]/50 ml-2">{dog.adminNote}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── COL 2: Needs + CTAs ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* What dog needs now */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <h3 className="text-lg font-black text-[#1B2A4A] mb-4">What {dog.name} Needs Now</h3>
              <div className="space-y-3">
                {dog.currentNeeds.map((need) => {
                  const Icon = needIcons[need.icon] || Heart;
                  return (
                    <div key={need.label} className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${need.urgent ? "bg-red-100" : "bg-slate-100"}`}>
                        <Icon className={`w-4 h-4 ${need.urgent ? "text-red-500" : "text-[#1B2A4A]/60"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1B2A4A]">{need.label}</p>
                        <p className={`text-xs ${need.urgent ? "text-red-500 font-semibold" : "text-[#1B2A4A]/50"}`}>{need.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <Link href={`/ttrg/donate?ttrgDog=${dog.name}`} className="block w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-4 rounded-2xl text-sm font-bold transition-colors text-center flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 fill-white" /> Support {dog.name}
            </Link>
            <Link href="/ttrg/foster" className="block w-full border-2 border-[#1B2A4A]/15 text-[#1B2A4A] py-4 rounded-2xl text-sm font-bold hover:bg-white transition-colors text-center">
              Apply to Foster
            </Link>
          </div>

          {/* ── COL 3: Milestones + About ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Milestones */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <h3 className="text-sm font-black text-[#1B2A4A] mb-4 uppercase tracking-wider">{dog.name}&apos;s Milestones</h3>
              <div className="space-y-3">
                {dog.milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${milestoneBg[m.status]}`}>
                      {m.status === "completed" && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {m.status === "in_progress" && <div className="w-2 h-2 rounded-full bg-white" />}
                      {m.status === "urgent" && <AlertTriangle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${m.status === "in_progress" ? "text-[#1B2A4A] font-bold" : milestoneColor[m.status]}`}>{m.label}</p>
                    </div>
                    <span className="text-[10px] text-[#1B2A4A]/40 flex-shrink-0">{m.date || (m.status === "in_progress" ? "Ongoing" : "Upcoming")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About dog */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <h3 className="text-sm font-black text-[#1B2A4A] mb-4 uppercase tracking-wider">About {dog.name}</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Breed", value: dog.breed },
                  { label: "Age", value: dog.age },
                  { label: "Gender", value: dog.gender },
                  { label: "Weight", value: dog.weight },
                  { label: "Location", value: dog.location },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-[#1B2A4A]/50">{item.label}</span>
                    <span className="font-semibold text-[#1B2A4A]">{item.value}</span>
                  </div>
                ))}
              </div>
              {/* small about image */}
              <div className="mt-4 rounded-xl overflow-hidden">
                <img src={dog.gallery[dog.gallery.length - 1] || dog.image} alt={dog.name} className="w-full h-32 object-cover" />
              </div>
            </div>

            {/* How You Can Help */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <h3 className="text-sm font-black text-[#1B2A4A] mb-2 uppercase tracking-wider">How You Can Help</h3>
              <p className="text-xs text-[#1B2A4A]/50 mb-4">Your support helps dogs like {dog.name} heal, recover, and find their forever home.</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Donate", href: `/ttrg/donate?ttrgDog=${dog.name}`, icon: Heart },
                  { label: "Foster", href: "/ttrg/foster", icon: Home },
                  { label: "Sponsor", href: `/ttrg/dogs/${dog.id}`, icon: Star },
                  { label: "Share", href: "#", icon: Share2 },
                ].map((a) => (
                  <Link key={a.label} href={a.href} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                      <a.icon className="w-4 h-4 text-[#C41E2A]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#1B2A4A]">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════ LEGEND ══════ */}
        <div className="mt-10 bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <div>
                  <p className="text-xs font-bold text-[#1B2A4A]">{item.label}</p>
                  <p className="text-[9px] text-[#1B2A4A]/40">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
