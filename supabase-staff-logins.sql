-- ═══════════════════════════════════════════════════════════════════════════
-- TTRG staff logins + a security fix for the admin_users table.
-- Run once in the Supabase SQL editor. Safe to re-run.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. SECURITY FIX ──────────────────────────────────────────────────────
-- The old policy let ANY visitor read this table with the public key that
-- ships in the browser — including passwords, which were stored in plain
-- text. Logging in now happens server-side (/api/ttrg/admin-session) using
-- the service-role key, so the public key needs no access at all.
DROP POLICY IF EXISTS "Admin full access users" ON admin_users;
DROP POLICY IF EXISTS "admin_users service only" ON admin_users;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- No policy for anon/authenticated = no public access. The service role
-- bypasses RLS, so the server-side login route still works.

-- ─── 2. Retire the old demo accounts ──────────────────────────────────────
UPDATE admin_users SET status = 'disabled'
 WHERE email IN ('lorenzo@ttrg.org','admin@ttrg.org','jasmine@ttrg.org','daniel@ttrg.org','bailey@ttrg.org');

-- ─── 3. Staff accounts — password for all: ttrg123 (stored SHA-256) ───────
INSERT INTO admin_users (name, email, password_hash, role, status) VALUES
  ('marketing@lorenzosdogtrainingteam.com',    'marketing@lorenzosdogtrainingteam.com',    'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('mr.matthews2022@gmail.com',                'mr.matthews2022@gmail.com',                'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('controller@lorenzosdogtrainingteam.com',   'controller@lorenzosdogtrainingteam.com',   'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('lorenzo@lorenzosdogtrainingteam.com',      'lorenzo@lorenzosdogtrainingteam.com',      'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('production@lorenzosdogtrainingteam.com',   'production@lorenzosdogtrainingteam.com',   'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('tmillerk999@gmail.com',                    'tmillerk999@gmail.com',                    'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('themarketing@lorenzosdogtrainingteam.com', 'themarketing@lorenzosdogtrainingteam.com', 'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('melissazuk@lorenzosdogtrainingteam.com',   'melissazuk@lorenzosdogtrainingteam.com',   'd68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active'),
  ('rachelleggett@lorenzosdogtrainingteam.com','rachelleggett@lorenzosdogtrainingteam.com','d68afa5e55c8efeaad685c1bed83fec24e6d6d488fbe2080b3ced900cdf8e075', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      role          = EXCLUDED.role,
      status        = 'active';
