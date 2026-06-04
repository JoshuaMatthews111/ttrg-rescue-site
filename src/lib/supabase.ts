// ═══════════════════════════════════════════════════════════════════════════════
// Supabase Client — Placeholder
// Once Supabase credentials are provided, uncomment and configure.
// Then swap localStorage calls in site-builder-store.ts for Supabase queries.
// ═══════════════════════════════════════════════════════════════════════════════

// import { createClient } from "@supabase/supabase-js";
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
//
// ─── Suggested Supabase Tables ───
// pages            (id, slug, title, status, created_at, updated_at, published_at)
// page_sections    (id, page_id, type, label, "order", visible, fields jsonb, created_at, updated_at)
// page_versions    (id, page_id, sections jsonb, status, saved_by, saved_at, note)
// media_library    (id, url, alt, type, filename, uploaded_by, uploaded_at, size_bytes)
// audit_logs       (id, user_id, user_name, page_id, page_title, section_id, section_label, action, old_value, new_value, status, timestamp)
// admin_roles      (id, user_id, role, permissions jsonb)

export {};
