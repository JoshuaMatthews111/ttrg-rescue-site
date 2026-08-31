# TTRG Site — Handoff to Fable 5

## Project Info
- **Repo:** https://github.com/JoshuaMatthews111/ttrg-rescue-site.git
- **Branch:** `main`
- **Framework:** Next.js 16.2.4 (App Router, Turbopack)
- **Hosting:** Vercel (connected to this repo, auto-deploys on push to `main`)
- **Domain:** https://teamtrainersrescuegroup.com
- **Supabase:** Used for database + file storage (env vars in Vercel project settings)

---

## How to Deploy
Push to `main` — Vercel auto-deploys. No manual steps needed. The Vercel account is already connected to this GitHub repo.

```bash
git add -A
git commit -m "your message"
git push origin main
```

Build command: `npm run build` (Next.js)  
Output: `.next`

---

## Recent Changes (Last 3 Days) — Audit These

### 1. Homepage Routing
- **What:** `teamtrainersrescuegroup.com` should show the TTRG page directly (no `/ttrg` in URL)
- **How:** `src/app/page.tsx` imports and re-exports the TTRG page component
- **Removed:** All rewrites/redirects from `next.config.ts`
- **AUDIT:** Verify `teamtrainersrescuegroup.com` loads TTRG content without showing `/ttrg` in URL bar. All internal links use `/ttrg/...` paths — confirm they all resolve (especially `/ttrg/dogs/[id]` and `/ttrg/make-training-affordable/[slug]`)

### 2. Logo Fitting in Circles
- **What:** Logo (`/ttrg/ttrg-logo.png`) should fill the circular container completely — no gaps
- **Files:** `src/components/ttrg/TTRGNav.tsx` (header + mobile drawer), `src/app/ttrg/page.tsx` (hero)
- **How:** Uses `object-cover scale-125` (header) and `object-cover scale-110` (hero)
- **AUDIT:** Check both mobile and desktop. Logo should be fully visible in the circle with no white/gray gaps around it. If still not filling, increase scale value.

### 3. Favicon
- **What:** Favicon should be the TTRG logo (circular logo with blue background)
- **Files:**
  - `public/favicon-ttrg.png` (180x180 square)
  - `src/app/favicon.ico` (32x32)
  - `src/app/layout.tsx` and `src/app/ttrg/layout.tsx` both reference `/favicon-ttrg.png`
- **AUDIT:** Verify favicon shows in browser tab on both the main domain and subpages. Clear cache if needed.

### 4. Header White Space
- **What:** Minimal gap between nav and the green ticker below it
- **Files:** `src/app/ttrg/page.tsx` — spacer div is `h-14 sm:h-16`
- **Nav padding:** `py-0.5` (scrolled), `py-1` (default) in `TTRGNav.tsx`
- **AUDIT:** There should be NO visible white gap between the header and the green scrolling ticker. If gap exists, reduce the spacer height.

### 5. Staff Login Security
- **What:** Demo credentials (`ttrg/ttrg`) were previously displayed publicly on the login page — now removed
- **File:** `src/app/ttrg/admin/login/page.tsx`
- **AUDIT:** Visit `/ttrg/admin/login` — should show NO credentials hint. Only "Authorized staff only. Contact admin for access."
- **NOTE:** The credentials still WORK for login (hardcoded in `src/lib/admin-store.ts` line 222) — just not displayed publicly. Consider changing to real auth.

### 6. PNG Image Upload Fix
- **What:** Uploading PNG/JPG images in admin panel now works correctly
- **File:** `src/lib/supabase-store.ts` — `uploadFile` function explicitly sets `contentType: file.type`
- **AUDIT:** Go to admin panel → Dogs or Family Profiles → Upload a PNG image → Should display immediately after upload.

### 7. Disclaimer Removed
- **What:** The amber disclaimer banner was removed from `/ttrg/make-training-affordable`
- **File:** `src/app/ttrg/make-training-affordable/page.tsx`
- **AUDIT:** Page should show filters directly below the nav spacer — no disclaimer text.

