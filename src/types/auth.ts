
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  location: string | null;
  degree_certification: string | null;
  fields_of_study: string | null;
  graduation_year: string | null;
  field_of_interest: string | null;
  hard_skills: string[] | null;
  career_history: string | null;
  subscription_status: string;
  onboarding_completed: boolean;
}

export type UserRole = 'user' | 'admin';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
