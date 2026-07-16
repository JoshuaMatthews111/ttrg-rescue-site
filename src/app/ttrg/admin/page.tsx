"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  Dog, AlertTriangle, FileText, DollarSign, BookOpen, ArrowRight, Search, Bell,
  ShieldCheck, Stethoscope, Home, HandHeart, Repeat, Activity, TrendingUp,
  PawPrint, Heart, Truck, Wrench, GraduationCap, Building2, Plus, Eye, Send,
  Image as ImageIcon, Users, Paintbrush, Info,
} from "lucide-react";
import { RoleContext } from "./layout";
import {
  fetchDogs, fetchSubmissions, fetchDonations, fetchFosterApplications,
  fetchSponsorInterests, fetchAuditLogs,
  type AdminDog, type Submission, type Donation,
} from "@/lib/admin-store";

/* ─── Info Tooltip ─── */
function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1.5" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <Info className="w-3.5 h-3.5 text-white/30 hover:text-white/60 cursor-help transition-colors" />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#1B2A4A] border border-white/20 text-white/80 text-[10px] leading-relaxed p-2.5 rounded-lg shadow-xl z-50 pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

const quickActions = [
  { label: "Add Dog", icon: Plus, href: "/ttrg/admin/dogs" },
  { label: "Review Applications", icon: FileText, href: "/ttrg/admin/applications" },
  { label: "Add Story/Video", icon: BookOpen, href: "/ttrg/admin/media" },
  { label: "View Donations", icon: DollarSign, href: "/ttrg/admin/donations" },
  { label: "Site Builder", icon: Paintbrush, href: "/ttrg/admin/site-builder" },
  { label: "Send Update", icon: Send, href: "/ttrg/admin/notifications" },
];

