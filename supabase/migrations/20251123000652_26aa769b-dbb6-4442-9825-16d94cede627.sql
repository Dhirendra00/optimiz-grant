-- Revert handle_new_user to previous version (without edge function call)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _invite_code TEXT;
  _assigned_role app_role;
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email_confirmed_at IS NOT NULL
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
$function$;