"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowDown, Phone, Clock, Heart, PawPrint, TrendingUp, ShieldCheck, EyeOff, BadgeCheck, Building2, Plus, Minus } from "lucide-react";
import SNNav from "./components/SNNav";
import SNFooter from "./components/SNFooter";
import Reveal from "./components/Reveal";

const NAVY = "#071a33";
const GOLD = "#bd8e28";
const GREEN = "#075933";

/* ─── FAQ Data ─── */
const FAQ_ITEMS = [
  { q: "Who is eligible to apply for membership?", a: "Membership is open to qualified investors and strategic partners who share our mission of long-term value creation and impact in the pet industry." },
  { q: "What types of investment opportunities are available?", a: "Members gain access to carefully selected opportunities connected to Lorenzo's Dog Training Team and future growth initiatives within the expanding pet industry." },
  { q: "How is my information protected?", a: "All member information is protected with the highest standard of privacy and security protocols. We are confidential by design." },
  { q: "How long does the application process take?", a: "The application process typically takes 3–5 business days. After submitting your application, our team will review and schedule an investor call." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: NAVY, background: "#fff" }}>
      <SNNav />

      {/* ══════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        className="sn-hero-home"
        style={{
          position: "relative",
          background: "linear-gradient(105deg, #fff 0%, #fff 45%, #f7f5ef 60%, #eef3ee 100%)",
          overflow: "hidden",
          padding: "60px 0 50px",
        }}
      >
        {/* Background hero image */}
        <Image
          className="sn-hero-dog"
          src="/hero-dog.jpg"
          alt=""
          width={1400}
          height={900}
          priority
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "55%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
            opacity: 0.85,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="sn-hero-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,.98) 42%, rgba(255,255,255,.7) 62%, rgba(255,255,255,.15) 100%)",
            zIndex: 1,
          }}
        />

        <div className="sn-shell sn-hero-inner" style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
          {/* Left: text */}
          <div style={{ maxWidth: 620 }}>
            <div style={{ color: GOLD, fontSize: 11.5, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>
              Private Access Into a Growing Pet Industry Opportunity
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 44, lineHeight: 1.12, margin: "0 0 20px", letterSpacing: "-.01em" }}>
              Your Opportunity to Invest in{" "}
              <span style={{ color: GREEN }}>Dog Training</span>,{" "}
              <span style={{ color: GREEN }}>Dog Rescue</span>, and the Future of the Pet Industry
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "#3d4a57", margin: "0 0 28px", maxWidth: 540 }}>
              The Select Network opens the door for qualified investors to participate in selected opportunities connected to Lorenzo&apos;s Dog Training Team, and future businesses created to serve families, rescue dogs, train dogs, and grow within the expanding pet industry.
            </p>
            {/* 2. TWO CTA BUTTONS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link
                href="/selectnetwork/join"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: `linear-gradient(135deg, ${GREEN}, #064a28)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "15px 26px",
                  fontWeight: 800,
                  fontSize: 12.5,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  textDecoration: "none",
                  boxShadow: "0 6px 18px rgba(7,89,51,.25)",
                }}
              >
                Begin Enrollment <ArrowRight size={15} />
              </Link>
              <Link
                href="/selectnetwork/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  color: NAVY,
                  border: "1.5px solid #d4cdbf",
                  borderRadius: 6,
                  padding: "15px 26px",
                  fontWeight: 800,
                  fontSize: 12.5,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  textDecoration: "none",
                }}
              >
                <Phone size={15} /> Speak With Our Team
              </Link>
            </div>
          </div>

          {/* Right: LDTT Logo */}
          <div className="sn-hero-logo-right" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Image
              src="/assets/select-network/lorenzos-dog-training-team-logo.png"
              alt="Lorenzo's Dog Training Team"
              width={320}
              height={320}
              style={{ width: 260, height: "auto" }}
            />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: NAVY }}>Serious Training. Serious Results. ™</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. METRICS STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid #ece6da", borderBottom: "1px solid #ece6da" }}>
        <div className="sn-shell sn-metrics-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, padding: "28px 40px" }}>
          {[
            { icon: <Clock size={24} color={GOLD} />, value: "21+", label: "Years of Dog Training Experience" },
            { icon: <Heart size={24} color={GOLD} />, value: "Hundreds", label: "of Dogs Trained" },
            { icon: <PawPrint size={24} color={GOLD} />, value: "Rescue, Rehabilitation,", label: " and Rehoming Mission" },
            { icon: <TrendingUp size={24} color={GOLD} />, value: "Built Around a", label: "Growing Pet Industry" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "6px 20px",
                borderRight: i < 3 ? "1px solid #eee7d8" : "none",
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: "50%", border: `1.5px solid ${GOLD}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                {m.icon}
              </div>
              <div>
                <b style={{ display: "block", fontSize: 17, color: NAVY, lineHeight: 1.2 }}>{m.value}</b>
                <small style={{ color: "#667085", fontSize: 12 }}>{m.label}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. INVESTMENT OPPORTUNITIES
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "60px 0 50px", background: "#fbf9f4", borderBottom: "1px solid #ece6da" }}>
        <div className="sn-shell">
          {/* Section title */}
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: NAVY, margin: "0 0 8px" }}>
                Investment Opportunities Within The Select Network
              </h2>
              <p style={{ color: "#5b6675", fontSize: 14.5, margin: 0 }}>Members gain access to carefully selected growth opportunities inside The Select Network.</p>
            </div>
          </Reveal>

          {/* Cards row */}
          <div className="sn-opps-row" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr 1fr 1fr", gap: 18, alignItems: "start" }}>
            {/* 5. SELECT NETWORK CARD */}
            <Reveal>
              <div style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 14, padding: "26px 22px", boxShadow: "0 8px 24px rgba(5,20,45,.05)", height: "100%" }}>
                <Image
                  src="/assets/select-network/select-network-logo.png"
                  alt="The Select Network"
                  width={200}
                  height={80}
                  style={{ width: 150, height: "auto", marginBottom: 16 }}
                />
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3d4a57", margin: 0 }}>
                  Here at The Select Network, we <b>Identify Opportunity, Build Systems, and Create Value.</b>
                </p>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#5b6675", margin: "12px 0 0" }}>
                  Through strategic initiatives designed to strengthen operations, expand impact, and support sustainable long-term growth.
                </p>
              </div>
            </Reveal>

            {/* 6. FLOATING ARROW */}
            <Reveal delay={100}>
              <div className="sn-arrow-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 10px", minHeight: 200, transform: "translateY(35px)" }}>
                <div className="sn-arrow-pulse" style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, #a07520)`, display: "grid", placeItems: "center", boxShadow: "0 6px 18px rgba(189,142,40,.35)", marginBottom: 14 }}>
                  <ArrowRight size={22} color="#fff" />
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "#5b6675", textAlign: "center", fontStyle: "italic", maxWidth: 180, margin: 0 }}>
                  Lorenzo&apos;s Dog Training Team is one of the leading companies in the dog training industry, with over 11 locations. This is your opportunity to invest in a growing and proven brand.
                </p>
              </div>
            </Reveal>

            {/* Mobile vertical connector */}
            <div className="sn-mobile-arrow" style={{ display: "none", justifyContent: "center", padding: "10px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, #a07520)`, display: "grid", placeItems: "center", boxShadow: "0 4px 14px rgba(189,142,40,.3)" }}><ArrowDown size={18} color="#fff" /></div>
            </div>

            {/* 7. LORENZO'S DOG TRAINING TEAM CARD */}
            <Reveal delay={150}>
              <div style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 14, padding: "26px 22px", boxShadow: "0 8px 24px rgba(5,20,45,.05)", height: "100%" }}>
                <Image
                  src="/assets/select-network/lorenzos-dog-training-team-logo.png"
                  alt="Lorenzo's Dog Training Team"
                  width={200}
                  height={200}
                  style={{ width: 120, height: "auto", marginBottom: 14 }}
                />
                <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 10px" }}>Lorenzo&apos;s Dog Training Team</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#4b5563", margin: "0 0 18px" }}>
                  Lorenzo&apos;s Dog Training Team is a proven professional dog training brand with a strong operating history, loyal clients, and scalable growth potential.
                </p>
                <Link
                  href="/selectnetwork/investment-focus"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: `linear-gradient(135deg, ${GREEN}, #064a28)`,
                    color: "#fff",
                    borderRadius: 6,
                    padding: "11px 18px",
                    fontWeight: 800,
                    fontSize: 11.5,
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                    textDecoration: "none",
                  }}
                >
                  What We Offer <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>

            {/* Mobile vertical connector */}
            <div className="sn-mobile-arrow" style={{ display: "none", justifyContent: "center", padding: "10px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, #a07520)`, display: "grid", placeItems: "center", boxShadow: "0 4px 14px rgba(189,142,40,.3)" }}><ArrowDown size={18} color="#fff" /></div>
            </div>

            {/* 8. FOUNDER SPOTLIGHT CARD */}
            <Reveal delay={200}>
              <div className="sn-founder-card" style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 14, padding: "22px 20px", boxShadow: "0 8px 24px rgba(5,20,45,.05)", height: "100%", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <Image
                  src="/assets/select-network/IMG_9919.png"
                  alt="Lorenzo Miller"
                  width={340}
                  height={470}
                  style={{ width: 170, height: 235, borderRadius: 10, objectFit: "cover", objectPosition: "center 20%", flexShrink: 0, display: "block" }}
                />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 235 }}>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400, fontSize: 42, lineHeight: 1, margin: "0 0 8px", color: "#b87522", whiteSpace: "nowrap" }}>Lorenzo Miller</h3>
                  <span style={{ fontFamily: "'Montserrat', 'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "#001b5d", display: "block", marginBottom: 10 }}>Founder &amp; CEO</span>
                  <p style={{ fontSize: 12, lineHeight: 1.55, color: "#4b5563", margin: "0 0 14px", fontStyle: "italic" }}>
                    &ldquo;At The Select Network, we believe wealth is more than numbers—it&apos;s impact, legacy, and freedom of choice. Our mission is to connect exceptional investors with exceptional opportunities.&rdquo;
                  </p>
                  <Link
                    href="/selectnetwork/about"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 18px",
                      borderRadius: 8,
                      background: "#005c2f",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      marginTop: 0,
                    }}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Mobile vertical connector */}
            <div className="sn-mobile-arrow" style={{ display: "none", justifyContent: "center", padding: "10px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, #a07520)`, display: "grid", placeItems: "center", boxShadow: "0 4px 14px rgba(189,142,40,.3)" }}><ArrowDown size={18} color="#fff" /></div>
            </div>

            {/* 9. FAQ CARD */}
            <Reveal delay={250}>
              <div style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 14, padding: "24px 20px", boxShadow: "0 8px 24px rgba(5,20,45,.05)", height: "100%" }}>
                <h3 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: NAVY, margin: "0 0 16px" }}>Frequently Asked Questions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {FAQ_ITEMS.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={i} style={{ borderBottom: i < FAQ_ITEMS.length - 1 ? "1px solid #eee7d8" : "none" }}>
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: "13px 0",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{faq.q}</span>
                          {isOpen ? <Minus size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} /> : <Plus size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />}
                        </button>
                        {isOpen && (
                          <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "#5b6675", margin: "0 0 12px", paddingRight: 20 }}>{faq.a}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10. TRUST / PRIVACY / EXCELLENCE
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "50px 0", background: "#fff" }}>
        <div className="sn-shell">
          <Reveal>
            <div style={{ marginBottom: 30 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 26, margin: "0 0 6px", letterSpacing: ".02em" }}>Trust. Privacy. Excellence.</h2>
              <p style={{ color: "#8a7a52", fontFamily: "Georgia, serif", fontStyle: "italic", margin: 0, fontSize: 14.5 }}>Built for discerning investors who value impact and integrity.</p>
            </div>
          </Reveal>
          <div className="sn-grid-4m" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {[
              { icon: <BadgeCheck size={24} />, title: "Invitation-Only Membership", desc: "Access is reserved for qualified investors and strategic partners who share our mission." },
              { icon: <EyeOff size={24} />, title: "Confidential By Design", desc: "Your information and investments are protected with the highest standard of privacy." },
              { icon: <ShieldCheck size={24} />, title: "Vetted Opportunities", desc: "We conduct rigorous due diligence to ensure every opportunity meets our high standards." },
              { icon: <Building2 size={24} />, title: "Aligned for Long-Term Value", desc: "We focus on sustainable growth, meaningful impact, and generational value creation." },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${GOLD}`, display: "grid", placeItems: "center", flexShrink: 0, color: GREEN }}>
                    {t.icon}
                  </div>
                  <div>
                    <b style={{ display: "block", fontSize: 14, color: NAVY, marginBottom: 5 }}>{t.title}</b>
                    <small style={{ color: "#5b6675", fontSize: 12.5, lineHeight: 1.55, display: "block" }}>{t.desc}</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          11. FOOTER
      ══════════════════════════════════════════════════════ */}
      <SNFooter />
    </div>
  );
}
