"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  Heart, Shield, Stethoscope, GraduationCap, Home, PawPrint, CheckCircle2,
  Phone, Mail, Truck, Sparkles, Utensils, Activity, AlertTriangle, Award,
  Building2, ArrowRight, DollarSign, CreditCard, Lock, Loader2, XCircle,
} from "lucide-react";
import { addDonation } from "@/lib/admin-store";

const donationOptions = [
  { amount: 25, label: "Feed a Rescue", desc: "Provides nutritious meals for one dog for a week", icon: PawPrint },
  { amount: 50, label: "Basic Medical Care", desc: "Covers flea treatment, deworming, and basic vet needs", icon: Stethoscope },
  { amount: 100, label: "Vet & Nutrition", desc: "Specialized food, supplements, and veterinary support", icon: Shield },
  { amount: 250, label: "Training & Rehab", desc: "Funds a full week of professional rehabilitation training", icon: GraduationCap },
  { amount: 500, label: "Surgery Fund", desc: "Helps cover emergency or corrective surgery for injured dogs", icon: Heart },
  { amount: 1000, label: "Full Sponsorship", desc: "Covers an entire month of care, training, and housing", icon: Home },
];

const rescueCosts = [
  { icon: Truck, label: "Shelter Pull + Transport", cost: "$150 – $500" },
  { icon: Stethoscope, label: "Vet Exam, Meds, Buffer", cost: "$1,000 – $3,000" },
  { icon: Sparkles, label: "Grooming + Microchip", cost: "$150 – $300" },
  { icon: Utensils, label: "Supplies", cost: "$400 – $800" },
  { icon: Home, label: "Boarding (45 days)", cost: "$3,375" },
  { icon: GraduationCap, label: "Training", cost: "$3,500" },
  { icon: Activity, label: "Marketing", cost: "$200 – $500" },
  { icon: Shield, label: "Admin / Legal", cost: "$150 – $300" },
  { icon: AlertTriangle, label: "Contingency", cost: "$500 – $2,000" },
];

const sponsorTiers = [
  { name: "Supporter", price: 25, impact: "Feeds a dog", icon: Utensils, popular: false },
  { name: "Care Partner", price: 50, impact: "Daily care + supplies", icon: PawPrint, popular: false },
  { name: "Health Sponsor", price: 100, impact: "Medical support", icon: Stethoscope, popular: true },
  { name: "Training Sponsor", price: 250, impact: "Training + rehabilitation", icon: GraduationCap, popular: false },
  { name: "Transformation Partner", price: 500, impact: "Full journey support", icon: Heart, popular: false },
  { name: "Inner Circle", price: 1000, impact: "Major impact + expansion", icon: Award, popular: false },
];

const missionTiers = [
  { tier: "Foundation", amount: 50, supports: "Utilities" },
  { tier: "Facility", amount: 250, supports: "Maintenance" },
  { tier: "Operations", amount: 500, supports: "Daily care systems" },
  { tier: "Mission Partner", amount: 1000, supports: "Monthly support" },
  { tier: "Expansion Sponsor", amount: 2500, supports: "Facility builds & expansion" },
];

const inputCls = "w-full h-12 px-5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 focus:border-[#C41E2A]/40";

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) return d.slice(0, 2) + "/" + d.slice(2);
  return d;
}

