-- Drop the problematic RLS policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_delete_policy" ON public.user_roles;

-- Create simple, non-recursive RLS policies
-- Users can read their own role (using auth.uid() directly, not querying user_roles)
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Allow inserts during registration (controlled by application logic)
CREATE POLICY "Allow role assignment during registration"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only service role can update/delete roles (no user-facing policy needed)