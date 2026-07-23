"use client";

// Campaign video that starts playing the moment a visitor lands on the page.
//
// Browsers only allow autoplay when the video is MUTED (and iOS additionally
// requires playsInline), so we autoplay muted and show a prominent "Tap for
// sound" button. The first tap unmutes and restarts from the beginning so the
// donor hears the story from the top. Hosted links (Drive/YouTube/Vimeo) are
// embedded with their own autoplay+mute parameters.

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getVideoEmbedUrl, getDirectVideoUrl, withEmbedAutoplay } from "@/lib/video-embed";

export default function CampaignVideo({
  url,
  poster,
  title,
  className = "",
}: { url: string; poster?: string; title: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const embed = getVideoEmbedUrl(url);

  // Kick off playback as soon as the element is ready (and retry once the tab
  // becomes visible, since browsers block autoplay in background tabs).
  useEffect(() => {
    if (embed) return;
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => { v.play().catch(() => {}); };
    tryPlay();
    const onVisible = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [embed, url]);

  if (embed) {
    return (
      <iframe
        src={withEmbedAutoplay(embed)}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={`w-full aspect-video rounded-2xl bg-black border-0 ${className}`}
        title={title}
      />
    );
  }

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    if (muted) {
      v.muted = false;
      v.currentTime = 0; // replay from the start now that they can hear it
      v.play().catch(() => {});
      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        src={getDirectVideoUrl(url)}
        poster={poster || undefined}
        autoPlay
        muted
        playsInline
        controls
        preload="auto"
        className="w-full rounded-2xl bg-black"
      />
      <button
        onClick={toggleSound}
        className="absolute top-3 right-3 inline-flex items-center gap-2 bg-black/70 hover:bg-black/85 text-white px-4 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm transition-all"
        aria-label={muted ? "Turn sound on" : "Mute video"}
      >
        {muted ? <><VolumeX className="w-4 h-4" /> Tap for sound</> : <><Volume2 className="w-4 h-4" /> Sound on</>}
      </button>
    </div>
  );
}
