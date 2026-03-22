-- Leonard & Victoria — Supabase Storage Policies
-- Run in Supabase SQL editor after creating the 'documents' bucket

-- Create bucket (if not already done via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
-- ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "authenticated_upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to read files
CREATE POLICY "authenticated_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

-- Allow admin and legal to delete files
CREATE POLICY "admin_legal_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      (SELECT role FROM public.users WHERE auth_id = auth.uid() LIMIT 1) IN ('admin', 'legal')
    )
  );
