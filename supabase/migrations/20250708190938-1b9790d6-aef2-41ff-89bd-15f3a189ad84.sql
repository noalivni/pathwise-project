
-- Add RLS policy to allow admins to view all interview sessions
CREATE POLICY "Admins can view all interview sessions" 
  ON public.interview_sessions 
  FOR SELECT 
  USING (get_user_role() = 'admin'::user_role);
