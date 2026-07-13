"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  HeartHandshake, Heart, ArrowLeft, MapPin, Users, AlertTriangle,
  CheckCircle, DollarSign, Share2, Clock, Stethoscope, GraduationCap,
  Star, ArrowRight,
} from "lucide-react";
import { getFamilyProfileBySlug, getPublishedFamilyProfiles, type FamilyProfile } from "@/lib/admin-store";

export default function FamilyProfileDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [otherProfiles, setOtherProfiles] = useState<FamilyProfile[]>([]);
  const [donateAmount, setDonateAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    const p = getFamilyProfileBySlug(slug);
    setProfile(p || null);
    setOtherProfiles(getPublishedFamilyProfiles().filter(x => x.slug !== slug).slice(0, 2));
  }, [slug]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFA]">
        <div className="text-center">
          <HeartHandshake className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#1B2A4A] mb-2">Profile Not Found</h1>
          <p className="text-slate-400 mb-6">This family profile may have been completed or removed.</p>
          <Link href="/ttrg/make-training-affordable" className="text-[#D97706] font-bold hover:underline">← Back to all families</Link>
        </div>
      </div>
    );
  }

  const pct = profile.goalAmount > 0 ? Math.min(100, Math.round((profile.raisedAmount / profile.goalAmount) * 100)) : 0;
  const isCompleted = profile.status === "completed";
  const remaining = Math.max(0, profile.goalAmount - profile.raisedAmount);
  const finalAmount = customAmount ? parseFloat(customAmount) : donateAmount || 0;

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: `Help ${profile!.dogName} — ${profile!.familyName}`, text: profile!.shortSummary, url }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  }

  return (
    <div className="bg-[#FDFCFA] min-h-screen">
      {/* Back nav */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/ttrg/make-training-affordable" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#D97706] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Family Profiles
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hero image */}
            <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96">
              <img src={profile.image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"} alt={profile.dogName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                {profile.urgent && <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"><AlertTriangle className="w-3.5 h-3.5" /> URGENT</span>}
                {isCompleted && <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> COMPLETED</span>}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[#D97706] text-xs font-bold uppercase tracking-wider mb-1">{profile.familyName}</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">{profile.dogName}</h1>
                <p className="text-white/70 text-sm flex items-center gap-2">
                  {profile.dogBreed} · <MapPin className="w-3.5 h-3.5" /> {profile.location}
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100">
              <h2 className="text-xl font-black text-[#1B2A4A] mb-4">{profile.familyName}&apos;s Story</h2>
              <p className="text-[#1B2A4A]/70 leading-relaxed whitespace-pre-line">{profile.story}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-[#1B2A4A]">Behavior Issues</h3>
                </div>
                <p className="text-sm text-[#1B2A4A]/60">{profile.behaviorIssues}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-[#D97706]" />
                  <h3 className="font-bold text-[#1B2A4A]">Training Needed</h3>
                </div>
                <p className="text-sm text-[#1B2A4A]/60">{profile.trainingNeeded}</p>
              </div>
            </div>

            {/* Testimony if completed */}
            {isCompleted && profile.testimony && (
              <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-black text-emerald-800">Training Complete!</h2>
                </div>
                <p className="text-emerald-700/80 leading-relaxed italic">&ldquo;{profile.testimony}&rdquo;</p>
              </div>
            )}

            {/* Other profiles */}
            {otherProfiles.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-[#1B2A4A] mb-4">Other Families That Need Help</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherProfiles.map(op => {
                    const opPct = op.goalAmount > 0 ? Math.min(100, Math.round((op.raisedAmount / op.goalAmount) * 100)) : 0;
                    return (
                      <Link key={op.id} href={`/ttrg/make-training-affordable/${op.slug}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                        <div className="h-32 overflow-hidden">
                          <img src={op.image} alt={op.dogName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-4">
                          <p className="font-bold text-[#1B2A4A] text-sm">{op.dogName} — {op.familyName}</p>
                          <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${opPct}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{opPct}% of ${op.goalAmount.toLocaleString()}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Donation */}
          <div className="lg:col-span-5 space-y-6">
            {/* Progress card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 sticky top-24">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-lg font-black text-[#1B2A4A]">Training Fund Progress</p>
                  <p className={`text-2xl font-black ${isCompleted ? "text-emerald-600" : "text-[#D97706]"}`}>{pct}%</p>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-[#D97706] to-[#F59E0B]"}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {profile.donorCount} supporters</span>
                  {!isCompleted && <span>{100 - pct}% still needed</span>}
                </div>
              </div>

              {!isCompleted ? (
                <>
                  {/* Donation amounts */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Choose an amount</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[25, 50, 100, 250, 500].map(amt => (
                        <button
                          key={amt}
                          onClick={() => { setDonateAmount(amt); setCustomAmount(""); }}
                          className={`py-3 rounded-xl text-sm font-bold transition-all ${donateAmount === amt && !customAmount ? "bg-[#D97706] text-white shadow-lg shadow-amber-500/20" : "bg-[#FFF8F0] text-[#D97706] hover:bg-[#D97706] hover:text-white"}`}
                        >
                          ${amt}
                        </button>
                      ))}
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={e => { setCustomAmount(e.target.value); setDonateAmount(null); }}
                          placeholder="Other"
                          className="w-full py-3 pl-7 pr-2 rounded-xl border-2 border-slate-200 focus:border-[#D97706] text-sm font-bold text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Donate CTA */}
                  <Link
                    href={`/ttrg/donate?ttrgDog=${encodeURIComponent(profile.dogName)}&amount=${finalAmount}&family=${encodeURIComponent(profile.familyName)}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#D97706] hover:bg-[#B45309] text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Heart className="w-5 h-5 fill-white" /> Donate ${finalAmount > 0 ? finalAmount.toFixed(0) : "0"} to Help {profile.dogName}
                  </Link>

                  {/* Share */}
                  <button onClick={share} className="flex items-center justify-center gap-2 w-full mt-3 border-2 border-slate-200 text-[#1B2A4A] py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                    <Share2 className="w-4 h-4" /> Share This Campaign
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-black text-emerald-700 text-lg">Fully Funded & Completed!</p>
                  <p className="text-sm text-slate-400 mt-1">Thank you to all {profile.donorCount} donors who made this possible.</p>
                  <Link href="/ttrg/make-training-affordable" className="inline-flex items-center gap-2 mt-4 text-[#D97706] font-bold text-sm hover:underline">
                    Help Another Family <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Info */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Created {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <DollarSign className="w-3 h-3" />
                  <span>Donations fund training, care, and program support for this family</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
