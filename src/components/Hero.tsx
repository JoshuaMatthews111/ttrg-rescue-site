"use client";

import { Play, Star, Shield, MapPin, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80"
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-a-dog-playing-at-the-park-2268/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: <Star className="w-3.5 h-3.5 text-gold fill-gold" />, text: "5-Star Google Reviews" },
            { icon: <Shield className="w-3.5 h-3.5 text-gold" />, text: "Veterinarian Approved" },
            { icon: <MapPin className="w-3.5 h-3.5 text-gold" />, text: "Serving 10 States Nationwide" },
          ].map((badge, i) => (
            <div
              key={i}
              className="glass flex items-center gap-2 px-4 py-2 rounded-full"
            >
              {badge.icon}
              <span className="text-white/90 text-xs font-[var(--font-body)] font-medium tracking-wide">
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Headline */}
        <h1 className="font-[var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          Transform Chaos
          <br />
          <span className="gradient-text">Into Confidence.</span>
        </h1>

        {/* Subheadline */}
        <p className="font-[var(--font-body)] text-lg sm:text-xl md:text-2xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Professional dog training that restores peace, obedience, and trust
          between you and your dog.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#contact"
            className="group bg-red hover:bg-red-light text-white px-8 py-4 rounded-full text-lg font-[var(--font-heading)] font-semibold tracking-wide transition-all hover:shadow-glow-red hover:scale-105 flex items-center gap-2"
          >
            Book Your Consultation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#testimonials"
            className="group glass text-white px-8 py-4 rounded-full text-lg font-[var(--font-heading)] font-medium tracking-wide transition-all hover:bg-white/15 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Watch Real Transformations
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {[
            { number: "10,000+", label: "Dogs Trained" },
            { number: "40+", label: "Years Experience" },
            { number: "10", label: "States Served" },
            { number: "100%", label: "All Breeds Welcome" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-[var(--font-heading)] font-bold text-white">
                {stat.number}
              </div>
              <div className="text-white/50 text-xs sm:text-sm font-[var(--font-body)] tracking-wider uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 animate-bounce">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
