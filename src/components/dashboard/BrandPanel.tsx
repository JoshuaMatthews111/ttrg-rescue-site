"use client";

import { useState } from "react";
import { Brand } from "@/lib/brands";
import { getBrandLogo } from "./BrandLogos";
import {
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  ArrowUpRight,
  ExternalLink,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  UserPlus,
  Share2,
  Link2,
  Eye,
  X,
} from "lucide-react";

interface BrandPanelProps {
  brand: Brand;
}

export default function BrandPanel({ brand }: BrandPanelProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const quickActions = brand.id === "lorenzos"
    ? [
        { icon: Calendar, label: "Appointments", count: "12 today" },
        { icon: Users, label: "Trainers", count: "8 active" },
        { icon: UserPlus, label: "New Clients", count: "3 pending" },
        { icon: DollarSign, label: "Payments", count: "$2,450" },
        { icon: FileText, label: "Programs", count: "6 active" },
        { icon: MessageSquare, label: "Messages", count: "5 unread" },
        { icon: Share2, label: "Referrals", count: "24 total" },
        { icon: Link2, label: "Booking Links", count: "8 active" },
      ]
    : brand.id === "ttrg"
    ? [
        { icon: Users, label: "Donors", count: "856" },
        { icon: DollarSign, label: "Donations", count: "$28,150" },
        { icon: BarChart3, label: "Dog Journeys", count: "42 active" },
        { icon: MessageSquare, label: "Updates", count: "12 new" },
        { icon: FileText, label: "Stories", count: "18 published" },
        { icon: Share2, label: "Referrals", count: "67 total" },
        { icon: UserPlus, label: "Sponsors", count: "31 active" },
        { icon: Calendar, label: "Events", count: "3 upcoming" },
      ]
    : [
        { icon: Users, label: "Members", count: "432" },
        { icon: Globe, label: "Connections", count: "1,240" },
        { icon: FileText, label: "Listings", count: "89" },
        { icon: MessageSquare, label: "Messages", count: "14 unread" },
        { icon: Calendar, label: "Events", count: "5 upcoming" },
        { icon: DollarSign, label: "Revenue", count: "$15,800" },
        { icon: Share2, label: "Referrals", count: "52 total" },
        { icon: BarChart3, label: "Analytics", count: "View" },
      ];

  const referralStats = {
    totalReferrals: brand.id === "lorenzos" ? 247 : brand.id === "ttrg" ? 156 : 89,
    activeLinks: brand.id === "lorenzos" ? 18 : brand.id === "ttrg" ? 12 : 8,
    conversionRate: brand.id === "lorenzos" ? "34%" : brand.id === "ttrg" ? "28%" : "22%",
    topReferrer: brand.id === "lorenzos" ? "Sarah M." : brand.id === "ttrg" ? "Michael R." : "David K.",
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Brand Header */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ backgroundColor: brand.colors.primary }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at top right, ${brand.colors.accent}, transparent 60%)`,
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getBrandLogo(brand.id, "w-14 h-14")}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{brand.name}</h1>
              <p className="text-white/60 text-sm mt-0.5">{brand.tagline}</p>
              <p className="text-white/40 text-xs mt-1">{brand.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {brand.previewUrl !== "#" && (
              <button
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview Site
              </button>
            )}
            <a
              href={brand.previewUrl !== "#" ? brand.previewUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Site
            </a>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Visitors", value: brand.stats.visitors, icon: Globe, change: "+12%" },
          { label: "Revenue", value: brand.stats.revenue, icon: DollarSign, change: "+18%" },
          { label: "Users", value: brand.stats.users, icon: Users, change: "+9%" },
          { label: "Growth", value: brand.stats.growth, icon: TrendingUp, change: "+3%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-slate-400" />
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-[11px] text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors"
                style={{
                  backgroundColor: `${brand.colors.primary}10`,
                  color: brand.colors.primary,
                }}
              >
                <action.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{action.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Referral System + Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral System */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Referral System</h3>
            </div>
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-lg font-bold text-indigo-700">{referralStats.totalReferrals}</p>
                <p className="text-[10px] text-indigo-500">Total Referrals</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-lg font-bold text-emerald-700">{referralStats.conversionRate}</p>
                <p className="text-[10px] text-emerald-500">Conversion Rate</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">Active Links</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{referralStats.activeLinks}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">Top Referrer</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{referralStats.topReferrer}</span>
              </div>
            </div>
            <button
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: brand.colors.primary }}
            >
              Generate Referral Link
            </button>
          </div>
        </div>

        {/* Content Management */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Content Management</h3>
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">Manage</button>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: "Homepage", status: "Published", updated: "2 days ago" },
              { label: "About Page", status: "Published", updated: "1 week ago" },
              { label: "Services", status: "Draft", updated: "3 days ago" },
              { label: "Blog Posts", status: "12 Published", updated: "Yesterday" },
              { label: "Media Library", status: "248 files", updated: "Today" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-700 font-medium">{item.label}</p>
                    <p className="text-[10px] text-slate-400">Updated {item.updated}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen Site Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Browser Chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer" onClick={() => setPreviewOpen(false)} />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md h-7 flex items-center px-3 max-w-lg mx-auto border border-slate-200">
                  <Globe className="w-3 h-3 text-slate-400 mr-2" />
                  <span className="text-xs text-slate-500">{brand.domain}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={brand.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-700"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </a>
                <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* iframe Preview */}
            <iframe
              src={brand.previewUrl}
              className="flex-1 w-full border-0"
              title={`${brand.name} Preview`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
