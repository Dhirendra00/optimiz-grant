-- Add RLS policies for admin user management

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Admins can insert user roles
CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update user roles
CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Admins can delete user roles
CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE USING (has_role(auth.uid(), 'admin'));