"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  Dog, AlertTriangle, FileText, DollarSign, BookOpen, ArrowRight, Search, Bell,
  ShieldCheck, Stethoscope, Home, HandHeart, Repeat, Activity, TrendingUp,
  PawPrint, Heart, Truck, Wrench, GraduationCap, Building2, Plus, Eye, Send,
  Image as ImageIcon, Users,
} from "lucide-react";
import { RoleContext } from "./layout";

/* ─── DATA ─── */
const statCards = [
  { label: "Active Dogs", value: 126, sub: "+8 this week", icon: Dog, color: "from-blue-500 to-blue-700", trend: "up" },
  { label: "Urgent Cases", value: 9, sub: "Needs immediate attention", icon: AlertTriangle, color: "from-red-500 to-red-700", trend: "alert" },
  { label: "Pending Applications", value: 23, sub: "-4 vs last week", icon: FileText, color: "from-amber-500 to-orange-600", trend: "down" },
  { label: "Donations This Month", value: "$24,580", sub: "+18.7% vs last month", icon: DollarSign, color: "from-emerald-500 to-emerald-700", trend: "up" },
  { label: "Stories Published", value: 17, sub: "+5 this month", icon: BookOpen, color: "from-violet-500 to-purple-700", trend: "up" },
];

const pipeline = [
  { stage: "Rescue", count: 18, sub: "+3 new", icon: ShieldCheck, color: "bg-red-600/20 border-red-500/40" },
  { stage: "Rehabilitate", count: 22, sub: "In treatment", icon: Stethoscope, color: "bg-orange-600/20 border-orange-500/40" },
  { stage: "Training (Internal)", count: 27, sub: "In training", icon: GraduationCap, color: "bg-amber-600/20 border-amber-500/40" },
  { stage: "Foster", count: 31, sub: "In foster care", icon: Home, color: "bg-blue-600/20 border-blue-500/40" },
  { stage: "Adopt", count: 28, sub: "Ready", icon: HandHeart, color: "bg-emerald-600/20 border-emerald-500/40" },
];

const missionFeed = [
  { time: "10 min ago", type: "urgent", dog: "K9 Bella", text: "Needs foster placement", priority: "HIGH", location: "Houston, TX" },
  { time: "25 min ago", type: "urgent", dog: "K9 Rex", text: "Medical attention required", priority: "HIGH", location: "Memphis, TN" },
  { time: "45 min ago", type: "rescue", dog: "K9 Luna", text: "Rescue transport needed", priority: "MEDIUM", location: "Dallas, TX" },
  { time: "1 hr ago", type: "donation", dog: "", text: "$525 donation received for K9 Max", priority: "INFO", location: "John D." },
  { time: "2 hr ago", type: "application", dog: "", text: "New foster application submitted", priority: "INFO", location: "Amanda F." },
];

const approvalsQueue = [
  { name: "Amanda Foster", type: "Adoption Application", time: "9:50 AM", dog: "K9 Rocky" },
  { name: "Michael Thompson", type: "Foster Application", time: "9:15 AM", dog: "K9 Luna" },
  { name: "Jessica Martinez", type: "Adoption Application", time: "8:40 AM", dog: "K9 Daisy" },
  { name: "David Anderson", type: "Foster Application", time: "Yesterday", dog: "K9 Max" },
  { name: "Lisa Brown", type: "Adoption Application", time: "Yesterday", dog: "K9 Zeus" },
];

const donorActivity = [
  { initials: "JD", name: "John Davis", time: "10:20 AM", amount: "$525.00", purpose: "K9 Bella · Medical Care" },
  { initials: "SM", name: "Sarah Miller", time: "9:45 AM", amount: "$250.00", purpose: "Training Program" },
  { initials: "RW", name: "Robert White", time: "9:30 AM", amount: "$1,000.00", purpose: "Emergency Rescue Fund" },
  { initials: "EW", name: "Emily Wilson", time: "8:15 AM", amount: "$100.00", purpose: "K9 Max · Transport" },
  { initials: "TG", name: "The Garcia Family", time: "Yesterday", amount: "$300.00", purpose: "Foster Care Support" },
];

