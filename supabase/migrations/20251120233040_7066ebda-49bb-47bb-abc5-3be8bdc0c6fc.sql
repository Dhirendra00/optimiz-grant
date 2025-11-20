-- Create invite_codes table
CREATE TABLE public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  role app_role NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  used BOOLEAN DEFAULT false NOT NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage all invite codes
CREATE POLICY "Admins can manage invite codes"
ON public.invite_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view valid unused invite codes (for validation during signup)
CREATE POLICY "Anyone can view valid unused codes"
ON public.invite_codes
FOR SELECT
USING (used = false AND (expires_at IS NULL OR expires_at > now()));

-- Trigger for updated_at
CREATE TRIGGER update_invite_codes_updated_at
BEFORE UPDATE ON public.invite_codes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to validate and consume invite code
CREATE OR REPLACE FUNCTION public.validate_and_consume_invite(
  _code TEXT,
  _user_id UUID
)
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  -- Get and lock the invite code
  SELECT role INTO _role
  FROM public.invite_codes
  WHERE code = _code
    AND used = false
    AND (expires_at IS NULL OR expires_at > now())
  FOR UPDATE;
  
  -- If not found, raise exception
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invite code';
  END IF;
  
  -- Mark as used
  UPDATE public.invite_codes
  SET used = true,
      used_by = _user_id,
      used_at = now()
  WHERE code = _code;
  
  RETURN _role;
END;
$$;