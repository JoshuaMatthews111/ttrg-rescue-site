"use client";

import {
  AlertTriangle,
  Volume2,
  Frown,
  Zap,
  Users,
  ShieldAlert,
  Dog,
  Heart,
} from "lucide-react";

const painPoints = [
  { icon: <Zap className="w-6 h-6" />, text: "Pulling on the leash", detail: "Every walk feels like a battle" },
  { icon: <ShieldAlert className="w-6 h-6" />, text: "Aggression issues", detail: "You're afraid they might hurt someone" },
  { icon: <Volume2 className="w-6 h-6" />, text: "Nonstop barking", detail: "Your neighbors are losing patience" },
  { icon: <AlertTriangle className="w-6 h-6" />, text: "Severe anxiety", detail: "Destructive when left alone" },
  { icon: <Dog className="w-6 h-6" />, text: "Jumping on everyone", detail: "Guests dread visiting" },
  { icon: <Frown className="w-6 h-6" />, text: "Ignoring commands", detail: "Nothing seems to work" },
  { icon: <Users className="w-6 h-6" />, text: "Embarrassment in public", detail: "You avoid taking them out" },
  { icon: <Heart className="w-6 h-6" />, text: "Fear of losing your dog", detail: "You've considered rehoming" },
];

export default function PainPoints() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-dark to-navy opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,43,43,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-red text-sm font-[var(--font-body)] font-semibold tracking-[0.2em] uppercase mb-4">
            We Understand Your Struggle
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Are You Feeling{" "}
            <span className="text-red">Frustrated</span>
            <br className="hidden sm:block" /> With Your Dog?
          </h2>
          <p className="font-[var(--font-body)] text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            You&apos;re not alone. Thousands of dog owners feel the same way before they find us.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-red/15 flex items-center justify-center mb-4 text-red group-hover:bg-red group-hover:text-white transition-all">
                {point.icon}
              </div>
              <h3 className="font-[var(--font-heading)] text-white font-semibold text-base mb-1">
                {point.text}
              </h3>
              <p className="font-[var(--font-body)] text-white/45 text-sm leading-relaxed">
                {point.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-red/40 to-transparent mx-auto mb-8" />
          <h3 className="font-[var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            You don&apos;t have to live{" "}
            <span className="text-red">stressed</span> anymore.
          </h3>
          <p className="font-[var(--font-body)] text-white/60 text-lg max-w-xl mx-auto mb-8">
            Over 40 years, we&apos;ve helped thousands of families just like yours turn chaos into calm.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden mb-3 border-2 border-red/30 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1558929996-da64ba858215?w=400&q=80"
                  alt="Stressed dog before training"
                  className="w-full h-full object-cover grayscale"
                  loading="lazy"
                />
              </div>
              <span className="text-red/70 text-sm font-[var(--font-body)] font-medium uppercase tracking-wider">Before</span>
            </div>

            <div className="w-12 h-12 rounded-full bg-red flex items-center justify-center shadow-glow-red">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden mb-3 border-2 border-green-400/30 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80"
                  alt="Happy dog after training"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-green-400/70 text-sm font-[var(--font-body)] font-medium uppercase tracking-wider">After</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
