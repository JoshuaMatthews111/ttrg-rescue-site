"use client";

// ═══════════════════════════════════════════════════════════════════════════
// TTRG Visual Site Builder — click-to-edit the REAL site.
//
// The right pane is the actual live site in an iframe (same origin, so we
// drive its DOM directly). In edit mode, staff click any text to retype it,
// click any photo to swap it, change the logo and font from the sidebar,
// resize text, or hide a section. Publish saves the patches to Supabase and
// every visitor's browser applies them on load (see LiveEditsApplier).
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Monitor, Smartphone, MousePointerClick, Eye,
  Type, Image as ImageIcon, Trash2, Check, Loader2, RotateCcw, Globe,
} from "lucide-react";
import { getSession } from "@/lib/admin-store";
import { uploadFile } from "@/lib/supabase-store";
import {
  fetchLiveEdits, saveLiveEdits, applyLiveEdits, normalizePath, cssPath,
  type LiveEdit,
} from "@/lib/live-edits";

const PAGES = [
  { label: "Home", path: "/ttrg" },
  { label: "Our Dogs", path: "/ttrg/sponsor" },
  { label: "Make Training Affordable", path: "/ttrg/make-training-affordable" },
  { label: "Success Stories", path: "/ttrg/stories" },
  { label: "Founder", path: "/ttrg/founder" },
  { label: "Get Involved", path: "/ttrg/get-involved" },
  { label: "Donate", path: "/ttrg/donate" },
  { label: "Contact", path: "/ttrg/contact" },
];

const FONTS = [
  { label: "Inter (default)", value: "'Inter', system-ui, sans-serif" },
  { label: "Poppins", value: "'Poppins', system-ui, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Helvetica", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: "Trebuchet", value: "'Trebuchet MS', Verdana, sans-serif" },
];

const TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "A", "BUTTON", "LI", "STRONG", "EM", "BLOCKQUOTE", "FIGCAPTION", "LABEL"]);

interface SelectedImage { key: string; src: string }
interface SelectedText { key: string }

