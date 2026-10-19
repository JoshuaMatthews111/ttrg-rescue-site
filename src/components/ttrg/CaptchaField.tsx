"use client";

// The "I'm not a robot" box shown above every card form's pay button.
// The charge route rejects any payment without a solved challenge, so a
// challenge is single-use: call `reset()` after any failed attempt.

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import type {} from "altcha/types/react";

export type CaptchaHandle = { reset: () => void };

const CaptchaField = forwardRef<CaptchaHandle, { onChange: (payload: string | null) => void }>(
  function CaptchaField({ onChange }, ref) {
    const el = useRef<HTMLElement & { reset?: () => void }>(null);
    const cb = useRef(onChange);
    cb.current = onChange;

    useImperativeHandle(ref, () => ({
      reset: () => { el.current?.reset?.(); cb.current(null); },
    }));

    useEffect(() => {
      import("altcha");
      const node = el.current;
      if (!node) return;
      const handler = (e: Event) => {
        const { state, payload } = (e as CustomEvent<{ state: string; payload?: string }>).detail;
        cb.current(state === "verified" && payload ? payload : null);
      };
      node.addEventListener("statechange", handler);
      return () => node.removeEventListener("statechange", handler);
    }, []);

    return (
      <altcha-widget
        ref={el}
        challenge="/api/ttrg/captcha"
        suppressHydrationWarning
        style={{ "--altcha-max-width": "100%" } as React.CSSProperties}
      />
    );
  },
);

export default CaptchaField;
