
export interface SoftSkill {
  name: string;
  description: string;
  icon: string;
}

export interface SkillRatings {
  [key: string]: number;
}

export interface PersonalityProfile {
  type: string;
  environment: string;
  topStrengths: string[];
  careerSuggestions: string[];
}

export interface SkillLevel {
  level: string;
  color: string;
}
