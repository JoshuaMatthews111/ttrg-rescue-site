"use client";

import { useState, useEffect } from "react";
import { Phone, MessageCircle, Mail, Users, Megaphone, BookOpen, TrendingUp, Clock } from "lucide-react";
import { getLeads, getContacts, getEmailLeads, getTrainers, getAnnouncements, getPrograms } from "@/lib/lorenzo-store";

export default function LorenzoAdminDashboard() {
  const [stats, setStats] = useState({ leads: 0, newLeads: 0, contacts: 0, unreadContacts: 0, emailLeads: 0, trainers: 0, announcements: 0, programs: 0 });
  const [recentLeads, setRecentLeads] = useState<{ id: string; name: string; dogName: string; behaviorIssue: string; status: string; date: string }[]>([]);

  useEffect(() => {
    const leads = getLeads();
    const contacts = getContacts();
    const emails = getEmailLeads();
    setStats({
      leads: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      contacts: contacts.length,
      unreadContacts: contacts.filter((c) => !c.read).length,
      emailLeads: emails.length,
      trainers: getTrainers().length,
      announcements: getAnnouncements().filter((a) => a.active).length,
      programs: getPrograms().length,
    });
    setRecentLeads(leads.slice(0, 5));
  }, []);

  const statCards = [
    { label: "Consultation Leads", value: stats.leads, badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined, icon: Phone, color: "bg-[#C8102E]" },
    { label: "Contact Messages", value: stats.contacts, badge: stats.unreadContacts > 0 ? `${stats.unreadContacts} unread` : undefined, icon: MessageCircle, color: "bg-blue-600" },
    { label: "Email Subscribers", value: stats.emailLeads, icon: Mail, color: "bg-emerald-600" },
    { label: "Active Trainers", value: stats.trainers, icon: Users, color: "bg-violet-600" },
  ];

  const statusColors: Record<string, string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-amber-100 text-amber-700", scheduled: "bg-emerald-100 text-emerald-700", won: "bg-green-100 text-green-700", lost: "bg-red-100 text-red-700", archived: "bg-slate-100 text-slate-500" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0B1D3A]">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Lorenzo&apos;s Dog Training Team — Back Office Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.badge && <span className="text-[10px] font-bold bg-[#C8102E] text-white px-2 py-0.5 rounded-full">{card.badge}</span>}
            </div>
            <p className="text-2xl font-black text-[#0B1D3A]">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h2 className="font-bold text-[#0B1D3A] mb-4">Recent Consultation Leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No consultation leads yet. Leads will appear here when submitted from the public site.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Dog</th><th className="pb-3 font-medium">Issue</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50">
                    <td className="py-3 font-medium text-[#0B1D3A]">{lead.name}</td>
                    <td className="py-3 text-slate-500">{lead.dogName || "—"}</td>
                    <td className="py-3 text-slate-500">{lead.behaviorIssue || "—"}</td>
                    <td className="py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[lead.status] || "bg-slate-100 text-slate-500"}`}>{lead.status}</span></td>
                    <td className="py-3 text-slate-400">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
