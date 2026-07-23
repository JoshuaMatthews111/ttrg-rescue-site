"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  HeartHandshake, Heart, ArrowLeft, MapPin, Users, AlertTriangle,
  CheckCircle, DollarSign, Share2, Clock, Stethoscope, GraduationCap,
  Star, ArrowRight,
} from "lucide-react";
import { getFamilyProfileBySlug, getPublishedFamilyProfiles, syncFamilyProfilesFromCloud, type FamilyProfile } from "@/lib/admin-store";
import { shareSubject, familyStageTitle } from "@/lib/share-messages";
import CampaignVideo from "@/components/ttrg/CampaignVideo";

const FAMILY_STAGES = [
  { title: "Family in Need", description: "A family with limited resources needs help keeping their dog." },
  { title: "Situation Evaluated", description: "TTRG reviews the family, the dog, the behavior issues, and the training need." },
  { title: "Support Profile Created", description: "Photos, videos, and the family's story are gathered into an individual fundraising profile." },
  { title: "Training Funds Raised", description: "The campaign is shared with donors until the needed training support is funded." },
  { title: "Training Completed", description: "The dog receives training, the family gives a final testimony, and donors see the outcome." },
] as const;

// Stage comes from the admin panel when set; otherwise derived from status.
function effectiveStage(p: FamilyProfile): number {
  if (p.currentStage && p.currentStage >= 1 && p.currentStage <= 5) return p.currentStage;
  if (p.status === "completed") return 5;
  if (p.status === "funded" || (p.goalAmount > 0 && p.raisedAmount >= p.goalAmount)) return 4;
  if (p.status === "published") return 4;
  return 3;
}

export default function FamilyProfileDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [otherProfiles, setOtherProfiles] = useState<FamilyProfile[]>([]);
  const [donateAmount, setDonateAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () => {
      setProfile(getFamilyProfileBySlug(slug) || null);
      setOtherProfiles(getPublishedFamilyProfiles().filter(x => x.slug !== slug).slice(0, 4));
    };
    load(); // instant paint from local cache
    syncFamilyProfilesFromCloud().then(() => { if (active) load(); });
    return () => { active = false; };
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

  async function share() {
    const p = profile!;
    const result = await shareSubject(
      {
        id: p.slug,
        name: p.dogName,
        story: p.shortSummary || p.story,
        urgent: p.urgent,
        goalAmount: p.goalAmount,
        raisedAmount: p.raisedAmount,
        donorCount: p.donorCount,
        familyName: p.familyName,
        location: p.location,
        customTitle: p.shareTitle || familyStageTitle(p.dogName, p.familyName, effectiveStage(p)),
      },
      window.location.href,
    );
    if (result === "copied") { setCopied(true); setTimeout(() => setCopied(false), 2500); }
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
        {/* Hero image (full width, top on all screens) */}
        <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 mb-8">
          <img src={profile.image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"} alt={profile.dogName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            {profile.urgent && <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"><AlertTriangle className="w-3.5 h-3.5" /> URGENT</span>}
            {isCompleted && <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> COMPLETED</span>}
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[#D97706] text-xs font-bold uppercase tracking-wider mb-1">{profile.familyName}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">{profile.dogName}</h1>
              <p className="text-white/70 text-sm flex items-center gap-2">
                {profile.dogBreed} · <MapPin className="w-3.5 h-3.5" /> {profile.location}
              </p>
            </div>
            <button
              onClick={share}
              className="inline-flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-5 py-3 rounded-full text-sm font-bold shadow-xl shadow-black/30 transition-all hover:scale-105 flex-shrink-0"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Message Copied!" : `Share ${profile.dogName}`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content — second on mobile, left on desktop */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            {/* Video */}
            {profile.videoUrl && (
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100">
                <h2 className="text-xl font-black text-[#1B2A4A] mb-4 px-2">Meet {profile.dogName}</h2>
                <CampaignVideo url={profile.videoUrl} poster={profile.image} title={`Video of ${profile.dogName}`} />
              </div>
            )}

            {/* Journey stages */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100">
              <h2 className="text-xl font-black text-[#1B2A4A] mb-6">{profile.dogName}&apos;s Journey</h2>
              <div className="space-y-0">
                {FAMILY_STAGES.map((stage, i) => {
                  const stageNum = i + 1;
                  const current = effectiveStage(profile);
                  const done = stageNum < current;
                  const active = stageNum === current;
                  return (
                    <div key={stage.title} className="flex gap-4">
                      {/* Marker + connector */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-colors ${done ? "bg-emerald-500 text-white" : active ? "bg-[#D97706] text-white ring-4 ring-[#D97706]/20" : "bg-slate-100 text-slate-400"}`}>
                          {done ? <CheckCircle className="w-5 h-5" /> : stageNum}
                        </div>
                        {i < FAMILY_STAGES.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-6 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                        )}
                      </div>
                      {/* Copy */}
                      <div className={`pb-6 ${i === FAMILY_STAGES.length - 1 ? "pb-0" : ""}`}>
                        <p className={`text-sm font-black uppercase tracking-wide ${active ? "text-[#D97706]" : done ? "text-emerald-600" : "text-[#1B2A4A]"}`}>
                          {stage.title}
                          {active && <span className="ml-2 text-[10px] bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded-full normal-case">Current Stage</span>}
                        </p>
                        <p className="text-[#1B2A4A]/60 text-sm leading-relaxed mt-1">{stage.description}</p>
                      </div>
                    </div>
                  );
                })}
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

          </div>

          {/* Sidebar — Donation — first on mobile, right on desktop */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
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
                    <Share2 className="w-4 h-4" /> {copied ? "Link Copied!" : "Share This Campaign"}
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

        {/* Other profiles — full width, very bottom */}
        {otherProfiles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-black text-[#1B2A4A] mb-4">Other Families That Need Help</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
