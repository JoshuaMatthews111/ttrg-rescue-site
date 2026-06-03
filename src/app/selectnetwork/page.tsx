"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Users, Target, Building2, Leaf, Lock, TrendingUp, Sun, Settings, BarChart3, ShieldPlus, Star, ArrowRight } from "lucide-react";

export default function SelectNetworkHomePage() {
  /* ─── Focus card rotation ─── */
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveCard((i) => (i + 1) % 6), 1700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sn-home">
      {/* ═══ TOP LINE ═══ */}
      <div className="sn-top-line">TRUST · PRIVACY · EXCELLENCE</div>

      {/* ═══ HEADER ═══ */}
      <header className="sn-header">
        <nav className="sn-nav-bar">
          <Link href="/selectnetwork" className="sn-brand">
            <Image src="/assets/select-network/select-network-logo.png" alt="The Select Network Private Investors Group LLC" width={320} height={80} priority style={{ height: 74, width: "auto" }} />
          </Link>
          <div className="sn-nav-links">
            <Link href="/selectnetwork/about">About</Link>
            <Link href="/selectnetwork/investment-focus">Investment Focus</Link>
            <Link href="/selectnetwork/reports">Investment Reports</Link>
            <Link href="/selectnetwork/invest-now">Invest Now</Link>
            <Link href="/selectnetwork/contact">Contact</Link>
          </div>
          <Link href="/selectnetwork/login" className="sn-portal-btn">🔒 Member Portal</Link>
        </nav>
      </header>

      {/* ═══ HERO ═══ */}
      <main className="sn-page">
        <section className="sn-hero" aria-label="Select Network homepage hero">
          {/* Left — Copy */}
          <div className="sn-hero-copy">
            <div className="sn-editorial-kicker">Private investors.<br />Strategic partners.<br />Lasting impact.</div>
            <div className="sn-headline-rotator" aria-label="Changing Select Network headline">
              <h1 className="sn-headline-slide sn-slide-1"><span className="sn-gold">Identifying</span><br />Opportunity.<br />Building Value.<br />Expanding the<br />Network.<span className="sn-headline-shine"></span></h1>
              <h1 className="sn-headline-slide sn-slide-2"><span className="sn-gold">Strategic</span><br />Capital.<br />Strong Systems.<br />Lasting<br />Impact.<span className="sn-headline-shine"></span></h1>
              <h1 className="sn-headline-slide sn-slide-3"><span className="sn-gold">Private</span><br />Access.<br />Selected Growth.<br />Future<br />Opportunities.<span className="sn-headline-shine"></span></h1>
            </div>
            <div className="sn-gold-rule"><span className="sn-rule-diamond">◇</span></div>
            <h2 className="sn-hero-subtitle">Building the Next Wave of Private Investment Opportunities</h2>
            <p className="sn-hero-paragraph">Select Network exists to connect capital with vision, strong company systems, and strategic private investment opportunities designed to create sustainable long-term growth.</p>
          </div>

          {/* Center — Video Header */}
          <div className="sn-showcase-wrap" aria-label="Select Network video header">
            <div className="sn-video-frame">
              <video
                className="sn-hero-video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/assets/select-network/select-network-logo.png"
                aria-label="Select Network brand motion video"
              >
                <source src="/assets/select-network/hero-video.mp4" type="video/mp4" />
              </video>
              <div className="sn-video-fallback" aria-hidden="true">
                <Image src="/assets/select-network/select-network-logo.png" alt="The Select Network" width={320} height={80} priority style={{ width: "70%", maxWidth: 320, height: "auto" }} />
              </div>
              <div className="sn-video-ring" aria-hidden="true"></div>
              <div className="sn-video-caption"><span>TRUST · PRIVACY · EXCELLENCE</span></div>
            </div>
          </div>

          {/* Right — Focus Cards */}
          <aside className="sn-focus-panel" aria-label="Rotating Select Network focus areas">
            {[
              { icon: <Users size={24} />, label: "Private Investor Group" },
              { icon: <Target size={24} />, label: "Strategic Opportunities" },
              { icon: <Building2 size={24} />, label: "Strong Company Systems" },
              { icon: <Leaf size={24} />, label: "Sustainable Growth" },
              { icon: <Lock size={24} />, label: "Member-Based Access" },
              { icon: <TrendingUp size={24} />, label: "Future Investment Focuses" },
            ].map((card, i) => (
              <div key={i} className={`sn-focus-card${activeCard === i ? " active" : ""}`}>
                <span className="sn-focus-icon">{card.icon}</span>
                <span className="sn-focus-label">{card.label}</span>
              </div>
            ))}
          </aside>
        </section>

        {/* ═══ HOW SELECT NETWORK WORKS ═══ */}
        <section className="sn-works" id="about" aria-label="How Select Network works">
          <h2 className="sn-section-title"><span>How Select Network Works</span></h2>
          <div className="sn-work-grid">
            <article className="sn-work-card">
              <div className="sn-icon-ring"><Sun size={38} /></div>
              <div>
                <h3>Identify Opportunity</h3>
                <p>We evaluate private investment opportunities with strong potential and long-term impact.</p>
              </div>
            </article>
            <div className="sn-arrow">→</div>
            <article className="sn-work-card">
              <div className="sn-icon-ring"><Settings size={38} /></div>
              <div>
                <h3>Build the System</h3>
                <p>We partner with capable teams to establish the structure, strategy, and systems for success.</p>
              </div>
            </article>
            <div className="sn-arrow">→</div>
            <article className="sn-work-card">
              <div className="sn-icon-ring"><BarChart3 size={38} /></div>
              <div>
                <h3>Create Long-Term Value</h3>
                <p>We support growth, drive efficiency, and build value for lasting wealth and future opportunities.</p>
              </div>
            </article>
          </div>
        </section>

        {/* ═══ GROW YOUR MONEY NOW ═══ */}
        <section className="sn-money" id="investment-focus" aria-label="Grow your money now investment focus section">
          <div className="sn-money-copy">
            <h2>GROW YOUR MONEY NOW</h2>
            <div className="sn-small-rule"></div>
            <p>Explore our current investment focus and discover how Select Network is creating value across real private investment opportunities.</p>
            <Link href="/selectnetwork/investment-focus" className="sn-btn-gold">View Investment Focus <ArrowRight size={16} /></Link>
          </div>
          <div className="sn-chart" aria-label="Illustrative platform growth visualization">
            <svg viewBox="0 0 360 190" preserveAspectRatio="none">
              <defs>
                <linearGradient id="snbar" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#64b9ff" /><stop offset="1" stopColor="#0d3c78" /></linearGradient>
                <linearGradient id="snarea" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#ffd36a" stopOpacity=".4" /><stop offset="1" stopColor="#ffd36a" stopOpacity="0" /></linearGradient>
              </defs>
              <g stroke="rgba(255,255,255,.08)" strokeWidth="1"><path d="M0 40H360M0 80H360M0 120H360M0 160H360" /><path d="M40 0V190M90 0V190M140 0V190M190 0V190M240 0V190M290 0V190" /></g>
              <g className="sn-bars">
                <rect x="38" y="148" width="12" height="25" fill="url(#snbar)" rx="2" />
                <rect x="70" y="135" width="12" height="38" fill="url(#snbar)" rx="2" />
                <rect x="102" y="118" width="12" height="55" fill="url(#snbar)" rx="2" />
                <rect x="134" y="128" width="12" height="45" fill="url(#snbar)" rx="2" />
                <rect x="166" y="105" width="12" height="68" fill="url(#snbar)" rx="2" />
                <rect x="198" y="92" width="12" height="81" fill="url(#snbar)" rx="2" />
                <rect x="230" y="76" width="12" height="97" fill="url(#snbar)" rx="2" />
                <rect x="262" y="57" width="12" height="116" fill="url(#snbar)" rx="2" />
                <rect x="294" y="32" width="12" height="141" fill="url(#snbar)" rx="2" />
              </g>
              <path className="sn-area" d="M25 150 C65 140, 95 120, 126 126 S185 87, 222 77 S270 42, 315 18 L315 190 L25 190 Z" fill="url(#snarea)" />
              <path className="sn-growth-line" d="M25 150 C65 140, 95 120, 126 126 S185 87, 222 77 S270 42, 315 18" fill="none" stroke="#ffd36a" strokeWidth="4" strokeLinecap="round" />
              <circle className="sn-spark" cx="315" cy="18" r="5" fill="#fff3a7" />
            </svg>
            <div className="sn-chart-legend">
              <span><i style={{ background: "#ffd36a" }}></i>Network Expansion</span>
              <span><i style={{ background: "#64b9ff" }}></i>Member Growth</span>
            </div>
            <div className="sn-chart-caption">Illustrative platform overview · not a guarantee of returns</div>
          </div>
          <article className="sn-ldtt-card">
            <Image src="/assets/select-network/lorenzos-dog-training-team-logo.png" alt="Lorenzo&apos;s Dog Training Team" width={200} height={200} style={{ width: 72, height: "auto", borderRadius: 6 }} />
            <div>
              <small>Current Investment Focus</small>
              <h3>Lorenzo&apos;s Dog Training Team</h3>
              <p>A Proven Brand. A Growing Mission. Professional Training. Positive Impact. Built for Long-Term Growth.</p>
              <Link href="/selectnetwork/investment-focus/ldtt">Learn More About Lorenzo&apos;s →</Link>
            </div>
          </article>
        </section>

        {/* ═══ TRUST STRIP ═══ */}
        <section className="sn-trust-strip" aria-label="Trust features">
          <article className="sn-trust-item">
            <div className="sn-trust-icon"><ShieldPlus size={36} /></div>
            <div>
              <h4>Invitation-Only Membership</h4>
              <p>Access is reserved for qualified investors and strategic partners who share our mission.</p>
            </div>
          </article>
          <article className="sn-trust-item">
            <div className="sn-trust-icon"><Lock size={36} /></div>
            <div>
              <h4>Confidential by Design</h4>
              <p>Your information and investments are protected with the highest standard of privacy.</p>
            </div>
          </article>
          <article className="sn-trust-item">
            <div className="sn-trust-icon"><Star size={36} /></div>
            <div>
              <h4>Aligned for Long-Term Value</h4>
              <p>We focus on sustainable growth, measurable impact, and generational wealth creation.</p>
            </div>
          </article>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="sn-footer-home">
        <strong>TRUST. PRIVACY. EXCELLENCE.</strong>
        <div className="sn-script">Built for discerning investors who value impact and integrity.</div>
        <div className="sn-footer-right">
          <span>Become by Design</span>
          <span>🔒 Private Protected</span>
        </div>
      </footer>

      {/* ═══ SCOPED STYLES ═══ */}
      <style jsx global>{`
        /* ─── ROOT ─── */
        .sn-home {
          --ivory: #fbf4e8;
          --ivory-2: #fffaf1;
          --navy: #051f45;
          --navy-2: #082d61;
          --gold: #c48628;
          --gold-2: #e0b461;
          --green: #075629;
          --emerald: #0a6b3b;
          --ink: #071a34;
          --muted: #5f6f82;
          --line: rgba(196,134,40,.35);
          --shadow: 0 24px 65px rgba(14,32,58,.12);
          --soft: 0 14px 32px rgba(122,82,18,.12);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--ink);
          background:
            radial-gradient(circle at 50% 0%, rgba(255,255,255,.96) 0 20%, transparent 52%),
            linear-gradient(180deg, #fffaf2 0%, #fbf4e8 48%, #fffaf3 100%);
          overflow-x: hidden;
          position: relative;
        }
        .sn-home:before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(90deg, rgba(196,134,40,.035) 1px, transparent 1px),
            linear-gradient(0deg, rgba(196,134,40,.025) 1px, transparent 1px);
          background-size: 58px 58px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,.7), transparent 70%);
          z-index: 0;
        }

        /* ─── TOP LINE ─── */
        .sn-top-line {
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: .34em;
          color: #9b650c;
          font-weight: 800;
          font-size: 12px;
          background: rgba(255,255,255,.42);
          border-bottom: 1px solid rgba(196,134,40,.14);
        }

        /* ─── HEADER ─── */
        .sn-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,250,241,.9);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(196,134,40,.18);
        }
        .sn-nav-bar {
          max-width: 1500px;
          margin: 0 auto;
          padding: 18px 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .sn-brand { display: flex; align-items: center; min-width: 270px; text-decoration: none; }
        .sn-brand img { filter: drop-shadow(0 8px 14px rgba(0,0,0,.12)); }
        .sn-nav-links { display: flex; align-items: center; gap: 38px; font-size: 14px; font-weight: 850; letter-spacing: .04em; text-transform: uppercase; color: var(--navy); }
        .sn-nav-links a { text-decoration: none; color: var(--navy); position: relative; white-space: nowrap; }
        .sn-nav-links a:after { content: ""; position: absolute; left: 0; right: 100%; bottom: -8px; height: 2px; background: var(--gold); transition: .28s ease; }
        .sn-nav-links a:hover:after { right: 0; }
        .sn-portal-btn {
          border: 0;
          padding: 17px 30px;
          border-radius: 8px;
          background: linear-gradient(180deg, #08733a, #035226);
          color: #fff5d2;
          font-weight: 900;
          letter-spacing: .04em;
          box-shadow: 0 13px 28px rgba(2,69,32,.22), inset 0 0 0 1px rgba(255,214,125,.28);
          cursor: pointer;
          text-transform: uppercase;
          white-space: nowrap;
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          font-size: 13px;
        }

        /* ─── PAGE ─── */
        .sn-page { max-width: 1500px; margin: 0 auto; padding: 0 46px 26px; position: relative; z-index: 1; }

        /* ─── HERO ─── */
        .sn-hero {
          display: grid;
          grid-template-columns: 35% 43% 22%;
          gap: 28px;
          min-height: 526px;
          padding-top: 24px;
          align-items: center;
          position: relative;
          isolation: isolate;
        }
        .sn-hero:after { content: ""; position: absolute; inset: auto 30px 0; height: 1px; background: linear-gradient(90deg, transparent, var(--line), transparent); }

        .sn-editorial-kicker { color: #b97820; font-size: 13px; line-height: 1.45; text-transform: uppercase; letter-spacing: .28em; font-weight: 900; margin-bottom: 18px; }
        .sn-hero-copy { align-self: center; padding-top: 15px; }

        /* Headline */
        .sn-home h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(42px, 4.2vw, 64px);
          line-height: 1.0;
          letter-spacing: -.035em;
          color: var(--navy);
          margin: 0;
          font-weight: 500;
          max-width: 520px;
        }
        .sn-gold {
          background: linear-gradient(90deg, #8d5518, #d7a64b, #805112);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 6px 18px rgba(196,134,40,.12);
          display: inline-block;
        }

        /* Headline rotator */
        .sn-headline-rotator { position: relative; height: 260px; perspective: 1100px; margin: 0 0 14px; overflow: hidden; max-width: 520px; }
        .sn-headline-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: rotateX(75deg) translateY(16px);
          transform-origin: 50% 0%;
          filter: blur(3px);
          animation: snHeadlineFold 10.5s infinite;
        }
        .sn-slide-2 { animation-delay: 3.5s; }
        .sn-slide-3 { animation-delay: 7s; }
        .sn-headline-shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(105deg, transparent 0 38%, rgba(255,228,148,.38) 47%, transparent 57%);
          mix-blend-mode: multiply;
          animation: snTextShine 3.5s ease-in-out infinite;
        }
        @keyframes snHeadlineFold {
          0% { opacity: 0; transform: rotateX(78deg) translateY(18px); filter: blur(5px); }
          8%, 27% { opacity: 1; transform: rotateX(0) translateY(0); filter: blur(0); }
          31% { opacity: 0; transform: rotateX(-70deg) translateY(-18px); filter: blur(4px); }
          100% { opacity: 0; transform: rotateX(-70deg) translateY(-18px); filter: blur(4px); }
        }
        @keyframes snTextShine {
          0%, 40% { transform: translateX(-120%); }
          68%, 100% { transform: translateX(120%); }
        }

        .sn-hero-subtitle { color: #a76418; font-weight: 900; font-size: 18px; margin: 0 0 10px; line-height: 1.3; letter-spacing: .02em; max-width: 520px; }
        .sn-hero-paragraph { font-size: 15px; line-height: 1.6; color: #23354e; font-weight: 600; max-width: 480px; margin: 0; }
        .sn-gold-rule { width: 80%; max-width: 420px; height: 1px; background: linear-gradient(90deg, var(--gold), rgba(196,134,40,.15), transparent); margin: 8px 0 20px; position: relative; }
        .sn-rule-diamond { position: absolute; left: 49%; top: -10px; color: var(--gold); font-size: 18px; background: var(--ivory-2); padding: 0 8px; }

        /* ─── VIDEO HEADER ─── */
        .sn-showcase-wrap { height: 420px; position: relative; display: flex; align-items: center; justify-content: center; }
        .sn-video-frame {
          position: relative;
          width: min(460px, 100%);
          aspect-ratio: 1 / 1;
          max-height: 400px;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(160deg, #061d3d 0%, #0a2e5e 45%, #05203f 100%);
          border: 1px solid rgba(224,180,97,.4);
          box-shadow:
            0 30px 60px rgba(7,26,51,.28),
            0 8px 20px rgba(0,0,0,.12),
            inset 0 0 0 1px rgba(255,255,255,.08);
          animation: snVideoFloat 6s ease-in-out infinite;
        }
        .sn-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
          display: block;
        }
        .sn-video-fallback {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 40%, rgba(224,180,97,.12), transparent 60%), linear-gradient(160deg, #061d3d, #05203f);
        }
        .sn-video-ring {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          border-radius: 20px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), inset 0 0 40px rgba(7,26,51,.35);
          background: linear-gradient(180deg, transparent 60%, rgba(5,31,69,.55) 100%);
        }
        .sn-video-caption {
          position: absolute;
          left: 0; right: 0; bottom: 14px;
          z-index: 4;
          text-align: center;
          pointer-events: none;
        }
        .sn-video-caption span {
          font-size: 10px;
          letter-spacing: .26em;
          color: #ffe7b0;
          font-weight: 800;
          background: rgba(5,31,69,.55);
          backdrop-filter: blur(4px);
          padding: 6px 16px;
          border-radius: 99px;
          border: 1px solid rgba(224,180,97,.4);
        }
        @keyframes snVideoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        /* ─── FOCUS PANEL ─── */
        .sn-focus-panel { border-left: 1px solid rgba(196,134,40,.26); padding-left: 32px; align-self: center; display: flex; flex-direction: column; gap: 14px; }
        .sn-focus-card { display: flex; align-items: center; gap: 14px; border: 1px solid rgba(196,134,40,.35); background: rgba(255,250,241,.72); border-radius: 10px; padding: 13px 14px; color: var(--navy); font-weight: 850; box-shadow: 0 8px 20px rgba(86,58,11,.05); position: relative; overflow: hidden; transition: all .32s ease; }
        .sn-focus-icon { color: #bd7723; flex: 0 0 auto; transition: .32s ease; display: flex; }
        .sn-focus-label { font-size: 14px; white-space: nowrap; }
        .sn-focus-card.active { background: linear-gradient(180deg, #fff, #fff6df); box-shadow: 0 14px 30px rgba(196,134,40,.16); border-color: rgba(196,134,40,.72); }
        .sn-focus-card.active:before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,221,144,.48), transparent); animation: snShutter 1.2s ease both; }
        .sn-focus-card.active .sn-focus-icon { transform: scale(1.13); color: #0a6b3b; filter: drop-shadow(0 0 7px rgba(224,180,97,.55)); }
        @keyframes snShutter { 0% { transform: translateX(-110%); } 100% { transform: translateX(110%); } }

        /* ─── HOW IT WORKS ─── */
        .sn-works { margin-top: 10px; padding: 16px 0 18px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .sn-section-title { font-weight: 950; text-align: center; letter-spacing: .16em; color: var(--navy); font-size: 14px; text-transform: uppercase; margin: 0 0 14px; display: flex; justify-content: center; align-items: center; gap: 16px; }
        .sn-section-title:before, .sn-section-title:after { content: "◆"; color: var(--gold); font-size: 10px; }
        .sn-work-grid { display: grid; grid-template-columns: 1fr 42px 1fr 42px 1fr; align-items: center; gap: 6px; }
        .sn-work-card { display: grid; grid-template-columns: 68px 1fr; align-items: center; gap: 14px; min-height: 80px; padding: 0 10px; }
        .sn-work-card h3 { font-family: Georgia, serif; color: var(--navy); font-size: 17px; margin: 0 0 5px; }
        .sn-work-card p { color: #1e3554; font-weight: 600; line-height: 1.4; font-size: 13px; margin: 0; }
        .sn-icon-ring {
          width: 62px; height: 62px;
          border: 1px solid rgba(196,134,40,.55);
          border-radius: 50%;
          display: grid; place-items: center;
          background: linear-gradient(145deg, #fffaf1 0%, #f3d18a 34%, #a96d1f 58%, #fff2c0 76%, #7e531a 100%);
          box-shadow: inset 0 2px 4px rgba(255,255,255,.85), inset 0 -8px 14px rgba(81,52,13,.16), 0 10px 20px rgba(152,96,19,.15);
          position: relative;
          animation: snMetalPulse 4s ease-in-out infinite;
          overflow: hidden;
        }
        .sn-icon-ring:before {
          content: "";
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 22%, #fffef8 0%, #fff7de 33%, #e0b461 58%, #8e5b18 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
        }
        .sn-icon-ring:after {
          content: "";
          position: absolute;
          top: -35%; bottom: -35%;
          width: 30%; left: -55%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent);
          transform: rotate(22deg);
          animation: snMetalSweep 2.8s ease-in-out infinite;
        }
        .sn-icon-ring svg { width: 30px; height: 30px; color: #063f26; position: relative; z-index: 2; filter: drop-shadow(0 2px 1px rgba(255,255,255,.45)) drop-shadow(0 4px 6px rgba(67,38,5,.18)); }
        .sn-arrow { font-size: 28px; color: var(--gold); justify-self: center; animation: snArrowPulse 1.9s ease-in-out infinite; opacity: .7; }
        @keyframes snMetalPulse { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scale(1.035); } }
        @keyframes snMetalSweep { 0%, 35% { left: -60%; opacity: 0; } 48% { opacity: 1; } 78%, 100% { left: 135%; opacity: 0; } }
        @keyframes snArrowPulse { 0%, 100% { transform: translateX(0); opacity: .62; } 50% { transform: translateX(7px); opacity: 1; } }

        /* ─── GROW YOUR MONEY ─── */
        .sn-money {
          margin: 24px 0 22px;
          border-radius: 12px;
          border: 1px solid rgba(224,180,97,.45);
          background: linear-gradient(90deg, #061d3d 0%, #082e62 48%, #061d3d 100%);
          box-shadow: 0 20px 40px rgba(5,31,69,.18);
          display: grid;
          grid-template-columns: 48% 22% 30%;
          overflow: hidden;
          min-height: 200px;
          position: relative;
        }
        .sn-money-copy { padding: 30px 34px; color: white; position: relative; z-index: 2; }
        .sn-money h2 { font-family: Georgia, serif; font-size: 28px; letter-spacing: .02em; margin: 0; color: #fff; line-height: 1.1; font-weight: 500; }
        .sn-small-rule { width: 100px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); margin: 14px 0 12px; }
        .sn-money p { font-size: 14px; line-height: 1.55; color: #f6eee0; margin: 0 0 18px; max-width: 420px; }
        .sn-btn-gold { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; border: 1px solid rgba(255,225,149,.8); border-radius: 6px; color: white; background: linear-gradient(180deg, #d7a246, #a76816); padding: 12px 20px; font-weight: 900; text-transform: uppercase; letter-spacing: .045em; box-shadow: 0 12px 24px rgba(0,0,0,.2); font-size: 12px; }

        /* Chart */
        .sn-chart { position: relative; min-height: 200px; background: radial-gradient(circle at 80% 28%, rgba(255,211,106,.1), transparent 24%), linear-gradient(90deg, rgba(6,29,61,0), rgba(8,46,98,.35)); overflow: hidden; animation: snChartBounce 4.5s ease-in-out infinite; opacity: .85; }
        .sn-chart:before { content: ""; position: absolute; inset: 16px; border-radius: 12px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent); animation: snChartScan 3s linear infinite; z-index: 1; pointer-events: none; }
        .sn-chart svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .sn-bars rect { transform-origin: bottom; animation: snBarRise 1.7s ease forwards, snBarBounce 2.6s ease-in-out 2s infinite; transform: scaleY(0); }
        .sn-bars rect:nth-child(2) { animation-delay: .1s; }
        .sn-bars rect:nth-child(3) { animation-delay: .18s; }
        .sn-bars rect:nth-child(4) { animation-delay: .28s; }
        .sn-bars rect:nth-child(5) { animation-delay: .38s; }
        .sn-bars rect:nth-child(6) { animation-delay: .5s; }
        .sn-bars rect:nth-child(7) { animation-delay: .62s; }
        .sn-bars rect:nth-child(8) { animation-delay: .75s; }
        .sn-bars rect:nth-child(9) { animation-delay: .9s; }
        .sn-growth-line { stroke-dasharray: 520; stroke-dashoffset: 520; animation: snDrawLine 2.4s ease 1.1s forwards; filter: drop-shadow(0 0 7px #ffc55a); }
        .sn-area { opacity: 0; animation: snAreaFade 1.6s ease 1.8s forwards; }
        .sn-spark { animation: snSparkMove 4s ease-in-out infinite; filter: drop-shadow(0 0 10px #ffd36a); }
        .sn-chart-legend { position: absolute; top: 12px; left: 16px; z-index: 2; display: flex; flex-direction: column; gap: 5px; }
        .sn-chart-legend span { display: inline-flex; align-items: center; gap: 6px; font-size: 9.5px; font-weight: 700; color: #cfe0f5; text-transform: uppercase; letter-spacing: .04em; }
        .sn-chart-legend i { width: 9px; height: 9px; border-radius: 2px; display: inline-block; }
        .sn-chart-caption { position: absolute; bottom: 10px; left: 0; right: 0; z-index: 2; text-align: center; font-size: 9px; color: #9fb6d4; letter-spacing: .03em; font-style: italic; }
        @keyframes snAreaFade { to { opacity: 1; } }
        @keyframes snBarRise { to { transform: scaleY(1); } }
        @keyframes snBarBounce { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.38); } }
        @keyframes snDrawLine { to { stroke-dashoffset: 0; } }
        @keyframes snSparkMove { 0%, 100% { opacity: .75; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(-14px) scale(1.22); } }
        @keyframes snChartBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes snChartScan { to { transform: translateX(130%); } }

        /* LDTT Card */
        .sn-ldtt-card { background: #fffaf1; margin: 12px; border-radius: 11px; padding: 20px 22px; display: grid; grid-template-columns: 80px 1fr; gap: 18px; align-items: center; border: 1px solid rgba(196,134,40,.35); box-shadow: inset 0 0 0 1px rgba(255,255,255,.65), 0 10px 20px rgba(0,0,0,.08); }
        .sn-ldtt-card small { display: block; color: var(--navy); font-weight: 950; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px; font-size: 10px; }
        .sn-ldtt-card h3 { font-family: Georgia, serif; color: var(--navy); font-size: 18px; line-height: 1.15; margin: 0 0 6px; text-transform: uppercase; }
        .sn-ldtt-card p { margin: 0; color: #23354e; font-weight: 700; line-height: 1.4; font-size: 12px; }
        .sn-ldtt-card a { display: inline-flex; margin-top: 8px; color: #b26e18; text-transform: uppercase; font-weight: 950; letter-spacing: .05em; text-decoration: none; font-size: 11px; }
        .sn-ldtt-card a:hover { text-decoration: underline; }

        /* ─── TRUST STRIP ─── */
        .sn-trust-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin: 16px 0 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px; }
        .sn-trust-item { display: grid; grid-template-columns: 56px 1fr; gap: 14px; align-items: center; border-right: 1px solid var(--line); padding-right: 18px; }
        .sn-trust-item:last-child { border-right: 0; }
        .sn-trust-icon { width: 50px; height: 50px; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle, #fff, #fff4dd); border: 1px solid rgba(196,134,40,.4); box-shadow: 0 4px 12px rgba(152,96,19,.1); }
        .sn-trust-icon svg { width: 28px; height: 28px; color: var(--green); }
        .sn-trust-item h4 { font-family: Georgia, serif; color: var(--navy); font-size: 16px; margin: 0 0 4px; }
        .sn-trust-item p { font-size: 12px; line-height: 1.4; color: #23354e; font-weight: 600; margin: 0; }

        /* ─── FOOTER ─── */
        .sn-footer-home { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 0 46px 25px; color: var(--navy); max-width: 1500px; margin: 0 auto; }
        .sn-footer-home strong { font-family: Georgia, serif; font-size: 20px; letter-spacing: .07em; }
        .sn-script { font-family: "Brush Script MT", "Segoe Script", cursive; color: #c17a2a; font-size: 22px; }
        .sn-footer-right { display: flex; align-items: center; gap: 24px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; font-weight: 850; }

        /* ─── RESPONSIVE: TABLET ─── */
        @media (max-width: 1180px) {
          .sn-nav-bar { padding: 16px 24px; }
          .sn-nav-links { gap: 18px; }
          .sn-page { padding: 0 24px 24px; }
          .sn-hero { grid-template-columns: 1fr; gap: 10px; }
          .sn-hero-copy { order: 1; }
          .sn-showcase-wrap { order: 2; height: auto; padding: 10px 0 20px; }
          .sn-focus-panel { order: 3; border-left: 0; padding-left: 0; display: grid; grid-template-columns: repeat(3, 1fr); }
          .sn-focus-label { white-space: normal; }
          .sn-work-grid { grid-template-columns: 1fr; }
          .sn-arrow { transform: rotate(90deg); animation: none; }
          .sn-money { grid-template-columns: 1fr; }
          .sn-chart { height: 170px; }
          .sn-trust-strip { grid-template-columns: 1fr; }
          .sn-trust-item { border-right: 0; border-bottom: 1px solid var(--line); padding-bottom: 18px; padding-right: 0; }
          .sn-trust-item:last-child { border-bottom: 0; }
        }

        /* ─── RESPONSIVE: MOBILE ─── */
        @media (max-width: 760px) {
          .sn-top-line { font-size: 10px; letter-spacing: .18em; }
          .sn-brand img { height: 56px !important; }
          .sn-nav-links, .sn-portal-btn { display: none; }
          .sn-nav-bar { padding: 14px 16px; }
          .sn-page { padding: 0 16px 20px; }
          .sn-hero { padding-top: 10px; }
          .sn-editorial-kicker { font-size: 11px; }
          .sn-home h1 { font-size: 36px; }
          .sn-headline-rotator { height: 200px; }
          .sn-hero-subtitle { font-size: 17px; }
          .sn-showcase-wrap { padding: 6px 0 16px; }
          .sn-video-frame { width: 100%; max-width: 360px; }
          .sn-focus-panel { grid-template-columns: 1fr; }
          .sn-work-card { grid-template-columns: 72px 1fr; padding: 8px 0; }
          .sn-money h2 { font-size: 30px; }
          .sn-money-copy { padding: 28px 22px; }
          .sn-ldtt-card { grid-template-columns: 1fr; text-align: center; }
          .sn-trust-item { grid-template-columns: 60px 1fr; }
          .sn-footer-home { flex-direction: column; text-align: center; padding: 0 16px 25px; }
          .sn-footer-right { flex-wrap: wrap; justify-content: center; }
          .sn-script { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
