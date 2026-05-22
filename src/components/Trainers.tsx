"use client";

import { Award, Shield, Clock, Star, BadgeCheck } from "lucide-react";

const trainers = [
  {
    name: "Lorenzo",
    title: "Founder & Head Trainer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    experience: "40+ Years",
    specialty: "Behavioral Rehabilitation",
    certifications: ["National-Level Certified", "Master Dog Trainer", "Behavioral Specialist"],
    bio: "With over four decades of experience, Lorenzo has dedicated his life to transforming the relationships between dogs and their families. His methods combine proven science with compassionate understanding.",
  },
  {
    name: "Training Director",
    title: "Lead Training Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
    experience: "20+ Years",
    specialty: "Service Dog Training",
    certifications: ["Certified Professional Trainer", "Service Dog Specialist", "AKC Evaluator"],
    bio: "Leading our team of professional trainers with a focus on service dog preparation and advanced obedience, ensuring every dog reaches its full potential.",
  },
  {
    name: "Behavioral Specialist",
    title: "Senior Behavioral Consultant",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    experience: "15+ Years",
    specialty: "Anxiety & Aggression",
    certifications: ["Certified Behaviorist", "Fear-Free Certified", "Canine Psychology Expert"],
    bio: "Specializing in the most challenging cases — aggression, severe anxiety, and fear-based behaviors. Known for patience and breakthrough results with dogs others have given up on.",
  },
];

export default function Trainers() {
  return (
    <section id="trainers" className="relative py-24 sm:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,43,43,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,83,0.05)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block text-gold text-sm font-[var(--font-body)] font-semibold tracking-[0.2em] uppercase mb-4">
            Elite Professionals
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Meet the Team Behind
            <br className="hidden sm:block" />{" "}
            <span className="gradient-text">the Transformations</span>
          </h2>
          <p className="font-[var(--font-body)] text-white/55 text-lg max-w-2xl mx-auto">
            National-level trainers with decades of experience. Elite expertise with a family-friendly approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div key={trainer.name} className="group">
              <div className="glass rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/10">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="glass rounded-full p-2">
                      <Award className="w-4 h-4 text-gold" />
                    </div>
                    <div className="glass rounded-full p-2">
                      <Shield className="w-4 h-4 text-gold" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 glass rounded-full px-4 py-2 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span className="text-white text-xs font-[var(--font-body)] font-semibold">
                      {trainer.experience}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-[var(--font-heading)] text-white font-bold text-xl">
                      {trainer.name}
                    </h3>
                    <BadgeCheck className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-white/50 text-sm font-[var(--font-body)] mb-3">
                    {trainer.title}
                  </p>
                  <p className="text-white/40 text-sm font-[var(--font-body)] leading-relaxed mb-4">
                    {trainer.bio}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-red" />
                    <span className="text-white/70 text-sm font-[var(--font-body)] font-medium">
                      {trainer.specialty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="text-[10px] font-[var(--font-body)] text-white/50 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 glass rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "40+", label: "Years Combined Experience" },
              { value: "10,000+", label: "Dogs Successfully Trained" },
              { value: "10", label: "States Served" },
              { value: "All", label: "Breeds & Temperaments" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs sm:text-sm font-[var(--font-body)] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
