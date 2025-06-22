
import { MatchCalculationParams } from "@/types/jobRecommendations";
import { parseSkillsFromText } from "./skillsParsing";

export const calculateCareerMatch = ({ role, assessment, profile }: MatchCalculationParams): number => {
  let matchScore = 0;
  let totalFactors = 0;

  // Field of Interest Match (40% weight) - highest priority
  if (profile?.field_of_interest && role.Industry) {
    const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.Industry.toLowerCase()) ||
                      role.Industry.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                      role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (fieldMatch) {
      matchScore += 40;
    }
  }
  totalFactors += 40;

  // Skills Match (35% weight) - technical alignment
  if (role.Skills_required && profile?.hard_skills) {
    const roleSkills = parseSkillsFromText(role.Skills_required);
    const skillsInCommon = roleSkills.filter((skill: string) =>
      profile.hard_skills.some((userSkill: string) =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).length;
    
    const skillsMatch = roleSkills.length > 0 ? 
      skillsInCommon / roleSkills.length : 0;
    matchScore += skillsMatch * 35;
  }
  totalFactors += 35;

  // Assessment Results Match (25% weight) - soft skills and personality fit
  if (assessment) {
    let overallAssessmentScore = 0;
    let assessmentFactors = 0;
    
    if (assessment.technical_skills && typeof assessment.technical_skills === 'object') {
      const techValues = Object.values(assessment.technical_skills).filter((val): val is number => typeof val === 'number');
      const techSkillsAvg = techValues.length > 0 ? 
        techValues.reduce((a, b) => a + b, 0) / techValues.length : 0;
      overallAssessmentScore += (techSkillsAvg / 5) * 15; // Convert to percentage and weight
      assessmentFactors += 15;
    }
    
    if (assessment.soft_skills && typeof assessment.soft_skills === 'object') {
      const softValues = Object.values(assessment.soft_skills).filter((val): val is number => typeof val === 'number');
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
