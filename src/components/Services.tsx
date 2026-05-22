"use client";

import {
  ArrowRight,
  GraduationCap,
  Brain,
  HeartHandshake,
  Target,
  Check,
} from "lucide-react";

const services = [
  {
    id: "basic-obedience",
    icon: <GraduationCap className="w-8 h-8" />,
    tag: "Foundation",
    title: "Basic Obedience",
    emotional: "Build a calm, confident, obedient companion your family can trust anywhere.",
    description:
      "Develops an essential line of communication and mutual respect. Your dog will learn to follow rules, respect boundaries, and respond reliably to commands.",
    benefits: [
      "Reliable sit, down, stay, and recall",
      "Polite leash walking",
      "Impulse control and focus",
      "Family-friendly manners",
    ],
    stats: { dogs: "5,000+", rate: "98%" },
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    reverse: false,
  },
  {
    id: "behavioral-modification",
    icon: <Brain className="w-8 h-8" />,
    tag: "Transformation",
    title: "Behavioral Modification",
    emotional: "Reclaim your peace of mind. We solve the behaviors other trainers can't.",
    description:
      "Designed for dogs with serious behavioral challenges like aggression, anxiety, fear, and reactivity. We address the root cause, not just the symptoms.",
    benefits: [
      "Aggression rehabilitation",
      "Anxiety and fear resolution",
      "Reactivity management",
      "Confidence rebuilding",
    ],
    stats: { dogs: "3,000+", rate: "95%" },
    image: "https://images.unsplash.com/photo-1558929996-da64ba858215?w=800&q=80",
    reverse: true,
  },
  {
    id: "service-dog",
    icon: <HeartHandshake className="w-8 h-8" />,
    tag: "Life-Changing",
    title: "Service Dog Training",
    emotional: "Give someone independence. Train a dog to change a life.",
    description:
      "Professional service dog training that teaches dogs to assist people by performing specific, life-enhancing tasks with reliability and precision.",
    benefits: [
      "Task-specific training",
      "Public access readiness",
      "Handler bonding & trust",
      "ADA compliance guidance",
    ],
    stats: { dogs: "500+", rate: "99%" },
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    reverse: false,
  },
  {
    id: "specialty",
    icon: <Target className="w-8 h-8" />,
    tag: "Elite",
    title: "Specialty Training",
    emotional: "Unlock your dog's full potential with advanced, purpose-driven training.",
    description:
      "Advanced training for higher-level control, confidence building, scent work, and specialized task skills. Perfect for families, working environments, and active lifestyles.",
    benefits: [
      "Advanced off-leash control",
      "Scent detection training",
      "Confidence building",
      "Environmental desensitization",
    ],
    stats: { dogs: "1,500+", rate: "97%" },
    image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80",
    reverse: true,
  },
];

function ServiceBlock({ service, index }: { service: (typeof services)[0]; index: number }) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
        index > 0 ? "mt-20 sm:mt-28" : ""
      }`}
    >
      <div className={`relative ${service.reverse ? "lg:order-2" : ""}`}>
        <div className="relative rounded-3xl overflow-hidden shadow-premium-lg group">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex gap-3">
            <div className="glass rounded-xl px-4 py-3 flex-1 text-center">
              <div className="text-white font-[var(--font-heading)] font-bold text-xl">{service.stats.dogs}</div>
              <div className="text-white/60 text-xs font-[var(--font-body)]">Dogs Trained</div>
            </div>
            <div className="glass rounded-xl px-4 py-3 flex-1 text-center">
              <div className="text-white font-[var(--font-heading)] font-bold text-xl">{service.stats.rate}</div>
              <div className="text-white/60 text-xs font-[var(--font-body)]">Success Rate</div>
            </div>
          </div>
        </div>
        <div
          className={`absolute -z-10 w-64 h-64 rounded-full bg-red/5 blur-3xl ${
            service.reverse ? "-right-16 -top-16" : "-left-16 -bottom-16"
          }`}
        />
      </div>

      <div className={`${service.reverse ? "lg:order-1" : ""}`}>
        <span className="inline-flex items-center gap-2 bg-red/10 text-red px-4 py-1.5 rounded-full text-sm font-[var(--font-body)] font-semibold tracking-wide mb-4">
          {service.icon}
          {service.tag}
        </span>

        <h3 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-navy mb-3">
          {service.title}
        </h3>

        <p className="font-[var(--font-heading)] text-xl sm:text-2xl text-navy/70 font-medium leading-snug mb-4">
          {service.emotional}
        </p>

        <p className="font-[var(--font-body)] text-navy/55 text-base leading-relaxed mb-6">
          {service.description}
        </p>

        <ul className="space-y-3 mb-8">
          {service.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="font-[var(--font-body)] text-navy/70 text-sm">{benefit}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="group inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-7 py-3.5 rounded-full font-[var(--font-heading)] font-semibold tracking-wide transition-all hover:shadow-lg hover:scale-105"
        >
          Book Consultation
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block text-red text-sm font-[var(--font-body)] font-semibold tracking-[0.2em] uppercase mb-4">
            Our Programs
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6">
            Training Programs Designed
            <br className="hidden sm:block" /> for{" "}
            <span className="text-red">Real Results</span>
          </h2>
          <p className="font-[var(--font-body)] text-navy/60 text-lg max-w-2xl mx-auto">
            Every dog is different. That&apos;s why we offer customized programs tailored to your dog&apos;s unique needs, temperament, and goals.
          </p>
        </div>

        {services.map((service, i) => (
          <ServiceBlock key={service.id} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
