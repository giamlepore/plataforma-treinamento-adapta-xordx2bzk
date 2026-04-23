-- Migration to add thumbnail support for courses and configure storage

-- 1. Add thumbnail_url column to courses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE public.courses ADD COLUMN thumbnail_url TEXT;
    END IF;
END $$;

-- 2. Create the storage bucket 'course-thumbnails'
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS policies for the bucket
-- Note: We interact with storage.objects

-- Allow public read access to all files in the bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'course-thumbnails' );

-- Allow authenticated admins to upload files
DROP POLICY IF EXISTS "Admin Insert" ON storage.objects;
CREATE POLICY "Admin Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow authenticated admins to update files
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow authenticated admins to delete files
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
