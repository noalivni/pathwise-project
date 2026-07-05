
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  location TEXT,
  degree_certification TEXT,
  fields_of_study TEXT,
  graduation_year TEXT,
  hard_skills TEXT[],
  career_history TEXT,
  subscription_status TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills_assessments table
CREATE TABLE public.skills_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  technical_skills JSONB,
  soft_skills JSONB,
  strengths TEXT[],
  weaknesses TEXT[],
  recommended_paths TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_roles table (from CSV dataset)
CREATE TABLE public.job_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  job_description TEXT,
  category TEXT,
  required_skills TEXT[],
  salary_range TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_job_matches table for personalized recommendations
CREATE TABLE public.user_job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_role_id UUID REFERENCES public.job_roles NOT NULL,
  match_percentage INTEGER,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning_resources table
CREATE TABLE public.learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  resource_type TEXT, -- course, article, video, etc.
  related_skills TEXT[],
  related_job_roles TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activities table for tracking actions
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  activity_type TEXT NOT NULL, -- assessment_completed, job_viewed, resume_downloaded, etc.
  activity_description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_sessions table
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_role TEXT,
  questions JSONB,
  responses JSONB,
  feedback TEXT,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for skills_assessments
CREATE POLICY "Users can view their own assessments" ON public.skills_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own assessments" ON public.skills_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for job_roles (public read access)
CREATE POLICY "Anyone can view job roles" ON public.job_roles FOR SELECT TO public USING (true);

-- RLS policies for user_job_matches
CREATE POLICY "Users can view their own matches" ON public.user_job_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own matches" ON public.user_job_matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own matches" ON public.user_job_matches FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for learning_resources (public read access)
CREATE POLICY "Anyone can view learning resources" ON public.learning_resources FOR SELECT TO public USING (true);

-- RLS policies for user_activities
CREATE POLICY "Users can view their own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for interview_sessions
CREATE POLICY "Users can view their own interview sessions" ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own interview sessions" ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample job roles
INSERT INTO public.job_roles (job_title, job_description, category, required_skills, salary_range, location) VALUES
('Frontend Developer', 'Build user interfaces and web applications using modern JavaScript frameworks', 'Technology', ARRAY['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'], '$60,000 - $90,000', 'Remote'),
('Data Analyst', 'Analyze data to help businesses make informed decisions', 'Analytics', ARRAY['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'], '$55,000 - $75,000', 'New York, NY'),
('UX Designer', 'Design user experiences for digital products', 'Design', ARRAY['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'], '$65,000 - $85,000', 'San Francisco, CA'),
('Marketing Specialist', 'Develop and execute marketing campaigns', 'Marketing', ARRAY['Digital Marketing', 'Google Analytics', 'Content Marketing', 'SEO'], '$50,000 - $65,000', 'Austin, TX'),
('Product Manager', 'Lead product strategy and development', 'Management', ARRAY['Product Strategy', 'Agile', 'Roadmapping', 'Stakeholder Management'], '$80,000 - $100,000', 'Seattle, WA');

-- Insert sample learning resources
INSERT INTO public.learning_resources (title, description, url, resource_type, related_skills, related_job_roles) VALUES
('React Fundamentals Course', 'Learn the basics of React development', 'https://reactjs.org/tutorial/tutorial.html', 'course', ARRAY['React', 'JavaScript'], ARRAY['Frontend Developer']),
('Python for Data Analysis', 'Master data analysis with Python', 'https://pandas.pydata.org/docs/getting_started/index.html', 'course', ARRAY['Python', 'Data Analysis'], ARRAY['Data Analyst']),
('UX Design Principles', 'Learn fundamental UX design concepts', 'https://www.interaction-design.org/', 'article', ARRAY['UX Design', 'User Research'], ARRAY['UX Designer']),
('Digital Marketing Guide', 'Complete guide to digital marketing', 'https://blog.hubspot.com/marketing', 'guide', ARRAY['Digital Marketing', 'SEO'], ARRAY['Marketing Specialist']),
('Product Management 101', 'Introduction to product management', 'https://www.productplan.com/learn/', 'course', ARRAY['Product Strategy', 'Roadmapping'], ARRAY['Product Manager']);
