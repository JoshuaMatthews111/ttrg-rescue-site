"use client";

// Fundraising progress shown to donors.
//
// Deliberately shows PERCENTAGE ONLY — the dollar goal never appears here,
// and the API that feeds it never sends the figure to the browser.

import { useEffect, useRef, useState } from "react";
import { Heart, Trophy } from "lucide-react";

const MILESTONES = [5, 25, 50, 75, 100];

export default function GoalProgress({
  dog,
  /** animate up from this value (used on the thank-you screen) */
  animateFrom,
  compact = false,
  className = "",
}: { dog?: string; animateFrom?: number; compact?: boolean; className?: string }) {
  const [percent, setPercent] = useState<number | null>(null);
  const [shown, setShown] = useState(animateFrom ?? 0);
  const raf = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const url = dog ? `/api/ttrg/progress?dog=${encodeURIComponent(dog)}` : "/api/ttrg/progress";
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled && d.ok) setPercent(d.percent); })
      .catch(() => {});
    return () => { cancelled = true; cancelAnimationFrame(raf.current); };
  }, [dog]);

  // Ease the bar up to its value so it always feels like movement.
  useEffect(() => {
    if (percent == null) return;
    const start = animateFrom ?? 0;
    const startedAt = performance.now();
    const duration = 1400;
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);      // ease-out-cubic
      setShown(start + (percent - start) * eased);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [percent, animateFrom]);

  if (percent == null) {
    return <div className={`h-3 rounded-full bg-slate-100 animate-pulse ${className}`} />;
  }

  const display = Math.round(shown * 10) / 10;
  const label = display >= 100 ? "Goal reached!" : `${display}% of our goal`;

  return (
    <div className={className}>
      <div className="flex items-end justify-between mb-2">
        <p className={`font-black text-[#1B2A4A] ${compact ? "text-sm" : "text-base"}`}>
          {compact ? "Progress" : "Progress to our goal"}
        </p>
        <p className={`font-black ${display >= 100 ? "text-emerald-600" : "text-[#C41E2A]"} ${compact ? "text-lg" : "text-2xl"}`}>
          {display}%
        </p>
      </div>

      {/* Bar + milestone markers */}
      <div className="relative">
        <div className={`${compact ? "h-3" : "h-4"} bg-slate-100 rounded-full overflow-hidden`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C41E2A] to-[#E8552F] transition-none"
            style={{ width: `${Math.max(display > 0 ? 1.5 : 0, display)}%` }}
          />
        </div>
        {MILESTONES.map(m => (
          <div key={m} className="absolute top-0 -translate-x-1/2" style={{ left: `${m}%` }} aria-hidden>
            <div className={`${compact ? "h-3" : "h-4"} w-0.5 ${display >= m ? "bg-white/70" : "bg-slate-300"}`} />
          </div>
        ))}
      </div>

      {/* Milestone labels */}
      <div className="relative mt-1.5 h-4">
        {MILESTONES.map(m => (
          <span
            key={m}
            className={`absolute -translate-x-1/2 text-[10px] font-bold ${display >= m ? "text-[#C41E2A]" : "text-slate-300"}`}
            style={{ left: `${m}%` }}
          >
            {m}%
          </span>
        ))}
      </div>

      {!compact && (
        <p className="text-xs text-[#1B2A4A]/50 mt-3 flex items-center gap-1.5">
          {display >= 100
            ? <><Trophy className="w-3.5 h-3.5 text-emerald-600" /> We made it — thank you!</>
            : <><Heart className="w-3.5 h-3.5 text-[#C41E2A]" /> {label} — every gift moves this bar.</>}
        </p>
      )}
    </div>
  );
}
