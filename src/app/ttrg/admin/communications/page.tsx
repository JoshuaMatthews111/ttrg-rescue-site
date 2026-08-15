"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Message Center — a five-step wizard an office admin can finish without
// training: Channel → Template → Edit & Preview → Recipients → Send.
//
// Safety lives on the server (consent, confirmation, batching). Nothing on
// this screen can override it.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import {
  Mail, MessageSquare, Send, Check, ChevronRight, ChevronLeft, Loader2,
  Users, AlertTriangle, Copy, Settings as SettingsIcon, Plus, Trash2, Eye,
} from "lucide-react";
import { personalise, smsSegments, linkIsLast, greetingName } from "@/lib/messaging";

type Channel = "email" | "sms" | "both";
type Tab = "compose" | "setup";

interface Template {
  id: string; name: string; audience: string; subject: string; headline: string;
  body: string; button_label: string; button_url: string; sms_text: string; media_url?: string;
}
interface Tester { id: string; name: string; email: string; phone: string; on: boolean }
interface Counts {
  total: number; emailReady: number; smsReady: number; smsRefused: number;
  providers: { email: string; sms: string };
  emailFrom?: string;
  lastEmailEvent?: { type: string; at: string } | null;
  lastSmsEvent?: { type: string; at: string } | null;
}

const STEPS = ["Channel", "Template", "Edit & Preview", "Recipients", "Send"];

const FALLBACK_TEMPLATES: Template[] = [{
  id: "blank", name: "Blank message", audience: "Write your own",
  subject: "", headline: "Dear {{first_name}},", body: "", button_label: "", button_url: "",
  sms_text: "",
}];

