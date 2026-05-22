"use client";

import { useState } from "react";
import { Copy, Send, Calendar, Check, Phone, Mail, MessageSquare } from "lucide-react";

export default function AppointmentLinkPage() {
  const [trainerName, setTrainerName] = useState("Lorenzo Miller");
  const [trainerSlug, setTrainerSlug] = useState("lorenzo");
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const appointmentUrl = `${baseUrl}/ttrg/book?trainer=${trainerSlug}`;

  const copy = () => {
    navigator.clipboard.writeText(appointmentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const smsBody = encodeURIComponent(`Hi! Book your training consultation with ${trainerName} here: ${appointmentUrl}`);
  const emailBody = encodeURIComponent(`Hi,\n\nI'd love to schedule a training consultation with you. Please use the link below to book a time that works best:\n\n${appointmentUrl}\n\nLooking forward to meeting you and your dog!\n\n— ${trainerName}\nTeam Trainers Rescue Group`);

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">APPOINTMENT LINK</h1>
        <p className="text-white/40 text-xs mt-1">Generate a personalized booking link and send to your client.</p>
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-6 mb-5">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-3">Trainer Profile</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-white/40 text-[10px] block mb-1">Your Name</label>
            <input value={trainerName} onChange={(e) => setTrainerName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
          </div>
          <div>
            <label className="text-white/40 text-[10px] block mb-1">URL Slug</label>
            <input value={trainerSlug} onChange={(e) => setTrainerSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
          </div>
        </div>

        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Your Shareable Link</p>
        <div className="flex gap-2 mb-2">
          <input value={appointmentUrl} readOnly className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-emerald-300 font-mono" />
          <button onClick={copy} className="bg-[#C41E2A] hover:bg-[#A01825] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
        <p className="text-white/30 text-[10px]">Share this link with your client — they&apos;ll be able to request an appointment and you&apos;ll get notified.</p>
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-6 mb-5">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-4">Quick Send</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href={`sms:?body=${smsBody}`} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all">
            <MessageSquare className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-white text-sm font-bold">Text Message</p>
            <p className="text-white/40 text-xs">Open messages app</p>
          </a>
          <a href={`mailto:?subject=Schedule%20your%20training%20consultation&body=${emailBody}`} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all">
            <Mail className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-white text-sm font-bold">Email</p>
            <p className="text-white/40 text-xs">Open email client</p>
          </a>
          <a href={`https://wa.me/?text=${smsBody}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all">
            <Send className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-white text-sm font-bold">WhatsApp</p>
            <p className="text-white/40 text-xs">Send via WhatsApp</p>
          </a>
        </div>
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-3">Preview Message</p>
        <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-sm text-white/80 leading-relaxed">
          Hi! Book your training consultation with <strong className="text-white">{trainerName}</strong> here:<br />
          <span className="text-emerald-300 font-mono text-xs break-all">{appointmentUrl}</span>
        </div>
      </div>
    </div>
  );
}
