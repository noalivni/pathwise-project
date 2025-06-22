
import { MatchCalculationParams } from "@/types/jobRecommendations";

interface PersonalizedMatchParams {
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

export const calculatePersonalizedCareerMatch = ({ role, profile, softSkillsAssessment, hardSkillsAssessment }: PersonalizedMatchParams): number => {
  let matchScore = 0;

  // 1. Field of Interest Match (40% weight) - Primary factor
  if (profile?.field_of_interest && role.category) {
    const directMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                       role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                       role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (directMatch) {
      matchScore += 40;
    } else {
      // Partial match for related fields
      const partialMatch = role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase().split(' ')[0]) ||
                          profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase().split(' ')[0]);
      if (partialMatch) {
        matchScore += 20;
      }
    }
  }

  // 2. Hard Skills Assessment Match (25% weight)
  if (hardSkillsAssessment?.technical_skills && role.required_skills) {
    const userSkills = Object.keys(hardSkillsAssessment.technical_skills);
    const skillScores = Object.values(hardSkillsAssessment.technical_skills) as number[];
    
    let assessmentSkillScore = 0;
    let matchedSkills = 0;

    role.required_skills.forEach((requiredSkill: string) => {
      const matchingUserSkill = userSkills.find(userSkill => 
        userSkill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
        requiredSkill.toLowerCase().includes(userSkill.toLowerCase())
      );
      
      if (matchingUserSkill) {
        const skillIndex = userSkills.indexOf(matchingUserSkill);
        const skillScore = skillScores[skillIndex] || 0;
        assessmentSkillScore += skillScore;
        matchedSkills++;
      }
    });

    if (matchedSkills > 0) {
      const avgSkillScore = assessmentSkillScore / matchedSkills;
      matchScore += (avgSkillScore / 5) * 25; // Convert 0-5 scale to percentage and apply weight
    }
  }

  // 3. Personality & Role Fit Match (20% weight)
  if (softSkillsAssessment?.soft_skills) {
    const softSkills = softSkillsAssessment.soft_skills;
    let personalityScore = 0;

    // Check for personality-role alignment
    const communication = softSkills["Communication"] || 0;
    const leadership = softSkills["Leadership"] || 0;
    const teamwork = softSkills["Teamwork"] || 0;
    const adaptability = softSkills["Adaptability"] || 0;

    // Client-facing roles need high communication
    if (role.job_title.toLowerCase().includes('sales') || 
        role.job_title.toLowerCase().includes('customer') ||
        role.job_title.toLowerCase().includes('client')) {
      if (communication >= 4) {
        personalityScore += 15;
      } else if (communication <= 2) {
        personalityScore -= 5; // Penalty for poor fit
      }
    }

    // Leadership roles need leadership skills
    if (role.job_title.toLowerCase().includes('manager') || 
        role.job_title.toLowerCase().includes('lead') ||
        role.job_title.toLowerCase().includes('director')) {
      if (leadership >= 4) {
        personalityScore += 15;
      } else if (leadership <= 2) {
        personalityScore -= 5;
      }
    }

    // Team-based roles need teamwork
    if (role.job_description?.toLowerCase().includes('team') ||
        role.job_description?.toLowerCase().includes('collaborative')) {
      if (teamwork >= 4) {
        personalityScore += 10;
      }
    }

    // Dynamic environments need adaptability
    if (role.job_description?.toLowerCase().includes('fast-paced') ||
        role.job_description?.toLowerCase().includes('startup') ||
        role.job_description?.toLowerCase().includes('agile')) {
      if (adaptability >= 4) {
        personalityScore += 10;
      } else if (adaptability <= 2) {
        personalityScore -= 3;
      }
    }

    matchScore += Math.max(personalityScore, 0); // Ensure no negative scores
  }

  // 4. Education & Experience Alignment (10% weight)
  let educationScore = 0;
  
  if (profile?.degree_certification) {
    const hasAdvancedDegree = ['Bachelor\'s', 'Master\'s', 'PhD'].includes(profile.degree_certification);
    if (hasAdvancedDegree) {
      educationScore += 5;
    } else {
      educationScore += 2;
    }
  }

  if (profile?.fields_of_study && role.category) {
    const studyFieldMatch = profile.fields_of_study.toLowerCase().includes(role.category.toLowerCase()) ||
                           role.category.toLowerCase().includes(profile.fields_of_study.toLowerCase());
    if (studyFieldMatch) {
      educationScore += 3;
    }
  }

  if (profile?.career_history && profile.career_history.length > 50) {
    educationScore += 2;
  }

  matchScore += Math.min(educationScore, 10);

  // 5. Location Match Bonus (5% weight)
  if (profile?.location && role.location) {
    const locationMatch = profile.location.toLowerCase().includes(role.location.toLowerCase()) ||
                         role.location.toLowerCase().includes(profile.location.toLowerCase()) ||
                         role.location.toLowerCase() === 'remote';
    if (locationMatch) {
      matchScore += 5;
    }
  }

  // Ensure reasonable range with field-specific boosts
  let finalMatch = Math.round(matchScore);
  
  // Boost scores for direct field matches
  if (profile?.field_of_interest && role.category) {
    const directFieldMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                            role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (directFieldMatch && finalMatch < 65) {
      finalMatch = Math.max(finalMatch, 65); // Minimum 65% for direct field matches
    }
  }

  return Math.min(Math.max(finalMatch, 30), 98);
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
