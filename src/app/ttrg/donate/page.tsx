"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart, Shield, Stethoscope, GraduationCap, Home, PawPrint, CheckCircle2,
  Phone, Mail, Truck, Sparkles, Utensils, Activity, AlertTriangle, Award,
  Building2, ArrowRight, DollarSign,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  );
}

const donationOptions = [
  { amount: 25, label: "Feed a Rescue", desc: "Provides nutritious meals for one dog for a week", icon: PawPrint },
  { amount: 50, label: "Basic Medical Care", desc: "Covers flea treatment, deworming, and basic vet needs", icon: Stethoscope },
  { amount: 100, label: "Vet & Nutrition", desc: "Specialized food, supplements, and veterinary support", icon: Shield },
  { amount: 250, label: "Training & Rehab", desc: "Funds a full week of professional rehabilitation training", icon: GraduationCap },
  { amount: 500, label: "Surgery Fund", desc: "Helps cover emergency or corrective surgery for injured dogs", icon: Heart },
  { amount: 1000, label: "Full Sponsorship", desc: "Covers an entire month of care, training, and housing", icon: Home },
];

const rescueCosts = [
  { icon: Truck, label: "Shelter Pull + Transport", cost: "$150 – $500" },
  { icon: Stethoscope, label: "Vet Exam, Meds, Buffer", cost: "$1,000 – $3,000" },
  { icon: Sparkles, label: "Grooming + Microchip", cost: "$150 – $300" },
  { icon: Utensils, label: "Supplies", cost: "$400 – $800" },
  { icon: Home, label: "Boarding (45 days)", cost: "$3,375" },
  { icon: GraduationCap, label: "Training", cost: "$3,500" },
  { icon: Activity, label: "Marketing", cost: "$200 – $500" },
  { icon: Shield, label: "Admin / Legal", cost: "$150 – $300" },
  { icon: AlertTriangle, label: "Contingency", cost: "$500 – $2,000" },
];

const sponsorTiers = [
  { name: "Supporter", price: 25, impact: "Feeds a dog", icon: Utensils, popular: false },
  { name: "Care Partner", price: 50, impact: "Daily care + supplies", icon: PawPrint, popular: false },
  { name: "Health Sponsor", price: 100, impact: "Medical support", icon: Stethoscope, popular: true },
  { name: "Training Sponsor", price: 250, impact: "Training + rehabilitation", icon: GraduationCap, popular: false },
  { name: "Transformation Partner", price: 500, impact: "Full journey support", icon: Heart, popular: false },
  { name: "Inner Circle", price: 1000, impact: "Major impact + expansion", icon: Award, popular: false },
];

const missionTiers = [
  { tier: "Foundation", amount: 50, supports: "Utilities" },
  { tier: "Facility", amount: 250, supports: "Maintenance" },
  { tier: "Operations", amount: 500, supports: "Daily care systems" },
  { tier: "Mission Partner", amount: 1000, supports: "Monthly support" },
  { tier: "Expansion Sponsor", amount: 2500, supports: "Facility builds & expansion" },
];

