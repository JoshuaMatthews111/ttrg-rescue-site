"use client";

// Campaign video that starts playing the moment a visitor lands on the page.
//
// Browsers only allow autoplay when the video is MUTED (and iOS additionally
// requires playsInline), so we autoplay muted and show a prominent "Tap for
// sound" button. The first tap unmutes and restarts from the beginning so the
// donor hears the story from the top. Hosted links (Drive/YouTube/Vimeo) are
// embedded with their own autoplay+mute parameters.

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getVideoEmbedUrl, getDirectVideoUrl, withEmbedAutoplay } from "@/lib/video-embed";

export default function CampaignVideo({
  url,
  poster,
  title,
  className = "",
}: { url: string; poster?: string; title: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const [embedMuted, setEmbedMuted] = useState(true);
  const embed = getVideoEmbedUrl(url);

  // Hosted players (YouTube/Vimeo) must start muted to be allowed to
  // autoplay. Turn the sound on as soon as the visitor interacts with the
  // page — their player APIs accept commands over postMessage.
  const unmuteEmbed = useCallback(() => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage(JSON.stringify({ event: "command", func: "unMute", args: [] }), "*");
      win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*");
      win.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
      win.postMessage(JSON.stringify({ method: "setVolume", value: 1 }), "*"); // Vimeo
      setEmbedMuted(false);
    } catch { /* cross-origin refusal — the visitor can use the player's own control */ }
  }, []);

  useEffect(() => {
    if (!embed) return;
    const onFirstInteraction = () => { unmuteEmbed(); removeAll(); };
    const events: (keyof DocumentEventMap)[] = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];
    const removeAll = () => events.forEach(e => document.removeEventListener(e, onFirstInteraction));
    events.forEach(e => document.addEventListener(e, onFirstInteraction, { passive: true }));
    return removeAll;
  }, [embed, unmuteEmbed]);

  // Goal: sound on, immediately. Browsers only permit unmuted autoplay when
  // the visitor already has engagement history with the site, so:
  //   1. TRY unmuted first — returning visitors get sound straight away.
  //   2. If the browser refuses, fall back to muted so it still plays
  //      (an unmuted attempt that is blocked plays nothing at all).
  //   3. Unmute on the visitor's first interaction anywhere on the page —
  //      any tap, click, scroll or keypress — so they don't have to hunt
  //      for a button.
  useEffect(() => {
    if (embed) return;
    const v = ref.current;
    if (!v) return;
    let cancelled = false;

    const startWithSound = async () => {
      if (cancelled || !v) return;
      v.muted = false;
      try {
        await v.play();
        if (!cancelled) setMuted(false);   // browser allowed sound
        return;
      } catch {
        // Blocked — play muted so the video is at least visible & moving.
        if (cancelled || !v) return;
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      }
    };
    startWithSound();

    // First real interaction anywhere unmutes the video automatically.
    const unmuteOnInteraction = () => {
      if (cancelled || !v || !v.muted) return;
      v.muted = false;
      setMuted(false);
      v.play().catch(() => {});
      removeListeners();
    };
    const events: (keyof DocumentEventMap)[] = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];
    const removeListeners = () => events.forEach(e =>
      document.removeEventListener(e, unmuteOnInteraction));
    events.forEach(e => document.addEventListener(e, unmuteOnInteraction, { passive: true }));

    const onVisible = () => { if (!document.hidden) v.play().catch(() => {}); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      removeListeners();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [embed, url]);

  if (embed) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          ref={frameRef}
          src={withEmbedAutoplay(embed)}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video rounded-2xl bg-black border-0"
          title={title}
        />
        {embedMuted && (
          <button
            onClick={unmuteEmbed}
            className="absolute top-3 right-3 inline-flex items-center gap-2 bg-black/70 hover:bg-black/85 text-white px-4 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm transition-all"
          >
            <VolumeX className="w-4 h-4" /> Tap for sound
          </button>
        )}
      </div>
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