export default function SiteBuilderPage() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState(PAGES[0]);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [editMode, setEditMode] = useState(true);
  const [edits, setEdits] = useState<LiveEdit[]>([]);
  const [dirty, setDirty] = useState(false);
  const [publishing, setPublishing] = useState<"idle" | "saving" | "saved">("idle");
  const [selectedImg, setSelectedImg] = useState<SelectedImage | null>(null);
  const [selectedText, setSelectedText] = useState<SelectedText | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const editModeRef = useRef(editMode);
  editModeRef.current = editMode;
  const editsRef = useRef(edits);
  editsRef.current = edits;

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push("/ttrg/admin/login"); return; }
    setAuthed(true);
    fetchLiveEdits().then(setEdits);
  }, [router]);

  // Upsert an edit (one per selector+type+page) and apply it to the iframe.
  const recordEdit = useCallback((edit: LiveEdit) => {
    setEdits(prev => {
      const rest = prev.filter(e => !(e.t === edit.t && e.k === edit.k && e.page === edit.page));
      return [...rest, edit];
    });
    setDirty(true);
    const doc = iframeRef.current?.contentDocument;
    if (doc) applyLiveEdits([edit], doc, edit.page === "*" ? "/ttrg" : edit.page);
  }, []);

  // ── Editor injection: runs every time the iframe finishes loading ────────
  const injectEditor = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    const win = iframe?.contentWindow;
    if (!doc || !win) return;

    const pagePath = normalizePath(win.location.pathname);

    // Re-apply pending (unpublished) edits so the preview stays truthful.
    setTimeout(() => applyLiveEdits(editsRef.current, doc, pagePath), 300);
    setTimeout(() => applyLiveEdits(editsRef.current, doc, pagePath), 1500);

    if (doc.getElementById("__ttrg-editor-style")) return; // already injected
    const style = doc.createElement("style");
    style.id = "__ttrg-editor-style";
    style.textContent = `
      .__ttrg-hover { outline: 2px dashed #C41E2A !important; outline-offset: 2px; cursor: pointer !important; }
      .__ttrg-editing { outline: 2px solid #D97706 !important; outline-offset: 2px; background: rgba(217,119,6,.06); }
    `;
    doc.head.appendChild(style);

    let hovered: HTMLElement | null = null;

    const isEditable = (el: HTMLElement) =>
      TEXT_TAGS.has(el.tagName) || el.tagName === "IMG";

    doc.addEventListener("mouseover", (e) => {
      if (!editModeRef.current) return;
      const el = e.target as HTMLElement;
      if (hovered) hovered.classList.remove("__ttrg-hover");
      if (isEditable(el)) { hovered = el; el.classList.add("__ttrg-hover"); }
    }, true);

    doc.addEventListener("click", (e) => {
      if (!editModeRef.current) return;
      const el = e.target as HTMLElement;
      if (!isEditable(el)) return;
      e.preventDefault();
      e.stopPropagation();

      if (el.tagName === "IMG") {
        el.classList.remove("__ttrg-hover");
        setSelectedText(null);
        setSelectedImg({ key: cssPath(el), src: (el as HTMLImageElement).src });
        return;
      }

      // Text: edit in place
      setSelectedImg(null);
      setSelectedText({ key: cssPath(el) });
      el.classList.remove("__ttrg-hover");
      el.classList.add("__ttrg-editing");
      el.setAttribute("contenteditable", "plaintext-only");
      el.focus();

      const commit = () => {
        el.removeAttribute("contenteditable");
        el.classList.remove("__ttrg-editing");
        const v = el.innerText.trim();
        recordEdit({ t: "text", page: pagePath, k: cssPath(el), v, label: v.slice(0, 42) || "(empty text)" });
        el.removeEventListener("blur", commit);
      };
      el.addEventListener("blur", commit);
      el.addEventListener("keydown", (ke) => {
        const kev = ke as KeyboardEvent;
        if (kev.key === "Enter" && el.tagName !== "P") { kev.preventDefault(); el.blur(); }
      });
    }, true);
  }, [recordEdit]);

  async function publish() {
    setPublishing("saving");
    const ok = await saveLiveEdits(edits);
    setPublishing(ok ? "saved" : "idle");
    if (ok) { setDirty(false); setTimeout(() => setPublishing("idle"), 2500); }
    else alert("Save failed — check your connection and try again.");
  }

  async function discardUnpublished() {
    const published = await fetchLiveEdits();
    setEdits(published);
    setDirty(false);
    setSelectedImg(null); setSelectedText(null);
    setIframeKey(k => k + 1); // reload preview clean
  }

  function removeEdit(edit: LiveEdit) {
    setEdits(prev => prev.filter(e => e !== edit));
    setDirty(true);
    setIframeKey(k => k + 1);
  }

  async function resetAll() {
    if (!confirm("Remove ALL published site edits and restore the original site?")) return;
    setEdits([]);
    await saveLiveEdits([]);
    setDirty(false);
    setIframeKey(k => k + 1);
  }

  // ── Image swap tools ──────────────────────────────────────────────────────
  async function uploadImageFor(key: string, file: File) {
    setUploading(true);
    const url = await uploadFile("media", `site-builder/${Date.now()}-${file.name}`, file);
    setUploading(false);
    if (!url) { alert("Upload failed"); return; }
    applyImage(key, url);
  }
  function applyImage(key: string, url: string) {
    const pagePath = normalizePath(iframeRef.current?.contentWindow?.location.pathname || page.path);
    recordEdit({ t: "img", page: pagePath, k: key, v: url, label: "Image changed" });
    setSelectedImg(s => (s ? { ...s, src: url } : s));
  }

  // ── Text sizing / layout ──────────────────────────────────────────────────
  function setTextSize(px: number) {
    if (!selectedText) return;
    const pagePath = normalizePath(iframeRef.current?.contentWindow?.location.pathname || page.path);
    recordEdit({ t: "style", page: pagePath, k: selectedText.key, v: `font-size:${px}px`, label: `Text size ${px}px` });
  }
  function hideSelected() {
    if (!selectedText) return;
    const pagePath = normalizePath(iframeRef.current?.contentWindow?.location.pathname || page.path);
    recordEdit({ t: "style", page: pagePath, k: selectedText.key, v: "display:none", label: "Element hidden" });
    setSelectedText(null);
  }

  // ── Global: logo + font ───────────────────────────────────────────────────
  async function uploadLogo(file: File) {
    setLogoUploading(true);
    const url = await uploadFile("media", `site-builder/logo-${Date.now()}-${file.name}`, file);
    setLogoUploading(false);
    if (!url) { alert("Upload failed"); return; }
    recordEdit({ t: "global", page: "*", k: "logo", v: url, label: "New logo" });
  }

  const currentFont = edits.find(e => e.t === "global" && e.k === "font")?.v || FONTS[0].value;
  const currentLogoScale = edits.find(e => e.t === "global" && e.k === "logoScale")?.v || "1";

  if (!authed) return null;

  const inp = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm";

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* ── TOP BAR ── */}
      <div className="bg-[#1B2A4A] text-white px-4 py-2.5 flex items-center gap-4 flex-shrink-0 flex-wrap">
        <Link href="/ttrg/admin/portal" className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Admin
        </Link>
        <span className="font-black text-sm tracking-wide">SITE BUILDER</span>

        <select
          value={page.path}
          onChange={e => { const p = PAGES.find(x => x.path === e.target.value)!; setPage(p); setSelectedImg(null); setSelectedText(null); }}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm"
        >
          {PAGES.map(p => <option key={p.path} value={p.path} className="text-black">{p.label}</option>)}
        </select>

        <div className="flex rounded-lg overflow-hidden border border-white/20">
          <button onClick={() => setDevice("desktop")} className={`px-3 py-1.5 ${device === "desktop" ? "bg-white/25" : "hover:bg-white/10"}`}><Monitor className="w-4 h-4" /></button>
          <button onClick={() => setDevice("mobile")} className={`px-3 py-1.5 ${device === "mobile" ? "bg-white/25" : "hover:bg-white/10"}`}><Smartphone className="w-4 h-4" /></button>
        </div>

        <button
          onClick={() => setEditMode(m => !m)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${editMode ? "bg-[#C41E2A]" : "bg-white/10 hover:bg-white/20"}`}
        >
          {editMode ? <MousePointerClick className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {editMode ? "Edit Mode: ON — click anything" : "Browse Mode"}
        </button>

        <div className="flex-1" />

        {dirty && <span className="text-xs text-amber-300 font-bold">Unpublished changes</span>}
        <button onClick={discardUnpublished} disabled={!dirty} className="px-3 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-white/20 disabled:opacity-40">Discard</button>
        <button
          onClick={publish}
          disabled={publishing === "saving" || !dirty}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
        >
          {publishing === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : publishing === "saved" ? <Check className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
          {publishing === "saved" ? "Live!" : "Publish Live"}
        </button>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* ── SIDEBAR ── */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 p-4 space-y-5">

          {/* How-to */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
            <b>Click any text</b> on the site to retype it (fix spelling, change wording).<br />
            <b>Click any photo</b> to replace it.<br />
            Then hit <b>Publish Live</b> — changes appear for every visitor instantly.
          </div>

          {/* Image tools */}
          {selectedImg && (
            <div className="border border-slate-200 rounded-xl p-3 space-y-2">
              <p className="text-xs font-black text-slate-500 uppercase flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Selected Photo</p>
              <img src={selectedImg.src} alt="" className="w-full h-28 object-cover rounded-lg" />
              <label className={`block text-center px-3 py-2 rounded-lg text-sm font-bold cursor-pointer ${uploading ? "bg-slate-100 text-slate-400" : "bg-[#C41E2A] text-white hover:bg-[#A01825]"}`}>
                {uploading ? "Uploading…" : "Upload Replacement"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImageFor(selectedImg.key, f); e.target.value = ""; }} />
              </label>
              <input className={inp} placeholder="…or paste image URL, press Enter"
                onKeyDown={e => { if (e.key === "Enter") applyImage(selectedImg.key, (e.target as HTMLInputElement).value); }} />
            </div>
          )}

          {/* Text tools */}
          {selectedText && (
            <div className="border border-slate-200 rounded-xl p-3 space-y-2">
              <p className="text-xs font-black text-slate-500 uppercase flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Selected Text</p>
              <label className="text-xs text-slate-500">Text size</label>
              <input type="range" min={12} max={72} defaultValue={20} className="w-full accent-[#C41E2A]"
                onChange={e => setTextSize(Number(e.target.value))} />
              <button onClick={hideSelected} className="w-full px-3 py-2 rounded-lg text-sm font-bold border border-red-200 text-red-600 hover:bg-red-50">
                Hide This Element
              </button>
            </div>
          )}

          {/* Logo */}
          <div className="border border-slate-200 rounded-xl p-3 space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase">Logo</p>
            <label className={`block text-center px-3 py-2 rounded-lg text-sm font-bold cursor-pointer ${logoUploading ? "bg-slate-100 text-slate-400" : "bg-[#1B2A4A] text-white hover:bg-[#152238]"}`}>
              {logoUploading ? "Uploading…" : "Upload New Logo"}
              <input type="file" accept="image/*" className="hidden" disabled={logoUploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f); e.target.value = ""; }} />
            </label>
            <label className="text-xs text-slate-500">Logo size ({Math.round(Number(currentLogoScale) * 100)}%)</label>
            <input type="range" min={0.7} max={1.6} step={0.05} value={Number(currentLogoScale)} className="w-full accent-[#1B2A4A]"
              onChange={e => recordEdit({ t: "global", page: "*", k: "logoScale", v: e.target.value, label: `Logo size ${Math.round(Number(e.target.value) * 100)}%` })} />
          </div>

          {/* Font */}
          <div className="border border-slate-200 rounded-xl p-3 space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase">Site Font</p>
            <select value={currentFont} className={inp}
              onChange={e => recordEdit({ t: "global", page: "*", k: "font", v: e.target.value, label: `Font: ${FONTS.find(f => f.value === e.target.value)?.label}` })}>
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          {/* Change list */}
          <div className="border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">Changes ({edits.length})</p>
            {edits.length === 0 && <p className="text-xs text-slate-400">No changes yet — click something on the site →</p>}
            <ul className="space-y-1.5 max-h-64 overflow-y-auto">
              {edits.map((e, i) => (
                <li key={i} className="flex items-center gap-2 text-xs bg-slate-50 rounded-lg px-2 py-1.5">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${e.t === "text" ? "bg-blue-100 text-blue-700" : e.t === "img" ? "bg-purple-100 text-purple-700" : e.t === "global" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{e.t}</span>
                  <span className="flex-1 truncate text-slate-600">{e.label || e.k}</span>
                  <button onClick={() => removeEdit(e)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
            {edits.length > 0 && (
              <button onClick={resetAll} className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50">
                <RotateCcw className="w-3.5 h-3.5" /> Reset Everything (restore original site)
              </button>
            )}
          </div>
        </div>

        {/* ── LIVE PREVIEW ── */}
        <div className="flex-1 flex items-start justify-center overflow-auto p-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all" style={{ width: device === "mobile" ? 390 : "100%", height: "100%" }}>
            <iframe
              key={`${page.path}-${iframeKey}`}
              ref={iframeRef}
              src={page.path}
              onLoad={injectEditor}
              className="w-full h-full border-0"
              title="Live site preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