const quickActions = [
  { label: "Add Dog", icon: Plus, href: "/ttrg/admin/dogs" },
  { label: "Review Applications", icon: FileText, href: "/ttrg/admin/applications" },
  { label: "Add Story/Video", icon: BookOpen, href: "/ttrg/admin/media" },
  { label: "View Donations", icon: DollarSign, href: "/ttrg/admin/donations" },
  { label: "Manage Urgent Cases", icon: AlertTriangle, href: "/ttrg/admin/dogs?status=urgent" },
  { label: "Send Update", icon: Send, href: "/ttrg/admin/notifications" },
];

const priorityColors: Record<string, string> = {
  HIGH: "bg-red-500/20 text-red-300 border-red-500/30",
  MEDIUM: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  INFO: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

export default function AdminDashboard() {
  const { role } = useContext(RoleContext);

  // Trainer view
  if (role === "trainer") return <TrainerDashboard />;
  // Partner view
  if (role === "org_partner") return <PartnerDashboard />;

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
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input placeholder="Search dogs, cases, donors, applications..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/30" />
          </div>
          <button className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-white/60" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C41E2A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">12</span>
          </button>
        </div>
      </div>

      {/* Mission Feed Ticker */}
      <div className="bg-gradient-to-r from-[#C41E2A]/10 via-transparent to-transparent border border-[#C41E2A]/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3 overflow-hidden">
        <span className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#C41E2A] animate-pulse" />
          <span className="text-[#C41E2A] text-[10px] font-bold tracking-wider">MISSION FEED</span>
        </span>
        <div className="flex items-center gap-6 text-xs text-white/70 overflow-hidden whitespace-nowrap">
          <span>NEW RESCUE: K9 Max rescued in Houston, TX</span>
          <span className="text-white/30">•</span>
          <span>URGENT CASE: K9 Bella needs foster now</span>
          <span className="text-white/30">•</span>
          <span>DONATION RECEIVED: $525 from John D.</span>
        </div>
        <Link href="/ttrg/admin/notifications" className="ml-auto text-[#C41E2A] text-[10px] font-bold tracking-wider hover:underline flex-shrink-0">VIEW ALL →</Link>
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
            </div>
            <Link href="/ttrg/admin/dogs" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW DETAILS →</Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {pipeline.map((stage) => (
              <Link key={stage.stage} href="/ttrg/admin/dogs" className={`relative p-3 rounded-xl border ${stage.color} hover:scale-[1.03] transition-transform cursor-pointer`}>
                <stage.icon className="w-5 h-5 text-white mb-2" />
                <p className="text-3xl font-black text-white">{stage.count}</p>
                <p className="text-[10px] font-bold text-white/70 mt-1">{stage.stage}</p>
                <p className="text-[9px] text-white/40 mt-0.5">{stage.sub}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs text-white/40 flex items-center gap-2"><PawPrint className="w-3.5 h-3.5" /> TOTAL DOGS IN PIPELINE: <strong className="text-white">126</strong></span>
            <Link href="/ttrg/admin/dogs" className="text-[10px] font-bold text-[#C41E2A] hover:underline">VIEW PIPELINE DETAILS →</Link>
          </div>
        </div>

        {/* Mission Feed */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-bold text-white">MISSION FEED</h2>
            </div>
            <Link href="/ttrg/admin/notifications" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW ALL →</Link>
          </div>
          <div className="space-y-3">
            {missionFeed.slice(0, 4).map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  {item.type === "urgent" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {item.type === "rescue" && <Truck className="w-4 h-4 text-blue-400" />}
                  {item.type === "donation" && <DollarSign className="w-4 h-4 text-emerald-400" />}
                  {item.type === "application" && <FileText className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.dog && <p className="text-white text-xs font-bold">{item.dog}</p>}
                    {!item.dog && <p className="text-white text-xs font-bold">{item.text}</p>}
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${priorityColors[item.priority]}`}>{item.priority}</span>
                  </div>
                  {item.dog && <p className="text-white/60 text-xs mt-0.5">{item.text}</p>}
                  <p className="text-white/40 text-[10px] mt-1">{item.time} · {item.location}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/ttrg/admin/notifications" className="block text-center text-xs font-bold text-[#C41E2A] hover:underline mt-4 py-2 border-t border-white/5">VIEW ALL ALERTS &amp; INCIDENTS</Link>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Donations Analytics */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">DONATIONS ANALYTICS</h2>
            </div>
            <span className="text-[10px] text-white/40">This Month</span>
          </div>
          <p className="text-4xl font-black text-white">$24,580</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +18.7% vs last month</p>

          {/* Mini chart */}
          <div className="mt-5 h-24 flex items-end justify-between gap-1">
            {[40, 30, 55, 45, 60, 75, 50, 65, 80, 70, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-[#C41E2A] to-[#C41E2A]/30 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5">
            <div><p className="text-lg font-black text-white">142</p><p className="text-[10px] text-white/40">Total Donations</p></div>
            <div><p className="text-lg font-black text-white">$173</p><p className="text-[10px] text-white/40">Avg Donation</p></div>
            <div><p className="text-lg font-black text-white">23</p><p className="text-[10px] text-white/40">New Donors</p></div>
          </div>
        </div>

        {/* Recent Donor Activity */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-bold text-white">RECENT DONOR ACTIVITY</h2>
            </div>
            <Link href="/ttrg/admin/donations" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW ALL →</Link>
          </div>
          <div className="space-y-2">
            {donorActivity.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">{d.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{d.name}</p>
                  <p className="text-white/40 text-[10px] truncate">{d.purpose}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 text-xs font-black">{d.amount}</p>
                  <p className="text-white/30 text-[9px]">{d.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Approvals Queue */}
        <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">APPLICATIONS QUEUE</h2>
            </div>
            <Link href="/ttrg/admin/applications" className="text-[10px] font-bold text-white/40 hover:text-white">VIEW ALL →</Link>
          </div>
          <div className="space-y-2">
            {approvalsQueue.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">{a.name.split(" ").map((n) => n[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{a.name}</p>
                  <p className="text-white/40 text-[10px] truncate">{a.type}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="bg-amber-500/20 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded">PENDING</span>
                  <span className="text-white/30 text-[9px]">{a.dog}</span>
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
    { label: "My Assigned Dogs", value: 5, sub: "+0 this week", icon: Dog, color: "from-blue-500 to-blue-700" },
    { label: "Sessions Today", value: 3, sub: "of 5 scheduled", icon: GraduationCap, color: "from-emerald-500 to-emerald-700" },
    { label: "Dogs in Training", value: 4, sub: "80% in training stage", icon: PawPrint, color: "from-amber-500 to-orange-600" },
    { label: "Behavior Cases", value: 2, sub: "Need attention", icon: AlertTriangle, color: "from-red-500 to-red-700" },
    { label: "Upcoming Check-ins", value: 7, sub: "Next 7 days", icon: Bell, color: "from-violet-500 to-purple-700" },
  ];

  const myDogs = [
    { name: "K9 Rex", breed: "Belgian Malinois · 2 yrs", stage: "Training", milestone: "Off-Leash Recall", urgency: "HIGH" },
    { name: "K9 Luna", breed: "German Shepherd · 2 yrs", stage: "Training", milestone: "Distraction Proofing", urgency: "MEDIUM" },
    { name: "K9 Zeus", breed: "American Pit Bull · 1 yr", stage: "Training", milestone: "Leash Manners", urgency: "LOW" },
    { name: "K9 Daisy", breed: "Dutch Shepherd · 3 yrs", stage: "Foster/Recovery", milestone: "Medical Recheck", urgency: "LOW" },
    { name: "K9 Max", breed: "German Shepherd Mix · 1 yr", stage: "Rehabilitate", milestone: "Confidence Building", urgency: "HIGH" },
  ];

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
    { label: "Corporate Partners", value: 48, sub: "+4 this month", icon: Building2, color: "from-blue-500 to-blue-700" },
    { label: "Monthly Sponsors", value: 128, sub: "+15 this month", icon: Heart, color: "from-red-500 to-red-700" },
    { label: "Referral Leads", value: 76, sub: "+12 this month", icon: Users, color: "from-amber-500 to-orange-600" },
    { label: "Dogs Shared", value: 34, sub: "+6 this month", icon: Dog, color: "from-emerald-500 to-emerald-700" },
    { label: "Funds Raised", value: "$87,450", sub: "+18.7% vs last month", icon: DollarSign, color: "from-violet-500 to-purple-700" },
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
