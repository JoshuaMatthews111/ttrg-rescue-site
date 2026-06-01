"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, ClipboardList, Users, Star, CreditCard, BarChart3, FolderOpen, Network, Megaphone, Contact, CalendarDays, Settings, ShieldCheck, Bell, Mail, CheckCircle, CircleDot, TrendingUp, Wallet, Menu, LogOut, UserCircle } from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => { if (started.current) return; started.current = true; const s = performance.now(); const step = (n: number) => { const p = Math.min((n - s) / duration, 1); setCount(Math.round(target * p)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, [target, duration]);
  return count;
}

const adminTabs = [
  { id: "overview", label: "Overview", ico: "dashboard" },
  { id: "applications", label: "Applications", ico: "clipboard" },
  { id: "members", label: "Members", ico: "users" },
  { id: "units", label: "Founder Units", ico: "star" },
  { id: "payments", label: "Payments", ico: "credit" },
  { id: "reports", label: "Financial Reports", ico: "chart" },
  { id: "docs", label: "Documents", ico: "folder" },
  { id: "matrix", label: "Referral Matrix", ico: "network" },
  { id: "announcements", label: "Announcements", ico: "megaphone" },
  { id: "crm", label: "Prospects CRM", ico: "contact" },
  { id: "scheduler", label: "Scheduler", ico: "calendar" },
  { id: "settings", label: "Settings", ico: "settings" },
  { id: "audit", label: "Audit Logs", ico: "shield" },
];

const matrixL1 = [
  { name: "Maria Santos", pic: "M", invested: "$25,000", units: 25, status: "Active", joined: "May 20", location: "Miami, FL", source: "Lorenzo" },
  { name: "David Chen", pic: "D", invested: "$10,000", units: 10, status: "Pending", joined: "May 22", location: "New York, NY", source: "Lorenzo" },
  { name: "James Wilson", pic: "J", invested: "$15,000", units: 15, status: "Active", joined: "May 28", location: "Dallas, TX", source: "Lorenzo" },
];

const calendarDays = (() => {
  const days = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
})();

