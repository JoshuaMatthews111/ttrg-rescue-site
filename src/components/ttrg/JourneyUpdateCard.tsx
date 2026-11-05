"use client";

import Link from "next/link";
import { Heart, ArrowRight, Calendar, Film } from "lucide-react";
import { getVideoEmbedUrl, getDirectVideoUrl } from "@/lib/video-embed";
import { type JourneyUpdate, donateHref, profileHref, formatUpdateDate } from "@/lib/journey-updates";

/**
 * One follow-up video update. `showProfileLink` is on for the Dog Journeys
 * page (routes visitors to the dog's profile) and off on the profile itself.
 */
export default function JourneyUpdateCard({ update, showProfileLink = true, badge = "Follow-Up Update", showDate = true }: { update: JourneyUpdate; showProfileLink?: boolean; badge?: string; showDate?: boolean }) {
  const embed = getVideoEmbedUrl(update.videoUrl);
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="aspect-video bg-black">
        {embed ? (
          <iframe
            src={`${embed}?rel=0&playsinline=1`}
            title={update.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          />
        ) : (
          <video src={getDirectVideoUrl(update.videoUrl)} controls playsInline preload="metadata" className="w-full h-full" />
        )}
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 bg-[#C41E2A]/10 text-[#C41E2A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            <Film className="w-3 h-3" /> {badge}
          </span>
          {showDate && update.date && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#1B2A4A]/40">
              <Calendar className="w-3 h-3" /> {formatUpdateDate(update.date)}
            </span>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-[#1B2A4A] mb-2">{update.title}</h3>
        <p className="text-sm text-[#1B2A4A]/60 leading-relaxed mb-5">{update.summary}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={donateHref(update)}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white py-3 px-5 rounded-xl text-sm font-bold transition-colors"
          >
            <Heart className="w-4 h-4 fill-white" /> Donate to {update.dogName}
          </Link>
          {showProfileLink && (
            <Link
              href={profileHref(update)}
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#1B2A4A]/15 text-[#1B2A4A] py-3 px-5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              View {update.dogName}&apos;s Profile <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
