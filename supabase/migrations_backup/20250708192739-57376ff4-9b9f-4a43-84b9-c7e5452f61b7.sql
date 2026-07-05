
-- Add RLS policy to allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles for management" 
  ON public.profiles 
  FOR SELECT 
  USING (get_user_role() = 'admin'::user_role);

-- Add RLS policy to allow admins to update user roles
CREATE POLICY "Admins can update user roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (get_user_role() = 'admin'::user_role)
  WITH CHECK (get_user_role() = 'admin'::user_role);

-- Add RLS policy to allow admins to delete user roles (in case we need to reset)
CREATE POLICY "Admins can delete user roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (get_user_role() = 'admin'::user_role);
