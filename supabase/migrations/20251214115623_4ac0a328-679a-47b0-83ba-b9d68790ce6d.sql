-- Drop the admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Admin role management will be done via service role/edge functions
-- Only keep the simple non-recursive policies