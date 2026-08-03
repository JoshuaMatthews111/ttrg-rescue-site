-- ═══════════════════════════════════════════════════════════════════════════
-- TTRG admin upgrade — run once in the Supabase SQL editor
-- (Dashboard → SQL Editor → paste → Run). Safe to re-run: everything is
-- IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Full donor details on donations ───────────────────────────────────
-- The donate form already collects these; they were being sent to
-- Authorize.net but never stored, so the admin couldn't display them.
ALTER TABLE donations ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS state TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS zip TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS referral_source TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS trainer_name TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS transaction_id TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS subscription_id TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS card_type TEXT DEFAULT '';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- ─── 2. Real partners (replaces the hardcoded demo list) ──────────────────
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Corporate',
  tier TEXT DEFAULT 'Active',
  region TEXT DEFAULT '',
  contribution NUMERIC DEFAULT 0,
  contact_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  website TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Stories & videos (admin ↔ public page share one source) ───────────
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'video',          -- video | story | youtube
  dog_name TEXT DEFAULT '',
  category TEXT DEFAULT 'Rescue Story',
  thumbnail TEXT DEFAULT '',
  video_src TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Authorize.net webhook delivery log ────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT DEFAULT '',
  payload JSONB,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. Row level security: public read, writes via the app ───────────────
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partners public read" ON partners;
CREATE POLICY "partners public read" ON partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "partners anon write" ON partners;
CREATE POLICY "partners anon write" ON partners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "stories public read" ON stories;
CREATE POLICY "stories public read" ON stories FOR SELECT USING (true);
DROP POLICY IF EXISTS "stories anon write" ON stories;
CREATE POLICY "stories anon write" ON stories FOR ALL USING (true) WITH CHECK (true);

-- webhook_events: service role only (no public policy on purpose)

-- ─── 6. Seed the real stories currently shown on /ttrg/stories ────────────
INSERT INTO stories (id, title, description, quote, type, dog_name, category, video_src, duration, published, featured, sort_order)
VALUES
  ('story-britta', 'Healing Together', 'Rehabilitation gave this dog — and this family — hope again.', 'Rehabilitation gave this dog — and this family — hope again.', 'video', '', 'Client Testimonial', 'https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/britta-testimonial.mp4', '2:31', true, true, 1),
  ('story-tucker', 'Tucker''s Second Chance', 'From neglect to thriving — a training success story.', 'From neglect to thriving — a training success story.', 'video', 'Tucker', 'Training Story', 'https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/testimonial-2.mp4', '2:18', true, true, 2),
  ('story-trefz', 'A Bond That Heals', 'How one family and one dog changed each other forever.', 'How one family and one dog changed each other forever.', 'video', '', 'Adoption Story', 'https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/trefz-family.mp4', '2:07', true, false, 3),
  ('story-braveheart', 'Braveheart''s New Beginning', 'Patience, training, and a second chance at life.', 'Patience, training, and a second chance at life.', 'video', '', 'Rescue Story', 'https://tueevdgdqkkrjylxvutp.supabase.co/storage/v1/object/public/ttrg-media/videos/just-the-2-of-us.mp4', '1:56', true, false, 4)
ON CONFLICT (id) DO NOTHING;
