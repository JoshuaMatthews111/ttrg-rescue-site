"use client";

// Media panel for dog and family profiles: the VIDEO leads and starts playing
// immediately (no scrolling to find it), with photos available as thumbnails
// underneath. Clicking a photo swaps the main area; clicking the video
// thumbnail returns to the video and restarts it.

import { useState } from "react";
import { Play, ImageIcon } from "lucide-react";
import CampaignVideo from "@/components/ttrg/CampaignVideo";

export default function MediaShowcase({
  videoUrl,
  images,
  title,
  poster,
  badges,
}: {
  videoUrl?: string;
  images: string[];
  title: string;
  poster?: string;
  /** optional overlay chips (URGENT / COMPLETED) shown on photos */
  badges?: React.ReactNode;
}) {
  const photos = Array.from(new Set(images.filter(Boolean)));
  const hasVideo = !!videoUrl;
  // Video first whenever there is one — that's the whole point.
  const [active, setActive] = useState<"video" | number>(hasVideo ? "video" : 0);

  if (!hasVideo && photos.length === 0) return null;

  return (
    <div>
      {/* Main stage */}
      <div className="relative rounded-3xl overflow-hidden bg-black">
        {active === "video" && videoUrl ? (
          <CampaignVideo url={videoUrl} poster={poster} title={title} />
        ) : (
          <div className="relative">
            <img
              src={photos[typeof active === "number" ? active : 0]}
              alt={title}
              className="w-full h-72 sm:h-[26rem] object-cover"
            />
            {badges}
          </div>
        )}
      </div>

      {/* Thumbnails — only when there is more than one thing to show */}
      {(hasVideo ? photos.length > 0 : photos.length > 1) && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {hasVideo && (
            <button
              onClick={() => setActive("video")}
              className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${active === "video" ? "border-[#C41E2A]" : "border-transparent opacity-70 hover:opacity-100"}`}
              aria-label="Play video"
            >
              {poster
                ? <img src={poster} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-slate-800" />}
              <span className="absolute inset-0 bg-black/45 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </span>
            </button>
          )}
          {photos.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${active === i ? "border-[#C41E2A]" : "border-transparent opacity-70 hover:opacity-100"}`}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {photos.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0 pl-1">
              <ImageIcon className="w-3 h-3" /> {photos.length} photo{photos.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
