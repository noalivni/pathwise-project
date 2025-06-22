
export interface CareerRole {
  ID_num: number;
  job_title: string;
  Short_description: string;
  Industry: string;
  Skills_required: string;
  Pay_grade: string;
  match_percentage?: number;
  is_bookmarked?: boolean;
}

export interface MatchCalculationParams {
  role: any;
  assessment: any;
  profile: any;
}
