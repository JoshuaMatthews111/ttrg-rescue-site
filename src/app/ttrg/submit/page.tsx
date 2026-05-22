"use client";

import { useState } from "react";
import { CheckCircle2, Upload, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { addSubmission, type Submission } from "@/lib/admin-store";

function genId() { return "TTRG-" + Math.random().toString(36).substring(2, 8).toUpperCase(); }

export default function SubmitDogPage() {
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [form, setForm] = useState({
    dogName: "", breed: "", age: "", gender: "", weight: "", location: "",
    story: "", reasonForSubmission: "", medicalNeeds: "", trainingNeeds: "", behaviorNotes: "",
    urgency: "", livingSituation: "", videoLink: "",
    submitterName: "", submitterType: "", submitterEmail: "", submitterPhone: "",
    organization: "", consent: false,
  });
  const u = (field: string, val: string | boolean) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = genId();
    const sub: Submission = {
      id,
      dogName: form.dogName,
      breed: form.breed,
      age: form.age,
      gender: form.gender,
      weight: form.weight,
      location: form.location,
      story: form.story,
      reasonForSubmission: form.reasonForSubmission,
      medicalNeeds: form.medicalNeeds,
      trainingNeeds: form.trainingNeeds,
      behaviorNotes: form.behaviorNotes,
      urgency: form.urgency,
      submitterName: form.submitterName,
      submitterEmail: form.submitterEmail,
      submitterPhone: form.submitterPhone,
      submitterType: form.submitterType,
      organization: form.organization,
      livingSituation: form.livingSituation,
      videoLink: form.videoLink,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      actionBy: "",
      consent: form.consent,
    };
    addSubmission(sub);
    setReferenceId(id);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Submission Received</h1>
        <p className="text-[#1B2A4A]/60 mb-2">Thank you for submitting a dog for rescue consideration.</p>
        <div className="bg-[#FAFAF8] rounded-xl p-4 border border-slate-100 mb-6">
          <p className="text-xs text-[#1B2A4A]/50 mb-1">Your reference ID:</p>
          <p className="text-lg font-bold text-[#1B2A4A] font-mono">{referenceId}</p>
          <p className="text-[10px] text-[#1B2A4A]/40 mt-2">Save this ID to check status or provide updates later.</p>
        </div>
        <p className="text-sm text-[#1B2A4A]/40 mb-6">Our team will review within 24–72 hours. Approved dogs will appear on our public site. You&apos;ll be notified by email.</p>
        <Link href="/ttrg" className="text-[#C41E2A] font-semibold hover:underline">← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Upload className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Recommend a Dog for Review</h1>
          <p className="text-white/60 max-w-lg mx-auto">Shelters, rescue partners, trainers, owners, or concerned citizens — recommend a dog and we will evaluate them for our program.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Important</p>
              <p className="text-xs text-amber-700">Submissions are reviewed by our team before appearing publicly. No dog is published without TTRG approval. You&apos;ll receive a reference ID to track your submission.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-[#1B2A4A]">Dog Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Dog's Name *" required value={form.dogName} onChange={(e) => u("dogName", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <input type="text" placeholder="Breed (or best guess) *" required value={form.breed} onChange={(e) => u("breed", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder="Age *" required value={form.age} onChange={(e) => u("age", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <select required value={form.gender} onChange={(e) => u("gender", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">Gender *</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input type="text" placeholder="Weight (approx)" value={form.weight} onChange={(e) => u("weight", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <input type="text" placeholder="Location (city, state) *" required value={form.location} onChange={(e) => u("location", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />

            <textarea placeholder="Reason for submission *" rows={3} required value={form.reasonForSubmission} onChange={(e) => u("reasonForSubmission", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            <textarea placeholder="Dog's story / background" rows={2} value={form.story} onChange={(e) => u("story", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            <textarea placeholder="Medical needs (known conditions, injuries, vaccinations)" rows={2} value={form.medicalNeeds} onChange={(e) => u("medicalNeeds", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            <textarea placeholder="Training / behavioral notes" rows={2} value={form.trainingNeeds} onChange={(e) => u("trainingNeeds", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
            <textarea placeholder="Behavior notes (reactivity, fears, good with kids/dogs)" rows={2} value={form.behaviorNotes} onChange={(e) => u("behaviorNotes", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />

            <select required value={form.urgency} onChange={(e) => u("urgency", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
              <option value="">Urgency Level *</option>
              <option value="Critical">Critical — immediate rescue needed</option>
              <option value="Urgent">Urgent — needs placement within days</option>
              <option value="Standard">Standard — needs rehoming within weeks</option>
              <option value="Low">Low — stable but seeking better situation</option>
            </select>

            <select value={form.livingSituation} onChange={(e) => u("livingSituation", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
              <option value="">Current living situation</option>
              <option>Shelter kennel</option>
              <option>Foster home</option>
              <option>Owner&apos;s home</option>
              <option>Outdoor / stray</option>
              <option>Rescue facility</option>
              <option>Unknown</option>
            </select>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-[#1B2A4A]/50">Upload photos of the dog</p>
              <p className="text-[10px] text-[#1B2A4A]/30 mt-1">JPG, PNG — Max 10MB each</p>
              <input type="file" multiple accept="image/*" className="mt-3 text-xs text-slate-500" />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
              <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-[#1B2A4A]/50">Upload video or provide a link</p>
              <input type="file" accept="video/*" className="mt-3 text-xs text-slate-500" />
              <p className="text-[10px] text-[#1B2A4A]/30 mt-2">Or paste a video link below:</p>
              <input type="url" placeholder="Video link (YouTube, Google Drive, etc.)" value={form.videoLink} onChange={(e) => u("videoLink", e.target.value)} className="w-full h-10 px-4 mt-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>

            <h2 className="text-lg font-bold text-[#1B2A4A] pt-4">Your Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name *" required value={form.submitterName} onChange={(e) => u("submitterName", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              <select required value={form.submitterType} onChange={(e) => u("submitterType", e.target.value)} className="h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option value="">You are a... *</option>
                <option>Individual</option>
                <option>Shelter / Pound</option>
                <option>Rescue Partner</option>
                <option>Trainer</option>
                <option>Veterinarian</option>
              </select>
            </div>
            <input type="email" placeholder="Email *" required value={form.submitterEmail} onChange={(e) => u("submitterEmail", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <input type="tel" placeholder="Phone *" required value={form.submitterPhone} onChange={(e) => u("submitterPhone", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            <input type="text" placeholder="Organization name (if applicable)" value={form.organization} onChange={(e) => u("organization", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={form.consent} onChange={(e) => u("consent", e.target.checked)} className="mt-1 rounded" />
              <span className="text-xs text-[#1B2A4A]/50">I confirm the information provided is accurate and I consent to TTRG reviewing this submission. I understand that not all submissions are accepted and that TTRG will contact me if additional information is needed.</span>
            </label>

            <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
              RECOMMEND THIS DOG
            </button>
            <p className="text-[10px] text-slate-400 text-center">Submissions are reviewed before publication. You&apos;ll receive a reference ID and email confirmation.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
