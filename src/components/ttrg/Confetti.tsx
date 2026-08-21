"use client";

// Small self-contained confetti burst for the donation thank-you.
// Written in-house rather than pulling a library: it is ~60 lines, adds no
// bundle weight, and needs no external script (which the site's CSP blocks).

import { useEffect, useRef } from "react";

const COLORS = ["#C41E2A", "#E8552F", "#F5B841", "#1B2A4A", "#2E9E5B", "#FFFFFF"];

export default function Confetti({ fire = true, pieces = 140 }: { fire?: boolean; pieces?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect a visitor who has asked for reduced motion.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const parts = Array.from({ length: pieces }, () => ({
      x: w() / 2 + (Math.random() - 0.5) * w() * 0.5,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4,
      size: 5 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    }));

    let frame = 0;
    let raf = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.12;                 // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vx *= 0.995;
        if (p.y < canvas.offsetHeight + 40) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 260);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (alive && frame < 260) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [fire, pieces]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] w-full h-full"
      aria-hidden
    />
  );
}
