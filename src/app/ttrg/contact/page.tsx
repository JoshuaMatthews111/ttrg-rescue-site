"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { addContactMessage, type ContactMessage } from "@/lib/admin-store";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", reason: "", message: "" });
  const u = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg: ContactMessage = {
      id: "CM-" + Date.now().toString(36).toUpperCase(),
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      date: new Date().toISOString().split("T")[0],
      read: false,
    };
    addContactMessage(msg);
    // Also send to API to store in Supabase and notify info@teamtrainersrescuegroup.com
    try {
      await fetch("/api/ttrg/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          subject: msg.subject,
          message: msg.message,
        }),
      });
    } catch { /* silently continue — local storage already saved */ }
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Message Sent</h1>
        <p className="text-[#1B2A4A]/60 mb-6">Thank you for reaching out to TTRG.</p>
        <Link href="/ttrg" className="text-[#C41E2A] font-semibold hover:underline">← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-white/60 max-w-lg mx-auto">Have a question, want to partner, or need help? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Visit Us", value: "4805 Orchard Rd\nCleveland, OH 44128" },
                { icon: Phone, label: "Call Us", value: "(866) 436-4959", href: "tel:+18664364959" },
                { icon: Mail, label: "Email Us", value: "info@teamtrainersrescuegroup.com", href: "mailto:info@teamtrainersrescuegroup.com" },
                { icon: Clock, label: "Hours", value: "Mon–Fri: 9am–6pm\nSat: 10am–4pm\nSun: Closed" },
              ].map((item: { icon: typeof MapPin; label: string; value: string; href?: string }) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#C41E2A]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2A4A] text-sm">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-[#1B2A4A]/50 hover:text-[#C41E2A] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-[#1B2A4A]/50 whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              <a
                href="https://www.facebook.com/TeamTrainersRescueGroup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                  <FacebookIcon className="w-5 h-5 text-[#C41E2A]" />
                </div>
                <div>
                  <p className="font-bold text-[#1B2A4A] text-sm">Facebook</p>
                  <p className="text-sm text-[#1B2A4A]/50 group-hover:text-[#C41E2A] transition-colors">Follow our rescue updates</p>
                </div>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B2A4A] mb-1.5">First Name *</label>
                    <input type="text" placeholder="John" required value={form.firstName} onChange={(e) => u("firstName", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1B2A4A] mb-1.5">Last Name *</label>
                    <input type="text" placeholder="Doe" required value={form.lastName} onChange={(e) => u("lastName", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2A4A] mb-1.5">Email Address *</label>
                  <input type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => u("email", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2A4A] mb-1.5">Phone (optional)</label>
                  <input type="tel" placeholder="(555) 555-5555" value={form.phone} onChange={(e) => u("phone", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2A4A] mb-1.5">Subject *</label>
                  <select required value={form.subject} onChange={(e) => u("subject", e.target.value)} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                    <option value="">Select a subject...</option>
                    <option>General Inquiry</option>
                    <option>Adoption</option>
                    <option>Foster</option>
                    <option>Sponsor a Dog</option>
                    <option>Volunteer</option>
                    <option>Become a Trainer</option>
                    <option>Recommend a Dog</option>
                    <option>Organization Partnership</option>
                    <option>Donation Question</option>
                    <option>Media/Press</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2A4A] mb-1.5">Message *</label>
                  <textarea placeholder="Tell us how we can help..." rows={5} required value={form.message} onChange={(e) => u("message", e.target.value)} className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
                </div>
                <button type="submit" className="w-full bg-[#C41E2A] hover:bg-[#A01825] text-white py-3.5 rounded-xl text-sm font-bold transition-colors">
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>

          {/* Google Maps Embed — 4805 Orchard Rd, Cleveland, OH 44128 */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2989.5!2d-81.52897!3d41.42317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8830fa9543c8e0f1%3A0x1!2s4805+Orchard+Rd%2C+Cleveland%2C+OH+44128!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TTRG Location — 4805 Orchard Rd, Cleveland, OH 44128"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
