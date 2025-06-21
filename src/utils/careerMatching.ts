
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
  let totalWeight = 100;

  // Career Field Match (30% weight)
  if (profile?.field_of_interest && role.category) {
    const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                      role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                      role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (fieldMatch) {
      matchScore += 30;
    }
  }

  // Hard Skills Match (35% weight) - Technical proficiency
  if (hardSkillsAssessment?.technical_skills && role.required_skills) {
    const userSkills = Object.keys(hardSkillsAssessment.technical_skills);
    const skillScores = Object.values(hardSkillsAssessment.technical_skills) as number[];
    
    let skillMatchScore = 0;
    let totalSkillsChecked = 0;

    role.required_skills.forEach((requiredSkill: string) => {
      const matchingUserSkill = userSkills.find(userSkill => 
        userSkill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
        requiredSkill.toLowerCase().includes(userSkill.toLowerCase())
      );
      
      if (matchingUserSkill) {
        const skillIndex = userSkills.indexOf(matchingUserSkill);
        const skillScore = skillScores[skillIndex] || 0;
        skillMatchScore += (skillScore / 5) * 100; // Convert 0-5 scale to percentage
      }
      totalSkillsChecked++;
    });

    if (totalSkillsChecked > 0) {
      matchScore += (skillMatchScore / totalSkillsChecked) * 0.35;
    }

    // Bonus for profile hard skills alignment
    if (profile?.hard_skills) {
      const profileSkillsMatch = role.required_skills.filter((skill: string) =>
        profile.hard_skills.some((userSkill: string) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ).length;
      
      const profileBonus = (profileSkillsMatch / role.required_skills.length) * 10;
      matchScore += profileBonus;
    }
  }

  // Soft Skills Match (25% weight) - Personality and behavioral fit
  if (softSkillsAssessment?.soft_skills) {
    const softSkillValues = Object.values(softSkillsAssessment.soft_skills) as number[];
    const avgSoftSkillScore = softSkillValues.length > 0 ?
      softSkillValues.reduce((a, b) => a + b, 0) / softSkillValues.length : 0;
    
    // Convert to percentage and apply weight
    matchScore += (avgSoftSkillScore / 5) * 25;
  }

  // Experience Level Match (10% weight) - Based on career history
  if (profile?.career_history) {
    const hasExperience = profile.career_history.length > 50; // Basic check for substantial career history
    if (hasExperience) {
      matchScore += 10;
    } else {
      matchScore += 5; // Partial points for some career history
    }
  }

  // Ensure reasonable range and round
  const finalMatch = Math.min(Math.max(Math.round(matchScore), 25), 98);
  return finalMatch;
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
