"use client";

import { ArrowRight, Phone, Calendar } from "lucide-react";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80"
          alt="Happy dog and family"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/95 via-navy/90 to-navy-dark/95" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,43,43,0.1)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-0.5 bg-red mx-auto mb-8" />

        <span className="inline-block text-gold text-sm font-[var(--font-body)] font-semibold tracking-[0.2em] uppercase mb-6">
          Take the First Step
        </span>

        <h2 className="font-[var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Your Dog&apos;s Transformation
          <br className="hidden sm:block" />{" "}
          <span className="gradient-text">Starts Today.</span>
        </h2>

        <p className="font-[var(--font-body)] text-white/65 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Book a consultation and experience the difference professional training
          can make. Your family deserves peace. Your dog deserves the best.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href="tel:8664364959"
            className="group bg-red hover:bg-red-light text-white px-10 py-4 rounded-full text-lg font-[var(--font-heading)] font-bold tracking-wide transition-all hover:shadow-glow-red hover:scale-105 flex items-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            Schedule Consultation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="tel:8664364959"
            className="group glass text-white px-8 py-4 rounded-full text-lg font-[var(--font-heading)] font-medium tracking-wide transition-all hover:bg-white/15 flex items-center gap-3"
          >
            <Phone className="w-5 h-5" />
            (866) 436-4959
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm font-[var(--font-body)]">
          <span>Free Consultation</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>No Obligation</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>All Breeds Welcome</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Nationwide Service</span>
        </div>
      </div>
    </section>
  );
}