export default function DonatePage() {
  const [selected, setSelected] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [donationType, setDonationType] = useState<"monthly" | "once">("monthly");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Thank You!</h1>
          <p className="text-[#1B2A4A]/60 mb-6">Your generous donation helps rescue, rehabilitate, and rehome dogs in need. You&apos;re making a real difference.</p>
          <p className="text-sm text-[#1B2A4A]/40 mb-4">Our team will follow up with you shortly to complete your donation.</p>
          <p className="text-sm text-[#1B2A4A]/40 mb-8">Questions? Call <a href="tel:+18664364959" className="text-[#C41E2A] font-semibold">(866) 436-4959</a> or email <a href="mailto:Teamtrainersrescue@gmail.com" className="text-[#C41E2A] font-semibold">Teamtrainersrescue@gmail.com</a></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ttrg/sponsor" className="bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
              Sponsor a Dog
            </Link>
            <Link href="/ttrg" className="border border-slate-200 text-[#1B2A4A] px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Support the Mission</h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
            Every dollar goes directly toward rescuing, rehabilitating, and rehoming dogs in need. Your generosity saves lives.
          </p>
          <p className="text-white/30 text-sm mt-3">Team Trainers Rescue Group · 501(c)(3)</p>
        </div>
      </section>

      {/* ═══ A. DONATION FORM ═══ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#1B2A4A] text-center mb-8">Make a Donation</h2>

          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#FAFAF8] rounded-full p-1 border border-slate-100 inline-flex">
              <button onClick={() => setDonationType("monthly")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${donationType === "monthly" ? "bg-[#C41E2A] text-white shadow" : "text-[#1B2A4A]/60"}`}>
                Monthly
              </button>
              <button onClick={() => setDonationType("once")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${donationType === "once" ? "bg-[#C41E2A] text-white shadow" : "text-[#1B2A4A]/60"}`}>
                One-Time
              </button>
            </div>
          </div>

          {/* Amount Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {donationOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => { setSelected(opt.amount); setCustom(""); }}
                className={`rounded-2xl p-5 text-left transition-all border ${selected === opt.amount ? "bg-[#C41E2A] border-[#C41E2A] text-white shadow-lg" : "bg-white border-slate-200 hover:border-[#C41E2A]/40"}`}
              >
                <opt.icon className={`w-5 h-5 mb-2 ${selected === opt.amount ? "text-white" : "text-[#C41E2A]"}`} />
                <p className="text-2xl font-bold">${opt.amount}</p>
                <p className={`text-xs font-semibold mt-1 ${selected === opt.amount ? "text-white/80" : "text-[#1B2A4A]"}`}>{opt.label}</p>
                <p className={`text-[10px] mt-1 leading-relaxed ${selected === opt.amount ? "text-white/60" : "text-[#1B2A4A]/40"}`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          {/* Custom */}
          <div className="mb-8">
            <input
              type="number"
              placeholder="Enter custom amount ($)"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
              className="w-full h-12 px-5 rounded-xl border border-slate-200 text-[#1B2A4A] text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 focus:border-[#C41E2A]/40"
            />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" required className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <input type="text" placeholder="Last Name" required className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <input type="email" placeholder="Email Address" required className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <input type="tel" placeholder="Phone (optional)" className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />

            {/* Contact info */}
            <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-slate-100">
              <div className="text-center mb-4">
                <Heart className="w-8 h-8 text-[#C41E2A] mx-auto mb-2" />
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">Ready to Give?</h3>
                <p className="text-sm text-[#1B2A4A]/50">To finalize your donation today, contact TTRG directly:</p>
              </div>
              <div className="space-y-3">
                <a href="tel:+18664364959" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#C41E2A]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-[#C41E2A]" /></div>
                  <div><p className="text-sm font-semibold text-[#1B2A4A]">Call Us</p><p className="text-xs text-[#1B2A4A]/50">(866) 436-4959</p></div>
                </a>
                <a href="mailto:Teamtrainersrescue@gmail.com" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#C41E2A]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-[#C41E2A]" /></div>
                  <div><p className="text-sm font-semibold text-[#1B2A4A]">Email Us</p><p className="text-xs text-[#1B2A4A]/50">Teamtrainersrescue@gmail.com</p></div>
                </a>
                <a href="https://www.facebook.com/TeamTrainersRescueGroup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#C41E2A]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0"><FacebookIcon className="w-5 h-5 text-[#C41E2A]" /></div>
                  <div><p className="text-sm font-semibold text-[#1B2A4A]">Facebook</p><p className="text-xs text-[#1B2A4A]/50">Message us on Facebook</p></div>
                </a>
              </div>
              <p className="text-[11px] text-[#1B2A4A]/30 text-center mt-4">Secure online giving will be available once the approved payment processor is integrated.</p>
            </div>

            <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-4 rounded-xl text-base font-bold transition-colors flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 fill-white" />
              SUBMIT DONATION INTEREST — ${custom || selected || 50} {donationType === "monthly" ? "/ MONTH" : ""}
            </button>
          </form>
        </div>
      </section>

      {/* ═══ B. COST TRANSPARENCY ═══ */}
      <section className="py-14 sm:py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">How Your Donation Makes a Difference</h2>
            <p className="text-[#1B2A4A]/50 text-sm mt-2 max-w-xl mx-auto">It costs approximately <strong className="text-[#C41E2A]">$10,000</strong> to fully rescue, rehabilitate, and rehome one dog. Here&apos;s where every dollar goes:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rescueCosts.map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#C41E2A]" />
                </div>
                <div>
                  <p className="font-bold text-[#1B2A4A] text-sm">{item.label}</p>
                  <p className="text-[#C41E2A] font-black text-lg">{item.cost}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-[#1B2A4A] text-white px-6 py-3 rounded-full text-sm font-bold">
              <DollarSign className="w-4 h-4" /> Total Target Per Dog: ~$10,000
            </div>
          </div>
        </div>
      </section>

      {/* ═══ C. MONTHLY SPONSORSHIP TIERS ═══ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">Monthly Sponsorship</h2>
            <p className="text-[#1B2A4A]/50 text-sm mt-2">Ongoing support that makes lasting change. Choose a tier that fits your heart.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sponsorTiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-3xl border p-7 transition-all hover:shadow-xl ${tier.popular ? "border-[#C41E2A] bg-[#FFF8F8] shadow-lg" : "border-slate-100 bg-white"}`}>
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C41E2A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</span>
                )}
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] flex items-center justify-center mb-4">
                  <tier.icon className="w-6 h-6 text-[#C41E2A]" />
                </div>
                <p className="text-sm font-bold text-[#1B2A4A]/50 uppercase tracking-wider">{tier.name}</p>
                <p className="text-4xl font-black text-[#1B2A4A] mt-1">${tier.price}<span className="text-base font-medium text-[#1B2A4A]/40">/mo</span></p>
                <p className="text-sm text-[#1B2A4A]/60 mt-2 mb-6">{tier.impact}</p>
                <Link href="/ttrg/contact" className={`block text-center py-3 rounded-xl text-sm font-bold transition-colors ${tier.popular ? "bg-[#C41E2A] hover:bg-[#A01825] text-white" : "border border-slate-200 text-[#1B2A4A] hover:bg-slate-50"}`}>
                  Become a {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ D. MISSION SUPPORT TIERS ═══ */}
      <section className="py-14 sm:py-16 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Help Us Keep the Mission Moving</h2>
            <p className="text-white/50 text-sm mt-2 max-w-lg mx-auto">Support the system that saves dogs. Your contribution keeps our facility, operations, and rescue infrastructure running.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {missionTiers.map((t) => (
              <div key={t.tier} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all text-center">
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{t.tier}</p>
                <p className="text-3xl font-black text-white mt-2">${t.amount.toLocaleString()}</p>
                <p className="text-white/40 text-xs mt-2">{t.supports}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ E. CORPORATE GIVING ═══ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="w-12 h-12 text-[#1B2A4A] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] mb-3">Partner With TTRG</h2>
          <p className="text-[#1B2A4A]/50 text-base max-w-lg mx-auto mb-8">
            Businesses can make a meaningful impact through corporate sponsorship, event partnerships, and community giving initiatives.
          </p>
          <Link href="/ttrg/contact" className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-8 py-4 rounded-full text-sm font-bold transition-all">
            Contact Us About Corporate Giving <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <p className="text-[11px] text-slate-400 text-center pb-8">
        Team Trainers Rescue Group · 501(c)(3) · Tax information available upon request.
      </p>
    </div>
  );
}
