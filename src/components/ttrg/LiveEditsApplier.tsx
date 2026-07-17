"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchLiveEdits, applyLiveEdits } from "@/lib/live-edits";

// Applies published site-builder edits on every page view. Retries a few
// times because parts of the page render after async data loads.
export default function LiveEditsApplier() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetchLiveEdits().then(edits => {
      if (cancelled || edits.length === 0) return;
      const run = () => applyLiveEdits(edits, document, pathname);
      run();
      const timers = [400, 1200, 3000].map(ms => setTimeout(run, ms));
      return () => timers.forEach(clearTimeout);
    });
    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
