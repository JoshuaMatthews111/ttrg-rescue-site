"use client";

import { useState } from "react";
import { Plus, Search, Shield, UserCheck, GraduationCap, Edit, Trash2, MoreVertical } from "lucide-react";

const roleConfig: Record<string, { icon: typeof Shield; color: string; bg: string }> = {
  "Super Admin": { icon: Shield, color: "text-red-700", bg: "bg-red-100" },
  Admin: { icon: UserCheck, color: "text-blue-700", bg: "bg-blue-100" },
  Trainer: { icon: GraduationCap, color: "text-emerald-700", bg: "bg-emerald-100" },
};

const users = [
  { name: "Lorenzo Miller", email: "lorenzo@ttrg.org", role: "Super Admin", status: "active", lastActive: "Just now", dogs: 6 },
  { name: "Admin Staff", email: "admin@ttrg.org", role: "Admin", status: "active", lastActive: "2 hours ago", dogs: 0 },
  { name: "Jasmine Bland", email: "jasmine@ttrg.org", role: "Trainer", status: "active", lastActive: "1 hour ago", dogs: 4 },
  { name: "Daniel Bainbridge", email: "daniel@ttrg.org", role: "Trainer", status: "active", lastActive: "3 hours ago", dogs: 5 },
  { name: "Bailey Brown", email: "bailey@ttrg.org", role: "Trainer", status: "active", lastActive: "1 day ago", dogs: 3 },
  { name: "Emilio Marotta", email: "emilio@ttrg.org", role: "Trainer", status: "inactive", lastActive: "1 week ago", dogs: 2 },
];

export default function UsersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Users &amp; Roles</h1>
          <p className="text-sm text-[#1B2A4A]/50">Manage team members and permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(roleConfig).map(([role, config]) => (
          <div key={role} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg ${config.bg} flex items-center justify-center`}>
              <config.icon className={`w-3 h-3 ${config.color}`} />
            </div>
            <span className="text-xs text-[#1B2A4A]/60">{role}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">User</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Role</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden md:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden lg:table-cell">Last Active</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden lg:table-cell">Assigned Dogs</th>
                <th className="text-right px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const rc = roleConfig[user.role] || roleConfig["Trainer"];
                return (
                  <tr key={user.email} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-xs font-bold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1B2A4A]">{user.name}</p>
                          <p className="text-[10px] text-[#1B2A4A]/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${rc.bg} ${rc.color}`}>{user.role}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`flex items-center gap-1 text-xs ${user.status === "active" ? "text-emerald-600" : "text-slate-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#1B2A4A]/40 text-xs hidden lg:table-cell">{user.lastActive}</td>
                    <td className="px-5 py-3 text-[#1B2A4A]/60 text-xs hidden lg:table-cell">{user.dogs}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#1B2A4A]/40 hover:text-[#1B2A4A]"><Edit className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#1B2A4A]/40 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
