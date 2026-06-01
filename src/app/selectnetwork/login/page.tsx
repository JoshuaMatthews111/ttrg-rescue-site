"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"choice" | "investor" | "staff" | "apply">("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fieldLabel: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 900, color: "#667085", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 };
  const fieldInput: React.CSSProperties = { width: "100%", background: "#f9f6ef", border: "1px solid #e7e2d8", borderRadius: 4, padding: "14px 16px", fontSize: 14, outline: "none", color: "#071a33" };

  const renderApply = () => (
    <div style={{ maxWidth: 520, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Link href="/selectnetwork"><Image src="/select-network-logo.png" alt="Select Network" width={200} height={50} className="sn-glow" style={{ height: 45, width: "auto", margin: "0 auto 20px", display: "block" }} /></Link>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px", color: "#071a33" }}>Request Private Access</h1>
        <p style={{ color: "#667085", fontSize: 14, margin: 0 }}>Submit your application for membership review</p>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e7e2d8", boxShadow: "0 18px 45px rgba(5,20,45,.12)", padding: 32, borderRadius: 6 }}>
        <form onSubmit={(e) => { e.preventDefault(); alert("Application submitted. You will be contacted for review."); }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={fieldLabel}>First Name</label><input required style={fieldInput} /></div>
            <div><label style={fieldLabel}>Last Name</label><input required style={fieldInput} /></div>
          </div>
          {[["Email", "email"], ["Phone", "text"], ["Desired Investment Amount", "text", "$25,000"], ["Referral Code (Optional)", "text", "Enter referral code"]].map(([l, t, p], i) => (
            <div key={i} style={{ marginBottom: 12 }}><label style={fieldLabel}>{l}</label><input type={t as string} placeholder={p as string} style={fieldInput} /></div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label style={fieldLabel}>Profile Photo</label>
            <input type="file" accept="image/*" style={{ ...fieldInput, padding: 10, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={fieldLabel}>Message</label>
            <textarea rows={3} placeholder="Tell us about your interest..." style={{ ...fieldInput, resize: "none" as const }} />
          </div>
          <button type="submit" className="sn-btn-gold sn-btn" style={{ width: "100%", padding: "16px 0" }}>Submit Application →</button>
        </form>
        <button onClick={() => setMode("choice")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 14, background: "none", border: "none", color: "#667085", fontSize: 13, cursor: "pointer" }}>← Back to login options</button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div style={{ maxWidth: 420, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Link href="/selectnetwork"><Image src="/select-network-logo.png" alt="Select Network" width={200} height={50} className="sn-glow" style={{ height: 45, width: "auto", margin: "0 auto 20px", display: "block" }} /></Link>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px", color: "#071a33" }}>{mode === "investor" ? "Investor Login" : "Staff Login"}</h1>
        <p style={{ color: "#667085", fontSize: 14, margin: 0 }}>{mode === "investor" ? "Access your private member dashboard" : "Access the admin back office"}</p>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e7e2d8", boxShadow: "0 18px 45px rgba(5,20,45,.12)", padding: 32, borderRadius: 6 }}>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = mode === "investor" ? "/selectnetwork/investor" : "/selectnetwork/admin"; }}>
          <div style={{ marginBottom: 16 }}><label style={fieldLabel}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" style={fieldInput} /></div>
          <div style={{ marginBottom: 20 }}><label style={fieldLabel}>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={fieldInput} /></div>
          <button type="submit" className="sn-btn-gold sn-btn" style={{ width: "100%", padding: "16px 0" }}>Sign In →</button>
        </form>
        <button onClick={() => setMode("choice")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 14, background: "none", border: "none", color: "#667085", fontSize: 13, cursor: "pointer" }}>← Back to login options</button>
      </div>
    </div>
  );

  const renderChoice = () => (
    <div style={{ maxWidth: 700, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Link href="/selectnetwork"><Image src="/select-network-logo.png" alt="Select Network" width={240} height={60} className="sn-glow" style={{ height: 55, width: "auto", margin: "0 auto 24px", display: "block" }} /></Link>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 400, margin: "0 0 8px", color: "#071a33" }}>Member Access</h1>
        <p style={{ color: "#667085", fontSize: 15, margin: 0 }}>Select your login type below</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <button onClick={() => setMode("investor")} style={{ textAlign: "left", background: "#fff", border: "1px solid #e7e2d8", boxShadow: "0 18px 45px rgba(5,20,45,.12)", padding: 28, borderRadius: 6, cursor: "pointer", transition: ".35s" }} className="hover:translate-y-[-4px] hover:border-[#bd8e28]">
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid #bd8e28", display: "grid", placeItems: "center", color: "#bd8e28", fontSize: 22, marginBottom: 16, background: "#fffaf0" }}>💰</div>
          <b style={{ display: "block", fontSize: 20, color: "#071a33", marginBottom: 8 }}>Investor Login</b>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "#667085", margin: 0 }}>Access your private dashboard, founder units, growth chart, documents, referrals, and account updates.</p>
        </button>
        <button onClick={() => setMode("staff")} style={{ textAlign: "left", background: "#fff", border: "1px solid #e7e2d8", boxShadow: "0 18px 45px rgba(5,20,45,.12)", padding: 28, borderRadius: 6, cursor: "pointer", transition: ".35s" }} className="hover:translate-y-[-4px] hover:border-[#075933]">
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid #075933", display: "grid", placeItems: "center", color: "#075933", fontSize: 22, marginBottom: 16, background: "#e3f5eb" }}>⚙️</div>
          <b style={{ display: "block", fontSize: 20, color: "#071a33", marginBottom: 8 }}>Staff Login</b>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "#667085", margin: 0 }}>Access the back office to manage members, applications, payments, documents, reports, and the referral matrix.</p>
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={() => setMode("apply")} style={{ background: "none", border: "none", color: "#bd8e28", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Not a member? Request Private Access →</button>
      </div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <Link href="/selectnetwork" style={{ color: "#667085", fontSize: 12 }}>← Back to Select Network</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f7f5ef,#fff)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, Arial, sans-serif" }}>
      {mode === "apply" ? renderApply() : mode === "investor" || mode === "staff" ? renderLogin() : renderChoice()}
    </div>
  );
}
