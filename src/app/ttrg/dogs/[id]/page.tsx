"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Shield, Stethoscope, GraduationCap, Smile, Home, ChevronRight, ArrowLeft, Share2, PawPrint, AlertTriangle, Dumbbell, Brain, Utensils, X, Phone, Mail, CheckCircle2 } from "lucide-react";
import { getDogById, donationTiers, dogs } from "@/lib/dogs";
import { getAdminDogById } from "@/lib/admin-store";

const stageInfo: Record<string, { icon: typeof Shield; label: string; color: string }> = {
  rescue: { icon: Shield, label: "Rescued", color: "bg-red-500" },
  rehabilitate: { icon: Stethoscope, label: "In Rehabilitation", color: "bg-amber-500" },
  train: { icon: GraduationCap, label: "In Training", color: "bg-emerald-500" },
  foster: { icon: Home, label: "In Foster", color: "bg-blue-500" },
  adopt: { icon: Home, label: "Ready to Adopt", color: "bg-violet-500" },
  recover: { icon: Home, label: "Recovering", color: "bg-blue-500" },
  rehome: { icon: Home, label: "Ready for Home", color: "bg-violet-500" },
};

const allStages = ["rescue", "rehabilitate", "foster", "adopt"] as const;
const stageMapping: Record<string, number> = { rescue: 0, rehabilitate: 1, train: 1, foster: 2, recover: 2, adopt: 3, rehome: 3 };

const stageNeeds: Record<string, { label: string; cta: string; href: string }> = {
  rescue: { label: "Urgent Foster Needed", cta: "Apply to Foster", href: "/ttrg/foster" },
  rehabilitate: { label: "Medical Support Needed", cta: "Sponsor Rehab", href: "/ttrg/donate" },
  train: { label: "Sponsor This Stage", cta: "Sponsor Training", href: "/ttrg/donate" },
  recover: { label: "Needs Placement Soon", cta: "Sponsor Recovery", href: "/ttrg/donate" },
  foster: { label: "In Foster Care", cta: "Sponsor Foster Care", href: "/ttrg/donate" },
  adopt: { label: "Ready for Adoption", cta: "Apply to Adopt", href: "/ttrg/adopt" },
  rehome: { label: "Ready for Adoption", cta: "Apply to Adopt", href: "/ttrg/adopt" },
};
const sponsorLabels: Record<string, string> = { rescue: "Sponsor Rescue", rehabilitate: "Sponsor Rehab", train: "Sponsor Training", recover: "Sponsor Recovery", foster: "Sponsor Foster Care", adopt: "Sponsor Adoption", rehome: "Sponsor Adoption" };

