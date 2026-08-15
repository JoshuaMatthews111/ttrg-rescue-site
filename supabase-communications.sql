-- ═══════════════════════════════════════════════════════════════════════════
-- TTRG Communications (Message Center) — run once in the Supabase SQL editor.
-- Safe to re-run: everything is IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Contacts: the audience ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id            BIGSERIAL PRIMARY KEY,     -- stable ordering for batched sends
  first_name    TEXT DEFAULT '',
  last_name     TEXT DEFAULT '',
  full_name     TEXT DEFAULT '',
  email         TEXT,
  phone         TEXT,
  city          TEXT DEFAULT '',
  state         TEXT DEFAULT '',
  zip           TEXT DEFAULT '',
  email_consent BOOLEAN DEFAULT false,     -- REQUIRED before any email
  sms_consent   BOOLEAN DEFAULT false,     -- REQUIRED before any text
  email_bounced BOOLEAN DEFAULT false,     -- set by the Resend webhook
  status        TEXT DEFAULT 'active',
  source        TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts (lower(email));
CREATE INDEX IF NOT EXISTS contacts_phone_idx ON contacts (phone);
CREATE INDEX IF NOT EXISTS contacts_email_ready_idx ON contacts (id) WHERE email_consent AND email IS NOT NULL;
CREATE INDEX IF NOT EXISTS contacts_sms_ready_idx   ON contacts (id) WHERE sms_consent   AND phone IS NOT NULL;

-- ─── Message log: what was sent, and what the provider said ───────────────
CREATE TABLE IF NOT EXISTS message_log (
  id          BIGSERIAL PRIMARY KEY,
  contact_id  BIGINT,
  channel     TEXT,                        -- email | sms
  template    TEXT DEFAULT '',
  subject     TEXT DEFAULT '',
  provider_id TEXT DEFAULT '',             -- Resend id / SimpleTexting smsid
  status      TEXT DEFAULT 'sent',         -- sent|delivered|bounced|complained|failed
  error       TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS message_log_contact_idx  ON message_log (contact_id);
CREATE INDEX IF NOT EXISTS message_log_provider_idx ON message_log (provider_id);

-- ─── Webhook events: raw deliveries, keyed for idempotency ────────────────
CREATE TABLE IF NOT EXISTS comm_webhook_events (
  id          TEXT PRIMARY KEY,            -- provider event id -> retries can't double-apply
  provider    TEXT,                        -- resend | simpletexting
  event_type  TEXT DEFAULT '',
  payload     JSONB,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Integration settings + saved testers (editable in the portal) ────────
CREATE TABLE IF NOT EXISTS comm_settings (
  id                 INTEGER PRIMARY KEY DEFAULT 1,
  email_from         TEXT DEFAULT 'Team Trainers Rescue Group <give@teamtrainersrescuegroup.com>',
  sms_number         TEXT DEFAULT '',
  test_recipients    JSONB DEFAULT '[]'::jsonb,
  last_email_event   JSONB,
  last_sms_event     JSONB,
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO comm_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── Saved message templates ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comm_templates (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  audience    TEXT DEFAULT '',             -- "who this is for"
  subject     TEXT DEFAULT '',
  headline    TEXT DEFAULT '',
  body        TEXT DEFAULT '',             -- paragraphs, blank-line separated
  button_label TEXT DEFAULT '',
  button_url   TEXT DEFAULT '',
  sms_text    TEXT DEFAULT '',
  media_url   TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS: the app writes with the service role; keep anon out ─────────────
ALTER TABLE contacts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE comm_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE comm_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comm_templates      ENABLE ROW LEVEL SECURITY;

-- Templates and settings are read by the admin screen through the API only,
-- but allowing anon SELECT on templates keeps the picker simple.
DROP POLICY IF EXISTS "templates read" ON comm_templates;
CREATE POLICY "templates read" ON comm_templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "templates write" ON comm_templates;
CREATE POLICY "templates write" ON comm_templates FOR ALL USING (true) WITH CHECK (true);
-- contacts / message_log / webhook events / settings: service role only.

-- ─── Starter templates ────────────────────────────────────────────────────
INSERT INTO comm_templates (id, name, audience, subject, headline, body, button_label, button_url, sms_text, sort_order) VALUES
 ('tmpl-urgent-dog', 'Urgent Dog Appeal', 'Donors who give to individual dogs',
  'A dog needs you today',
  'Dear {{first_name}}, a dog needs you right now',
  E'We just took in a dog who needs immediate care, and we are asking the people who have stood with us before.\n\nEvery dollar goes straight to food, medical care, and the training that turns a frightened animal into somebody''s companion.\n\nThank you for being part of this.',
  'Help This Dog', 'https://teamtrainersrescuegroup.com/ttrg/donate',
  E'{{first_name}}, a dog came into our care today and needs help. Every dollar goes to their care.\nhttps://teamtrainersrescuegroup.com/ttrg/donate', 1),
 ('tmpl-thank-you', 'Thank You', 'Everyone who has donated',
  'Thank you, {{first_name}}',
  'Thank you, {{first_name}}',
  E'Because of you, another dog gets a second chance. We wanted you to hear what your gift made possible.\n\nWe will keep you posted as their story unfolds.\n\nWith gratitude, the whole TTRG team.',
  'See the Dogs You Helped', 'https://teamtrainersrescuegroup.com/ttrg/sponsor',
  E'Thank you {{first_name}} — because of you another dog gets a second chance. See who you helped:\nhttps://teamtrainersrescuegroup.com/ttrg/sponsor', 2),
 ('tmpl-monthly-update', 'Monthly Update', 'The whole list',
  'This month at Team Trainers Rescue Group',
  'Hello {{first_name}}, here is what happened this month',
  E'Here is what your support made possible over the last month — the rescues, the training wins, and the dogs who went home.\n\nThank you for being part of every one of these stories.',
  'Read the Update', 'https://teamtrainersrescuegroup.com/ttrg/stories',
  E'{{first_name}}, here is what your support made possible this month at TTRG:\nhttps://teamtrainersrescuegroup.com/ttrg/stories', 3),
 ('tmpl-event', 'Event Invitation', 'Local supporters',
  'You are invited',
  '{{first_name}}, you are invited',
  E'We would love to see you. Come meet the dogs, meet the trainers, and see the work up close.\n\nDetails are on our site — we hope you can make it.',
  'See the Details', 'https://teamtrainersrescuegroup.com/ttrg/contact',
  E'{{first_name}}, you''re invited to our next TTRG event. Come meet the dogs:\nhttps://teamtrainersrescuegroup.com/ttrg/contact', 4)
ON CONFLICT (id) DO NOTHING;