### 8. Family Profile 404s
- **What:** Clicking "Read Story" on family profiles was returning 404
- **Root cause:** Catch-all rewrites in `next.config.ts` were doubling the `/ttrg` prefix
- **Fix:** Removed all rewrites from `next.config.ts`
- **AUDIT:** Click any family profile card on `/ttrg/make-training-affordable` — should load the full profile page, NOT 404.

### 9. Dog Profile 404s
- **Same root cause as #8**
- **AUDIT:** Click any dog on `/ttrg/sponsor` — should load the individual dog profile page.

### 10. OG Meta Tags (Sharing Thumbnails)
- **What:** Sharing dog/family profile links should show the dog's actual photo, not generic site image
- **Files:**
  - `src/app/ttrg/dogs/[id]/layout.tsx` — generates dynamic meta for dog profiles
  - `src/app/ttrg/make-training-affordable/[slug]/layout.tsx` — generates dynamic meta for family profiles
- **AUDIT:** Share a dog profile URL in iMessage/Slack — should show dog photo + name. Use https://www.opengraph.xyz/ to verify.

### 11. Founder Page
- **What:** Heading changed from `"Lorenzo Miller -- Founder"` to `"Lorenzo Miller - Founder"` (single dash)
- **File:** `src/app/ttrg/founder/page.tsx` line 31
- **AUDIT:** Visit `/ttrg/founder` — heading should have a single dash.

### 12. "Become a Trainer" Link
- **What:** Under "Get Involved" dropdown → "Become a Trainer" links to external trainer application
- **File:** `src/components/ttrg/TTRGNav.tsx` line 17
- **Current:** `https://lorenzosdogtrainingteam.com/become-a-trainer`
- **AUDIT:** Click it — should open trainer application in new tab.

### 13. Load More (Success Stories)
- **What:** "Load More" button on `/ttrg/stories` now works — shows 3 initially, loads more on click
- **File:** `src/app/ttrg/stories/page.tsx`
- **AUDIT:** Visit stories page, verify button loads additional stories.

### 14. Resend Build Error Fix
- **What:** `new Resend()` was crashing at build time when `RESEND_API_KEY` env var missing
- **File:** `src/app/api/ttrg/contact/route.ts` — Resend instance now created lazily inside handler
- **AUDIT:** Build should pass even without `RESEND_API_KEY` in env. If key IS set, contact form sends email.

### 15. Hero Section Removed from Make Training Affordable
- **What:** The large "Family Preservation Program / We Make Training Affordable" hero was removed
- **File:** `src/app/ttrg/make-training-affordable/page.tsx`
- **AUDIT:** Page should start with filters, no large hero banner.

---

## Environment Variables (in Vercel Project Settings)
These must be set for full functionality:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (optional — contact form email won't send without it)

---

## Key File Locations
| Purpose | Path |
|---------|------|
| Root page | `src/app/page.tsx` |
| TTRG home | `src/app/ttrg/page.tsx` |
| Nav component | `src/components/ttrg/TTRGNav.tsx` |
| Next config | `next.config.ts` |
| Root layout/meta | `src/app/layout.tsx` |
| TTRG layout/meta | `src/app/ttrg/layout.tsx` |
| Admin login | `src/app/ttrg/admin/login/page.tsx` |
| Dog profiles | `src/app/ttrg/dogs/[id]/page.tsx` |
| Family profiles | `src/app/ttrg/make-training-affordable/[slug]/page.tsx` |
| Supabase helpers | `src/lib/supabase-store.ts` |
| Admin store | `src/lib/admin-store.ts` |
| Logo file | `public/ttrg/ttrg-logo.png` |
| Favicon | `public/favicon-ttrg.png` + `src/app/favicon.ico` |

---

## Instructions for Fable 5
1. Pull latest `main` branch
2. Run `npm install` then `npm run build` to verify build passes
3. Audit each item above — check live site at https://teamtrainersrescuegroup.com after deploy completes
4. Fix anything not working properly
5. Push fixes to `main` — Vercel will auto-deploy
