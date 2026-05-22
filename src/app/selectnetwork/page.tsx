"use client";

import { useState } from "react";
import { Globe, Users, TrendingUp, Briefcase, ArrowRight, Star, ChevronRight, Phone, Mail, MapPin, Shield, Zap, Target, Award, LayoutDashboard, ExternalLink, X, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Network",
    desc: "Connect with entrepreneurs, investors, and professionals across industries worldwide.",
  },
  {
    icon: Briefcase,
    title: "Business Opportunities",
    desc: "Access exclusive deals, partnerships, and investment opportunities curated for members.",
  },
  {
    icon: TrendingUp,
    title: "Growth Accelerator",
    desc: "Tools, mentorship, and resources designed to scale your business to the next level.",
  },
  {
    icon: Shield,
    title: "Vetted Members",
    desc: "Every member is verified and approved, ensuring quality connections and trusted partnerships.",
  },
];

const networkStats = [
  { label: "Active Members", value: "2,400+", icon: Users },
  { label: "Businesses Connected", value: "850+", icon: Briefcase },
  { label: "Deals Closed", value: "$14M+", icon: TrendingUp },
  { label: "Industries", value: "40+", icon: Globe },
];

const testimonials = [
  {
    name: "Marcus Chen",
    role: "CEO, TechVenture Capital",
    quote: "Select Network connected me with three key partners who helped scale my portfolio by 300%.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Sarah Williams",
    role: "Founder, GreenScale Industries",
    quote: "The quality of connections here is unmatched. Every introduction has led to meaningful business.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "David Park",
    role: "Managing Partner, Apex Holdings",
    quote: "This isn't just networking — it's an ecosystem built for serious growth and real results.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
];

const membershipTiers = [
  {
    name: "Connect",
    price: "$49",
    period: "/month",
    desc: "For professionals looking to expand their network",
    features: ["Member directory access", "Monthly virtual events", "Basic profile listing", "Community forums", "Email newsletter"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Collaborate",
    price: "$149",
    period: "/month",
    desc: "For entrepreneurs ready to accelerate growth",
    features: ["Everything in Connect", "Priority introductions", "Quarterly masterminds", "Business listing spotlight", "Investor access", "1-on-1 strategy sessions"],
    cta: "Join Now",
    featured: true,
  },
  {
    name: "Elevate",
    price: "$499",
    period: "/month",
    desc: "For leaders building industry-changing ventures",
    features: ["Everything in Collaborate", "Executive roundtables", "Deal flow access", "White-glove concierge", "Annual summit VIP", "Board placement support", "Custom introductions"],
    cta: "Apply Now",
    featured: false,
  },
];

export default function SelectNetworkPage() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C] flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wider">SELECT NETWORK</p>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase">Connect · Collaborate · Elevate</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["About", "Membership", "Events", "Directory", "Resources", "Contact"].map((link) => (
              <a key={link} href="#" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden sm:block text-white/60 hover:text-white text-sm font-medium transition-colors">
              Sign In
            </a>
            <a href="#" className="bg-[#C9A84C] hover:bg-[#d4b65e] text-[#1a1a2e] px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105">
              Apply for Membership
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[#1a1a2e]">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 30% 50%, #C9A84C, transparent 50%), radial-gradient(ellipse at 70% 60%, #4A90D9, transparent 50%)" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Star className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-white/60 text-sm">The Premier Business Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Where Ambition Meets
            <br />
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#4A90D9] bg-clip-text text-transparent">
              Opportunity
            </span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            An exclusive network connecting entrepreneurs, investors, and visionaries. Built for growth. Designed for impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="group bg-[#C9A84C] hover:bg-[#d4b65e] text-[#1a1a2e] px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 flex items-center gap-3">
              Apply for Membership
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#" className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium border border-white/10 transition-all flex items-center gap-3">
              <Globe className="w-5 h-5" />
              Explore Network
            </a>
          </div>
          {/* Trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-white/30 text-sm">
            <span>Forbes Featured</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Inc. 5000 Network</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>500+ Five-Star Reviews</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {networkStats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#F5F5F7] border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e]/5 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-[#1a1a2e]" />
                </div>
                <p className="text-3xl font-bold text-[#1a1a2e]">{stat.value}</p>
                <p className="text-sm text-[#1a1a2e]/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Why Select Network</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] leading-tight">
              Built for <span className="text-[#4A90D9]">Serious Growth</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{feature.title}</h3>
                <p className="text-[#1a1a2e]/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] leading-tight">
              Trusted by <span className="text-[#C9A84C]">Leaders</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#F5F5F7] rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-[#1a1a2e]/70 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-[#1a1a2e]">{t.name}</p>
                    <p className="text-xs text-[#1a1a2e]/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Membership</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Choose Your <span className="text-[#C9A84C]">Path</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membershipTiers.map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-8 border ${tier.featured ? "bg-[#C9A84C]/10 border-[#C9A84C]/30 scale-105" : "bg-white/5 border-white/10"} transition-all hover:scale-105`}>
                {tier.featured && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#C9A84C] text-[#1a1a2e] px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-white/40 text-sm mb-4">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-white/40 text-sm">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/60 text-sm">
                      <ChevronRight className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${tier.featured ? "bg-[#C9A84C] text-[#1a1a2e] hover:bg-[#d4b65e]" : "bg-white/10 text-white hover:bg-white/20 border border-white/10"}`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] leading-tight mb-6">
            Ready to <span className="bg-gradient-to-r from-[#C9A84C] to-[#4A90D9] bg-clip-text text-transparent">Elevate</span>?
          </h2>
          <p className="text-[#1a1a2e]/60 text-lg max-w-2xl mx-auto mb-10">
            Join a network of leaders who are building the future. Applications are reviewed within 48 hours.
          </p>
          <a href="#" className="inline-flex items-center gap-3 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105">
            Apply for Membership
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-[#C9A84C]" />
                <div>
                  <p className="text-white font-bold text-sm tracking-wider">SELECT NETWORK</p>
                  <p className="text-white/30 text-[9px] tracking-[0.2em]">Connect · Collaborate · Elevate</p>
                </div>
              </div>
              <p className="text-white/30 text-sm leading-relaxed">
                A premium business network built for growth and opportunity.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Network</p>
              {["About", "Membership", "Events", "Directory", "Resources"].map((link) => (
                <a key={link} href="#" className="block text-white/30 hover:text-white text-sm py-1.5 transition-colors">{link}</a>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Resources</p>
              {["Blog", "Podcast", "Case Studies", "Partnerships", "Press"].map((link) => (
                <a key={link} href="#" className="block text-white/30 hover:text-white text-sm py-1.5 transition-colors">{link}</a>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Contact</p>
              <div className="space-y-3 text-white/30 text-sm">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> (800) 555-0199</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@selectnetwork.com</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Global</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-8 text-center">
            <p className="text-white/20 text-xs">© 2026 Select Network. All rights reserved. A TLM Enterprises Organization.</p>
          </div>
        </div>
      </footer>

      {/* Admin Toggle */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
        {adminOpen && (
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 p-4 w-64">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-white tracking-wide">TLM Enterprises</p>
              <button onClick={() => setAdminOpen(false)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1.5">
              <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm">
                <LayoutDashboard className="w-4 h-4" /> Master Dashboard
              </a>
              <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm">
                <ExternalLink className="w-4 h-4" /> Lorenzo&apos;s Site
              </a>
              <a href="/ttrg" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm">
                <ExternalLink className="w-4 h-4" /> TTRG Site
              </a>
            </div>
          </div>
        )}
        <button onClick={() => setAdminOpen(!adminOpen)} className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${adminOpen ? "bg-white text-[#0f172a]" : "bg-[#0f172a] text-white border border-white/10"}`}>
          {adminOpen ? <X className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