const meetings = [
  { id: 1, title: "Investor Call - Michael Anderson", date: "Jun 2, 2025", time: "10:00 AM", type: "Zoom Presentation", status: "Confirmed", zoom: "https://zoom.us/j/987654321" },
  { id: 2, title: "Onboarding - Sophia Martinez", date: "Jun 4, 2025", time: "2:00 PM", type: "Onboarding Call", status: "Pending", zoom: "" },
  { id: 3, title: "Follow-up - David Thompson", date: "Jun 6, 2025", time: "11:30 AM", type: "Follow-up", status: "Confirmed", zoom: "https://zoom.us/j/123456789" },
  { id: 4, title: "Quarterly Review - Lorenzo", date: "Jun 10, 2025", time: "9:00 AM", type: "Zoom Presentation", status: "Confirmed", zoom: "https://zoom.us/j/111222333" },
];

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerMember, setDrawerMember] = useState<typeof matrixL1[0] | null>(null);
  const [matrixAnimated, setMatrixAnimated] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [showGcal, setShowGcal] = useState(false);
  const [chartDraw, setChartDraw] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [meetingCreated, setMeetingCreated] = useState(false);

  useEffect(() => { setTimeout(() => setChartDraw(true), 300); }, []);
  useEffect(() => { if (activeTab === "matrix") setTimeout(() => setMatrixAnimated(true), 100); }, [activeTab]);

  const membersCount = useCountUp(128);
  const apps = useCountUp(23);
  const issued = useCountUp(3450);
  const remaining = useCountUp(46550);

  const card: React.CSSProperties = { background: "#fff", border: "1px solid #e7e2d8", borderRadius: 14, padding: 24, boxShadow: "0 8px 24px rgba(5,20,45,.06)" };
  const kpiBox: React.CSSProperties = { ...card, display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", transition: ".3s", cursor: "pointer" };
  const thS: React.CSSProperties = { textAlign: "left", padding: 10, color: "#667085", fontSize: 11, textTransform: "uppercase", fontWeight: 900, borderBottom: "1px solid #e9edf3" };
  const tdS: React.CSSProperties = { padding: 12, borderBottom: "1px solid #eef2f6" };
  const btnGreen: React.CSSProperties = { background: "linear-gradient(135deg,#075933,#0b7346)", color: "#fff", border: 0, borderRadius: 8, padding: "12px 16px", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", cursor: "pointer", transition: ".25s" };
  const btnGold: React.CSSProperties = { background: "linear-gradient(135deg,#d1a645,#bc8b25)", color: "#fff", border: 0, borderRadius: 8, padding: "12px 16px", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", cursor: "pointer", transition: ".25s" };
  const btnOutline: React.CSSProperties = { background: "#fff", color: "#a46a00", border: "1px solid #bd8e28", borderRadius: 8, padding: "8px 14px", fontWeight: 900, fontSize: 11, cursor: "pointer", transition: ".25s" };
  const fieldLabel: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 900, color: "#667085", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 };
  const fieldInput: React.CSSProperties = { width: "100%", background: "#f9f6ef", border: "1px solid #e7e2d8", borderRadius: 8, padding: "12px 16px", fontSize: 14, outline: "none" };
  const statusBadge = (s: string) => ({ padding: "4px 10px", borderRadius: 99, background: s === "Active" || s === "Published" || s === "Confirmed" ? "#e3f5eb" : s === "Pending" || s === "Review" ? "#fffaf0" : "#f5f7fb", color: s === "Active" || s === "Published" || s === "Confirmed" ? "#087345" : s === "Pending" || s === "Review" ? "#bd8e28" : "#667085", fontSize: 11, fontWeight: 900 as const, textTransform: "uppercase" as const });

  const switchTab = (id: string) => { setActiveTab(id); setSidebarOpen(false); };

  const handleCreateZoom = () => {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    setZoomLink(`https://zoom.us/j/${id}`);
    setShowZoom(true);
  };

  const handleCreateMeeting = () => {
    setMeetingCreated(true);
    setTimeout(() => setMeetingCreated(false), 3000);
  };

  const icoMap: Record<string, React.ReactNode> = { dashboard: <LayoutDashboard size={18} />, clipboard: <ClipboardList size={18} />, users: <Users size={18} />, star: <Star size={18} />, credit: <CreditCard size={18} />, chart: <BarChart3 size={18} />, folder: <FolderOpen size={18} />, network: <Network size={18} />, megaphone: <Megaphone size={18} />, contact: <Contact size={18} />, calendar: <CalendarDays size={18} />, settings: <Settings size={18} />, shield: <ShieldCheck size={18} /> };

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: "#071a33", background: "#fcfbf8" }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="sn-sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{ display: "none" }} />}

      <div className="sn-portal-grid" style={{ display: "grid", gridTemplateColumns: "296px 1fr", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside className={`sn-sidebar ${sidebarOpen ? "open" : ""}`} style={{ background: "linear-gradient(180deg,#fff 0%,#fbf8f1 54%,#edf6ef 100%)", borderRight: "1px solid #e7e2d8", padding: "24px 18px", position: "sticky", top: 0, height: "100vh", overflow: "auto" }}>
          <div style={{ marginBottom: 28 }}><Link href="/selectnetwork"><Image src="/select-network-logo.png" alt="Select Network" width={245} height={60} style={{ width: 245, height: "auto" }} /></Link></div>
          <nav style={{ display: "grid", gap: 7 }}>
            {adminTabs.map((t) => (
              <button key={t.id} onClick={() => switchTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left", padding: "14px 16px", border: 0, borderRadius: 12, background: activeTab === t.id ? "linear-gradient(135deg,#075933,#0d6d42)" : "transparent", color: activeTab === t.id ? "#fff" : "#10233b", fontWeight: 800, fontSize: 14, transition: ".25s", transform: activeTab === t.id ? "translateX(3px)" : "none", boxShadow: activeTab === t.id ? "0 0 22px rgba(213,168,61,.55)" : "none", cursor: "pointer" }}>
                <span style={{ width: 27, color: activeTab === t.id ? "#ffd46f" : "#c48817", display: "flex", justifyContent: "center" }}>{icoMap[t.ico] || t.ico}</span>{t.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 34, background: "#fff", border: "1px solid #e7e2d8", boxShadow: "0 16px 40px rgba(5,20,45,.10)", padding: 20, borderRadius: 12 }}>
            <h3 style={{ margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Staff Support</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#667085" }}>Staff support center.</p>
            <button style={btnGreen}>Contact Support →</button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ padding: "28px 30px 48px", minWidth: 0 }}>
          {/* ── MOBILE APP HEADER (hidden on desktop via CSS) ── */}
          <div className="sn-app-topbar" style={{ display: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="sn-mobile-toggle" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", color: "#bd8e28", textTransform: "uppercase" }}>Admin Portal</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{adminTabs.find(t => t.id === activeTab)?.label || "Overview"}</div>
              </div>
            </div>
            <div className="sn-topbar-right">
              <span style={{ position: "relative", cursor: "pointer" }}><Bell size={20} color="#ffd46f" /><span style={{ position: "absolute", top: -4, right: -6, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 900, padding: "1px 4px", borderRadius: 99 }}>4</span></span>
              <div className="sn-avatar-sm">A</div>
            </div>
          </div>

          {/* ── DESKTOP TOP BAR (hidden on mobile via CSS) ── */}
          <div className="sn-desktop-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="sn-mobile-toggle" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
              <div><div style={{ fontSize: 13, color: "#667085" }}>Welcome back, Admin.</div><h1 style={{ margin: "4px 0 0", fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 400 }}>Admin Overview</h1></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <span style={{ position: "relative", cursor: "pointer" }}><Bell size={22} color="#667085" /><span style={{ position: "absolute", top: -4, right: -8, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 900, padding: "2px 5px", borderRadius: 99 }}>1</span></span>
              <span style={{ position: "relative", cursor: "pointer" }}><Mail size={22} color="#667085" /><span style={{ position: "absolute", top: -4, right: -8, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 900, padding: "2px 5px", borderRadius: 99 }}>3</span></span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#075933,#0d6d42)", color: "#ffd46f", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 16 }}>A</div><div className="sn-user-desktop"><b style={{ fontSize: 14 }}>Admin User</b><br /><small style={{ color: "#667085" }}>Administrator</small></div></div>
            </div>
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div className="sn-kpi-grid-6" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 22 }}>
                {[{ ico: <Users size={20} />, label: "Active Members", value: String(membersCount) }, { ico: <ClipboardList size={20} />, label: "Pending Apps", value: String(apps) }, { ico: <Star size={20} />, label: "Units Issued", value: issued.toLocaleString() }, { ico: <CircleDot size={20} />, label: "Remaining", value: remaining.toLocaleString() }, { ico: <CalendarDays size={20} />, label: "Meetings", value: "6" }, { ico: <BarChart3 size={20} />, label: "Reports Pending", value: "7" }].map((k, i) => (
                  <div key={i} style={kpiBox} className="hover:translate-y-[-3px] hover:shadow-[0_16px_40px_rgba(5,20,45,.10)]">
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#edf6ef", border: "1px solid #c7e2d0", display: "grid", placeItems: "center", color: "#c48817" }}>{k.ico}</div>
                    <div><small style={{ fontSize: 11, color: "#667085", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>{k.label}</small><br /><b style={{ fontSize: 18 }}>{k.value}</b></div>
                  </div>
                ))}
              </div>
              <div className="sn-admin-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
                <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Platform Analytics</h2>
                  <svg viewBox="0 0 640 260" style={{ width: "100%", height: 180 }}>
                    <polyline points="35,205 120,178 205,154 292,139 380,118 468,88 598,44" fill="none" stroke="#bd8e28" strokeWidth="5" style={{ strokeDasharray: 900, strokeDashoffset: chartDraw ? 0 : 900, transition: "stroke-dashoffset 2s ease" }} />
                    <polyline points="35,220 120,198 205,181 292,169 380,151 468,139 598,118" fill="none" stroke="#075933" strokeWidth="4" style={{ strokeDasharray: 900, strokeDashoffset: chartDraw ? 0 : 900, transition: "stroke-dashoffset 2s ease .3s" }} />
                    <g fill="#fff" stroke="#bd8e28" strokeWidth="4" style={{ opacity: chartDraw ? 1 : 0, transition: "opacity .5s ease 1.5s" }}><circle cx="120" cy="178" r="6" /><circle cx="292" cy="139" r="6" /><circle cx="468" cy="88" r="6" /><circle cx="598" cy="44" r="6" /></g>
                  </svg>
                </div>
                <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 14px" }}>Applications Queue</h2>
                  {[{ name: "Michael Anderson", loc: "Miami, FL" }, { name: "Sophia Martinez", loc: "Austin, TX" }, { name: "David Thompson", loc: "Dallas, TX" }].map((a, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eef2f6" }}>
                      <div><b style={{ fontSize: 13 }}>{a.name}</b><br /><small style={{ color: "#667085" }}>{a.loc}</small></div>
                      <button style={{ ...btnOutline, fontSize: 10, padding: "4px 10px" }}>Review</button>
                    </div>
                  ))}
                </div>
                <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 14px" }}>Quick Actions</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {["Review Apps", "Approve Reports", "Schedule Meeting", "Export Data", "Add Member", "Upload CSV", "Send Update", "Open Matrix"].map((a, i) => (
                      <button key={i} onClick={() => { if (a === "Review Apps") switchTab("applications"); if (a === "Approve Reports") switchTab("reports"); if (a === "Schedule Meeting") switchTab("scheduler"); if (a === "Open Matrix") switchTab("matrix"); }} style={{ padding: "10px 8px", background: i % 2 === 0 ? "#f9f6ef" : "#edf6ef", border: "1px solid #e7e2d8", borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: "pointer", transition: ".25s", color: "#071a33" }} className="hover:translate-y-[-2px] hover:shadow-[0_0_22px_rgba(213,168,61,.55)]">{a} →</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}><input placeholder="Search applications" style={{ flex: 1, minWidth: 200, ...fieldInput }} /><select style={{ ...fieldInput, width: "auto" }}><option>All Statuses</option></select><button style={btnGreen}>Filter</button></div>
              <div className="sn-table-wrap" style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Applications</h2>
                <div className="sn-desktop-table" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
                  <thead><tr>{["Name", "Interest", "Date", "Status", "Actions"].map(h => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[{ name: "Michael Anderson", interest: "$10,000", date: "May 20", status: "Review" }, { name: "Sophia Martinez", interest: "$25,000", date: "May 19", status: "Review" }, { name: "David Thompson", interest: "$50,000", date: "May 18", status: "Pending" }].map((a, i) => (
                      <tr key={i}><td style={tdS}><b>{a.name}</b></td><td style={{ ...tdS, color: "#bd8e28", fontWeight: 700 }}>{a.interest}</td><td style={{ ...tdS, color: "#667085" }}>{a.date}</td><td style={tdS}><span style={statusBadge(a.status)}>{a.status}</span></td><td style={tdS}><button style={btnOutline}>Approve</button> <button style={{ ...btnOutline, borderColor: "#dc2626", color: "#dc2626", marginLeft: 4 }}>Reject</button></td></tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="sn-mobile-cards" style={{ display: "none" }}>
                  {[{ name: "Michael Anderson", interest: "$10,000", date: "May 20", status: "Review" }, { name: "Sophia Martinez", interest: "$25,000", date: "May 19", status: "Review" }, { name: "David Thompson", interest: "$50,000", date: "May 18", status: "Pending" }].map((a, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><b style={{ fontSize: 15 }}>{a.name}</b><span style={statusBadge(a.status)}>{a.status}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Interest</span><span className="sn-m-value" style={{ color: "#bd8e28" }}>{a.interest}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Date</span><span className="sn-m-value">{a.date}</span></div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}><button style={{ ...btnGreen, flex: 1, padding: "10px" }}>Approve</button><button style={{ ...btnOutline, flex: 1, borderColor: "#dc2626", color: "#dc2626" }}>Reject</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {activeTab === "members" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}><input placeholder="Search members" style={{ flex: 1, minWidth: 200, ...fieldInput }} /><button style={btnGreen}>Add Member</button><button style={btnOutline}>Upload CSV</button></div>
              <div className="sn-table-wrap" style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Members</h2>
                <div className="sn-desktop-table" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
                  <thead><tr>{["Name", "Status", "Units", "Invested", "Joined", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[{ name: "Lorenzo", status: "Active", units: 50, invested: "$5,000", joined: "May 12" }, { name: "Maria Santos", status: "Active", units: 25, invested: "$2,500", joined: "May 20" }, { name: "David Chen", status: "Pending", units: 10, invested: "$1,000", joined: "May 22" }, { name: "James Wilson", status: "Active", units: 15, invested: "$1,500", joined: "May 28" }].map((m, i) => (
                      <tr key={i}><td style={{ ...tdS, fontWeight: 700 }}>{m.name}</td><td style={tdS}><span style={statusBadge(m.status)}>{m.status}</span></td><td style={tdS}>{m.units}</td><td style={tdS}>{m.invested}</td><td style={{ ...tdS, color: "#667085" }}>{m.joined}</td><td style={tdS}><button style={btnOutline}>View</button></td></tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="sn-mobile-cards" style={{ display: "none" }}>
                  {[{ name: "Lorenzo", status: "Active", units: 50, invested: "$5,000", joined: "May 12" }, { name: "Maria Santos", status: "Active", units: 25, invested: "$2,500", joined: "May 20" }, { name: "David Chen", status: "Pending", units: 10, invested: "$1,000", joined: "May 22" }, { name: "James Wilson", status: "Active", units: 15, invested: "$1,500", joined: "May 28" }].map((m, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><b style={{ fontSize: 15 }}>{m.name}</b><span style={statusBadge(m.status)}>{m.status}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Units</span><span className="sn-m-value">{m.units}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Invested</span><span className="sn-m-value">{m.invested}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Joined</span><span className="sn-m-value">{m.joined}</span></div>
                      <button style={{ ...btnOutline, width: "100%", marginTop: 10 }}>View Profile</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FOUNDER UNITS */}
          {activeTab === "units" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div className="sn-kpi-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
                {[{ ico: <Star size={20} />, label: "Total Planned", value: "50,000" }, { ico: <CheckCircle size={20} />, label: "Issued", value: "3,450" }, { ico: <CircleDot size={20} />, label: "Remaining", value: "46,550" }, { ico: <Wallet size={20} />, label: "Unit Price", value: "$100" }].map((k, i) => (
                  <div key={i} style={kpiBox}><div style={{ width: 42, height: 42, borderRadius: "50%", background: "#edf6ef", border: "1px solid #c7e2d0", display: "grid", placeItems: "center", color: "#c48817" }}>{k.ico}</div><div><small style={{ fontSize: 11, color: "#667085", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</small><br /><b style={{ fontSize: 18 }}>{k.value}</b></div></div>
                ))}
              </div>
              <div style={{ ...card, marginBottom: 16 }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Founder Unit Management</h2>
                <div className="sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div><label style={fieldLabel}>Issue Units</label><input placeholder="Number of units" style={fieldInput} /></div>
                  <div><label style={fieldLabel}>Assign To Member</label><input placeholder="Search member" style={fieldInput} /></div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button style={btnGreen}>Issue Units</button><button style={btnOutline}>Pause Available</button><button style={btnOutline}>Update Availability</button></div>
                <div style={{ marginTop: 18, height: 12, background: "#edf6ef", borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: "6.9%", background: "linear-gradient(90deg,#bd8e28,#075933)", borderRadius: 99, transition: "width 1.5s ease" }} /></div>
                <p style={{ fontSize: 12, color: "#667085", marginTop: 8 }}>3,450 of 50,000 units issued (6.9%)</p>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div className="sn-table-wrap" style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Payments</h2>
                <div className="sn-desktop-table" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 550 }}>
                  <thead><tr>{["Member", "Amount", "Processor", "Status", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[{ name: "David Chen", amount: "$1,000", status: "Pending" }, { name: "Maria Santos", amount: "$2,500", status: "Active" }, { name: "James Wilson", amount: "$1,500", status: "Active" }].map((p, i) => (
                      <tr key={i}><td style={{ ...tdS, fontWeight: 700 }}>{p.name}</td><td style={tdS}>{p.amount}</td><td style={{ ...tdS, color: "#667085" }}>Placeholder</td><td style={tdS}><span style={statusBadge(p.status)}>{p.status}</span></td><td style={tdS}><button style={btnOutline}>Review</button></td></tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="sn-mobile-cards" style={{ display: "none" }}>
                  {[{ name: "David Chen", amount: "$1,000", status: "Pending" }, { name: "Maria Santos", amount: "$2,500", status: "Active" }, { name: "James Wilson", amount: "$1,500", status: "Active" }].map((p, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><b style={{ fontSize: 15 }}>{p.name}</b><span style={statusBadge(p.status)}>{p.status}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Amount</span><span className="sn-m-value">{p.amount}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Processor</span><span className="sn-m-value" style={{ color: "#667085" }}>Placeholder</span></div>
                      <button style={{ ...btnOutline, width: "100%", marginTop: 10 }}>Review</button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, borderLeft: "4px solid #3b82f6", background: "#f0f7ff", color: "#1e40af", padding: "12px 14px", fontSize: 12, borderRadius: "0 6px 6px 0" }}>Payment processor placeholder. Final integration after attorney/accountant review.</div>
              </div>
            </div>
          )}

          {/* FINANCIAL REPORTS */}
          {activeTab === "reports" && (
            <div className="sn-mobile-content sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, animation: "fadeIn .5s ease" }}>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Upload Financial Report</h2>
                <div className="sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={fieldLabel}>Title</label><input placeholder="Q2 Financial Snapshot" style={fieldInput} /></div>
                  <div><label style={fieldLabel}>Category</label><select style={fieldInput}><option>Monthly Financials</option><option>Quarterly Progress</option><option>Annual Report</option><option>Major Win</option><option>Investor Notice</option></select></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={fieldLabel}>Summary</label><textarea rows={3} style={{ ...fieldInput, resize: "none" as const }} /></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button style={btnGreen}>Save Draft</button><button style={btnGold}>Publish</button></div>
                <div style={{ marginTop: 14, borderLeft: "4px solid #bd8e28", background: "#fffaf0", color: "#604b17", padding: "12px 14px", fontSize: 12, borderRadius: "0 6px 6px 0" }}>Reports must be approved before investors can see them.</div>
              </div>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 14px" }}>Reports Pending Approval</h2>
                {[{ title: "Q2 Financial Report", date: "May 20" }, { title: "Expansion Milestone", date: "May 18" }].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eef2f6", flexWrap: "wrap", gap: 8 }}>
                    <div><b style={{ fontSize: 14 }}>{r.title}</b><br /><small style={{ color: "#667085" }}>Submitted {r.date}</small></div>
                    <div style={{ display: "flex", gap: 6 }}><span style={statusBadge("Pending")}>Pending</span><button style={btnOutline}>Approve</button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "docs" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}><button style={btnGreen}>+ Upload Document</button></div>
              <div className="sn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                {["Membership Agreement", "Operating Agreement", "Investment Disclosure", "Tax Form W-9", "Track Record", "Legal Updates"].map((d, i) => (
                  <div key={i} style={{ ...card, transition: ".3s" }} className="hover:translate-y-[-3px] hover:shadow-[0_16px_40px_rgba(5,20,45,.10)]">
                    <h3 style={{ margin: "0 0 8px" }}>{d}</h3>
                    <p style={{ color: "#667085", fontSize: 13, margin: "0 0 14px" }}>Document management</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><button style={btnOutline}>View</button><button style={{ ...btnOutline, borderColor: "#dc2626", color: "#dc2626" }}>Delete</button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REFERRAL MATRIX */}
          {activeTab === "matrix" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div className="sn-kpi-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
                {[{ ico: <Network size={20} />, label: "Current Network", value: "5 / 39" }, { ico: <Users size={20} />, label: "Total Slots", value: "40" }, { ico: <CheckCircle size={20} />, label: "Active", value: "28" }, { ico: <CircleDot size={20} />, label: "Pending", value: "3" }].map((k, i) => (
                  <div key={i} style={kpiBox}><div style={{ width: 42, height: 42, borderRadius: "50%", background: "#edf6ef", border: "1px solid #c7e2d0", display: "grid", placeItems: "center", color: "#c48817" }}>{k.ico}</div><div><small style={{ fontSize: 11, color: "#667085", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</small><br /><b style={{ fontSize: 18 }}>{k.value}</b></div></div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <input placeholder="Search members..." style={{ flex: 1, minWidth: 200, ...fieldInput }} />
                <select style={{ ...fieldInput, width: "auto" }}><option>All Statuses</option><option>Active</option><option>Pending</option><option>Paused</option></select>
                <button style={btnGreen}>Add Member</button>
              </div>
              <div style={card}>
                <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 22, margin: "0 0 20px" }}>Admin Referral Matrix & Member Management</h2>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, opacity: matrixAnimated ? 1 : 0, transform: matrixAnimated ? "translateY(0)" : "translateY(20px)", transition: "all .6s ease" }}>
                  <div style={{ background: "#fff", border: "2px solid #bd8e28", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 24px rgba(5,20,45,.06)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#075933,#0d6d42)", color: "#ffd46f", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 18 }}>L</div>
                    <div><b>Lorenzo</b><br /><small style={{ color: "#667085" }}>Origin • Active</small><div style={{ fontSize: 12, color: "#5b6675" }}>Units: 50 | Invested: $5,230</div></div>
                  </div>
                </div>
                <div style={{ height: 24, width: 2, background: "linear-gradient(#bd8e28,#075933)", margin: "0 auto", opacity: matrixAnimated ? 1 : 0, transition: "opacity .4s ease .3s" }} />
                <div style={{ marginBottom: 10, opacity: matrixAnimated ? 1 : 0, transform: matrixAnimated ? "translateY(0)" : "translateY(20px)", transition: "all .6s ease .4s" }}>
                  <div style={{ textAlign: "center", fontSize: 12, fontWeight: 900, color: "#075933", marginBottom: 8 }}>Level 1 — 3 Members</div>
                  <div className="sn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                    {matrixL1.map((m, i) => (
                      <div key={i} onClick={() => setDrawerMember(m)} style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 12, padding: 14, cursor: "pointer", transition: ".3s", boxShadow: "0 8px 22px rgba(5,20,45,.06)" }} className="hover:translate-y-[-3px] hover:shadow-[0_0_22px_rgba(213,168,61,.55)] hover:border-[#bd8e28]">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#edf6ef", border: "1px solid #c7e2d0", display: "grid", placeItems: "center", color: "#075933", fontWeight: 900, fontSize: 14 }}>{m.pic}</div>
                          <div><b style={{ fontSize: 13 }}>{m.name}</b><br /><small style={{ color: "#667085", fontSize: 11 }}>{m.invested} | {m.units} Units</small></div>
                        </div>
                        <span style={{ ...statusBadge(m.status), marginTop: 8, display: "inline-block" }}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ height: 20, width: 2, background: "linear-gradient(#bd8e28,#075933)", margin: "0 auto", opacity: matrixAnimated ? 1 : 0, transition: "opacity .4s ease .7s" }} />
                <div style={{ opacity: matrixAnimated ? 1 : 0, transform: matrixAnimated ? "translateY(0)" : "translateY(20px)", transition: "all .6s ease .8s" }}>
                  <div style={{ textAlign: "center", fontSize: 12, fontWeight: 900, color: "#075933", marginBottom: 8 }}>Level 2 — 9 Members</div>
                  <div className="sn-matrix-l2" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                    {["Sophia Lee", "Michael Brown", "Emily Davis", "Chris Park", "Ana Torres", null, null, null, null].map((n, i) => n ? (
                      <div key={i} style={{ background: "#fff", border: "1px solid #e7e2d8", borderRadius: 10, padding: 10, textAlign: "center", fontSize: 12, transition: ".3s", cursor: "pointer" }} className="hover:translate-y-[-2px] hover:border-[#bd8e28]">
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#edf6ef", display: "grid", placeItems: "center", margin: "0 auto 4px", fontSize: 11, fontWeight: 900, color: "#075933" }}>{n.charAt(0)}</div>
                        <b style={{ fontSize: 11 }}>{n.split(" ")[0]}</b><br /><span style={{ ...statusBadge("Active"), fontSize: 9 }}>Active</span>
                      </div>
                    ) : (
                      <div key={i} style={{ background: "#f9f6ef", border: "1px dashed #e7e2d8", borderRadius: 10, padding: 10, textAlign: "center", fontSize: 11, color: "#667085" }}><div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px dashed #c7e2d0", margin: "0 auto 4px", background: "#fff" }} />Open</div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 20, padding: 14, background: "#f9f6ef", borderRadius: 10, border: "1px solid #e7e2d8", opacity: matrixAnimated ? 1 : 0, transition: "opacity .5s ease 1.2s" }}>
                  <small style={{ color: "#667085", fontWeight: 700 }}>Level 3 — 27 slots (placeholder)</small>
                </div>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="sn-mobile-content sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, animation: "fadeIn .5s ease" }}>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Create Announcement</h2>
                <div className="sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={fieldLabel}>Title</label><input style={fieldInput} /></div>
                  <div><label style={fieldLabel}>Audience</label><select style={fieldInput}><option>All Members</option><option>Active Only</option></select></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={fieldLabel}>Message</label><textarea rows={4} style={{ ...fieldInput, resize: "none" as const }} /></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button style={btnGreen}>Publish Announcement</button><button style={btnOutline}>Save Draft</button></div>
              </div>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 14px" }}>Recent Announcements</h2>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eef2f6" }}><b>Q2 Investor Webinar</b><span style={statusBadge("Active")}>Published</span></div>
              </div>
            </div>
          )}

          {/* PROSPECTS CRM */}
          {activeTab === "crm" && (
            <div className="sn-mobile-content sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, animation: "fadeIn .5s ease" }}>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Prospects CRM</h2>
                <div className="sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[["Name", ""], ["Phone", ""], ["Email", ""], ["Interest", "$5,000"], ["Home Address", ""], ["Occupation", ""], ["Referred By", ""], ["Last Contact", ""]].map(([l, p], i) => (
                    <div key={i}><label style={fieldLabel}>{l}</label><input placeholder={p} style={fieldInput} /></div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}><label style={fieldLabel}>Notes</label><textarea placeholder="Left voicemail, referred by, follow-up..." rows={3} style={{ ...fieldInput, resize: "none" as const }} /></div>
                <button style={btnGreen}>Add Prospect</button>
              </div>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 14px" }}>CRM Summary</h2>
                <div style={{ width: 180, height: 180, border: "30px solid #075933", borderTopColor: "#bd8e28", borderRadius: "50%", display: "grid", placeItems: "center", margin: "20px auto" }}><b style={{ fontSize: 36 }}>194</b></div>
                <p style={{ textAlign: "center", color: "#667085", fontSize: 13 }}>Total prospects tracked</p>
              </div>
            </div>
          )}

          {/* SCHEDULER — Enhanced */}
          {activeTab === "scheduler" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              {/* Success Toast */}
              {meetingCreated && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 99999, background: "#e3f5eb", border: "1px solid #87d4a5", borderRadius: 10, padding: "14px 20px", boxShadow: "0 10px 30px rgba(5,20,45,.15)", animation: "fadeIn .3s ease" }}><b style={{ color: "#075933" }}>✓ Meeting Created Successfully</b></div>}

              <div className="sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                {/* Schedule Form */}
                <div style={card}>
                  <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Schedule Meeting</h2>
                  <div className="sn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><label style={fieldLabel}>Prospect / Member Name</label><input placeholder="Enter name" style={fieldInput} /></div>
                    <div><label style={fieldLabel}>Email</label><input type="email" placeholder="email@example.com" style={fieldInput} /></div>
                    <div><label style={fieldLabel}>Phone</label><input type="tel" placeholder="(555) 000-0000" style={fieldInput} /></div>
                    <div><label style={fieldLabel}>Date</label><input type="date" style={fieldInput} /></div>
                    <div><label style={fieldLabel}>Time</label><input type="time" style={fieldInput} /></div>
                    <div><label style={fieldLabel}>Meeting Type</label><select style={fieldInput}><option>Zoom Presentation</option><option>Onboarding Call</option><option>Follow-up</option><option>Investor Review</option><option>Prospect Introduction</option></select></div>
                  </div>
                  <div style={{ marginBottom: 12 }}><label style={fieldLabel}>Meeting Notes</label><textarea rows={2} placeholder="Pre-meeting notes, agenda items..." style={{ ...fieldInput, resize: "none" as const }} /></div>
                  <div style={{ marginBottom: 12 }}><label style={fieldLabel}>Follow-up Notes</label><textarea rows={2} placeholder="Post-meeting follow-up..." style={{ ...fieldInput, resize: "none" as const }} /></div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={handleCreateMeeting} style={btnGreen}>Create Invite</button>
                    <button onClick={handleCreateZoom} style={btnGold}>Create Zoom Meeting</button>
                    <button onClick={() => setShowGcal(true)} style={btnOutline}>Connect Google Calendar</button>
                  </div>
                </div>

                {/* Monthly Calendar */}
                <div style={card}>
                  <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 18, margin: "0 0 14px" }}>June 2025</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 16 }}>
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                      <div key={d} style={{ textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 900, color: "#667085" }}>{d}</div>
                    ))}
                    {calendarDays.map((day, i) => {
                      const hasEvent = day === 2 || day === 4 || day === 6 || day === 10;
                      const isToday = day === new Date().getDate();
                      return (
                        <div key={i} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 6, fontSize: 12, fontWeight: isToday ? 900 : 500, background: isToday ? "#075933" : hasEvent ? "#f9f6ef" : "transparent", color: isToday ? "#fff" : day ? "#071a33" : "transparent", border: hasEvent && !isToday ? "1px solid #e7e2d8" : "1px solid transparent", cursor: day ? "pointer" : "default", transition: ".2s", minHeight: 32 }}>
                          {day || ""}
                          {hasEvent && !isToday && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#bd8e28", margin: "2px auto 0" }} />}
                        </div>
                      );
                    })}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 10px", color: "#071a33" }}>Upcoming Meetings</h3>
                  {meetings.map((m) => (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eef2f6", gap: 8, flexWrap: "wrap" }}>
                      <div>
                        <b style={{ fontSize: 13 }}>{m.title}</b><br />
                        <small style={{ color: "#667085" }}>{m.date} • {m.time} • {m.type}</small>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={statusBadge(m.status)}>{m.status}</span>
                        {m.zoom && <button style={{ ...btnOutline, fontSize: 9, padding: "4px 8px" }}>Join Zoom</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="sn-mobile-content" style={{ maxWidth: 600, animation: "fadeIn .5s ease" }}>
              <div style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>System Settings</h2>
                {[["Admin Email", "admin@selectnetwork.com"], ["Company Name", "Select Network Private Investors Group LLC"], ["Unit Price", "$100"], ["Total Units", "50,000"]].map(([l, v], i) => (
                  <div key={i} style={{ marginBottom: 14 }}><label style={fieldLabel}>{l}</label><input defaultValue={v} style={fieldInput} /></div>
                ))}
                <h3 style={{ margin: "20px 0 10px", fontSize: 16 }}>Integrations</h3>
                {["Stripe / Stripe Treasury", "Zoom API", "Google Calendar", "Supabase"].map((n, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eef2f6", flexWrap: "wrap", gap: 8 }}><span style={{ fontWeight: 700, fontSize: 14 }}>{n}</span><span style={statusBadge("Pending")}>Ready</span></div>
                ))}
                <button style={{ ...btnGreen, marginTop: 16 }}>Save Settings</button>
              </div>
            </div>
          )}

          {/* AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="sn-mobile-content" style={{ animation: "fadeIn .5s ease" }}>
              <div className="sn-table-wrap" style={card}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>Audit Logs</h2>
                <div className="sn-desktop-table" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 500 }}>
                  <thead><tr>{["Timestamp", "User", "Action", "Details"].map(h => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[{ time: "May 28, 10:45 AM", user: "Admin", action: "Approved Application", details: "Michael Anderson" }, { time: "May 27, 3:20 PM", user: "Admin", action: "Published Report", details: "Q2 Financial Snapshot" }, { time: "May 26, 9:00 AM", user: "System", action: "New Application", details: "Sophia Martinez" }].map((l, i) => (
                      <tr key={i}><td style={{ ...tdS, color: "#667085" }}>{l.time}</td><td style={tdS}>{l.user}</td><td style={tdS}>{l.action}</td><td style={{ ...tdS, color: "#667085" }}>{l.details}</td></tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="sn-mobile-cards" style={{ display: "none" }}>
                  {[{ time: "May 28, 10:45 AM", user: "Admin", action: "Approved Application", details: "Michael Anderson" }, { time: "May 27, 3:20 PM", user: "Admin", action: "Published Report", details: "Q2 Financial Snapshot" }, { time: "May 26, 9:00 AM", user: "System", action: "New Application", details: "Sophia Martinez" }].map((l, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><b style={{ fontSize: 14 }}>{l.action}</b><span style={{ fontSize: 11, color: "#667085" }}>{l.time}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">User</span><span className="sn-m-value">{l.user}</span></div>
                      <div className="sn-m-card-row"><span className="sn-m-label">Details</span><span className="sn-m-value">{l.details}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Member Drawer */}
      {drawerMember && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex" }}>
          <div onClick={() => setDrawerMember(null)} style={{ flex: 1, background: "rgba(7,26,51,.3)", backdropFilter: "blur(2px)" }} />
          <div className="sn-drawer" style={{ width: 400, background: "#fff", boxShadow: "-10px 0 40px rgba(5,20,45,.15)", padding: 28, overflow: "auto", animation: "slideInRight .3s ease" }}>
            <button onClick={() => setDrawerMember(null)} style={{ float: "right", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#667085" }}>✕</button>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#075933,#0d6d42)", color: "#ffd46f", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 24, margin: "0 auto 12px" }}>{drawerMember.pic}</div>
              <b style={{ fontSize: 20 }}>{drawerMember.name}</b><br /><span style={statusBadge(drawerMember.status)}>{drawerMember.status}</span>
            </div>
            {[["Joined", drawerMember.joined], ["Amount Invested", drawerMember.invested], ["Units", String(drawerMember.units)], ["Location", drawerMember.location], ["Referral Source", drawerMember.source], ["Status", drawerMember.status]].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eef2f6", fontSize: 14 }}><span style={{ color: "#667085" }}>{l}</span><b>{v}</b></div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 20 }}>
              <button style={btnGreen}>Approve</button>
              <button style={btnOutline}>Pause</button>
              <button style={btnOutline}>Move</button>
              <button style={btnOutline}>View Full Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showZoom && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "grid", placeItems: "center", background: "rgba(7,26,51,.4)", backdropFilter: "blur(3px)" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 32, maxWidth: 440, width: "90%", boxShadow: "0 24px 60px rgba(5,20,45,.2)", animation: "fadeIn .3s ease" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, margin: "0 0 6px" }}>Zoom Meeting Created</h2>
            <p style={{ color: "#667085", fontSize: 13, margin: "0 0 14px" }}>Your meeting link is ready. Share it with the participant.</p>
            <div style={{ background: "#f9f6ef", border: "1px solid #e7e2d8", borderRadius: 8, padding: "14px 16px", fontSize: 14, marginBottom: 16, fontFamily: "monospace", wordBreak: "break-all" }}>{zoomLink || "https://zoom.us/j/123456789"}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => { navigator.clipboard.writeText(zoomLink); }} style={btnGreen}>Copy Link</button>
              <button style={btnGold}>Send Invite</button>
              <button style={btnOutline}>Add to Google Calendar</button>
              <button style={{ ...btnOutline, borderColor: "#667085", color: "#667085" }} onClick={() => setShowZoom(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Google Calendar Modal */}
      {showGcal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "grid", placeItems: "center", background: "rgba(7,26,51,.4)", backdropFilter: "blur(3px)" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 32, maxWidth: 440, width: "90%", boxShadow: "0 24px 60px rgba(5,20,45,.2)", animation: "fadeIn .3s ease" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, margin: "0 0 14px" }}>Google Calendar</h2>
            <p style={{ color: "#667085", lineHeight: 1.7, marginBottom: 16 }}>Google Calendar connection placeholder. OAuth integration will be connected in production.</p>
            <button onClick={() => setShowGcal(false)} style={btnGreen}>Close</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
