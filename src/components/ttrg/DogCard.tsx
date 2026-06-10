"use client";

import { useRef } from "react";
import Link from "next/link";
import { Heart, AlertTriangle, Clock, CheckCircle2, ArrowRight, Play } from "lucide-react";
import type { Dog, journeyStages } from "@/lib/dogs";

/* mini journey stages for the progress bar */
const miniStages = [
  { key: "rescue", label: "Rescue" },
  { key: "medical", label: "Medical" },
  { key: "rehab", label: "Training" },
  { key: "foster", label: "Foster" },
  { key: "adopt", label: "Adopt" },
] as const;

type MiniKey = typeof miniStages[number]["key"];

const stageOrder: Record<string, number> = { rescue: 0, medical: 1, rehab: 2, foster: 3, adopt: 4, home: 5 };

function getStageIndex(key: string): number {
  return stageOrder[key] ?? 0;
}

const oldStageMap: Record<string, string> = { rescue: "rescue", rehabilitate: "rehab", train: "rehab", recover: "medical", rehome: "adopt" };

export default function DogCard({ dog: raw }: { dog: Dog }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  /* safe defaults for legacy admin dogs */
  const dog = {
    ...raw,
    daysInRescue: raw.daysInRescue || 0,
    currentJourneyStage: raw.currentJourneyStage || (oldStageMap[raw.stage] as Dog["currentJourneyStage"]) || "rescue",
    statusBadges: raw.statusBadges || (raw.urgent ? ["Urgent"] : []),
    videoUrl: (raw as unknown as Record<string, unknown>).videoUrl as string || (raw as unknown as Record<string, unknown>).video_url as string || "",
  };
  const currentIdx = getStageIndex(dog.currentJourneyStage);
  const hasVideo = !!dog.videoUrl;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col">
      {/* ── HERO MEDIA (video or image) ── */}
      <Link href={`/ttrg/dogs/${dog.id}`} className="block">
        <div
          className="relative h-56 sm:h-60 overflow-hidden"
          onMouseEnter={() => { if (hasVideo && videoRef.current) videoRef.current.play().catch(() => {}); }}
          onMouseLeave={() => { if (hasVideo && videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
        >
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={dog.videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                poster={dog.image || undefined}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-[#C41E2A] fill-[#C41E2A] ml-0.5" />
                </div>
              </div>
            </>
          ) : (
            <img
              src={dog.image}
              alt={dog.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* badges top-left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {hasVideo && (
              <span className="flex items-center gap-1 bg-[#1B2A4A]/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Play className="w-3 h-3 fill-white" /> Video
              </span>
            )}
            {dog.urgent && (
              <span className="flex items-center gap-1 bg-[#C41E2A] text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Urgent
              </span>
            )}
            {dog.statusBadges
              .filter((b) => b !== "Urgent")
              .map((badge) => (
                <span
                  key={badge}
                  className="bg-[#1B2A4A]/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-semibold"
                >
                  {badge}
                </span>
              ))}
          </div>

          {/* heart top-right */}
          <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-[#C41E2A]" />
          </span>

          {/* days in rescue bottom-left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5" /> {dog.daysInRescue} days in rescue
          </div>
        </div>
      </Link>

      {/* ── BODY ── */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/ttrg/dogs/${dog.id}`} className="block">
          <h3 className="text-2xl font-black text-[#1B2A4A] mb-1">{dog.name}</h3>
          <p className="text-[12px] text-[#1B2A4A]/50 mb-3">
            {dog.age} · {dog.breed} · {dog.gender}
          </p>
          <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-5 line-clamp-3">
            {dog.story}
          </p>
        </Link>

        {/* ── JOURNEY PROGRESS BAR ── */}
        <div className="mb-5">
          <p className="text-[11px] font-bold text-[#1B2A4A]/70 mb-2.5">Journey Progress</p>
          <div className="flex items-center gap-0">
            {miniStages.map((stage, i) => {
              const isCompleted = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isUpcoming = i > currentIdx;

              return (
                <div key={stage.key} className="flex items-center flex-1">
                  {/* connector line before (except first) */}
                  {i > 0 && (
                    <div
                      className={`h-[2px] flex-1 -mx-0.5 ${
                        isCompleted || isCurrent ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                  {/* dot */}
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isCurrent
                          ? "bg-white border-amber-500 ring-2 ring-amber-400/30"
                          : "bg-slate-100 border-slate-200"
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                    <span
                      className={`text-[9px] font-semibold ${
                        isCompleted
                          ? "text-emerald-600"
                          : isCurrent
                          ? "text-amber-600"
                          : "text-slate-300"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BUTTONS ── */}
        <div className="flex gap-3 mt-auto">
          <Link
            href={`/ttrg/donate?ttrgDog=${dog.name}`}
            className="flex-1 bg-[#C41E2A] hover:bg-[#A01825] text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" /> DONATE
          </Link>
          <Link
            href={`/ttrg/dogs/${dog.id}`}
            className="flex-1 border-2 border-[#1B2A4A]/15 text-[#1B2A4A] py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            VIEW PROFILE <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
