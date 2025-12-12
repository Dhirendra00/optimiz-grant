-- Add organization_type to organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS organization_type text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS postal_code text;

-- Add registration status to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS registration_status text DEFAULT 'pending_verification' CHECK (registration_status IN ('pending_verification', 'verified_incomplete', 'active')),
ADD COLUMN IF NOT EXISTS job_title text;

-- Create verification_tokens table for email verification
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on verification_tokens
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Policy for verification tokens - users can view their own
CREATE POLICY "Users can view own verification tokens"
ON public.verification_tokens
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage all tokens (for edge functions)
CREATE POLICY "Service role can manage tokens"
ON public.verification_tokens
FOR ALL
USING (true)
WITH CHECK (true);

-- Update handle_new_user function to set initial registration status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _invite_code TEXT;
  _assigned_role app_role;
BEGIN
  -- Insert into profiles with pending_verification status
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name, email_verified, registration_status, phone, job_title)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email_confirmed_at IS NOT NULL,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN 'verified_incomplete' ELSE 'pending_verification' END,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'job_title'
  );
  
  -- Get invite code from metadata if provided
  _invite_code := NEW.raw_user_meta_data->>'invite_code';
  
  -- If invite code provided, get role from invite_codes table
  IF _invite_code IS NOT NULL THEN
    SELECT role INTO _assigned_role
    FROM public.invite_codes
    WHERE code = _invite_code
      AND used = true
      AND used_by = NEW.id;
  END IF;
  
  -- If no valid invite code, assign default 'organization' role
  IF _assigned_role IS NULL THEN
    _assigned_role := 'organization';
  END IF;
  
  -- Assign the determined role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _assigned_role);
  
  RETURN NEW;
END;
$$;