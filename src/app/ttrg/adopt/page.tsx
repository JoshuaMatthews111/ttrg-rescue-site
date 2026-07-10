"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart, HandHeart, CheckCircle2, Phone, Mail, ArrowRight,
  ChevronDown, Shield, PawPrint, Home, Users, HelpCircle,
} from "lucide-react";
import { addFosterApplication, type FosterApplication } from "@/lib/admin-store";

const adoptBenefits = [
  { icon: Shield, title: "Fully Vetted", desc: "Every dog is spayed/neutered, vaccinated, microchipped, and health-cleared." },
  { icon: PawPrint, title: "Training Support", desc: "Adoption includes guidance from our certified trainers for a smooth transition." },
  { icon: Home, title: "Lifetime Support", desc: "We're always here if you need help — our support doesn't end at adoption." },
  { icon: Users, title: "Perfect Match", desc: "We carefully match dogs to families based on lifestyle, experience, and temperament." },
];

const adoptSteps = [
  { num: 1, title: "Browse Dogs", desc: "View our available dogs and find one that fits your family." },
  { num: 2, title: "Apply", desc: "Fill out the adoption application below." },
  { num: 3, title: "Interview", desc: "We schedule a brief call to learn about your home and lifestyle." },
  { num: 4, title: "Meet & Greet", desc: "Meet your potential new family member in person." },
  { num: 5, title: "Welcome Home", desc: "Finalize adoption and bring your new dog home with full support." },
];

const faqs = [
  { q: "What is the adoption fee?", a: "Adoption fees vary by dog but typically range from $150–$400. This covers spay/neuter, vaccinations, microchip, and initial vet care." },
  { q: "How long does the process take?", a: "Most adoptions are completed within 1–2 weeks after application submission." },
  { q: "Can I adopt if I rent?", a: "Yes! We just need written landlord approval confirming pets are allowed." },
  { q: "What if it doesn't work out?", a: "We have a return policy. If the match doesn't work, we take the dog back — no questions asked." },
];

