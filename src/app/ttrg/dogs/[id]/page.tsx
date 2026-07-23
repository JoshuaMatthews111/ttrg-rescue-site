"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, MapPin, ChevronRight, ChevronLeft, ArrowLeft, Share2,
  PawPrint, AlertTriangle, X, CheckCircle2, Clock, Star, Stethoscope,
  GraduationCap, Brain, Home, Loader2, Play, Film, Calendar,
  Users, ArrowRight, Gift
} from "lucide-react";
import { getDogById, donationTiers, journeyStages, type Dog } from "@/lib/dogs";
import { shareSubject, dogStageTitle } from "@/lib/share-messages";
import { getVideoEmbedUrl, getDirectVideoUrl } from "@/lib/video-embed";
import MediaShowcase from "@/components/ttrg/MediaShowcase";
import { fetchShareOverrides, type ShareOverride } from "@/lib/share-overrides";
import { fetchDogById, subscribeToTable } from "@/lib/admin-store";
import {
  formatAge, formatBreed, isEmpty, filterEmptyStrings, buildDisplayOptions,
  getTimelineIndex, getTimelineKey, TIMELINE_STAGES, DOG_STATUS_COLORS,
  getSupportActions, buildEmotionalSummary, GENDER_ICONS, SIZE_ICONS,
} from "@/lib/dog-constants";

/* ── stage helpers ── */
const stageOrder: Record<string, number> = { rescue: 0, medical: 1, rehab: 2, foster: 3, adopt: 4, home: 5 };
const milestoneColor: Record<string, string> = { completed: "text-emerald-500", in_progress: "text-amber-500", upcoming: "text-slate-300", urgent: "text-red-500" };
const milestoneBg: Record<string, string> = { completed: "bg-emerald-500", in_progress: "bg-amber-500", upcoming: "bg-slate-200", urgent: "bg-red-500" };

