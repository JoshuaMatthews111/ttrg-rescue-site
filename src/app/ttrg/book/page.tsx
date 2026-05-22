"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, CheckCircle2, User, Phone, Mail, PawPrint } from "lucide-react";

const trainers: Record<string, { name: string; role: string; photo: string; bio: string }> = {
  lorenzo: { name: "Lorenzo Miller", role: "Founder & Lead Trainer", photo: "/ttrg/founder-lorenzo.jpg", bio: "40+ years of experience. Behavior modification, service dog training, and rehabilitation." },
  jasmine: { name: "Jasmine Bland", role: "Adoption & Foster Coordinator", photo: "/ttrg/trainers/jasmine-bland-candid.jpg", bio: "Specializes in solutions training and family integration." },
  daniel: { name: "Daniel Bainbridge", role: "K9 Specialist", photo: "/ttrg/trainers/daniel-bainbridge-rd-candid.jpg", bio: "10+ years training high-drive dogs and behavior cases." },
  bailey: { name: "Bailey Brown", role: "Puppy Trainer", photo: "/ttrg/trainers/bailey-brown-candid.jpg", bio: "Puppy socialization and foundation training expert." },
};

const slots = ["Mon 9:00 AM", "Mon 11:30 AM", "Tue 10:00 AM", "Tue 2:30 PM", "Wed 9:00 AM", "Wed 1:00 PM", "Thu 11:00 AM", "Thu 3:30 PM", "Fri 10:00 AM"];

function BookingForm() {
  const params = useSearchParams();
  const trainerSlug = params.get("trainer") || "lorenzo";
  const trainer = trainers[trainerSlug] || trainers.lorenzo;

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dogName, setDogName] = useState("");
  const [issue, setIssue] = useState("");
  const [slot, setSlot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center shadow-xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
          <h1 className="text-3xl font-black text-[#1B2A4A] mb-3">You&apos;re booked!</h1>
          <p className="text-[#1B2A4A]/60 mb-6">
            Your appointment with <strong>{trainer.name}</strong> is confirmed for <strong>{slot}</strong>.
          </p>
          <div className="bg-[#FAFAF8] rounded-2xl p-4 mb-6 text-left text-sm">
            <p className="text-[#1B2A4A]/40 text-xs mb-1">Confirmation sent to:</p>
            <p className="text-[#1B2A4A] font-bold">{email}</p>
            <p className="text-[#1B2A4A]/60 text-xs mt-2">{trainer.name} will reach out within 24 hours to confirm.</p>
          </div>
          <a href="/ttrg" className="inline-block bg-[#C41E2A] text-white px-6 py-3 rounded-xl text-sm font-bold">← Back to TTRG</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Trainer card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-5 flex items-center gap-5">
          <img src={trainer.photo} alt={trainer.name} className="w-20 h-20 rounded-2xl object-cover object-top" />
          <div>
            <p className="text-[#C41E2A] text-[10px] font-bold uppercase tracking-wider">Book a Session With</p>
            <h1 className="text-2xl font-black text-[#1B2A4A]">{trainer.name}</h1>
            <p className="text-[#1B2A4A]/60 text-xs">{trainer.role}</p>
            <p className="text-[#1B2A4A]/40 text-[11px] mt-1">{trainer.bio}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? "bg-[#C41E2A]" : "bg-slate-200"}`} />
          ))}
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
          {step === 1 && (
            <>
              <h2 className="text-xl font-black text-[#1B2A4A] mb-1">Tell us about you and your dog</h2>
              <p className="text-[#1B2A4A]/50 text-sm mb-5">Quick info — takes 30 seconds.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-[#1B2A4A]/60 text-xs font-bold block mb-1">Your Name *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1B2A4A]/60 text-xs font-bold block mb-1">Email *</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-[#1B2A4A]/60 text-xs font-bold block mb-1">Phone *</label>
                    <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[#1B2A4A]/60 text-xs font-bold block mb-1">Dog&apos;s Name</label>
                  <input value={dogName} onChange={(e) => setDogName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="text-[#1B2A4A]/60 text-xs font-bold block mb-1">What do you need help with?</label>
                  <textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows={3} placeholder="Behavior, training goals, or specific concerns..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} disabled={!name || !email || !phone} className="w-full mt-5 bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-40 text-white py-3.5 rounded-xl text-sm font-bold">Continue → Pick a Time</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-black text-[#1B2A4A] mb-1">Pick a time</h2>
              <p className="text-[#1B2A4A]/50 text-sm mb-5">All times are local. {trainer.name} will confirm within 24 hours.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {slots.map((s) => (
                  <button key={s} type="button" onClick={() => setSlot(s)} className={`p-3 rounded-xl text-xs font-bold border-2 transition-all ${slot === s ? "bg-[#C41E2A] border-[#C41E2A] text-white" : "bg-slate-50 border-slate-200 text-[#1B2A4A] hover:border-[#C41E2A]/40"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#1B2A4A] py-3.5 rounded-xl text-sm font-bold">← Back</button>
                <button type="submit" disabled={!slot} className="flex-[2] bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-40 text-white py-3.5 rounded-xl text-sm font-bold">Confirm Booking</button>
              </div>
            </>
          )}
        </form>

        <p className="text-center text-[#1B2A4A]/40 text-[11px] mt-5">Powered by Team Trainers Rescue Group</p>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C41E2A]/30 border-t-[#C41E2A] rounded-full animate-spin" /></div>}>
      <BookingForm />
    </Suspense>
  );
}
