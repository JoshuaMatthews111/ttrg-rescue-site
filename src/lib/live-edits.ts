// ═══════════════════════════════════════════════════════════════════════════
// TTRG Live Edits — powers the visual site builder.
//
// Edits are tiny patches (CSS selector → new text / image / style) saved in
// the existing `site_settings.hero_subtitles` JSONB column (previously unused)
// so no schema migration is needed. Every visitor's browser fetches the
// patches once per page load and applies them after hydration, so changes
// published in the admin builder appear on the real site immediately.
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from "./supabase";

export interface LiveEdit {
  /** "text" | "img" | "style" target a selector; "global" targets site-wide keys */
  t: "text" | "img" | "style" | "global";
  /** pathname the edit belongs to ("*" for global edits) */
  page: string;
  /** CSS selector path, or for global edits: "font" | "logo" | "logoScale" */
  k: string;
  v: string;
  /** short human label shown in the builder's change list */
  label?: string;
}

const MARKER = "__ttrg_live_edits__";

export async function fetchLiveEdits(): Promise<LiveEdit[]> {
  const { data, error } = await supabase
    .from("site_settings").select("hero_subtitles").eq("id", 1).single();
  if (error || !data) return [];
  const raw = data.hero_subtitles;
  if (Array.isArray(raw) && raw.length === 2 && raw[0] === MARKER) {
    try { return JSON.parse(raw[1]) as LiveEdit[]; } catch { return []; }
  }
  return [];
}

export async function saveLiveEdits(edits: LiveEdit[]): Promise<boolean> {
  const { error } = await supabase
    .from("site_settings")
    .update({ hero_subtitles: [MARKER, JSON.stringify(edits)] })
    .eq("id", 1);
  return !error;
}

/** "/" serves the TTRG home, so normalize it to "/ttrg" for edit matching. */
export function normalizePath(pathname: string): string {
  return pathname === "/" ? "/ttrg" : pathname.replace(/\/$/, "");
}

export function applyLiveEdits(edits: LiveEdit[], doc: Document, pathname: string) {
  const page = normalizePath(pathname);
  for (const e of edits) {
    try {
      if (e.t === "global") { applyGlobalEdit(e, doc); continue; }
      if (e.page !== page) continue;
      const el = doc.querySelector<HTMLElement>(e.k);
      if (!el) continue;
      if (e.t === "text") { if (el.innerText !== e.v) el.innerText = e.v; }
      else if (e.t === "img") { (el as unknown as HTMLImageElement).src = e.v; }
      else if (e.t === "style") { el.style.cssText += ";" + e.v; }
    } catch { /* bad selector — skip */ }
  }
}

function applyGlobalEdit(e: LiveEdit, doc: Document) {
  if (e.k === "font") {
    doc.body.style.fontFamily = e.v;
  } else if (e.k === "logo") {
    doc.querySelectorAll<HTMLImageElement>('img[src*="ttrg-logo"]').forEach(img => {
      if (img.src !== e.v) img.src = e.v;
    });
  } else if (e.k === "logoScale") {
    doc.querySelectorAll<HTMLImageElement>('img[src*="ttrg-logo"]').forEach(img => {
      img.style.transform = `scale(${e.v})`;
    });
  }
}

/** Build a stable CSS path for an element (nth-of-type chain up to body). */
export function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.tagName !== "BODY" && parts.length < 12) {
    const tag = node.tagName.toLowerCase();
    if (node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const sameTag = Array.from(parent.children).filter(c => c.tagName === node!.tagName);
    parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${sameTag.indexOf(node) + 1})` : tag);
    node = parent;
  }
  return parts.join(" > ");
}
