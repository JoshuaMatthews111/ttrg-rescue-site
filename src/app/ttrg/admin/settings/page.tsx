"use client";

import { Save, Globe, Mail, Bell, Shield, Palette, Image } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Settings</h1>
        <p className="text-sm text-[#1B2A4A]/50">Manage site configuration, notifications, and integrations</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Organization */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Globe className="w-4 h-4 text-blue-600" /></div>
            <h2 className="font-bold text-[#1B2A4A]">Organization</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#1B2A4A]/50 block mb-1">Organization Name</label>
                <input type="text" defaultValue="Team Trainer Rescue Group" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              </div>
              <div>
                <label className="text-xs text-[#1B2A4A]/50 block mb-1">Tax ID</label>
                <input type="text" placeholder="Available upon request" defaultValue="" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#1B2A4A]/50 block mb-1">Address</label>
              <input type="text" defaultValue="4805 Orchard Rd, Cleveland, OH 44128" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#1B2A4A]/50 block mb-1">Phone</label>
                <input type="text" defaultValue="(866) 436-4959" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              </div>
              <div>
                <label className="text-xs text-[#1B2A4A]/50 block mb-1">Email</label>
                <input type="text" defaultValue="info@teamtrainersrescuegroup.com" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Email & Integrations */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><Mail className="w-4 h-4 text-emerald-600" /></div>
            <h2 className="font-bold text-[#1B2A4A]">Email &amp; Integrations</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#1B2A4A]/50 block mb-1">Email Provider</label>
              <select className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option>Mailchimp</option>
                <option>ConvertKit</option>
                <option>SendGrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#1B2A4A]/50 block mb-1">API Key</label>
              <input type="password" defaultValue="sk-xxxxxxxxxxxxx" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
            </div>
            <div>
              <label className="text-xs text-[#1B2A4A]/50 block mb-1">Chat Widget</label>
              <select className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                <option>Crisp Chat</option>
                <option>Intercom</option>
                <option>Tawk.to</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><Bell className="w-4 h-4 text-amber-600" /></div>
            <h2 className="font-bold text-[#1B2A4A]">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              "New dog submissions",
              "Foster/Volunteer applications",
              "New sponsorships & donations",
              "Trainer updates on dog profiles",
              "Contact form submissions",
              "Urgent dog alerts",
              "Admin announcements",
            ].map((pref) => (
              <label key={pref} className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF8] cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="text-sm text-[#1B2A4A]">{pref}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#C41E2A]" />
              </label>
            ))}
          </div>
        </div>

        <button className="w-full sm:w-auto bg-[#C41E2A] hover:bg-[#A01825] text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
