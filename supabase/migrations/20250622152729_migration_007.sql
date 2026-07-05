
-- Drop the old job_roles table and update dependencies
-- First, update the foreign key in user_job_matches to reference new_job_roles
ALTER TABLE public.user_job_matches DROP CONSTRAINT IF EXISTS user_job_matches_job_role_id_fkey;

-- Change the column type from UUID to bigint to match new_job_roles.ID_num
ALTER TABLE public.user_job_matches ALTER COLUMN job_role_id TYPE bigint USING job_role_id::text::bigint;

-- Add new foreign key constraint to reference new_job_roles (using correct case-sensitive column name)
ALTER TABLE public.user_job_matches ADD CONSTRAINT user_job_matches_job_role_id_fkey 
  FOREIGN KEY (job_role_id) REFERENCES public.new_job_roles("ID_num") ON DELETE CASCADE;

-- Drop the old job_roles table
DROP TABLE IF EXISTS public.job_roles CASCADE;

-- Rename new_job_roles to job_roles for consistency
ALTER TABLE public.new_job_roles RENAME TO job_roles;

-- Update RLS policies for the renamed table
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job roles" ON public.job_roles FOR SELECT TO public USING (true);
