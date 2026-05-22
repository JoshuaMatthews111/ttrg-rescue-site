"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getContacts, type ContactMessage } from "@/lib/lorenzo-store";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { setContacts(getContacts()); }, []);

  const filtered = contacts.filter((c) => {
    if (search && !`${c.name} ${c.email} ${c.subject}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0B1D3A] mb-6">Contact Messages</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-slate-400 text-sm">No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className={`bg-white rounded-xl border p-5 ${msg.read ? "border-slate-100" : "border-[#C8102E]/20 bg-red-50/30"}`}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-bold text-[#0B1D3A] text-sm">{msg.name}</p>
                  <p className="text-xs text-slate-400">{msg.email} · {msg.phone} · {msg.date}</p>
                </div>
                {!msg.read && <span className="text-[10px] font-bold bg-[#C8102E] text-white px-2 py-0.5 rounded-full">New</span>}
              </div>
              {msg.subject && <p className="text-sm font-semibold text-[#0B1D3A] mb-1">{msg.subject}</p>}
              <p className="text-sm text-slate-500">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
