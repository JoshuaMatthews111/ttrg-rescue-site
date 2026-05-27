"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authenticate, setSession } from "@/lib/admin-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = authenticate(username, password);
      if (result) {
        setSession(result.name, result.role);
        router.push("/ttrg/admin");
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0f1b30] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/10">
            <img src="/ttrg/ttrg-logo.jpeg" alt="TTRG" className="w-16 h-16 rounded-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Staff Login</h1>
          <p className="text-white/40 text-sm">Team Trainers Rescue Group — Staff Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#C41E2A]" />
            <h2 className="text-lg font-bold text-[#1B2A4A]">Sign In</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 focus:border-[#C41E2A]/40"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 focus:border-[#C41E2A]/40"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" /> SIGN IN
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 bg-[#FAFAF8] rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-[#1B2A4A]/40 uppercase tracking-wider mb-2">Test Mode Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[10px] text-[#1B2A4A]/40">Username:</span>
                <p className="font-mono font-bold text-[#1B2A4A]">ttrg</p>
              </div>
              <div>
                <span className="text-[10px] text-[#1B2A4A]/40">Password:</span>
                <p className="font-mono font-bold text-[#1B2A4A]">ttrg</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-[11px] text-center mt-6">
          © {new Date().getFullYear()} Team Trainers Rescue Group · Admin Portal
        </p>
      </div>
    </div>
  );
}
