
export interface CareerRole {
  id: string;
  job_title: string;
  job_description: string;
  category: string;
  required_skills: string[];
  match_percentage?: number;
  is_bookmarked?: boolean;
}

export interface MatchCalculationParams {
  role: any;
  assessment: any;
  profile: any;
}
