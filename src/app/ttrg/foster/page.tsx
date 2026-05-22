"use client";

import { useState } from "react";
import { Heart, CheckCircle2, Home, Phone, Mail, Shield, PawPrint, Clock, Stethoscope, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { addFosterApplication, type FosterApplication } from "@/lib/admin-store";

const fosterBenefits = [
  { icon: Shield, title: "We Cover Everything", desc: "Vet care, food, supplies, and crates are provided at no cost to you." },
  { icon: Clock, title: "Flexible Commitment", desc: "Foster periods range from 2 weeks to 3 months depending on the dog." },
  { icon: Stethoscope, title: "24/7 Support", desc: "Our team is available around the clock for questions or emergencies." },
  { icon: PawPrint, title: "Training Included", desc: "Dogs in foster receive continued training support from our certified trainers." },
];

const fosterSteps = [
  { num: 1, title: "Apply", desc: "Fill out the foster application below." },
  { num: 2, title: "Review & Interview", desc: "We review your application and schedule a brief call." },
  { num: 3, title: "Home Check", desc: "A quick virtual or in-person home check for safety." },
  { num: 4, title: "Meet Your Foster Dog", desc: "We match you with a dog that fits your lifestyle." },
  { num: 5, title: "Welcome Home", desc: "Take your foster dog home with full supplies and support." },
];

export default function FosterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", cityState: "",
    housingType: "", rentOrOwn: "", currentPets: "", dogExperience: "",
    childrenInHome: "", preferredSize: "", availability: "", reason: "", consent: false,
  });
  const u = (field: string, val: string | boolean) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app: FosterApplication = {
      id: "FA-" + Date.now().toString(36).toUpperCase(),
      firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
      cityState: form.cityState, housingType: form.housingType, rentOrOwn: form.rentOrOwn,
      currentPets: form.currentPets, dogExperience: form.dogExperience, childrenInHome: form.childrenInHome,
      preferredSize: form.preferredSize, availability: form.availability, reason: form.reason,
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
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Foster Application Received!</h1>
        <p className="text-[#1B2A4A]/60 mb-4">Thank you for opening your home to a rescue dog. We&apos;ll review your application and contact you within 48 hours.</p>
        <div className="text-sm text-[#1B2A4A]/40 space-y-1 mb-6">
          <p className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-[#C41E2A]" /><a href="tel:+18664364959" className="hover:text-[#C41E2A]">(866) 436-4959</a></p>
          <p className="flex items-center justify-center gap-2"><Mail className="w-4 h-4 text-[#C41E2A]" /><a href="mailto:Teamtrainersrescue@gmail.com" className="hover:text-[#C41E2A]">Teamtrainersrescue@gmail.com</a></p>
        </div>
        <Link href="/ttrg" className="text-[#C41E2A] font-semibold hover:underline">← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Home className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Become a Foster Family</h1>
          <p className="text-white/60 max-w-lg mx-auto text-base">Open your home temporarily and give a rescue dog a safe place to heal while they wait for their forever family.</p>
        </div>
      </section>

      {/* What Fostering Means */}
      <section className="py-14 sm:py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">What It Means to Foster</h2>
            <p className="text-[#1B2A4A]/50 text-sm mt-2 max-w-xl mx-auto">Fostering is temporary — but the impact is permanent. You provide a safe bridge between rescue and a forever home.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fosterBenefits.map((b) => (
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

      {/* How It Works */}
      <section className="py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">How the Foster Process Works</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-[#C41E2A]/10" />
            <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-3">
              {fosterSteps.map((s) => (
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
          <div className="text-center mt-10">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-500/20"
              >
                <Heart className="w-4 h-4 fill-white" /> START YOUR FOSTER APPLICATION <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { setShowForm(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="inline-flex items-center gap-1 text-[#1B2A4A]/50 text-sm hover:text-[#C41E2A] transition-colors"
              >
                <ChevronDown className="w-4 h-4 rotate-180" /> Back to info
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Application Form */}
      {showForm && (
      <section className="py-12 sm:py-16 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#1B2A4A]">Foster Application</h2>
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

            <h2 className="text-lg font-bold text-[#1B2A4A] pt-4">Home & Living Situation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select required value={form.housingType} onChange={(e) => u("housingType", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Housing type *</option>
                <option>House with yard</option>
                <option>House without yard</option>
                <option>Apartment</option>
                <option>Condo/Townhouse</option>
              </select>
              <select required value={form.rentOrOwn} onChange={(e) => u("rentOrOwn", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Rent or own? *</option>
                <option>Own</option>
                <option>Rent — landlord allows pets</option>
                <option>Rent — need to confirm pet policy</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select required value={form.currentPets} onChange={(e) => u("currentPets", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Current pets? *</option>
                <option>No other pets</option>
                <option>Yes — dogs only</option>
                <option>Yes — cats only</option>
                <option>Yes — dogs and cats</option>
                <option>Yes — other animals</option>
              </select>
              <select value={form.childrenInHome} onChange={(e) => u("childrenInHome", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Children in home?</option>
                <option>No children</option>
                <option>Yes — under 5</option>
                <option>Yes — 5-12</option>
                <option>Yes — teens</option>
                <option>Yes — mixed ages</option>
              </select>
            </div>

            <h2 className="text-lg font-bold text-[#1B2A4A] pt-4">Foster Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={form.preferredSize} onChange={(e) => u("preferredSize", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Preferred dog size</option>
                <option>Small (under 25 lbs)</option>
                <option>Medium (25-50 lbs)</option>
                <option>Large (50+ lbs)</option>
                <option>Any size</option>
              </select>
              <select value={form.availability} onChange={(e) => u("availability", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Availability</option>
                <option>Available now</option>
                <option>Available within 1-2 weeks</option>
                <option>Available within a month</option>
                <option>Flexible</option>
              </select>
            </div>
            <textarea placeholder="Previous experience with dogs *" rows={3} required value={form.dogExperience} onChange={(e) => u("dogExperience", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            <textarea placeholder="Why do you want to foster? *" rows={3} required value={form.reason} onChange={(e) => u("reason", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={form.consent} onChange={(e) => u("consent", e.target.checked)} className="mt-1 rounded" />
              <span className="text-xs text-[#1B2A4A]/50">I confirm this information is accurate and I agree to be contacted by Team Trainers Rescue Group regarding fostering opportunities. I understand that all foster placements are subject to review and a home check may be required.</span>
            </label>

            <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-white" /> SUBMIT FOSTER APPLICATION
            </button>
          </form>
        </div>
      </section>
      )}
    </div>
  );
}