export default function AdoptPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", cityState: "",
    housingType: "", rentOrOwn: "", currentPets: "", dogExperience: "",
    childrenInHome: "", preferredSize: "", reason: "", consent: false,
  });
  const u = (field: string, val: string | boolean) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app: FosterApplication = {
      id: "AA-" + Date.now().toString(36).toUpperCase(),
      firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
      cityState: form.cityState, housingType: form.housingType, rentOrOwn: form.rentOrOwn,
      currentPets: form.currentPets, dogExperience: form.dogExperience, childrenInHome: form.childrenInHome,
      preferredSize: form.preferredSize, availability: "adoption", reason: form.reason,
      consent: form.consent, status: "pending",
      date: new Date().toISOString().split("T")[0], actionBy: "",
    };
    addFosterApplication(app);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Adoption Application Received!</h1>
        <p className="text-[#1B2A4A]/60 mb-4">Thank you for your interest in adopting. We&apos;ll review your application and contact you within 48 hours.</p>
        <div className="text-sm text-[#1B2A4A]/40 space-y-1 mb-6">
          <p className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-[#C41E2A]" /><a href="tel:+18664364959" className="hover:text-[#C41E2A]">(866) 436-4959</a></p>
          <p className="flex items-center justify-center gap-2"><Mail className="w-4 h-4 text-[#C41E2A]" /><a href="mailto:info@teamtrainersrescuegroup.com" className="hover:text-[#C41E2A]">info@teamtrainersrescuegroup.com</a></p>
        </div>
        <Link href="/ttrg/sponsor" className="text-[#C41E2A] font-semibold hover:underline">View Available Dogs →</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <HandHeart className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Adopt a Dog</h1>
          <p className="text-white/60 max-w-lg mx-auto text-base">Give a rescue dog a permanent, loving home. Every adoption opens a spot to save the next dog waiting.</p>
        </div>
      </section>

      {/* What Adoption Means */}
      <section className="py-14 sm:py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">What You Get When You Adopt</h2>
            <p className="text-[#1B2A4A]/50 text-sm mt-2 max-w-xl mx-auto">Adopting from TTRG means you get a fully prepared, healthy, trained dog — and a support system for life.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {adoptBenefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#FFF0F0] flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-[#C41E2A]" />
                </div>
                <h3 className="font-bold text-[#1B2A4A] text-sm mb-1.5">{b.title}</h3>
                <p className="text-xs text-[#1B2A4A]/50 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">How the Adoption Process Works</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-[#C41E2A]/10" />
            <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-3">
              {adoptSteps.map((s) => (
                <div key={s.num} className="flex md:flex-col items-center gap-3 md:text-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#C41E2A] text-white flex items-center justify-center text-sm font-black flex-shrink-0 shadow-md relative z-10">
                    {s.num}
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2A4A] text-sm">{s.title}</p>
                    <p className="text-xs text-[#1B2A4A]/50 mt-1 max-w-[180px]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ttrg/sponsor" className="inline-flex items-center gap-2 border-2 border-[#C41E2A] text-[#C41E2A] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#C41E2A] hover:text-white transition-all">
              <PawPrint className="w-4 h-4" /> Browse Available Dogs
            </Link>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-500/20"
              >
                <Heart className="w-4 h-4 fill-white" /> Start Adoption Application <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-16 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#1B2A4A]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#C41E2A] flex-shrink-0" />
                    <span className="font-bold text-[#1B2A4A] text-sm">{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#1B2A4A]/40 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm text-[#1B2A4A]/60 leading-relaxed pl-8">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      {showForm && (
        <section className="py-12 sm:py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-[#1B2A4A]">Adoption Application</h2>
              <p className="text-sm text-[#1B2A4A]/50 mt-1">Takes about 5 minutes. We&apos;ll be in touch within 48 hours.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <h2 className="text-lg font-bold text-[#1B2A4A]">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name *" required value={form.firstName} onChange={(e) => u("firstName", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                <input type="text" placeholder="Last Name *" required value={form.lastName} onChange={(e) => u("lastName", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              </div>
              <input type="email" placeholder="Email *" required value={form.email} onChange={(e) => u("email", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <input type="tel" placeholder="Phone *" required value={form.phone} onChange={(e) => u("phone", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <input type="text" placeholder="City, State *" required value={form.cityState} onChange={(e) => u("cityState", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />

              <h2 className="text-lg font-bold text-[#1B2A4A] pt-2">Home & Lifestyle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={form.housingType} onChange={(e) => u("housingType", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                  <option value="">Housing Type</option>
                  <option>House with yard</option>
                  <option>House without yard</option>
                  <option>Apartment/Condo</option>
                  <option>Townhouse</option>
                </select>
                <select value={form.rentOrOwn} onChange={(e) => u("rentOrOwn", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                  <option value="">Rent or Own</option>
                  <option>Own</option>
                  <option>Rent</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Current pets (type & number)" value={form.currentPets} onChange={(e) => u("currentPets", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                <input type="text" placeholder="Children in home (ages)" value={form.childrenInHome} onChange={(e) => u("childrenInHome", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              </div>
              <select value={form.preferredSize} onChange={(e) => u("preferredSize", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Preferred Dog Size</option>
                <option>Small (under 25 lbs)</option>
                <option>Medium (25-50 lbs)</option>
                <option>Large (50+ lbs)</option>
                <option>Any size</option>
              </select>
              <textarea placeholder="Previous experience with dogs *" rows={3} required value={form.dogExperience} onChange={(e) => u("dogExperience", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
              <textarea placeholder="Why do you want to adopt? *" rows={3} required value={form.reason} onChange={(e) => u("reason", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required checked={form.consent} onChange={(e) => u("consent", e.target.checked)} className="mt-1 rounded" />
                <span className="text-xs text-[#1B2A4A]/50">I confirm this information is accurate and I agree to be contacted by Team Trainers Rescue Group regarding adoption. I understand all adoptions are subject to review.</span>
              </label>

              <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 fill-white" /> SUBMIT ADOPTION APPLICATION
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
