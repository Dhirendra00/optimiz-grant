-- Add new columns to organizations table for complete profile data
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS annual_budget_range TEXT,
ADD COLUMN IF NOT EXISTS staff_count TEXT,
ADD COLUMN IF NOT EXISTS has_grant_experience BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS grant_experience_details TEXT,
ADD COLUMN IF NOT EXISTS current_funders TEXT,
ADD COLUMN IF NOT EXISTS preferred_communication TEXT,
ADD COLUMN IF NOT EXISTS consulting_interest BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS geographic_focus TEXT,
ADD COLUMN IF NOT EXISTS profile_submitted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_submitted_at TIMESTAMP WITH TIME ZONE;

-- Create storage bucket for organization documents
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('organization-documents', 'organization-documents', false, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Create organization_documents table to track uploaded documents
CREATE TABLE IF NOT EXISTS public.organization_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on organization_documents
ALTER TABLE public.organization_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for organization_documents
CREATE POLICY "Users can view own documents"
  ON public.organization_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own documents"
  ON public.organization_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.organization_documents
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
  ON public.organization_documents
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for organization-documents bucket
CREATE POLICY "Users can upload to own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'organization-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents storage"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'organization-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents storage"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'organization-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all org documents storage"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'organization-documents' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );