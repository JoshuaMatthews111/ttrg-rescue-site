"use client";

import { Bell, CheckCircle2, AlertTriangle, Heart, Users, Upload, FileText, Mail, Send } from "lucide-react";

const notifications = [
  { id: 1, type: "submission", icon: Upload, title: "New Dog Submission", desc: "Max (German Shepherd Mix) submitted by Houston Animal Shelter — Critical urgency", time: "2 hours ago", read: false },
  { id: 2, type: "application", icon: FileText, title: "Foster Application", desc: "Sarah Mitchell applied to foster Tucker", time: "3 hours ago", read: false },
  { id: 3, type: "donation", icon: Heart, title: "New Sponsorship", desc: "John Kim started $100/mo sponsorship for Daisy", time: "4 hours ago", read: false },
  { id: 4, type: "alert", icon: AlertTriangle, title: "Urgent: Surgery Funding", desc: "Shadow's surgery fund is at 30% — needs $700 more", time: "6 hours ago", read: false },
  { id: 5, type: "application", icon: Users, title: "Volunteer Application", desc: "Mike Torres wants to help with weekend events", time: "8 hours ago", read: false },
  { id: 6, type: "update", icon: CheckCircle2, title: "Trainer Update", desc: "Lorenzo updated Bailey's training notes — 'Responding well to leash training'", time: "1 day ago", read: true },
  { id: 7, type: "submission", icon: Upload, title: "Submission Approved", desc: "Admin approved Coco (Poodle Mix) for public listing", time: "1 day ago", read: true },
  { id: 8, type: "contact", icon: Mail, title: "Contact Form", desc: "Partnership inquiry from PetCo Houston — corporate sponsorship", time: "2 days ago", read: true },
];

const typeColors: Record<string, string> = {
  submission: "bg-blue-100 text-blue-600",
  application: "bg-emerald-100 text-emerald-600",
  donation: "bg-pink-100 text-pink-600",
  alert: "bg-red-100 text-red-600",
  update: "bg-slate-100 text-slate-600",
  contact: "bg-amber-100 text-amber-600",
};

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Notifications</h1>
          <p className="text-sm text-[#1B2A4A]/50">{notifications.filter((n) => !n.read).length} unread notifications</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl text-xs font-medium text-[#1B2A4A] hover:bg-slate-50 transition-colors">
            <CheckCircle2 className="w-3 h-3" /> Mark All Read
          </button>
          <button className="flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            <Send className="w-3 h-3" /> Send Notification
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm ${notif.read ? "border-slate-100 opacity-70" : "border-[#C41E2A]/10 border-l-4 border-l-[#C41E2A]"}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${typeColors[notif.type]} flex items-center justify-center flex-shrink-0`}>
                <notif.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-[#1B2A4A] text-sm">{notif.title}</p>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-[#C41E2A] flex-shrink-0" />}
                </div>
                <p className="text-sm text-[#1B2A4A]/60 mt-0.5">{notif.desc}</p>
                <p className="text-[10px] text-[#1B2A4A]/30 mt-2">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