function DonateInner() {
  const params = useSearchParams();
  const dogName = params.get("ttrgDog") || "";
  const preAmount = params.get("amount") ? Number(params.get("amount")) : null;
  const formRef = useRef<HTMLFormElement>(null);

  const [selected, setSelected] = useState<number | null>(preAmount || 50);
  const [custom, setCustom] = useState("");
  const [donationType, setDonationType] = useState<"monthly" | "once">("once");
  const [showCosts, setShowCosts] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [trainerReferral, setTrainerReferral] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // State
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ message: string; transactionId?: string; subscriptionId?: string } | null>(null);

  const finalAmount = custom ? parseFloat(custom) : selected || 0;

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (finalAmount < 1) { setError("Please select or enter a donation amount."); return; }

    // Format expiry from MM/YY to MMYY
    const expClean = expiry.replace(/\D/g, "");
    if (expClean.length !== 4) { setError("Please enter a valid expiration date (MM/YY)."); return; }

    setProcessing(true);
    try {
      const res = await fetch("/api/ttrg/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          cardNumber: cardNumber.replace(/\s/g, ""),
          expDate: expClean,
          cvv,
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          address: address || undefined,
          city: city || undefined,
          state: state || undefined,
          zip: zip || undefined,
          donationType,
          dogName: dogName || undefined,
          trainerReferral: trainerReferral || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addDonation({
          id: data.transactionId || `don-${Date.now()}`,
          name: `${firstName} ${lastName}`,
          email,
          amount: finalAmount,
          frequency: donationType === "monthly" ? "monthly" : "one-time",
          dogName: dogName || undefined,
          date: new Date().toISOString(),
          status: "completed",
          last4: cardNumber.replace(/\s/g, "").slice(-4),
        });
        setSuccess(data);
      } else {
        setError(data.error || "Payment failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Thank You!</h1>
          <p className="text-[#1B2A4A]/60 mb-4">{success.message}</p>
          {success.transactionId && <p className="text-sm text-[#1B2A4A]/40 mb-2">Transaction ID: <span className="font-mono font-bold">{success.transactionId}</span></p>}
          {success.subscriptionId && <p className="text-sm text-[#1B2A4A]/40 mb-2">Subscription ID: <span className="font-mono font-bold">{success.subscriptionId}</span></p>}
          <p className="text-sm text-[#1B2A4A]/40 mb-2">Amount: <strong>${finalAmount.toFixed(2)}{donationType === "monthly" ? "/month" : ""}</strong></p>
          <p className="text-sm text-[#1B2A4A]/40 mb-6">A confirmation will be sent to <strong>{email}</strong></p>
          <p className="text-sm text-[#1B2A4A]/40 mb-8">Questions? Call <a href="tel:+18664364959" className="text-[#C41E2A] font-semibold">(866) 436-4959</a> or email <a href="mailto:info@teamtrainersrescuegroup.com" className="text-[#C41E2A] font-semibold">info@teamtrainersrescuegroup.com</a></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ttrg/sponsor" className="bg-[#C41E2A] hover:bg-[#A01825] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
              Sponsor a Dog
            </Link>
            <Link href="/ttrg" className="border border-slate-200 text-[#1B2A4A] px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-[#C41E2A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Every Dollar Saves a Life</h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
            Your generosity rescues dogs from danger, heals them, and places them in loving forever homes.
          </p>
          {dogName && <p className="text-[#C41E2A] font-bold mt-3">Donating for: {dogName}</p>}
          <p className="text-white/30 text-sm mt-3">Team Trainers Rescue Group · 501(c)(3)</p>
        </div>
      </section>

      {/* ═══ A. DONATION FORM ═══ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#1B2A4A] text-center mb-8">Make a Donation</h2>

          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#FAFAF8] rounded-full p-1 border border-slate-100 inline-flex">
              <button onClick={() => setDonationType("monthly")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${donationType === "monthly" ? "bg-[#C41E2A] text-white shadow" : "text-[#1B2A4A]/60"}`}>
                Monthly
              </button>
              <button onClick={() => setDonationType("once")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${donationType === "once" ? "bg-[#C41E2A] text-white shadow" : "text-[#1B2A4A]/60"}`}>
                One-Time
              </button>
            </div>
          </div>

          {/* Amount Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {donationOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => { setSelected(opt.amount); setCustom(""); }}
                className={`rounded-2xl p-5 text-left transition-all border ${selected === opt.amount ? "bg-[#C41E2A] border-[#C41E2A] text-white shadow-lg" : "bg-white border-slate-200 hover:border-[#C41E2A]/40"}`}
              >
                <opt.icon className={`w-5 h-5 mb-2 ${selected === opt.amount ? "text-white" : "text-[#C41E2A]"}`} />
                <p className="text-2xl font-bold">${opt.amount}</p>
                <p className={`text-xs font-semibold mt-1 ${selected === opt.amount ? "text-white/80" : "text-[#1B2A4A]"}`}>{opt.label}</p>
                <p className={`text-[10px] mt-1 leading-relaxed ${selected === opt.amount ? "text-white/60" : "text-[#1B2A4A]/40"}`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          {/* Custom */}
          <div className="mb-8">
            <input
              type="number"
              min="1"
              placeholder="Enter custom amount ($)"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
              className="w-full h-12 px-5 rounded-xl border border-slate-200 text-[#1B2A4A] text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 focus:border-[#C41E2A]/40"
            />
          </div>

          {/* Payment Form */}
          <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
              <input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
            </div>
            <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            <input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            <input type="text" placeholder="Trainer Referral (Who referred you?) *" required value={trainerReferral} onChange={(e) => setTrainerReferral(e.target.value)} className={inputCls} />

            {/* Billing Address */}
            <div className="pt-2">
              <p className="text-xs font-bold text-[#1B2A4A]/40 uppercase tracking-wider mb-3">Billing Address</p>
              <input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls + " mb-3"} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                <input type="text" placeholder="State" maxLength={2} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} className={inputCls} />
                <input type="text" placeholder="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* Credit Card */}
            <div className="bg-[#FAFAF8] rounded-2xl p-6 border border-slate-100 mt-2">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#C41E2A]" />
                <h3 className="text-sm font-bold text-[#1B2A4A]">Payment Details</h3>
                <div className="ml-auto flex items-center gap-1 text-emerald-600">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Secure</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Card Number"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    autoComplete="cc-number"
                    className={inputCls + " pr-12"}
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    autoComplete="cc-exp"
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    autoComplete="cc-csc"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] text-[#1B2A4A]/30">
                <Lock className="w-3 h-3" />
                <span>Your payment is securely processed by Authorize.Net. TTRG never stores your card information.</span>
              </div>
              {/* RapidScan Security Site Seal */}
              <div className="flex justify-center mt-4">
                <div id="rapidscan-siteseal"></div>
              </div>
              <Script
                src="https://rapidscansecure.com/siteseal/siteseal.js?code=144,41183B1A4716EFAEDA66CF216BD026E8EC73FC28"
                strategy="afterInteractive"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={processing || finalAmount < 1}
              className="w-full bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl text-base font-bold transition-colors flex items-center justify-center gap-2"
            >
              {processing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...</>
              ) : (
                <><Lock className="w-4 h-4" /> DONATE ${finalAmount > 0 ? finalAmount.toFixed(2) : "0.00"} {donationType === "monthly" ? "/ MONTH" : ""}</>
              )}
            </button>

            <p className="text-center text-[10px] text-[#1B2A4A]/30 mt-2">
              {donationType === "monthly" ? "Your card will be charged monthly until you cancel. Contact us anytime to modify or cancel." : "One-time secure charge to your credit card."}
            </p>

            {/* Alt Contact */}
            <div className="text-center pt-2">
              <p className="text-xs text-[#1B2A4A]/40 mb-2">Prefer to donate another way?</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="tel:+18664364959" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B2A4A]/60 hover:text-[#C41E2A] transition-colors">
                  <Phone className="w-3.5 h-3.5" /> (866) 436-4959
                </a>
                <a href="mailto:info@teamtrainersrescuegroup.com" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B2A4A]/60 hover:text-[#C41E2A] transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email Us
                </a>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ═══ B. COST TRANSPARENCY (COLLAPSIBLE) ═══ */}
      <section className="py-14 sm:py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] mb-3">How Your Donation Makes a Difference</h2>
            <p className="text-[#1B2A4A]/50 text-sm max-w-xl mx-auto mb-6">Here&apos;s what it takes to move one dog from rescue to a forever home.</p>
            <button
              onClick={() => setShowCosts(!showCosts)}
              className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-6 py-3 rounded-full text-sm font-bold transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              {showCosts ? "Hide Cost Breakdown" : "See How Your Support Helps"}
            </button>
          </div>

          {showCosts && (
            <div className="mt-10 animate-fade-up">
              <p className="text-center text-[#1B2A4A]/50 text-sm mb-6">It costs approximately <strong className="text-[#C41E2A]">$10,000</strong> to fully rescue, rehabilitate, and rehome one dog.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rescueCosts.map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-lg transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#C41E2A]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1B2A4A] text-sm">{item.label}</p>
                      <p className="text-[#C41E2A] font-black text-lg">{item.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 bg-[#1B2A4A] text-white px-6 py-3 rounded-full text-sm font-bold">
                  <DollarSign className="w-4 h-4" /> Total Per Dog: ~$10,000
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ C. MONTHLY SPONSORSHIP TIERS ═══ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">Monthly Sponsorship</h2>
            <p className="text-[#1B2A4A]/50 text-sm mt-2">Ongoing support that makes lasting change. Choose a tier that fits your heart.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sponsorTiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-3xl border p-7 transition-all hover:shadow-xl ${tier.popular ? "border-[#C41E2A] bg-[#FFF8F8] shadow-lg" : "border-slate-100 bg-white"}`}>
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C41E2A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</span>
                )}
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] flex items-center justify-center mb-4">
                  <tier.icon className="w-6 h-6 text-[#C41E2A]" />
                </div>
                <p className="text-sm font-bold text-[#1B2A4A]/50 uppercase tracking-wider">{tier.name}</p>
                <p className="text-4xl font-black text-[#1B2A4A] mt-1">${tier.price}<span className="text-base font-medium text-[#1B2A4A]/40">/mo</span></p>
                <p className="text-sm text-[#1B2A4A]/60 mt-2 mb-6">{tier.impact}</p>
                <button onClick={() => { setSelected(tier.price); setCustom(""); setDonationType("monthly"); scrollToForm(); }} className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition-colors ${tier.popular ? "bg-[#C41E2A] hover:bg-[#A01825] text-white" : "border border-slate-200 text-[#1B2A4A] hover:bg-slate-50"}`}>
                  Become a {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ D. MISSION SUPPORT TIERS ═══ */}
      <section className="py-14 sm:py-16 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Help Us Keep the Mission Moving</h2>
            <p className="text-white/50 text-sm mt-2 max-w-lg mx-auto">Support the system that saves dogs. Your contribution keeps our facility, operations, and rescue infrastructure running.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {missionTiers.map((t) => (
              <div key={t.tier} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all text-center">
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{t.tier}</p>
                <p className="text-3xl font-black text-white mt-2">${t.amount.toLocaleString()}</p>
                <p className="text-white/40 text-xs mt-2">{t.supports}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ E. CORPORATE GIVING ═══ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="w-12 h-12 text-[#1B2A4A] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] mb-3">Partner With TTRG</h2>
          <p className="text-[#1B2A4A]/50 text-base max-w-lg mx-auto mb-8">
            Businesses can make a meaningful impact through corporate sponsorship, event partnerships, and community giving initiatives.
          </p>
          <Link href="/ttrg/contact" className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66] text-white px-8 py-4 rounded-full text-sm font-bold transition-all">
            Contact Us About Corporate Giving <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="text-center pb-8 px-4">
        <p className="text-[11px] text-slate-400">
          Team Trainers Rescue Group is a 501(c)(3) nonprofit organization. EIN: 46-1426142
        </p>
        <p className="text-[10px] text-slate-300 mt-1">All donations are tax-deductible to the extent allowed by law.</p>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C41E2A]" /></div>}>
      <DonateInner />
    </Suspense>
  );
}
