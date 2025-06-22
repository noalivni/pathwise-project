
export interface CareerRole {
  ID_num: number;
  job_title: string;
  Short_description: string;
  Industry: string;
  Skills_required: string;
  Pay_grade: string;
  match_percentage?: number;
  is_bookmarked?: boolean;
  // Additional computed properties for compatibility
  id?: string;
  category?: string;
  job_description?: string;
  required_skills?: string[];
}

export interface MatchCalculationParams {
  role: any;
  assessment: any;
  profile: any;
}

export interface PersonalizedMatchParams {
  role: any;
  profile: any;
  softSkillsAssessment: any;
  hardSkillsAssessment: any;
}