export default function DogProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const adminDog = typeof window !== "undefined" ? getAdminDogById(id) : undefined;
  const staticDog = getDogById(id);
  const dog = adminDog || staticDog;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (!dog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <PawPrint className="w-16 h-16 text-slate-200" />
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Dog not found</h1>
        <Link href="/ttrg/sponsor" className="text-[#C41E2A] font-semibold hover:underline">← View all dogs</Link>
      </div>
    );
  }

  const stage = stageInfo[dog.stage] || stageInfo.rescue;
  const StageIcon = stage.icon;
  const currentStageIndex = stageMapping[dog.stage] ?? 0;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAF8] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-[#1B2A4A]/50">
            <Link href="/ttrg" className="hover:text-[#C41E2A]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/ttrg/sponsor" className="hover:text-[#C41E2A]">Sponsor a Dog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1B2A4A] font-medium">{dog.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT — Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4">
              <img src={dog.gallery[activeImage] || dog.image} alt={dog.name} className="w-full h-full object-cover" />
              {dog.urgent && (
                <span className="absolute top-4 left-4 bg-[#C41E2A] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> {stageNeeds[dog.stage]?.label || "Urgent Need"}
                </span>
              )}
              {!dog.urgent && stageNeeds[dog.stage] && (
                <span className="absolute top-4 left-4 bg-[#1B2A4A]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {stageNeeds[dog.stage].label}
                </span>
              )}
              <span className={`absolute top-4 right-4 ${stage.color} text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                <StageIcon className="w-3 h-3" /> {stage.label}
              </span>
            </div>
            {dog.gallery.length > 1 && (
              <div className="flex gap-3">
                {dog.gallery.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#C41E2A]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div>
            <Link href="/ttrg/sponsor" className="inline-flex items-center gap-1 text-sm text-[#1B2A4A]/50 hover:text-[#C41E2A] mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to all dogs
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-2">{dog.name}</h1>
            <p className="text-[#1B2A4A]/50 text-sm mb-4">{dog.age} · {dog.gender} · {dog.breed} · {dog.weight}</p>
            <p className="flex items-center gap-2 text-sm text-[#1B2A4A]/40 mb-6"><MapPin className="w-4 h-4" /> {dog.location}</p>

            {/* Story */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#1B2A4A] mb-2">{dog.name}&apos;s Story</h2>
              <p className="text-[#1B2A4A]/60 text-sm leading-relaxed">{dog.fullStory}</p>
            </div>

            {/* Journey Progress */}
            <div className="bg-[#FAFAF8] rounded-2xl p-5 mb-8 border border-slate-100">
              <h3 className="text-sm font-bold text-[#1B2A4A] mb-4">Rescue Journey Progress</h3>
              <div className="flex items-center gap-1">
                {allStages.map((s, i) => {
                  const info = stageInfo[s];
                  const Icon = info.icon;
                  const isActive = i <= currentStageIndex;
                  return (
                    <div key={s} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isActive ? info.color + " text-white" : "bg-slate-100 text-slate-300"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-semibold text-center ${isActive ? "text-[#1B2A4A]" : "text-[#1B2A4A]/30"}`}>{info.label.replace("In ", "")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Needs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Stethoscope, label: "Medical Needs", value: dog.medicalNeeds },
                { icon: Dumbbell, label: "Training Needs", value: dog.trainingNeeds },
                { icon: Brain, label: "Behavior Notes", value: dog.behaviorNotes },
                { icon: Utensils, label: "Special Needs", value: dog.specialNeeds },
              ].map((item) => (
                <div key={item.label} className="bg-[#FAFAF8] rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-[#C41E2A]" />
                    <span className="text-xs font-bold text-[#1B2A4A]">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-[#1B2A4A]/50 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Donation CTA */}
            <div className="bg-[#1B2A4A] rounded-2xl p-6 sm:p-8">
              <h3 className="text-white font-bold text-lg mb-2">What {dog.name} Needs Right Now</h3>
              <p className="text-white/50 text-sm mb-6">Your support goes directly to {dog.name}&apos;s care. Choose a giving level:</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(""); }}
                    className={`rounded-xl p-3 text-left transition-all border ${selectedAmount === tier.amount ? "bg-[#C41E2A] border-[#C41E2A] text-white" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
                  >
                    <span className="text-lg font-bold">${tier.amount}</span>
                    <p className="text-[10px] mt-0.5 opacity-70">{tier.label}</p>
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <input
                  type="number"
                  placeholder="Custom amount ($)"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/50"
                />
              </div>

              <button
                onClick={() => setShowDonateModal(true)}
                className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                {sponsorLabels[dog.stage] || "SPONSOR"} {dog.name.toUpperCase()} — ${customAmount || selectedAmount || 50}/MONTH
              </button>

              <div className="flex gap-3 mt-3">
                <Link href="/ttrg/adopt" className="flex-1 bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl text-xs font-semibold text-center transition-colors">
                  APPLY TO ADOPT
                </Link>
                <Link href="/ttrg/foster" className="flex-1 bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl text-xs font-semibold text-center transition-colors">
                  APPLY TO FOSTER
                </Link>
                <button onClick={() => { if (navigator.share) navigator.share({ title: `Help ${dog.name}`, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }} className="flex-1 bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                  <Share2 className="w-3 h-3" /> SHARE
                </button>
              </div>

              {/* Follow This Journey */}
              <button className="w-full mt-3 border border-white/10 hover:bg-white/5 text-white/70 py-2.5 rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2">
                <PawPrint className="w-3 h-3" /> Follow {dog.name}&apos;s Journey — Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowDonateModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDonateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <div className="text-center mb-6">
              <Heart className="w-10 h-10 text-[#C41E2A] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#1B2A4A]">Sponsor {dog.name}</h3>
              <p className="text-sm text-[#1B2A4A]/50 mt-1">${customAmount || selectedAmount || 50}/month</p>
            </div>
            {sponsorSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-[#1B2A4A] mb-2">Interest Received!</h4>
                <p className="text-sm text-[#1B2A4A]/50 mb-4">Our team will follow up with you to finalize your sponsorship of {dog.name}.</p>
                <div className="space-y-2 text-sm text-[#1B2A4A]/50">
                  <p className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-[#C41E2A]" /> <a href="tel:+18664364959" className="hover:text-[#C41E2A]">(866) 436-4959</a></p>
                  <p className="flex items-center justify-center gap-2"><Mail className="w-4 h-4 text-[#C41E2A]" /> <a href="mailto:Teamtrainersrescue@gmail.com" className="hover:text-[#C41E2A]">Teamtrainersrescue@gmail.com</a></p>
                </div>
                <button onClick={() => { setShowDonateModal(false); setSponsorSubmitted(false); }} className="mt-4 text-[#C41E2A] text-sm font-semibold hover:underline">Close</button>
              </div>
            ) : (
              <>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSponsorSubmitted(true); }}>
                  <input type="text" placeholder="Full Name" required className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                  <input type="email" placeholder="Email Address" required className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                  <input type="tel" placeholder="Phone (optional)" className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                  <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 fill-white" /> SUBMIT SPONSOR INTEREST
                  </button>
                </form>
                <p className="text-[10px] text-slate-400 text-center mt-4">Our team will contact you to finalize sponsorship details. Your information is never shared.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