const priorityColors: Record<string, string> = {
  HIGH: "bg-red-500/20 text-red-300 border-red-500/30",
  MEDIUM: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  INFO: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

export default function AdminDashboard() {
  const { role } = useContext(RoleContext);
  const [dogs, setDogs] = useState<AdminDog[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fosterApps, setFosterApps] = useState<{ id: string; firstName?: string; lastName?: string; status?: string; date?: string }[]>([]);
  const [sponsors, setSponsors] = useState<{ id: string; name: string; dogName?: string; amount?: number; date?: string }[]>([]);
  const [auditLogs, setAuditLogs] = useState<{ action: string; entityName?: string; userName?: string; timestamp?: string }[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  useEffect(() => {
    async function load() {
      const [d, s, don, fa, sp, logs] = await Promise.all([
        fetchDogs(), fetchSubmissions(), fetchDonations(),
        fetchFosterApplications(), fetchSponsorInterests(), fetchAuditLogs(),
      ]);
      setDogs(d); setSubmissions(s); setDonations(don);
      setFosterApps(fa as unknown as typeof fosterApps);
      setSponsors(sp as unknown as typeof sponsors);
      setAuditLogs(logs as unknown as typeof auditLogs);
      setLastRefresh(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) + " ET");
    }
    load();
  }, []);

  // Trainer view
  if (role === "trainer") return <TrainerDashboard />;
  // Partner view
  if (role === "org_partner") return <PartnerDashboard />;

  // Computed real stats
  const publishedDogs = dogs.filter((d) => d.status === "published" || d.status === "urgent");
  const urgentDogs = dogs.filter((d) => d.urgent || d.status === "urgent");
  const pendingSubs = submissions.filter((s) => s.status === "pending");
  const totalDonationAmt = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const pendingFoster = fosterApps.filter((f) => f.status === "pending");

  const pipelineCounts = {
    rescue: dogs.filter((d) => d.stage === "rescue").length,
    rehabilitate: dogs.filter((d) => d.stage === "rehabilitate").length,
    train: dogs.filter((d) => d.stage === "train").length,
    recover: dogs.filter((d) => d.stage === "recover").length,
    rehome: dogs.filter((d) => d.stage === "rehome").length,
  };

  const pipeline = [
    { stage: "Rescue", count: pipelineCounts.rescue, icon: ShieldCheck, color: "bg-red-600/20 border-red-500/40" },
    { stage: "Rehabilitate", count: pipelineCounts.rehabilitate, icon: Stethoscope, color: "bg-orange-600/20 border-orange-500/40" },
    { stage: "Training", count: pipelineCounts.train, icon: GraduationCap, color: "bg-amber-600/20 border-amber-500/40" },
    { stage: "Recover", count: pipelineCounts.recover, icon: Home, color: "bg-blue-600/20 border-blue-500/40" },
    { stage: "Rehome", count: pipelineCounts.rehome, icon: HandHeart, color: "bg-emerald-600/20 border-emerald-500/40" },
  ];

  const statCards = [
    { label: "Active Dogs", value: publishedDogs.length, sub: `${dogs.length} total in system`, icon: Dog, color: "from-blue-500 to-blue-700", trend: "up" as const },
    { label: "Urgent Cases", value: urgentDogs.length, sub: "Needs immediate attention", icon: AlertTriangle, color: "from-red-500 to-red-700", trend: "alert" as const },
    { label: "Pending Applications", value: pendingSubs.length + pendingFoster.length, sub: `${pendingSubs.length} submissions, ${pendingFoster.length} foster`, icon: FileText, color: "from-amber-500 to-orange-600", trend: "down" as const },
    { label: "Total Donations", value: `$${totalDonationAmt.toLocaleString()}`, sub: `${donations.length} donations recorded`, icon: DollarSign, color: "from-emerald-500 to-emerald-700", trend: "up" as const },
    { label: "Sponsor Interests", value: sponsors.length, sub: "Active sponsor inquiries", icon: Heart, color: "from-violet-500 to-purple-700", trend: "up" as const },
  ];

  // Super Admin / Admin view
  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">TEAM TRAINERS RESCUE GROUP</h1>
          <p className="text-white/40 text-xs mt-1">RESCUE. REHABILITATE. <span className="text-[#C41E2A] font-bold">TRAIN.</span> REHOME.</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-[10px] text-white/30">Last refreshed: {lastRefresh}</span>}
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input placeholder="Search dogs, cases, donors..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
              {card.trend === "alert" && <AlertTriangle className="w-4 h-4 text-red-400" />}
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Rescue Pipeline - takes 2 cols */}
        <div className="lg:col-span-2 bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#C41E2A]" />
              <h2 className="text-sm font-bold text-white">DOG JOURNEY PIPELINE</h2>
              <InfoTip text="Shows the number of dogs currently in each stage of their journey. These counts are live from the database and update as you change dog stages in the Dogs Management page." />
            </div>
            <Link href="/ttrg/admin/dogs" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW DETAILS →</Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {pipeline.map((stage) => (
              <Link key={stage.stage} href="/ttrg/admin/dogs" className={`relative p-3 rounded-xl border ${stage.color} hover:scale-[1.03] transition-transform cursor-pointer`}>
                <stage.icon className="w-5 h-5 text-white mb-2" />
                <p className="text-3xl font-black text-white">{stage.count}</p>
                <p className="text-[10px] font-bold text-white/70 mt-1">{stage.stage}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs text-white/40 flex items-center gap-2"><PawPrint className="w-3.5 h-3.5" /> TOTAL DOGS IN SYSTEM: <strong className="text-white">{dogs.length}</strong></span>
            <Link href="/ttrg/admin/dogs" className="text-[10px] font-bold text-[#C41E2A] hover:underline">VIEW ALL DOGS →</Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">RECENT ACTIVITY</h2>
              <InfoTip text="Shows the latest actions taken in the admin panel (dog edits, status changes, deletions). Updated in real-time from the audit log." />
            </div>
          </div>
          <div className="space-y-3">
            {auditLogs.length === 0 && (
              <p className="text-white/30 text-xs text-center py-8">No activity yet. Changes you make will appear here.</p>
            )}
            {auditLogs.slice(0, 5).map((log, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{log.action?.replace(/_/g, " ").toUpperCase()}</p>
                  <p className="text-white/60 text-[10px] truncate">{log.entityName || "—"} · by {log.userName || "Admin"}</p>
                  <p className="text-white/30 text-[9px] mt-0.5">{log.timestamp ? new Date(log.timestamp).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "short", timeStyle: "short" }) : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Donations */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">DONATIONS</h2>
              <InfoTip text="Total donations recorded in the system. These are from site submissions. To connect Authorize.net for live payment tracking, the API Login ID, Transaction Key, and Signature Key are needed." />
            </div>
            <Link href="/ttrg/admin/donations" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW ALL →</Link>
          </div>
          <p className="text-4xl font-black text-white">${totalDonationAmt.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1">{donations.length} donations recorded</p>
          <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/5">
            <div><p className="text-lg font-black text-white">{donations.length}</p><p className="text-[10px] text-white/40">Total Donations</p></div>
            <div><p className="text-lg font-black text-white">${donations.length > 0 ? Math.round(totalDonationAmt / donations.length) : 0}</p><p className="text-[10px] text-white/40">Avg Donation</p></div>
          </div>
        </div>

        {/* Recent Donors */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-bold text-white">RECENT DONORS</h2>
              <InfoTip text="Donors who have submitted donations via the site. Shows actual donor names, amounts, and dates from the database." />
            </div>
            <Link href="/ttrg/admin/donations" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW ALL →</Link>
          </div>
          <div className="space-y-2">
            {donations.length === 0 && <p className="text-white/30 text-xs text-center py-8">No donations yet.</p>}
            {donations.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                  {d.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{d.name}</p>
                  <p className="text-white/40 text-[10px] truncate">{d.dogName ? `Sponsor: ${d.dogName}` : "General Donation"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 text-xs font-black">${d.amount}</p>
                  <p className="text-white/30 text-[9px]">{d.date ? new Date(d.date).toLocaleDateString() : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foster/Sponsor Applications */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">FOSTER APPLICATIONS</h2>
              <InfoTip text="Foster applications submitted through the public site. Shows applicant names and status. Pending applications need admin review." />
            </div>
            <Link href="/ttrg/admin/applications" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW ALL →</Link>
          </div>
          <div className="space-y-2">
            {fosterApps.length === 0 && <p className="text-white/30 text-xs text-center py-8">No foster applications yet.</p>}
            {fosterApps.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                  {((a.firstName || "")[0] || "") + ((a.lastName || "")[0] || "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{a.firstName} {a.lastName}</p>
                  <p className="text-white/40 text-[10px] truncate">Foster Application</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${a.status === "pending" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>{(a.status || "pending").toUpperCase()}</span>
                  <span className="text-white/30 text-[9px]">{a.date ? new Date(a.date).toLocaleDateString() : ""}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/ttrg/admin/applications" className="block text-center text-xs font-bold text-[#C41E2A] hover:underline mt-4 py-2 border-t border-white/5">REVIEW ALL APPLICATIONS</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-[#C41E2A]" /> QUICK ACTIONS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((qa) => (
            <Link key={qa.label} href={qa.href} className="bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#C41E2A]/40 rounded-xl p-4 text-center transition-all group">
              <qa.icon className="w-6 h-6 text-[#C41E2A] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-white">{qa.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TRAINER DASHBOARD ─── */
function TrainerDashboard() {
  const trainerStats = [
    { label: "My Assigned Dogs", value: 0, sub: "No assignments yet", icon: Dog, color: "from-blue-500 to-blue-700" },
    { label: "Sessions Today", value: 0, sub: "None scheduled", icon: GraduationCap, color: "from-emerald-500 to-emerald-700" },
    { label: "Dogs in Training", value: 0, sub: "—", icon: PawPrint, color: "from-amber-500 to-orange-600" },
    { label: "Behavior Cases", value: 0, sub: "—", icon: AlertTriangle, color: "from-red-500 to-red-700" },
    { label: "Upcoming Check-ins", value: 0, sub: "—", icon: Bell, color: "from-violet-500 to-purple-700" },
  ];

  const myDogs: { name: string; breed: string; stage: string; milestone: string; urgency: string }[] = [];

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">TRAINER PORTAL</h1>
          <p className="text-white/40 text-xs mt-1">Training Team · Manage your assigned dogs, sessions, and milestones</p>
        </div>
        <Link href="/ttrg/admin/appointment" className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Send Appointment Link
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {trainerStats.map((card) => (
          <div key={card.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Dog className="w-4 h-4 text-[#C41E2A]" /> MY ASSIGNED DOGS</h2>
          <div className="space-y-2">
            {myDogs.map((dog) => (
              <div key={dog.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C41E2A]/30 to-[#C41E2A]/10 flex items-center justify-center">
                  <Dog className="w-6 h-6 text-[#C41E2A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold">{dog.name}</p>
                  <p className="text-white/40 text-xs">{dog.breed}</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-white/60 text-xs">{dog.stage}</p>
                  <p className="text-white/40 text-[10px]">{dog.milestone}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded border ${priorityColors[dog.urgency]}`}>{dog.urgency}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><PawPrint className="w-4 h-4 text-emerald-400" /> SHARE A STORY</h2>
          <p className="text-xs text-white/50 mb-4">Share a dog&apos;s progress with the admin team. They&apos;ll review and may publish it on the homepage.</p>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center mb-3 hover:border-white/20 transition-colors cursor-pointer">
            <ImageIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
            <p className="text-white/40 text-xs">Drag &amp; drop photos or videos here</p>
            <button className="mt-3 bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-4 py-2 rounded-lg">Choose Files</button>
          </div>
          <textarea placeholder="Write a short story about this dog's progress..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30 resize-none" />
          <button className="w-full mt-3 bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold py-3 rounded-xl">Submit Story</button>
        </div>
      </div>
    </div>
  );
}

/* ─── PARTNER DASHBOARD ─── */
function PartnerDashboard() {
  const partnerStats = [
    { label: "Corporate Partners", value: 0, sub: "—", icon: Building2, color: "from-blue-500 to-blue-700" },
    { label: "Monthly Sponsors", value: 0, sub: "—", icon: Heart, color: "from-red-500 to-red-700" },
    { label: "Referral Leads", value: 0, sub: "—", icon: Users, color: "from-amber-500 to-orange-600" },
    { label: "Dogs Shared", value: 0, sub: "—", icon: Dog, color: "from-emerald-500 to-emerald-700" },
    { label: "Funds Raised", value: "$0", sub: "—", icon: DollarSign, color: "from-violet-500 to-purple-700" },
  ];

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PARTNER &amp; OUTREACH PORTAL</h1>
          <p className="text-white/40 text-xs mt-1">Stronger Partners. More Lives Saved.</p>
        </div>
        <Link href="/ttrg/admin/partners" className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <Send className="w-4 h-4" /> Submit Referral
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {partnerStats.map((card) => (
          <div key={card.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-[10px] text-emerald-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-[#C41E2A]" /> SHAREABLE LINKS &amp; RESOURCES</h2>
        <div className="space-y-3">
          {[
            { label: "Sponsor a Dog Campaign", url: "/ttrg/sponsor", desc: "Monthly support for rescue dogs" },
            { label: "Infrastructure Support", url: "/ttrg#infrastructure", desc: "Kennels, training facilities, vehicles" },
            { label: "Vet Care Fund", url: "/ttrg/donate?fund=vet", desc: "Medical, surgery, emergency care" },
            { label: "Recommend a Dog", url: "/ttrg/submit", desc: "Partner referral pipeline" },
          ].map((link) => (
            <div key={link.label} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold">{link.label}</p>
                <p className="text-white/40 text-xs">{link.desc}</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(window.location.origin + link.url)} className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-3 py-2 rounded-lg">Copy Link</button>
              <Link href={link.url} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-[10px] font-bold px-3 py-2 rounded-lg flex items-center gap-1">
                <Eye className="w-3 h-3" /> View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
