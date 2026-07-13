"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartHandshake, Heart, ArrowRight, MapPin, Users, AlertTriangle,
  CheckCircle, DollarSign, Star, Search, Filter,
} from "lucide-react";
import { getPublishedFamilyProfiles, type FamilyProfile } from "@/lib/admin-store";

export default function MakeTrainingAffordable() {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setProfiles(getPublishedFamilyProfiles());
  }, []);

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.familyName.toLowerCase().includes(q) || p.dogName.toLowerCase().includes(q);
    if (filter === "active") return matchSearch && (p.status === "published" || p.status === "funded");
    if (filter === "completed") return matchSearch && p.status === "completed";
    return matchSearch;
  });

  const totalRaised = profiles.reduce((s, p) => s + p.raisedAmount, 0);
  const totalDonors = profiles.reduce((s, p) => s + p.donorCount, 0);
  const familiesHelped = profiles.filter(p => p.status === "completed").length;

  return (
    <div className="bg-[#FDFCFA] min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-[#1B2A4A] via-[#0f1a30] to-[#1B2A4A] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D97706]/20 rounded-full px-4 py-1.5 mb-6">
            <HeartHandshake className="w-4 h-4 text-[#D97706]" />
            <span className="text-[#D97706] text-xs font-bold uppercase tracking-wider">Family Preservation Program</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Help Families <span className="text-[#D97706]">Keep Their Dogs</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            Not every dog needs to be rescued from a shelter. Some dogs need help before they lose their home. Your donation funds professional training for families who can&apos;t afford it.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-3xl font-black text-[#D97706]">{profiles.length}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold">Families Supported</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{totalDonors}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold">Supporters</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-400">{familiesHelped}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold">Goals Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] text-amber-700 text-center font-medium">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Profiles shown below are representative examples for illustration purposes unless individually marked as verified TTRG cases. Photos may be stock or representative images.
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === "all" ? "bg-[#D97706] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                All Families ({profiles.length})
              </button>
              <button onClick={() => setFilter("active")} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === "active" ? "bg-[#D97706] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                Needs Support
              </button>
              <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === "completed" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                Success Stories
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search families..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm w-64" />
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HeartHandshake className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No family profiles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(profile => {
                const pct = profile.goalAmount > 0 ? Math.min(100, Math.round((profile.raisedAmount / profile.goalAmount) * 100)) : 0;
                const isCompleted = profile.status === "completed";
                return (
                  <Link key={profile.id} href={`/ttrg/make-training-affordable/${profile.slug}`} className="group">
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img src={profile.image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80"} alt={profile.dogName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {profile.urgent && (
                            <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              <AlertTriangle className="w-3 h-3" /> URGENT
                            </span>
                          )}
                          {profile.featured && (
                            <span className="flex items-center gap-1 bg-[#D97706] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-white" /> FEATURED
                            </span>
                          )}
                          {isCompleted && (
                            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" /> COMPLETED
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-black text-lg">{profile.dogName}</p>
                          <p className="text-white/70 text-xs">{profile.dogBreed} · <MapPin className="w-3 h-3 inline" /> {profile.location}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-[#D97706] text-xs font-bold uppercase tracking-wider mb-1">{profile.familyName}</p>
                        <p className="text-sm text-[#1B2A4A]/60 leading-relaxed line-clamp-2 mb-4">{profile.shortSummary}</p>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-[#1B2A4A]">{pct}% funded</span>
                            <span className="flex items-center gap-1 text-slate-400"><Users className="w-3 h-3" /> {profile.donorCount} supporters</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-[#D97706] to-[#F59E0B]"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* CTA */}
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                            <CheckCircle className="w-4 h-4" /> Training Complete — Read Story <ArrowRight className="w-4 h-4 ml-auto" />
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <span className="flex-1 bg-[#D97706] hover:bg-[#B45309] text-white py-2.5 rounded-xl text-sm font-bold transition-colors text-center flex items-center justify-center gap-2">
                              <Heart className="w-4 h-4 fill-white" /> Donate Now
                            </span>
                            <span className="flex items-center justify-center px-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1B2A4A] to-[#0a1628]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <HeartHandshake className="w-12 h-12 text-[#D97706] mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Know a Family That Needs Help?</h2>
          <p className="text-white/50 text-sm mb-6 max-w-xl mx-auto">
            If you know a family struggling to afford dog training, refer them to TTRG. We&apos;ll evaluate the situation and create a support campaign.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/ttrg/contact" className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-4 rounded-full text-sm font-bold transition-all">
              <HeartHandshake className="w-4 h-4" /> Refer a Family
            </Link>
            <Link href="/ttrg/donate" className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
              <Heart className="w-4 h-4 fill-white" /> General Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
