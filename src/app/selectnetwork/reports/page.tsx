"use client";

import Link from "next/link";
import { BarChart3, TrendingUp, PieChart, Network, CalendarClock, Eye, Download, Info, ArrowRight } from "lucide-react";
import SNNav from "../components/SNNav";
import SNFooter from "../components/SNFooter";
import Reveal from "../components/Reveal";
import ReportsCharts from "../components/ReportsCharts";
import { ldttDisclaimer, ldttCategoryTotals, ldttTotalProfit, fmtUSD } from "../data/ldtt";

const NAVY = "#071a33";
const GOLD = "#bd8e28";
const GREEN = "#075933";

const scrollToCharts = () => {
  document.getElementById("live-charts")?.scrollIntoView({ behavior: "smooth" });
};

export default function ReportsPage() {
  const reportCards = [
    { icon: <BarChart3 size={24} />, title: "Revenue Performance Overview", desc: "Total sales and category revenue from Lorenzo's Dog Training Team historical records, 2016–2025.", pdf: null },
    { icon: <TrendingUp size={24} />, title: "Profit & Margin Summary", desc: "Operating profit and margin by year from the client-provided LDTT record.", pdf: null },
    { icon: <PieChart size={24} />, title: "Category Sales Breakdown", desc: "Training, boarding, equipment/misc, and tuition totals across all years.", pdf: null },
    { icon: <Network size={24} />, title: "Trainer Hierarchy 2026", desc: "Visual overview of LDTT's trainer network and leadership structure. Separate from the investor referral matrix.", pdf: "/reports/trainer-hierarchy-2026.pdf" },
    { icon: <CalendarClock size={24} />, title: "Quarterly Investor Updates", desc: "Approved quarterly updates and communications, available inside the Member Portal.", pdf: null, portal: true },
  ];

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: NAVY, background: "#fff" }}>
      <SNNav />

      {/* Hero */}
      <section className="sn-section-pad" style={{ background: "linear-gradient(135deg,#061a33,#030b17)", color: "#fff", padding: "70px 0" }}>
        <div className="sn-shell" style={{ textAlign: "center" }}>
          <div style={{ color: GOLD, fontSize: 12, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Investment Reports</div>
          <h1 className="sn-page-hero-h1" style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 42, lineHeight: 1.15, margin: "0 auto", maxWidth: 720 }}>
            Transparency You Can Trust
          </h1>
          <p style={{ color: "#c6d2e1", maxWidth: 760, margin: "20px auto 0", lineHeight: 1.8, fontSize: 15.5 }}>
            At The Select Network, we believe informed investors make confident investors. Our investment reports provide clear, consistent, and data-driven visibility into the historical operating performance of Lorenzo&apos;s Dog Training Team so qualified investors can review the business record with confidence.
          </p>
        </div>
      </section>

      {/* Report cards */}
      <section style={{ padding: "70px 0 40px", background: "#fff" }}>
        <div className="sn-shell">
          <div className="sn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {reportCards.map((r, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 16, padding: 26, boxShadow: "0 10px 30px rgba(5,20,45,.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: "#edf6ef", color: GREEN, display: "grid", placeItems: "center", marginBottom: 16 }}>{r.icon}</div>
                  <h3 style={{ fontSize: 18, margin: "0 0 10px", color: NAVY }}>{r.title}</h3>
                  <p style={{ color: "#5b6675", lineHeight: 1.6, margin: "0 0 20px", fontSize: 13.5, flex: 1 }}>{r.desc}</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {r.portal ? (
                      <Link href="/selectnetwork/login" style={btnGreen}><Eye size={15} /> View in Portal</Link>
                    ) : (
                      <button onClick={scrollToCharts} style={btnGreen}><Eye size={15} /> View Report</button>
                    )}
                    {r.pdf ? (
                      <a href={r.pdf} target="_blank" rel="noopener noreferrer" style={btnGold}><Download size={15} /> Download PDF</a>
                    ) : !r.portal ? (
                      <button onClick={() => window.print()} style={btnOutline}><Download size={15} /> Download PDF</button>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Snapshot intro */}
      <section id="live-charts" style={{ padding: "30px 0 20px", background: "#fbf9f4", scrollMarginTop: 100 }}>
        <div className="sn-shell">
          <Reveal>
            <div style={{ marginBottom: 8 }}>
              <div style={{ width: 40, height: 3, background: GOLD, marginBottom: 16 }} />
              <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 32, margin: "0 0 12px" }}>Lorenzo&apos;s Dog Training Team Historical Operating Snapshot</h2>
              <p style={{ color: "#5b6675", lineHeight: 1.75, maxWidth: 820, margin: 0 }}>
                The charts below summarize Lorenzo&apos;s Dog Training Team sales, category revenue, trainer count, expenses, and operating profit based on the records provided. The purpose is to give qualified investors visibility into the operating history connected to the opportunity.
              </p>
            </div>
          </Reveal>

          {/* KPI summary */}
          <div className="sn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, margin: "26px 0" }}>
            {[
              { label: "Total Sales Generated (2016–2025)", value: fmtUSD(ldttCategoryTotals.totalSales) },
              { label: "Total Operating Profit (2016–2025)", value: fmtUSD(ldttTotalProfit) },
              { label: "Training Sales (largest category)", value: fmtUSD(ldttCategoryTotals.training) },
            ].map((k, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 14, padding: "20px 22px" }}>
                <small style={{ fontSize: 11.5, color: "#667085", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>{k.label}</small>
                <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, marginTop: 6 }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive charts */}
      <section style={{ padding: "10px 0 40px", background: "#fbf9f4" }}>
        <div className="sn-shell">
          <ReportsCharts />
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: "0 0 70px", background: "#fbf9f4" }}>
        <div className="sn-shell">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "1px solid #e7d9b6", borderLeft: `4px solid ${GOLD}`, borderRadius: "0 12px 12px 0", padding: "20px 22px" }}>
            <Info size={22} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: "#604b17", fontSize: 13.5, lineHeight: 1.7 }}>{ldttDisclaimer}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sn-section-pad" style={{ padding: "60px 0", background: "#fff", textAlign: "center" }}>
        <div className="sn-shell">
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 28, margin: "0 0 18px" }}>Review the full record inside the Member Portal.</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/selectnetwork/join" className="sn-btn" style={{ background: `linear-gradient(135deg,#0b5b34,#08431f)` }}>Apply For Membership <ArrowRight size={16} /></Link>
            <Link href="/selectnetwork/login" className="sn-btn sn-btn-outline">Member Portal</Link>
          </div>
        </div>
      </section>

      <SNFooter />
    </div>
  );
}

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  borderRadius: 8,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: ".03em",
  cursor: "pointer",
  textDecoration: "none",
  border: 0,
};
const btnGreen: React.CSSProperties = { ...btnBase, background: "linear-gradient(135deg,#0b5b34,#08431f)", color: "#fff" };
const btnGold: React.CSSProperties = { ...btnBase, background: "linear-gradient(135deg,#d1a645,#bc8b25)", color: "#fff" };
const btnOutline: React.CSSProperties = { ...btnBase, background: "#fff", color: "#a46a00", border: "1px solid #bd8e28" };