export default function DogProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const staticDog = getDogById(id);
  const [rawDog, setRawDog] = useState<(Dog & Record<string, unknown>) | undefined>(staticDog as (Dog & Record<string, unknown>) | undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [shareOverride, setShareOverride] = useState<ShareOverride | undefined>(undefined);

  useEffect(() => {
    fetchShareOverrides().then(map => setShareOverride(map[id]));
  }, [id]);

  async function handleShare(d: { id: string; name: string; story?: string; rescueStory?: string; urgent?: boolean; stage?: string }) {
    const result = await shareSubject(
      {
        id: d.id, name: d.name, story: d.story || d.rescueStory || "", urgent: d.urgent,
        customTitle: shareOverride?.title || dogStageTitle(d.name, d.stage),
      },
      window.location.href,
    );
    if (result === "copied") {
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    }
  }

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

  // Build complete dog data with safe defaults
  const dog = {
    ...rawDog,
    // Ensure arrays exist
    medicalNeedsOptions: (rawDog.medicalNeedsOptions as string[]) || [],
    trainingNeedsOptions: (rawDog.trainingNeedsOptions as string[]) || [],
    behaviorNotesOptions: (rawDog.behaviorNotesOptions as string[]) || [],
    specialNeedsOptions: (rawDog.specialNeedsOptions as string[]) || [],
    // Use structured fields if available
    breedOption: (rawDog.breedOption as string) || rawDog.breed,
    otherBreed: rawDog.otherBreed as string | undefined,
    ageNumber: rawDog.ageNumber as number | undefined,
    ageUnit: rawDog.ageUnit as string | undefined,
    ageApproximate: rawDog.ageApproximate as boolean | undefined,
    genderOption: (rawDog.genderOption as string) || rawDog.gender,
    size: rawDog.size as string | undefined,
    dogStatus: (rawDog.dogStatus as string) || (rawDog.urgent ? "Urgent Support Needed" : "In Training"),
    journeyStage: (rawDog.journeyStage as string) || (rawDog.currentJourneyStage === "medical" ? "Medical Care" : rawDog.currentJourneyStage === "rehab" ? "Training" : rawDog.currentJourneyStage === "foster" ? "Foster Placement" : rawDog.currentJourneyStage === "adopt" ? "Ready for Adoption" : rawDog.currentJourneyStage === "home" ? "Adopted" : "Intake"),
    supportGoal: (rawDog.supportGoal as string) || "Needs Donations",
    rescueStory: rawDog.rescueStory as string | undefined,
    otherMedicalNeed: rawDog.otherMedicalNeed as string | undefined,
    medicalNeedsNotes: rawDog.medicalNeedsNotes as string | undefined,
    otherTrainingNeed: rawDog.otherTrainingNeed as string | undefined,
    trainingNeedsNotes: rawDog.trainingNeedsNotes as string | undefined,
    otherBehaviorNote: rawDog.otherBehaviorNote as string | undefined,
    behaviorNotesText: rawDog.behaviorNotesText as string | undefined,
    otherSpecialNeed: rawDog.otherSpecialNeed as string | undefined,
    specialNeedsNotes: rawDog.specialNeedsNotes as string | undefined,
    rescueDate: rawDog.rescueDate as string | undefined,
    daysInRescue: (rawDog.daysInRescue && (rawDog.daysInRescue as number) > 0)
      ? rawDog.daysInRescue as number
      : Math.max(1, Math.floor((Date.now() - new Date((rawDog.publishedAt as string) || (rawDog.createdAt as string) || Date.now()).getTime()) / 86400000)),
    gallery: rawDog.gallery || [],
    image: rawDog.image || "",
    name: rawDog.name || "",
    story: rawDog.story || "",
    urgent: rawDog.urgent || false,
    breed: rawDog.breed || "",
    gender: rawDog.gender || "",
    age: rawDog.age || "",
    weight: rawDog.weight || "",
    currentJourneyStage: rawDog.currentJourneyStage as string | undefined,
    currentStageLabel: rawDog.currentStageLabel as string | undefined,
    currentNeeds: (rawDog.currentNeeds as { icon: string; label: string; detail: string; urgent?: boolean }[]) || [],
    milestones: (rawDog.milestones as { label: string; date?: string; status: string }[]) || [],
  };

  const dogVideoUrl = (dog?.videoUrl as string) || "";

  // Build display values
  const displayBreed = formatBreed(dog.breedOption, dog.otherBreed, dog.breed);
  const displayAge = formatAge(dog.ageNumber, dog.ageUnit, dog.ageApproximate) || dog.age;
  const displayGender = dog.genderOption || dog.gender;
  const displaySize = dog.size || "Medium";

  // Build needs arrays (hiding "Other" if custom text is empty)
  const medicalNeeds = buildDisplayOptions(dog.medicalNeedsOptions, dog.otherMedicalNeed);
  const trainingNeeds = buildDisplayOptions(dog.trainingNeedsOptions, dog.otherTrainingNeed);
  const behaviorNotes = buildDisplayOptions(dog.behaviorNotesOptions, dog.otherBehaviorNote);
  const specialNeeds = buildDisplayOptions(dog.specialNeedsOptions, dog.otherSpecialNeed);

  // Check if sections have content
  const hasMedical = medicalNeeds.length > 0 || !isEmpty(dog.medicalNeedsNotes);
  const hasTraining = trainingNeeds.length > 0 || !isEmpty(dog.trainingNeedsNotes);
  const hasBehavior = behaviorNotes.length > 0 || !isEmpty(dog.behaviorNotesText);
  const hasSpecial = specialNeeds.length > 0 || !isEmpty(dog.specialNeedsNotes);

  // Build emotional summary
  const emotionalSummary = buildEmotionalSummary({
    name: dog.name,
    breedOption: dog.breedOption,
    otherBreed: dog.otherBreed,
    ageNumber: dog.ageNumber,
    ageUnit: dog.ageUnit,
    ageApproximate: dog.ageApproximate,
    genderOption: dog.genderOption,
    dogStatus: dog.dogStatus,
    rescueStory: dog.rescueStory,
  });

  // Support actions
  const supportActions = getSupportActions(dog.supportGoal);

  // Timeline index
  const timelineIdx = getTimelineIndex(dog.journeyStage);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-[#1B2A4A]/50">
            <Link href="/ttrg" className="hover:text-[#C41E2A]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/ttrg/sponsor" className="hover:text-[#C41E2A]">Our Dogs</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1B2A4A] font-medium">{dog.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ═══════════════════════════════════════════════════════════════
            A. TOP DOG SUMMARY CARD
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Video first (auto-plays), photos as thumbnails below */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {dog.dogStatus && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${DOG_STATUS_COLORS[dog.dogStatus] || "bg-slate-100 text-slate-700"}`}>
                    {dog.dogStatus}
                  </span>
                )}
                {dog.urgent && !dog.dogStatus?.includes("Urgent") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" /> Urgent
                  </span>
                )}
                <button
                  onClick={() => handleShare(dog)}
                  className="ml-auto inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105"
                >
                  <Share2 className="w-4 h-4" />
                  {shareState === "copied" ? "Copied!" : `Share ${dog.name}`}
                </button>
              </div>
              <MediaShowcase
                videoUrl={dogVideoUrl || undefined}
                images={[dog.image, ...(dog.gallery || [])]}
                poster={dog.image}
                title={dog.name}
              />
            </div>

            {/* Right: Info */}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] mb-2">
                Meet {dog.name}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mb-4">
                {!isEmpty(displayBreed) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm">
                    <PawPrint className="w-3.5 h-3.5" /> {displayBreed}
                  </span>
                )}
                {!isEmpty(displayAge) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm">
                    <Calendar className="w-3.5 h-3.5" /> {displayAge}
                  </span>
                )}
                {!isEmpty(displayGender) && displayGender !== "Unknown" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm">
                    {GENDER_ICONS[displayGender]} {displayGender}
                  </span>
                )}
                {!isEmpty(displaySize) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm">
                    {SIZE_ICONS[displaySize]} {displaySize}
                  </span>
                )}
              </div>

              {/* Short Story from Admin Panel */}
              <p className="text-[#1B2A4A]/70 text-base leading-relaxed mb-4">
                {dog.story || dog.rescueStory || emotionalSummary}
              </p>

              {/* Expandable Full Story */}
              {!isEmpty(dog.fullStory) && (
                <div className="mb-6">
                  {showFullStory && (
                    <p className="text-[#1B2A4A]/70 text-sm leading-relaxed whitespace-pre-line mb-2">
                      {dog.fullStory}
                    </p>
                  )}
                  <button
                    onClick={() => setShowFullStory(!showFullStory)}
                    className="text-[#C41E2A] text-sm font-semibold hover:underline flex items-center gap-1"
                  >
                    {showFullStory ? "Hide Full Story" : "View Full Story"}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showFullStory ? "rotate-90" : ""}`} />
                  </button>
                </div>
              )}

              {/* Gallery thumbnails */}
              {dog.gallery.length > 1 && (
                <div className="flex gap-2 mb-6">
                  {dog.gallery.slice(0, 4).map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#C41E2A]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {dog.gallery.length > 4 && (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-medium">
                      +{dog.gallery.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Full-screen playback of the video shown in the media panel */}
              {dogVideoUrl && (
                <button onClick={() => setShowVideo(true)} className="flex items-center gap-2 text-[#C41E2A] font-semibold text-sm mb-6 hover:underline">
                  <Film className="w-4 h-4" /> Watch {dog.name}&apos;s Video Full Screen
                </button>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/ttrg/donate?ttrgDog=${dog.name}`} className="flex-1 bg-[#C41E2A] hover:bg-[#A01825] text-white py-3 px-6 rounded-xl text-sm font-bold transition-colors text-center flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-white" /> Donate to {dog.name}
                </Link>
                {supportActions.showFoster && (
                  <Link href="/ttrg/foster" className="flex-1 border-2 border-[#1B2A4A]/15 text-[#1B2A4A] py-3 px-6 rounded-xl text-sm font-bold hover:bg-white transition-colors text-center">
                    Apply to Foster
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && dogVideoUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {getVideoEmbedUrl(dogVideoUrl) ? (
                <iframe src={getVideoEmbedUrl(dogVideoUrl)!} allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="w-full h-full border-0" title={`Video of ${dog.name}`} />
              ) : (
                <video src={getDirectVideoUrl(dogVideoUrl)} controls autoPlay playsInline className="w-full h-full" />
              )}
              <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            B. RESCUE STORY SECTION
        ═══════════════════════════════════════════════════════════════ */}
        {!isEmpty(dog.rescueStory) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C41E2A]" /> {dog.name}&apos;s Rescue Story
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-[#1B2A4A]/70 leading-relaxed whitespace-pre-line">
                {dog.rescueStory}
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            C. JOURNEY TIMELINE
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-6 text-center">
            {dog.name}&apos;s Journey at TTRG
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Progress Bar */}
            <div className="hidden sm:block absolute top-6 left-0 right-0 h-1 bg-slate-100 rounded-full">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-[#C41E2A] rounded-full transition-all" style={{ width: `${(timelineIdx / (TIMELINE_STAGES.length - 1)) * 100}%` }} />
            </div>

            {/* Stages */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {TIMELINE_STAGES.map((stage, i) => {
                const isCompleted = i < timelineIdx;
                const isCurrent = i === timelineIdx;

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 mb-2 relative z-10 ${
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                      isCurrent ? "bg-[#C41E2A] border-[#C41E2A] text-white ring-4 ring-[#C41E2A]/20" :
                      "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{stage.num}</span>}
                    </div>
                    <p className={`text-xs font-bold ${isCompleted ? "text-emerald-600" : isCurrent ? "text-[#C41E2A]" : "text-slate-400"}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] text-[#C41E2A]/70 mt-1">Current</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Journey Info */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              {(dog.currentStageLabel || dog.journeyStage) && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C41E2A]" />
                  <span className="text-[#1B2A4A]">Current Stage: <strong>{dog.currentStageLabel || dog.journeyStage}</strong></span>
                </div>
              )}
              {dog.rescueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C41E2A]" />
                  <span className="text-[#1B2A4A]">Rescued: <strong>{dog.rescueDate}</strong></span>
                </div>
              )}
              {dog.daysInRescue !== undefined && (
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#C41E2A]" />
                  <span className="text-[#1B2A4A]"><strong>{dog.daysInRescue}</strong> days in care</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            D. WHAT [DOG] NEEDS NOW - Only show if has content
        ═══════════════════════════════════════════════════════════════ */}
        {dog.currentNeeds && dog.currentNeeds.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-[#1B2A4A] mb-6">
              What {dog.name} Needs Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dog.currentNeeds.map((need: { icon: string; label: string; detail: string; urgent?: boolean }, i: number) => {
                const iconMap: Record<string, React.ReactNode> = {
                  vet: <Stethoscope className="w-5 h-5 text-red-500" />,
                  training: <GraduationCap className="w-5 h-5 text-emerald-500" />,
                  foster: <Home className="w-5 h-5 text-amber-500" />,
                  nutrition: <Heart className="w-5 h-5 text-blue-500" />,
                };
                const bgMap: Record<string, string> = {
                  vet: "bg-red-100",
                  training: "bg-emerald-100",
                  foster: "bg-amber-100",
                  nutrition: "bg-blue-100",
                };
                return (
                  <div key={i} className={`flex items-start gap-3 p-4 bg-slate-50 rounded-xl ${need.urgent ? "ring-2 ring-red-200" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl ${bgMap[need.icon] || "bg-slate-100"} flex items-center justify-center flex-shrink-0`}>
                      {iconMap[need.icon] || <Heart className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div>
                      <p className="font-bold text-[#1B2A4A] text-sm">{need.label}</p>
                      <p className="text-xs text-[#1B2A4A]/60">{need.detail}</p>
                      {need.urgent && <span className="text-[10px] text-red-500 font-bold uppercase mt-1 block">Urgent</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            E. SUPPORT NEEDS CARDS (Only show if has content)
        ═══════════════════════════════════════════════════════════════ */}
        {(hasMedical || hasTraining || hasBehavior || hasSpecial) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Medical Needs Card */}
            {hasMedical && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#C41E2A]" /> Medical Needs
                </h3>
                {medicalNeeds.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {medicalNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1B2A4A]/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {need}
                      </li>
                    ))}
                  </ul>
                )}
                {!isEmpty(dog.medicalNeedsNotes) && (
                  <p className="text-sm text-[#1B2A4A]/60 italic border-t border-slate-100 pt-3">
                    {dog.medicalNeedsNotes}
                  </p>
                )}
              </div>
            )}

            {/* Training Needs Card */}
            {hasTraining && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#C41E2A]" /> Training Needs
                </h3>
                {trainingNeeds.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {trainingNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1B2A4A]/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {need}
                      </li>
                    ))}
                  </ul>
                )}
                {!isEmpty(dog.trainingNeedsNotes) && (
                  <p className="text-sm text-[#1B2A4A]/60 italic border-t border-slate-100 pt-3">
                    {dog.trainingNeedsNotes}
                  </p>
                )}
              </div>
            )}

            {/* Behavior Notes Card */}
            {hasBehavior && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#C41E2A]" /> Behavior Notes
                </h3>
                {behaviorNotes.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {behaviorNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1B2A4A]/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
                {!isEmpty(dog.behaviorNotesText) && (
                  <p className="text-sm text-[#1B2A4A]/60 italic border-t border-slate-100 pt-3">
                    {dog.behaviorNotesText}
                  </p>
                )}
              </div>
            )}

            {/* Special Needs Card */}
            {hasSpecial && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#C41E2A]" /> Special Needs
                </h3>
                {specialNeeds.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {specialNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1B2A4A]/70">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        {need}
                      </li>
                    ))}
                  </ul>
                )}
                {!isEmpty(dog.specialNeedsNotes) && (
                  <p className="text-sm text-[#1B2A4A]/60 italic border-t border-slate-100 pt-3">
                    {dog.specialNeedsNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            F. MILESTONES
        ═══════════════════════════════════════════════════════════════ */}
        {dog.milestones && dog.milestones.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-[#1B2A4A] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {dog.name}&apos;s Milestones
            </h2>
            <div className="space-y-4">
              {dog.milestones.map((milestone: { label: string; date?: string; status: string }, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.status === "completed" ? "bg-emerald-100" :
                    milestone.status === "in_progress" ? "bg-amber-100" :
                    milestone.status === "urgent" ? "bg-red-100" :
                    "bg-slate-100"
                  }`}>
                    {milestone.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {milestone.status === "in_progress" && <Clock className="w-5 h-5 text-amber-500" />}
                    {milestone.status === "urgent" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {milestone.status === "upcoming" && <div className="w-3 h-3 rounded-full bg-slate-300" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold ${
                        milestone.status === "completed" ? "text-emerald-600" :
                        milestone.status === "in_progress" ? "text-amber-600" :
                        milestone.status === "urgent" ? "text-red-600" :
                        "text-slate-400"
                      }`}>
                        {milestone.label}
                      </p>
                      {milestone.date && (
                        <span className="text-xs text-[#1B2A4A]/50">{milestone.date}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#1B2A4A]/50 mt-0.5">
                      {milestone.status === "completed" ? "Completed" :
                       milestone.status === "in_progress" ? "In Progress" :
                       milestone.status === "urgent" ? "Urgent - Needs Attention" :
                       "Upcoming"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            G. DONATION CALLOUT
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-[#C41E2A] to-[#A01825] rounded-3xl p-6 sm:p-8 text-white mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 fill-white/20" />
            <h2 className="text-2xl font-bold mb-3">Help {dog.name} Continue Their Journey</h2>
            <p className="text-white/80 mb-6">
              Your support helps provide food, medical care, training, and the second chance this dog deserves.
            </p>

            {/* Donation Tiers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[25, 50, 100, 250].map((amount) => (
                <Link
                  key={amount}
                  href={`/ttrg/donate?ttrgDog=${dog.name}&amount=${amount}`}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center transition-colors"
                >
                  <span className="text-2xl font-black">${amount}</span>
                  <span className="block text-xs text-white/70 mt-1">
                    {amount === 25 && "Food Support"}
                    {amount === 50 && "Basic Care"}
                    {amount === 100 && "Vet & Nutrition"}
                    {amount === 250 && "Training & Rehab"}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/ttrg/donate?ttrgDog=${dog.name}`} className="inline-flex items-center justify-center gap-2 bg-white text-[#C41E2A] py-3 px-6 rounded-xl font-bold hover:bg-white/90 transition-colors">
                <Gift className="w-4 h-4" /> Donate Custom Amount
              </Link>
              {supportActions.showFoster && (
                <Link href="/ttrg/foster" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white py-3 px-6 rounded-xl font-bold hover:bg-white/10 transition-colors">
                  <Home className="w-4 h-4" /> Apply to Foster
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            F. QUICK INFO & NAVIGATION
        ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/ttrg/sponsor" className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-[#1B2A4A]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1B2A4A]">Back to All Dogs</p>
              <p className="text-xs text-[#1B2A4A]/50">See more rescue stories</p>
            </div>
          </Link>

          <Link href="/ttrg/donate" className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#C41E2A]/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#C41E2A]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1B2A4A]">General Donation</p>
              <p className="text-xs text-[#1B2A4A]/50">Support all TTRG dogs</p>
            </div>
          </Link>

          <button onClick={() => handleShare(dog)} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-[#1B2A4A]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1B2A4A]">Share {dog.name}&apos;s Story</p>
              <p className="text-xs text-[#1B2A4A]/50">Help spread the word</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
