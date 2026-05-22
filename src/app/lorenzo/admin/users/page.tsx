"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, X } from "lucide-react";
import { getUsers, upsertUser, type LorenzoUser, type LorenzoRole } from "@/lib/lorenzo-store";

const roles: LorenzoRole[] = ["super_admin", "admin", "trainer", "office_staff"];
const roleColors: Record<string, string> = { super_admin: "bg-red-100 text-red-700", admin: "bg-blue-100 text-blue-700", trainer: "bg-emerald-100 text-emerald-700", office_staff: "bg-violet-100 text-violet-700" };

export default function UsersPage() {
  const [users, setUsers] = useState<LorenzoUser[]>([]);
  const [editing, setEditing] = useState<LorenzoUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setUsers(getUsers()); }, []);

  const openNew = () => { setEditing({ id: `u-${Date.now()}`, username: "", password: "", name: "", email: "", role: "trainer", status: "active", dateInvited: new Date().toISOString().split("T")[0], lastLogin: "" }); setShowModal(true); };
  const openEdit = (u: LorenzoUser) => { setEditing({ ...u }); setShowModal(true); };
  const save = () => { if (!editing) return; upsertUser(editing); setUsers(getUsers()); setShowModal(false); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#0B1D3A]">Users & Roles</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C8102E] text-white px-4 py-2.5 rounded-lg text-sm font-bold"><Plus className="w-4 h-4" /> Invite User</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
            <th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium"></th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50">
                <td className="px-5 py-3 font-medium text-[#0B1D3A]">{u.name}<br /><span className="text-[10px] text-slate-400">@{u.username}</span></td>
                <td className="px-5 py-3 text-slate-500">{u.email}</td>
                <td className="px-5 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleColors[u.role]}`}>{u.role.replace("_", " ")}</span></td>
                <td className="px-5 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{u.status}</span></td>
                <td className="px-5 py-3"><button onClick={() => openEdit(u)} className="text-slate-400 hover:text-[#C8102E]"><Edit className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-black text-[#0B1D3A] mb-4">{editing.name ? "Edit User" : "Invite User"}</h2>
            <div className="space-y-3">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Full Name" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} placeholder="Email" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input value={editing.username} onChange={(e) => setEditing({ ...editing, username: e.target.value })} placeholder="Username" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <input value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} placeholder="Password" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
              <select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as LorenzoRole })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm">
                {roles.map((r) => <option key={r} value={r} className="capitalize">{r.replace("_", " ")}</option>)}
              </select>
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as "active" | "disabled" })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <button onClick={save} className="w-full mt-4 bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm">Save User</button>
          </div>
        </div>
      )}
    </div>
  );
}
