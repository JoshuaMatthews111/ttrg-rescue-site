"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { getSettings, saveSettings, type LorenzoSettings } from "@/lib/lorenzo-store";

export default function SettingsPage() {
  const [settings, setSettings] = useState<LorenzoSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSettings(getSettings()); }, []);

  const handleSave = () => {
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return null;
  const u = (field: keyof LorenzoSettings, value: string | boolean) => setSettings({ ...settings, [field]: value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#0B1D3A]">Settings</h1>
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#C8102E] text-white px-4 py-2.5 rounded-lg text-sm font-bold">
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
        <div><label className="text-sm font-medium text-slate-700 block mb-1">Business Phone</label><input value={settings.phone} onChange={(e) => u("phone", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700 block mb-1">Business Email</label><input value={settings.email} onChange={(e) => u("email", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700 block mb-1">Address</label><input value={settings.address} onChange={(e) => u("address", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700 block mb-1">Facebook URL</label><input value={settings.socialFacebook} onChange={(e) => u("socialFacebook", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700 block mb-1">Instagram URL</label><input value={settings.socialInstagram} onChange={(e) => u("socialInstagram", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700 block mb-1">YouTube URL</label><input value={settings.socialYoutube} onChange={(e) => u("socialYoutube", e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" /></div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.announcementEnabled} onChange={(e) => u("announcementEnabled", e.target.checked)} className="rounded" /> Announcement Bar Enabled</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.emailCaptureEnabled} onChange={(e) => u("emailCaptureEnabled", e.target.checked)} className="rounded" /> Email Capture Popup Enabled</label>
        </div>
      </div>
    </div>
  );
}
