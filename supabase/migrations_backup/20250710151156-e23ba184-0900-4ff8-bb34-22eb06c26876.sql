-- Remove Maya Reichman's data from all tables
-- User ID: 8654b024-3af2-4b93-94da-f4b43c478489
-- Email: mayareichman1@gmail.com

-- Remove from user_activities
DELETE FROM public.user_activities WHERE user_id = '8654b024-3af2-4b93-94da-f4b43c478489';

-- Remove from interview_sessions
DELETE FROM public.interview_sessions WHERE user_id = '8654b024-3af2-4b93-94da-f4b43c478489';

-- Remove from skills_assessments
DELETE FROM public.skills_assessments WHERE user_id = '8654b024-3af2-4b93-94da-f4b43c478489';

-- Remove from user_job_matches
DELETE FROM public.user_job_matches WHERE user_id = '8654b024-3af2-4b93-94da-f4b43c478489';

-- Remove from user_roles
DELETE FROM public.user_roles WHERE user_id = '8654b024-3af2-4b93-94da-f4b43c478489';

-- Remove from profiles (this should be done last due to potential dependencies)
DELETE FROM public.profiles WHERE id = '8654b024-3af2-4b93-94da-f4b43c478489';

-- Note: The auth.users record will be automatically cleaned up by Supabase's auth system
-- when the user is deleted from the auth dashboard, or you can delete it manually from there