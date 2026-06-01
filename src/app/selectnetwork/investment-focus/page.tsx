"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Users, BookOpen, Building2, Handshake, Home, TrendingUp, DollarSign, PawPrint, CheckCircle2 } from "lucide-react";
import SNNav from "../components/SNNav";
import SNFooter from "../components/SNFooter";
import Reveal from "../components/Reveal";

const NAVY = "#071a33";
const GOLD = "#bd8e28";
const GREEN = "#075933";

export default function InvestmentFocusPage() {
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: NAVY, background: "#fff" }}>
      <SNNav />

      {/* Hero */}
      <section className="sn-section-pad" style={{ background: "linear-gradient(135deg,#061a33,#030b17)", color: "#fff", padding: "70px 0" }}>
        <div className="sn-shell" style={{ textAlign: "center" }}>
          <div style={{ color: GOLD, fontSize: 12, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Investment Focus</div>
          <h1 className="sn-page-hero-h1" style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 42, lineHeight: 1.15, margin: "0 auto", maxWidth: 760 }}>
            Investing in the Future of the <span style={{ color: GOLD }}>Pet Industry</span>
          </h1>
          <p style={{ color: "#c6d2e1", maxWidth: 660, margin: "20px auto 0", lineHeight: 1.7, fontSize: 16 }}>
            We focus on high-impact, purpose-driven opportunities that address real needs in the pet industry while delivering strong potential for growth.
          </p>
        </div>
      </section>

      {/* Focus cards */}
      <section style={{ padding: "78px 0", background: "#fff" }}>
        <div className="sn-shell">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 40, height: 3, background: GOLD, margin: "0 auto 18px" }} />
              <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 32, margin: 0 }}>Where We Invest</h2>
            </div>
          </Reveal>
          <div className="sn-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 18 }}>
            {[
              { icon: <GraduationCap size={26} />, title: "Elite Dog Training Programs", desc: "Industry-leading training, behavior solutions, and certification courses." },
              { icon: <Users size={26} />, title: "Trainer Network Expansion", desc: "Scaling a multi-state network of skilled, certified trainers." },
              { icon: <BookOpen size={26} />, title: "Leadership & Education", desc: "Developing leaders through structured education and mentorship." },
              { icon: <Building2 size={26} />, title: "Operational Infrastructure", desc: "Systems, facilities, and tools built to scale responsibly." },
              { icon: <Handshake size={26} />, title: "Strategic Partnerships", desc: "Aligned relationships that expand reach and create value." },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ background: "#fbf9f4", border: "1px solid #eee7d8", borderRadius: 16, padding: "26px 20px", height: "100%" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "#edf6ef", color: GREEN, display: "grid", placeItems: "center", marginBottom: 16 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 16.5, margin: "0 0 8px", color: NAVY }}>{c.title}</h3>
                  <p style={{ color: "#5b6675", lineHeight: 1.6, margin: 0, fontSize: 13.5 }}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why this market + Investor Lens */}
      <section style={{ padding: "20px 0 78px", background: "#fff" }}>
        <div className="sn-shell sn-split" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30, alignItems: "start" }}>
          <Reveal>
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 30, margin: "0 0 8px" }}>Why This Market</h2>
              <p style={{ color: "#5b6675", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 560 }}>The pet industry is one of the fastest-growing sectors in the U.S. — and we&apos;re building businesses that lead with impact.</p>
              <div className="sn-grid-4m" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: <Home size={22} />, value: "90.5M+", label: "U.S. Households Own Pets" },
                  { icon: <TrendingUp size={22} />, value: "6.3%", label: "Projected Industry Growth" },
                  { icon: <DollarSign size={22} />, value: "$147B+", label: "U.S. Pet Industry Market Size" },
                  { icon: <PawPrint size={22} />, value: "High Demand", label: "Training, Rescue & Pet Services" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fbf9f4", border: "1px solid #eee7d8", borderRadius: 14, padding: "22px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, color: GREEN }}>{s.icon}<b style={{ fontSize: 22, color: NAVY }}>{s.value}</b></div>
                    <small style={{ color: "#667085", fontSize: 13 }}>{s.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div style={{ background: "linear-gradient(135deg,#0b5b34,#06351f)", color: "#fff", borderRadius: 18, padding: 32, boxShadow: "0 18px 45px rgba(7,67,31,.25)" }}>
              <span style={{ color: "#ffd46f", fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Investor Lens</span>
              <p style={{ fontSize: 16, lineHeight: 1.7, margin: "14px 0 22px", color: "#eaf3ee" }}>
                We take a long-term view, focusing on disciplined growth, strong leadership, and systems built to scale.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Purpose-driven opportunities with measurable impact",
                  "Select participation with experienced leadership",
                  "Scalable models and operational discipline",
                  "Long-term value creation for investors and communities",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckCircle2 size={20} color="#ffd46f" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: "#eaf3ee" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="sn-section-pad" style={{ padding: "60px 0", background: "#fbf9f4", textAlign: "center" }}>
        <div className="sn-shell">
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 28, margin: "0 0 18px" }}>Review the operating record behind the opportunity.</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/selectnetwork/reports" className="sn-btn" style={{ background: `linear-gradient(135deg,#0b5b34,#08431f)` }}>View Investment Reports <ArrowRight size={16} /></Link>
            <Link href="/selectnetwork/join" className="sn-btn sn-btn-outline">Join The Network</Link>
          </div>
        </div>
      </section>

      <SNFooter />
    </div>
  );
}
