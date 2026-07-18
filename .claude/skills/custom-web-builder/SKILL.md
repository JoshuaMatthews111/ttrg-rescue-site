---
name: custom-web-builder
description: Build a click-to-edit visual site builder that lets non-technical staff edit the REAL live website (text, photos, logo, fonts, layout) from an admin page, with changes published instantly to all visitors — no redeploy, no CMS migration, no new database tables. Use when a client asks for "a site builder", "let my team edit the site", or "live content editing".
---

# Custom Web Builder — Click-to-Edit the Real Site

A production-proven pattern (built and shipped on teamtrainersrescuegroup.com) for adding
a Wix-style visual editor to ANY existing React/Next.js site in a few hours, without
rewriting pages as CMS content.

## Core idea: DOM patches, not a CMS

Don't model pages as structured content. Instead, store a small list of **patches**:

```ts
interface LiveEdit {
  t: "text" | "img" | "style" | "global";  // what kind of patch
  page: string;                             // pathname it applies to ("*" for global)
  k: string;                                // CSS selector path (or global key: font/logo/logoScale)
  v: string;                                // new text / image URL / css / value
  label?: string;                           // human label for the change list
}
```

Three moving parts:

1. **Storage** — one JSON blob of `LiveEdit[]`. Any writable store works: a JSONB column,
   a KV, or a JSON file in public object storage. No schema migration needed — hijack an
   unused column or upload `site-edits.json` to a public bucket.
2. **Applier** — a tiny client component mounted in the site's shell. On every page load
   (and route change) it fetches the patches and applies matching ones:
   `document.querySelector(k)` → set `innerText` / `src` / append `style.cssText`.
   CRITICAL: re-apply on a retry schedule (e.g. 400ms / 1200ms / 3000ms) because parts of
   the page render after async data loads and hydration can overwrite early writes.
3. **Editor** — an admin page with the REAL site in a **same-origin iframe**. Same origin
   means you drive its DOM directly: no postMessage protocol needed.

## The editor page

- **Inject on iframe load** (`onLoad`): a `<style>` for hover outlines, plus capture-phase
  `mouseover` and `click` listeners on the iframe document.
- **Text editing**: on click of a text tag (H1–H6, P, SPAN, A, BUTTON, LI, STRONG, EM…),
  `preventDefault`, set `contenteditable="plaintext-only"`, focus. On blur, read
  `innerText`, compute the selector path, record the patch.
- **Image editing**: on click of an IMG, show a sidebar panel with Upload (→ object
  storage → URL) and paste-URL options; record an `img` patch.
- **Selector paths**: walk up from the element building `tag:nth-of-type(n)` segments
  until BODY (stop early at any `#id`, escaped with `CSS.escape`). Keep under ~12 levels.
- **Global edits**: logo swap (`img[src*="logo"]` → new src), logo size (transform scale
  slider), site font (body fontFamily) — these apply on every page (`page: "*"`).
- **Recording**: upsert by `(t, page, k)` so re-editing the same element replaces its
  patch. Apply each new patch to the iframe immediately for instant feedback.
- **Toolbar**: page dropdown, desktop/mobile width toggle, Edit-mode toggle (edit mode
  blocks link navigation via the capture-phase click handler; browse mode lets staff
  navigate), Discard (reload published set + remount iframe), **Publish** (save the whole
  list to storage), Reset-all, and a change list with per-item delete.

## Publish & consistency rules

- Publishing writes the FULL list, not deltas — last publisher wins, simple and safe.
- Public storage/CDNs cache aggressively: always fetch with a `?t=Date.now()` buster.
- Selector patches are resilient to content changes but NOT to big structural refactors —
  an orphaned patch silently stops applying (never breaks the page). Offer "Reset
  Everything" so stale patches are one click away from gone.

## Verification loop (run every time — this is what makes it actually work)

1. `npm run build` — must pass.
2. Deploy (or dev server), open the editor, confirm the iframe shows the real site.
3. Click a text element → type a change → confirm it appears in the change list.
4. Publish → read the storage back directly (curl) → confirm the patch JSON is there.
5. Open the site as a **normal visitor** (no editor) → confirm the change applied.
6. Remove the test patch (Reset) → confirm the site is back to original.
Repeat this loop after ANY change to the applier, selector logic, or storage.

## Ideas that make it even better (roadmap tested against real client asks)

- **Stable anchors**: add `data-edit-id` attributes to key elements at build time and
  prefer them over nth-of-type paths — survives refactors.
- **Draft vs published**: keep two lists; Preview link renders drafts via a query param.
- **Versioning/undo**: append each publish to a history array; one-click rollback.
- **Rich text**: bold/italic/color via `document.execCommand` or a mini toolbar over the
  contenteditable element (store innerHTML patches — sanitize!).
- **Section tools**: hide/show and reorder top-level sections (style patches with
  `display:none` / flex `order`).
- **Per-user permissions**: gate publish behind roles; log who published what.
- **Image focal point**: store `object-position` alongside src swaps.
- **Inline AI**: "rewrite this text" button that sends the selected element's text to an
  LLM and offers alternatives.

## Pitfalls learned in production

- Hydration will overwrite your first DOM writes — the retry schedule is not optional.
- `nth-of-type` must count only same-tag siblings (`children.filter(tagName)`).
- Edit mode must capture clicks (`addEventListener(..., true)`) or links navigate away.
- `contenteditable="plaintext-only"` avoids pasted-HTML injection for text edits.
- Remount the iframe (React `key` bump) to cleanly revert un-published experiments.
- The editor page must NOT be wrapped by the site shell that runs the applier, or your
  own edits fight the editor.
