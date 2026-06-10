-- ═══════════════════════════════════════════════════════════════
-- Add video_url column to dogs table
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Add video URL column to dogs
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';

-- Remove file size limit on the 'media' bucket (allows unlimited uploads)
-- By default Supabase has a 50MB limit. This sets it to 5GB.
UPDATE storage.buckets SET file_size_limit = 5368709120 WHERE id = 'media';

-- Also ensure the 'dogs' bucket allows large files
UPDATE storage.buckets SET file_size_limit = 5368709120 WHERE id = 'dogs';

-- If buckets don't exist yet, create them with no practical limit
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 5368709120)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 5368709120, public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('dogs', 'dogs', true, 5368709120)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 5368709120, public = true;

-- Allow public read access on both buckets
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'dogs'));

-- Allow authenticated or anon uploads (for admin panel uploads via anon key)
CREATE POLICY "Allow uploads media" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('media', 'dogs'));
CREATE POLICY "Allow updates media" ON storage.objects FOR UPDATE USING (bucket_id IN ('media', 'dogs'));
CREATE POLICY "Allow deletes media" ON storage.objects FOR DELETE USING (bucket_id IN ('media', 'dogs'));
