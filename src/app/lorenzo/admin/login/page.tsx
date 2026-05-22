"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";
import { lorenzoAuthenticate, lorenzoSetSession } from "@/lib/lorenzo-store";

export default function LorenzoAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = lorenzoAuthenticate(username, password);
      if (user) {
        lorenzoSetSession(user);
        router.push("/lorenzo/admin");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0B1D3A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/lorenzo/logo.jpeg" alt="Lorenzo's Dog Training Team" className="h-20 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white">Lorenzo&apos;s Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">Dog Training Team — Back Office</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" required />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#C8102E] hover:bg-[#A50D24] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">Test: lorenzo / lorenzo</p>
        </form>
      </div>
    </div>
  );
}
