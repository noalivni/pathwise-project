
import { PersonalizedMatchParams } from "@/types/jobRecommendations";
import { parseSkillsFromText } from "./skillsParsing";

export const calculatePersonalizedCareerMatch = ({ role, profile, softSkillsAssessment, hardSkillsAssessment }: PersonalizedMatchParams): number => {
  let matchScore = 0;
  const baseScore = 50; // Start with a base score

  console.log('Calculating match for role:', role.job_title);
  console.log('User field of interest:', profile?.field_of_interest);

  // 1. Field of Interest Match (35% weight) - Primary factor
  if (profile?.field_of_interest && role.Industry) {
    const fieldLower = profile.field_of_interest.toLowerCase();
    const categoryLower = role.Industry.toLowerCase();
    const titleLower = role.job_title.toLowerCase();
    
    const directMatch = fieldLower.includes(categoryLower) ||
                       categoryLower.includes(fieldLower) ||
                       titleLower.includes(fieldLower);
    
    if (directMatch) {
      matchScore += 35;
      console.log('Direct field match: +35');
    } else {
      // Partial match for related fields
      const fieldWords = fieldLower.split(' ');
      const categoryWords = categoryLower.split(' ');
      const titleWords = titleLower.split(' ');
      
      const wordOverlap = fieldWords.some(word => 
        categoryWords.includes(word) || titleWords.includes(word)
      );
      
      if (wordOverlap) {
        matchScore += 15;
        console.log('Partial field match: +15');
      } else {
        matchScore += 5; // Small bonus for any role
        console.log('No field match: +5');
      }
    }
  } else {
    matchScore += 10; // Base field score when no preference
  }

  // 2. Hard Skills Assessment Match (25% weight)
  if (hardSkillsAssessment?.technical_skills) {
    const userSkills = Object.keys(hardSkillsAssessment.technical_skills);
    const skillScores = Object.values(hardSkillsAssessment.technical_skills).filter((val): val is number => typeof val === 'number');
    const avgUserSkillLevel = skillScores.length > 0 ? 
      skillScores.reduce((a, b) => a + b, 0) / skillScores.length : 2.5;
    
    let skillMatchScore = 0;
    
    if (role.Skills_required) {
      const roleSkills = parseSkillsFromText(role.Skills_required);
      
      if (roleSkills.length > 0) {
        let matchedSkills = 0;
        let totalSkillScore = 0;

        roleSkills.forEach((requiredSkill: string) => {
          const matchingUserSkill = userSkills.find(userSkill => 
            userSkill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
            requiredSkill.toLowerCase().includes(userSkill.toLowerCase())
          );
          
          if (matchingUserSkill) {
            const skillIndex = userSkills.indexOf(matchingUserSkill);
            const skillScore = skillScores[skillIndex] || 0;
            totalSkillScore += skillScore;
            matchedSkills++;
          }
        });

        if (matchedSkills > 0) {
          const avgMatchedSkillScore = totalSkillScore / matchedSkills;
          const matchRatio = matchedSkills / roleSkills.length;
          skillMatchScore = (avgMatchedSkillScore / 5) * matchRatio * 25;
        } else {
          // No specific skill matches, use general skill level
          skillMatchScore = (avgUserSkillLevel / 5) * 10;
        }
      } else {
        // No required skills specified, use general assessment
        skillMatchScore = (avgUserSkillLevel / 5) * 15;
      }
    } else {
      // No required skills specified, use general assessment
      skillMatchScore = (avgUserSkillLevel / 5) * 15;
    }
    
    matchScore += skillMatchScore;
    console.log('Hard skills match: +', skillMatchScore);
  } else {
    matchScore += 10; // Base score when no hard skills assessment
  }

  // 3. Personality & Role Fit Match (20% weight)
  if (softSkillsAssessment?.soft_skills) {
    const softSkills = softSkillsAssessment.soft_skills;
    let personalityScore = 0;

    const communication = typeof softSkills["Communication"] === 'number' ? softSkills["Communication"] : 2.5;
    const leadership = typeof softSkills["Leadership"] === 'number' ? softSkills["Leadership"] : 2.5;
    const teamwork = typeof softSkills["Teamwork"] === 'number' ? softSkills["Teamwork"] : 2.5;
    const adaptability = typeof softSkills["Adaptability"] === 'number' ? softSkills["Adaptability"] : 2.5;
    const creativity = typeof softSkills["Creativity"] === 'number' ? softSkills["Creativity"] : 2.5;

    const roleTitle = role.job_title.toLowerCase();
    const roleDesc = role.Short_description?.toLowerCase() || '';

    // Client-facing roles need high communication
    if (roleTitle.includes('sales') || roleTitle.includes('customer') || 
        roleTitle.includes('client') || roleDesc.includes('client')) {
      if (communication >= 4) {
        personalityScore += 8;
      } else if (communication >= 3) {
        personalityScore += 4;
      } else {
        personalityScore -= 2; // Small penalty for poor fit
      }
    }

    // Leadership roles need leadership skills
    if (roleTitle.includes('manager') || roleTitle.includes('lead') || 
        roleTitle.includes('director') || roleTitle.includes('supervisor')) {
      if (leadership >= 4) {
        personalityScore += 8;
      } else if (leadership >= 3) {
        personalityScore += 4;
      } else {
        personalityScore -= 1;
      }
    }

    // Creative roles need creativity
    if (roleTitle.includes('design') || roleTitle.includes('creative') || 
        roleTitle.includes('marketing') || roleDesc.includes('creative')) {
      if (creativity >= 4) {
        personalityScore += 6;
      } else if (creativity >= 3) {
        personalityScore += 3;
      }
    }

    // Team-based roles need teamwork
    if (roleDesc.includes('team') || roleDesc.includes('collaborative')) {
      if (teamwork >= 4) {
        personalityScore += 5;
      } else if (teamwork >= 3) {
        personalityScore += 2;
      }
    }

    // Dynamic environments need adaptability
    if (roleDesc.includes('fast-paced') || roleDesc.includes('startup') || 
        roleDesc.includes('agile') || roleDesc.includes('dynamic')) {
      if (adaptability >= 4) {
        personalityScore += 5;
      } else if (adaptability >= 3) {
        personalityScore += 2;
      }
    }

    // Base personality score from overall soft skills average
    const softSkillValues = Object.values(softSkills).filter((val): val is number => typeof val === 'number');
    const avgSoftSkills = softSkillValues.length > 0 ? 
      softSkillValues.reduce((a, b) => a + b, 0) / softSkillValues.length : 2.5;
    personalityScore += (avgSoftSkills / 5) * 8;

    matchScore += Math.max(personalityScore, 0);
    console.log('Personality match: +', Math.max(personalityScore, 0));
  } else {
    matchScore += 10; // Base score when no soft skills assessment
  }

  // 4. Education & Experience Alignment (15% weight)
  let backgroundScore = 0;
  
  if (profile?.degree_certification) {
    const hasAdvancedDegree = ['Bachelor\'s', 'Master\'s', 'PhD'].includes(profile.degree_certification);
    if (hasAdvancedDegree) {
      backgroundScore += 6;
    } else {
      backgroundScore += 3;
    }
  }

  if (profile?.fields_of_study && role.Industry) {
    const studyFieldMatch = profile.fields_of_study.toLowerCase().includes(role.Industry.toLowerCase()) ||
                           role.Industry.toLowerCase().includes(profile.fields_of_study.toLowerCase());
    if (studyFieldMatch) {
      backgroundScore += 5;
    }
  }

  if (profile?.career_history && profile.career_history.length > 50) {
    backgroundScore += 4;
  }

  matchScore += Math.min(backgroundScore, 15);
  console.log('Background match: +', Math.min(backgroundScore, 15));

  // Calculate final score with base
  let finalMatch = Math.round(baseScore + matchScore);
  
  // Ensure minimum score for field matches
  if (profile?.field_of_interest && role.Industry) {
    const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.Industry.toLowerCase()) ||
                      role.Industry.toLowerCase().includes(profile.field_of_interest.toLowerCase());
    if (fieldMatch && finalMatch < 60) {
      finalMatch = 60; // Minimum 60% for field matches
    }
  }

  // Ensure reasonable range
  finalMatch = Math.min(Math.max(finalMatch, 35), 95);
  
  console.log('Final match score:', finalMatch);
  return finalMatch;
};
