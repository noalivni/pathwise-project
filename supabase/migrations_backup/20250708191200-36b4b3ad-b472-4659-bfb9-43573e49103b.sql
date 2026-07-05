
-- Add RLS policy to allow admins to view all user job matches
CREATE POLICY "Admins can view all user job matches" 
  ON public.user_job_matches 
  FOR SELECT 
  USING (get_user_role() = 'admin'::user_role);