export default function CommunicationsPage() {
  const [tab, setTab] = useState<Tab>("compose");
  const [step, setStep] = useState(0);
  const [channel, setChannel] = useState<Channel>("email");
  const [templates, setTemplates] = useState<Template[]>(FALLBACK_TEMPLATES);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loadErr, setLoadErr] = useState("");

  // editable copy of the chosen template — the original is never modified
  const [subject, setSubject] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [smsText, setSmsText] = useState("");
  const [media, setMedia] = useState("");
  const [previewName, setPreviewName] = useState("Sarah");

  const [testers, setTesters] = useState<Tester[]>([]);
  const [batchSize, setBatchSize] = useState(100);
  const [offset, setOffset] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; msg: string; errors?: { to: string; error?: string }[] }>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/ttrg/messages");
      if (res.status === 401) { setLoadErr("Please sign out and sign in again to enable sending."); return; }
      const data = await res.json();
      if (data.ok) {
        setCounts(data);
        const saved: Tester[] = (data.testRecipients || []).map((t: Tester, i: number) => ({
          id: t.id || `t${i}`, name: t.name || "", email: t.email || "", phone: t.phone || "", on: i === 0,
        }));
        setTesters(saved.length ? saved : [{ id: "t0", name: "", email: "", phone: "", on: true }]);
      } else setLoadErr(data.error || "Could not load audience counts.");
    } catch { setLoadErr("Could not reach the server."); }

    try {
      const { fetchTemplates } = await import("@/lib/comm-templates-client");
      const list = await fetchTemplates();
      if (list.length) setTemplates(list);
    } catch { /* starter template stays */ }
  }, []);
  useEffect(() => { load(); }, [load]);

  function chooseTemplate(t: Template) {
    setSubject(t.subject); setHeadline(t.headline); setBody(t.body);
    setButtonLabel(t.button_label || ""); setButtonUrl(t.button_url || "");
    setSmsText(t.sms_text || ""); setMedia(t.media_url || "");
    setStep(2);
  }

  const sampleContact = { first_name: previewName, city: "Cleveland", state: "OH" };
  const pv = (s: string) => personalise(s, sampleContact, "#unsubscribe");
  const seg = smsSegments(pv(smsText));
  const linkOk = linkIsLast(smsText);

  async function send(mode: "test" | "audience") {
    setSending(true); setResult(null);
    const payload: Record<string, unknown> = {
      channel, mode, subject, headline, body, buttonLabel, buttonUrl, imageUrl,
      text: smsText, media: media || undefined,
    };
    if (mode === "test") {
      payload.recipients = testers.filter(t => t.on).map(t => ({ name: t.name, email: t.email, phone: t.phone }));
    } else {
      payload.limit = batchSize; payload.offset = offset; payload.confirm = true;
    }
    try {
      const res = await fetch("/api/ttrg/messages", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) setResult({ ok: false, msg: data.error || "Send failed." });
      else {
        const parts: string[] = [];
        if (data.emailsSent) parts.push(`${data.emailsSent} email${data.emailsSent === 1 ? "" : "s"}`);
        if (data.textsSent) parts.push(`${data.textsSent} text${data.textsSent === 1 ? "" : "s"}`);
        setResult({
          ok: data.failed === 0,
          msg: `${parts.join(" and ") || "Nothing"} sent${data.failed ? `, ${data.failed} failed` : ""}.`,
          errors: data.errors,
        });
        if (mode === "audience" && data.nextOffset != null) setOffset(data.nextOffset);
      }
    } catch { setResult({ ok: false, msg: "Could not reach the server." }); }
    setSending(false);
  }

  const inp = "w-full px-3 py-2 rounded-lg bg-[#0b1524] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#C41E2A]";
  const label = "text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block";
  const webhookBase = typeof window !== "undefined" ? window.location.origin : "https://teamtrainersrescuegroup.com";

  return (
    <div className="p-5 sm:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">COMMUNICATIONS</h1>
          <p className="text-white/40 text-xs mt-1">Send a branded email or text to your supporters</p>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          <button onClick={() => setTab("compose")} className={`px-4 py-2 text-xs font-bold ${tab === "compose" ? "bg-[#C41E2A] text-white" : "text-white/60 hover:bg-white/5"}`}>Compose</button>
          <button onClick={() => setTab("setup")} className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 ${tab === "setup" ? "bg-[#C41E2A] text-white" : "text-white/60 hover:bg-white/5"}`}><SettingsIcon className="w-3.5 h-3.5" /> Setup</button>
        </div>
      </div>

      {loadErr && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-amber-200 text-xs">
          {loadErr}
        </div>
      )}

      {tab === "setup" ? (
        <SetupPanel counts={counts} webhookBase={webhookBase} testers={testers} setTesters={setTesters} inp={inp} label={label} onSaved={load} />
      ) : (
      <>
        {/* Stepper */}
        <div className="flex items-center gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                i === step ? "bg-[#C41E2A] text-white" : i < step ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25" : "bg-white/5 text-white/30"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-white/25" : "bg-white/10"}`}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
          ))}
        </div>

        {/* ── 1 · Channel ── */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              { key: "email", icon: Mail, title: "Email", desc: "A branded email with your logo, a photo and a button." },
              { key: "sms", icon: MessageSquare, title: "Text", desc: "A short text message, optionally with a picture." },
              { key: "both", icon: Send, title: "Both", desc: "Send the email and the text together." },
            ] as const).map(o => (
              <button key={o.key} onClick={() => { setChannel(o.key); setStep(1); }}
                className={`text-left p-6 rounded-2xl border transition-all ${channel === o.key ? "bg-[#C41E2A]/10 border-[#C41E2A]" : "bg-[#0f1b30] border-white/5 hover:border-white/20"}`}>
                <o.icon className={`w-8 h-8 mb-3 ${channel === o.key ? "text-[#C41E2A]" : "text-white/40"}`} />
                <p className="text-white font-black text-lg mb-1">{o.title}</p>
                <p className="text-white/40 text-xs leading-relaxed">{o.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* ── 2 · Template ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <button key={t.id} onClick={() => chooseTemplate(t)}
                className="text-left p-5 rounded-2xl bg-[#0f1b30] border border-white/5 hover:border-[#C41E2A] transition-colors">
                <p className="text-white font-bold mb-1">{t.name}</p>
                <p className="text-white/40 text-xs mb-3">{t.audience}</p>
                <p className="text-white/50 text-xs line-clamp-2">{t.subject || t.sms_text}</p>
                <span className="inline-flex items-center gap-1 text-[#C41E2A] text-[11px] font-bold mt-3">Use this <ChevronRight className="w-3 h-3" /></span>
              </button>
            ))}
          </div>
        )}

        {/* ── 3 · Edit & Preview ── */}
        {step === 2 && (
          <div className="flex flex-col xl:flex-row gap-6">
            {/* editor */}
            <div className="flex-1 min-w-0 space-y-4">
              {(channel === "email" || channel === "both") && (
                <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-black text-white/60 uppercase tracking-wider flex items-center gap-2"><Mail className="w-4 h-4 text-[#C41E2A]" /> Email</p>
                  <div><label className={label}>Subject line</label><input value={subject} onChange={e => setSubject(e.target.value)} className={inp} /></div>
                  <div><label className={label}>Headline</label><input value={headline} onChange={e => setHeadline(e.target.value)} className={inp} /></div>
                  <div><label className={label}>Message (blank line = new paragraph)</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} className={inp} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={label}>Button label</label><input value={buttonLabel} onChange={e => setButtonLabel(e.target.value)} className={inp} /></div>
                    <div><label className={label}>Button link</label><input value={buttonUrl} onChange={e => setButtonUrl(e.target.value)} className={inp} /></div>
                  </div>
                  <div><label className={label}>Photo in the email (optional)</label><input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inp} placeholder="https://…/photo.jpg" /></div>
                </div>
              )}

              {(channel === "sms" || channel === "both") && (
                <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-black text-white/60 uppercase tracking-wider flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#C41E2A]" /> Text message</p>
                  <div><label className={label}>Message</label>
                    <textarea value={smsText} onChange={e => setSmsText(e.target.value)} rows={5} className={inp} /></div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="text-white/50">{seg.chars} characters</span>
                    <span className={seg.segments > 3 ? "text-amber-300" : "text-white/50"}>{seg.segments} segment{seg.segments === 1 ? "" : "s"}</span>
                    {seg.segments > 1 && <span className="text-white/30">costs {seg.segments}× a short message</span>}
                  </div>
                  {!linkOk && (
                    <p className="text-[11px] text-amber-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      Put the link on the last line — phones only show a picture preview when the message ends with the link.
                    </p>
                  )}
                  <div><label className={label}>Picture in the text (optional)</label>
                    <input value={media} onChange={e => setMedia(e.target.value)} className={inp} placeholder="https://…/photo.jpg — under 300 KB" /></div>
                </div>
              )}

              <div className="bg-[#0b1524] border border-white/5 rounded-xl p-4 text-[11px] text-white/50 leading-relaxed">
                <b className="text-white/70">Personalisation:</b> type <code className="text-[#C41E2A]">{"{{first_name}}"}</code>,{" "}
                <code className="text-[#C41E2A]">{"{{last_name}}"}</code>, <code className="text-[#C41E2A]">{"{{full_name}}"}</code>,{" "}
                <code className="text-[#C41E2A]">{"{{city}}"}</code> or <code className="text-[#C41E2A]">{"{{state}}"}</code> and each person
                sees their own details. If we don&apos;t have a usable name, it says <b className="text-white/70">Friend</b>.
              </div>
            </div>

            {/* preview */}
            <div className="xl:w-[420px] flex-shrink-0 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-white/40" />
                <label className="text-[11px] text-white/50">Preview as:</label>
                <input value={previewName} onChange={e => setPreviewName(e.target.value)} className="px-2 py-1 rounded bg-[#0b1524] border border-white/10 text-white text-xs w-32" />
              </div>

              {(channel === "email" || channel === "both") && (
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="bg-[#1B2A4A] px-4 py-2">
                    <p className="text-white/50 text-[10px]">Subject</p>
                    <p className="text-white text-xs font-bold truncate">{pv(subject) || "(no subject)"}</p>
                  </div>
                  <div className="p-5 max-h-[420px] overflow-y-auto">
                    <p className="text-[#1B2A4A] font-black text-lg mb-3">{pv(headline)}</p>
                    {imageUrl && <img src={imageUrl} alt="" className="w-full rounded-lg mb-3" />}
                    {pv(body).split(/\n{2,}/).filter(Boolean).map((p, i) => (
                      <p key={i} className="text-[#333] text-sm leading-relaxed mb-3 whitespace-pre-line">{p}</p>
                    ))}
                    {buttonLabel && <span className="inline-block bg-[#C41E2A] text-white text-sm font-bold px-6 py-3 rounded-full">{buttonLabel}</span>}
                    <p className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100">Team Trainers Rescue Group · Cleveland, OH · <span className="underline">Unsubscribe</span></p>
                  </div>
                </div>
              )}

              {(channel === "sms" || channel === "both") && (
                <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
                  <p className="text-[10px] text-white/40 mb-3 text-center">On a phone</p>
                  <div className="max-w-[260px] mx-auto">
                    {media && <img src={media} alt="" className="w-full rounded-t-2xl" />}
                    <div className={`bg-[#e5e5ea] text-[#111] text-sm p-3 ${media ? "rounded-b-2xl" : "rounded-2xl"} whitespace-pre-line break-words`}>
                      {pv(smsText) || "(empty)"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 4 · Recipients ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Contacts total", value: counts?.total ?? "—" },
                { label: "Can receive email", value: counts?.emailReady ?? "—", hint: "gave email permission" },
                { label: "Can receive text", value: counts?.smsReady ?? "—", hint: "gave text permission" },
                { label: "Opted out of text", value: counts?.smsRefused ?? "—", hint: "will be skipped" },
              ].map(c => (
                <div key={c.label} className="bg-[#0f1b30] border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="text-2xl font-black text-white">{typeof c.value === "number" ? c.value.toLocaleString() : c.value}</p>
                  {c.hint && <p className="text-[10px] text-white/30 mt-1">{c.hint}</p>}
                </div>
              ))}
            </div>
            <div className="bg-[#0b1524] border border-white/5 rounded-xl p-4 text-xs text-white/50 flex items-start gap-2">
              <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/30" />
              <span>People who never gave permission, or who unsubscribed, are excluded automatically by the server. There is no way to override that from this screen — that&apos;s deliberate, and it keeps TTRG on the right side of the law.</span>
            </div>
          </div>
        )}

        {/* ── 5 · Send ── */}
        {step === 4 && (
          <div className="space-y-5">
            {/* testers */}
            <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
              <p className="text-sm font-bold text-white mb-1">1. Send yourself a test first</p>
              <p className="text-white/40 text-xs mb-4">Each tester is greeted by their own name, so this proves the personalisation really works.</p>
              <div className="space-y-2 mb-3">
                {testers.map((t, i) => (
                  <div key={t.id} className="flex flex-wrap items-center gap-2">
                    <input type="checkbox" checked={t.on} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, on: e.target.checked } : x))} className="accent-[#C41E2A] w-4 h-4" />
                    <input value={t.name} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Name" className={`${inp} flex-1 min-w-[110px]`} />
                    <input value={t.email} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, email: e.target.value } : x))} placeholder="email@…" className={`${inp} flex-1 min-w-[150px]`} />
                    <input value={t.phone} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, phone: e.target.value } : x))} placeholder="Mobile" className={`${inp} flex-1 min-w-[120px]`} />
                    <button onClick={() => setTesters(testers.filter((_, j) => j !== i))} className="p-2 text-white/30 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => setTesters([...testers, { id: `t${Date.now()}`, name: "", email: "", phone: "", on: true }])}
                className="text-[11px] text-white/50 hover:text-white flex items-center gap-1 mb-4"><Plus className="w-3 h-3" /> Add another tester</button>

              {testers.some(t => t.on) && (
                <p className="text-[11px] text-white/50 mb-3">
                  Opens with <b className="text-white">&ldquo;{pv(headline).slice(0, 60) || greetingName(testers.find(t => t.on)?.name)}&rdquo;</b> and goes to{" "}
                  {testers.filter(t => t.on).map(t => `${t.name || "unnamed"} (${[t.email && "email", t.phone && "text"].filter(Boolean).join(" + ") || "no address"})`).join(", ")}.
                </p>
              )}
              <button onClick={() => send("test")} disabled={sending || !testers.some(t => t.on)}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send test
              </button>
            </div>

            {/* real send */}
            <div className="bg-[#0f1b30] border border-[#C41E2A]/30 rounded-2xl p-5">
              <p className="text-sm font-bold text-white mb-1">2. Send to supporters</p>
              <p className="text-white/40 text-xs mb-4">Sent in batches so nothing times out. Send one batch, check it arrived, then send the next.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div><label className={label}>Batch size</label>
                  <select value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} className={inp}>
                    {[25, 50, 100, 250, 500].map(n => <option key={n} value={n} className="bg-[#0b1524]">{n}</option>)}
                  </select></div>
                <div><label className={label}>Starting at person</label>
                  <input type="number" value={offset} onChange={e => setOffset(Number(e.target.value))} className={inp} /></div>
                <div className="flex items-end">
                  <p className="text-[11px] text-white/40 pb-2">
                    {channel === "sms" ? counts?.smsReady : counts?.emailReady} eligible
                  </p>
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-white/70 mb-4">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="accent-[#C41E2A] w-4 h-4 mt-0.5" />
                <span>I have sent myself a test and checked it. I understand this cannot be un-sent.</span>
              </label>
              <button onClick={() => send("audience")} disabled={sending || !confirmed}
                className="bg-[#C41E2A] hover:bg-[#A01825] disabled:opacity-40 text-white text-sm font-bold px-6 py-3 rounded-lg flex items-center gap-2">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send to {batchSize} people (from #{offset})
              </button>
            </div>

            {result && (
              <div className={`rounded-2xl p-5 border ${result.ok ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                <p className={`text-sm font-bold ${result.ok ? "text-emerald-300" : "text-red-300"}`}>{result.msg}</p>
                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-3 space-y-1 max-h-48 overflow-y-auto">
                    {result.errors.map((e, i) => (
                      <li key={i} className="text-[11px] text-red-200/80">{e.to}: {e.error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* nav */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white/50 hover:text-white disabled:opacity-30 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < 4 && (
            <button onClick={() => setStep(step + 1)}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </>
      )}
    </div>
  );
}

// ─── Setup / Integrations ───────────────────────────────────────────────────
function SetupPanel({ counts, webhookBase, testers, setTesters, inp, label, onSaved }: {
  counts: Counts | null; webhookBase: string; testers: Tester[];
  setTesters: (t: Tester[]) => void; inp: string; label: string; onSaved: () => void;
}) {
  const [copied, setCopied] = useState("");
  const [saving, setSaving] = useState(false);
  const emailHook = `${webhookBase}/api/ttrg/webhooks/email`;
  const smsHook = `${webhookBase}/api/ttrg/webhooks/sms`;

  function copy(text: string, which: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(which); setTimeout(() => setCopied(""), 1500); });
  }

  async function saveTesters() {
    setSaving(true);
    await fetch("/api/ttrg/comm-settings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_recipients: testers.map(({ id, name, email, phone }) => ({ id, name, email, phone })) }),
    }).catch(() => {});
    setSaving(false); onSaved();
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-3">Connection status</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Email (Resend)", status: counts?.providers.email, last: counts?.lastEmailEvent },
            { name: "Text (SimpleTexting)", status: counts?.providers.sms, last: counts?.lastSmsEvent },
          ].map(p => (
            <div key={p.name} className="bg-[#0b1524] rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{p.name}</p>
              <p className={`text-sm font-bold ${p.status && p.status !== "not configured" ? "text-emerald-400" : "text-amber-400"}`}>
                {p.status || "…"}
              </p>
              <p className="text-[10px] text-white/30 mt-2">
                Last event: {p.last ? `${p.last.type} · ${new Date(p.last.at).toLocaleString()}` : "none yet"}
              </p>
            </div>
          ))}
        </div>
        {counts?.emailFrom && <p className="text-[11px] text-white/40 mt-3">Sending as <b className="text-white/70">{counts.emailFrom}</b></p>}
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-1">Webhook addresses</p>
        <p className="text-white/40 text-xs mb-4">Paste these into Resend and SimpleTexting so the portal learns what happened after each send.</p>
        {[["Resend → Webhooks", emailHook, "email"], ["SimpleTexting → Integrations", smsHook, "sms"]].map(([title, url, key]) => (
          <div key={key} className="mb-3">
            <label className={label}>{title}</label>
            <div className="flex gap-2">
              <input readOnly value={url} className={`${inp} font-mono text-[11px]`} />
              <button onClick={() => copy(url, key)} className="px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 flex-shrink-0">
                {copied === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-white/30 mt-3 leading-relaxed">
          Subscribe to <code>email.delivered</code>, <code>email.bounced</code>, <code>email.complained</code>,
          <code> email.opened</code>, <code>email.clicked</code>. Spam complaints and bounces switch that
          person&apos;s email permission off automatically. Texts replying STOP are opted out at once.
        </p>
      </div>

      <div className="bg-[#0f1b30] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-1">Saved testers</p>
        <p className="text-white/40 text-xs mb-4">The people offered on the Send step.</p>
        <div className="space-y-2 mb-3">
          {testers.map((t, i) => (
            <div key={t.id} className="flex flex-wrap gap-2">
              <input value={t.name} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Name" className={`${inp} flex-1 min-w-[110px]`} />
              <input value={t.email} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, email: e.target.value } : x))} placeholder="email@…" className={`${inp} flex-1 min-w-[150px]`} />
              <input value={t.phone} onChange={e => setTesters(testers.map((x, j) => j === i ? { ...x, phone: e.target.value } : x))} placeholder="Mobile" className={`${inp} flex-1 min-w-[120px]`} />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTesters([...testers, { id: `t${Date.now()}`, name: "", email: "", phone: "", on: true }])}
            className="text-[11px] text-white/50 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
          <button onClick={saveTesters} disabled={saving} className="ml-auto bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save testers
          </button>
        </div>
      </div>

      <div className="bg-[#0b1524] border border-white/5 rounded-xl p-4 text-[11px] text-white/40 leading-relaxed">
        <b className="text-white/70">API keys are never entered here.</b> Anything in this screen would be
        downloadable by anyone. Keys live in the Vercel environment settings:
        <code className="text-white/60"> RESEND_API_KEY</code>, <code className="text-white/60">SIMPLETEXTING_API_KEY</code>,
        <code className="text-white/60"> RESEND_WEBHOOK_SECRET</code>, <code className="text-white/60">SIMPLETEXTING_WEBHOOK_SECRET</code>,
        <code className="text-white/60"> UNSUBSCRIBE_SECRET</code>.
      </div>
    </div>
  );
}
