
import { MatchCalculationParams } from "@/types/jobRecommendations";

interface EnhancedMatchParams {
  role: any;
  profile: any;
  softSkillsAssessment: any;
  hardSkillsAssessment: any;
}

export const calculateCareerMatch = ({ role, assessment, profile }: MatchCalculationParams): number => {
  let matchScore = 0;
  let totalFactors = 0;

  // Field of Interest Match (40% weight) - highest priority
  if (profile?.field_of_interest && role.category) {
    const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                      role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                      role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (fieldMatch) {
      matchScore += 40;
    }
  }
  totalFactors += 40;

  // Skills Match (35% weight) - technical alignment
  if (role.required_skills && profile?.hard_skills) {
    const skillsInCommon = role.required_skills.filter((skill: string) =>
      profile.hard_skills.some((userSkill: string) =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).length;
    
    const skillsMatch = role.required_skills.length > 0 ? 
      skillsInCommon / role.required_skills.length : 0;
    matchScore += skillsMatch * 35;
  }
  totalFactors += 35;

  // Assessment Results Match (25% weight) - soft skills and personality fit
  if (assessment) {
    let overallAssessmentScore = 0;
    let assessmentFactors = 0;
    
    if (assessment.technical_skills && typeof assessment.technical_skills === 'object') {
      const techValues = Object.values(assessment.technical_skills) as number[];
      const techSkillsAvg = techValues.length > 0 ? 
        techValues.reduce((a, b) => a + b, 0) / techValues.length : 0;
      overallAssessmentScore += (techSkillsAvg / 5) * 15; // Convert to percentage and weight
      assessmentFactors += 15;
    }
    
    if (assessment.soft_skills && typeof assessment.soft_skills === 'object') {
      const softValues = Object.values(assessment.soft_skills) as number[];
      const softSkillsAvg = softValues.length > 0 ?
        softValues.reduce((a, b) => a + b, 0) / softValues.length : 0;
      overallAssessmentScore += (softSkillsAvg / 5) * 10; // Convert to percentage and weight
      assessmentFactors += 10;
    }

    if (assessmentFactors > 0) {
      matchScore += overallAssessmentScore;
    }
  }
  totalFactors += 25;

  // Calculate final match percentage
  const finalMatch = totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 50;
  return Math.min(Math.max(finalMatch, 30), 95); // Ensure reasonable range
};

export const calculateEnhancedCareerMatch = ({ role, profile, softSkillsAssessment, hardSkillsAssessment }: EnhancedMatchParams): number => {
  let matchScore = 0;

  // 1. Field of Interest Match (35% weight) - Primary factor
  if (profile?.field_of_interest && role.category) {
    const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                      role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                      role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (fieldMatch) {
      matchScore += 35;
    } else {
      // Partial match for related fields
      const partialMatch = role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase().split(' ')[0]) ||
                          profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase().split(' ')[0]);
      if (partialMatch) {
        matchScore += 15;
      }
    }
  }

  // 2. Hard Skills Match (30% weight) - Technical proficiency from assessments and profile
  let skillsScore = 0;
  let skillsFactors = 0;

  // From hard skills assessment
  if (hardSkillsAssessment?.technical_skills && role.required_skills) {
    const userSkills = Object.keys(hardSkillsAssessment.technical_skills);
    const skillScores = Object.values(hardSkillsAssessment.technical_skills) as number[];
    
    let assessmentSkillScore = 0;
    let matchedAssessmentSkills = 0;

    role.required_skills.forEach((requiredSkill: string) => {
      const matchingUserSkill = userSkills.find(userSkill => 
        userSkill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
        requiredSkill.toLowerCase().includes(userSkill.toLowerCase())
      );
      
      if (matchingUserSkill) {
        const skillIndex = userSkills.indexOf(matchingUserSkill);
        const skillScore = skillScores[skillIndex] || 0;
        assessmentSkillScore += (skillScore / 5) * 100; // Convert 0-5 scale to percentage
        matchedAssessmentSkills++;
      }
    });

    if (matchedAssessmentSkills > 0) {
      skillsScore += (assessmentSkillScore / matchedAssessmentSkills) * 0.6; // 60% weight from assessment
      skillsFactors += 0.6;
    }
  }

  // From profile hard skills
  if (profile?.hard_skills && role.required_skills) {
    const profileSkillsMatch = role.required_skills.filter((skill: string) =>
      profile.hard_skills.some((userSkill: string) =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).length;
    
    const profileSkillScore = role.required_skills.length > 0 ? 
      (profileSkillsMatch / role.required_skills.length) * 100 : 0;
    skillsScore += profileSkillScore * 0.4; // 40% weight from profile
    skillsFactors += 0.4;
  }

  if (skillsFactors > 0) {
    matchScore += (skillsScore / skillsFactors) * 0.3; // Apply 30% weight
  }

  // 3. Soft Skills & Personality Match (20% weight)
  if (softSkillsAssessment?.soft_skills) {
    const softSkillValues = Object.values(softSkillsAssessment.soft_skills) as number[];
    const avgSoftSkillScore = softSkillValues.length > 0 ?
      softSkillValues.reduce((a, b) => a + b, 0) / softSkillValues.length : 0;
    
    matchScore += (avgSoftSkillScore / 5) * 20;
  }

  // 4. Education & Experience Alignment (10% weight)
  let educationScore = 0;
  
  // Education level match
  if (profile?.degree_certification) {
    const hasAdvancedDegree = ['Bachelor\'s', 'Master\'s', 'PhD'].includes(profile.degree_certification);
    if (hasAdvancedDegree) {
      educationScore += 5;
    } else {
      educationScore += 2; // Some points for any education
    }
  }

  // Field of study relevance
  if (profile?.fields_of_study && role.category) {
    const studyFieldMatch = profile.fields_of_study.toLowerCase().includes(role.category.toLowerCase()) ||
                           role.category.toLowerCase().includes(profile.fields_of_study.toLowerCase());
    if (studyFieldMatch) {
      educationScore += 3;
    }
  }

  // Career history relevance
  if (profile?.career_history && profile.career_history.length > 50) {
    educationScore += 2; // Points for substantial career history
  }

  matchScore += Math.min(educationScore, 10); // Cap at 10%

  // 5. Location Match Bonus (5% weight)
  if (profile?.location && role.location) {
    const locationMatch = profile.location.toLowerCase().includes(role.location.toLowerCase()) ||
                         role.location.toLowerCase().includes(profile.location.toLowerCase()) ||
                         role.location.toLowerCase() === 'remote';
    if (locationMatch) {
      matchScore += 5;
    }
  }

  // Ensure reasonable range and apply minimum boost for field matches
  let finalMatch = Math.round(matchScore);
  
  // Boost scores for field-matching roles
  if (profile?.field_of_interest && role.category) {
    const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                      role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (fieldMatch && finalMatch < 60) {
      finalMatch = Math.max(finalMatch, 60); // Minimum 60% for field matches
    }
  }

  return Math.min(Math.max(finalMatch, 25), 98);
};

export const getMatchColor = (match: number): string => {
  if (match >= 80) return "bg-green-500";
  if (match >= 65) return "bg-blue-500";
  if (match >= 50) return "bg-yellow-500";
  return "bg-gray-500";
};

export const getMatchDescription = (match: number): string => {
  if (match >= 80) return "Excellent fit based on your goals and skills";
  if (match >= 65) return "Good alignment with your profile";
  if (match >= 50) return "Potential match worth exploring";
  return "Consider developing skills in this area";
};
