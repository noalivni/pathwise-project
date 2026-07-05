
-- Add field_of_interest to profiles table
ALTER TABLE public.profiles 
ADD COLUMN field_of_interest TEXT;

-- Add assessment_type to skills_assessments for better categorization
ALTER TABLE public.skills_assessments 
ADD COLUMN assessment_type TEXT DEFAULT 'general';

-- Update skills_assessments to better handle both hard and soft skills
ALTER TABLE public.skills_assessments 
ADD COLUMN field_specific_skills JSONB,
ADD COLUMN personality_traits JSONB;
