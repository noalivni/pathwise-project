
import { supabase } from "@/integrations/supabase/client";
import { calculatePersonalizedCareerMatch } from "@/utils/personalizedCareerMatching";

export const fetchAndCalculateJobMatches = async (user: any, profile: any, limit: number = 4) => {
  if (!user || !profile) return [];

  try {
    // Get user's latest skills assessments
    const { data: softSkillsAssessment } = await supabase
      .from('skills_assessments')
      .select('*')
      .eq('user_id', user.id)
      .eq('assessment_type', 'soft_skills')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: hardSkillsAssessment } = await supabase
      .from('skills_assessments')
      .select('*')
      .eq('user_id', user.id)
      .eq('assessment_type', 'hard_skills')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get all job roles first
    const { data: allJobRoles, error } = await supabase
      .from('job_roles')
      .select('*');

    if (error) throw error;

    if (!allJobRoles || allJobRoles.length === 0) {
      console.log('No job roles found in database');
      return [];
    }

    // Filter by field of interest with flexible matching
    let filteredRoles = allJobRoles;
    
    if (profile.field_of_interest) {
      const fieldLower = profile.field_of_interest.toLowerCase();
      
    // Primary filter: exact or partial matches
    const primaryMatches = allJobRoles.filter(role => {
      const categoryLower = role.category?.toLowerCase() || '';
      const titleLower = role.job_title?.toLowerCase() || '';

  return (
    categoryLower.includes(fieldLower) ||
    fieldLower.includes(categoryLower) ||
    titleLower.includes(fieldLower) ||
    fieldLower.includes(titleLower)
  );
});
      // If we have enough primary matches, use them
      if (primaryMatches.length >= 4) {
        filteredRoles = primaryMatches;
      } else {
        // Fallback: include broader matches and general roles
        const secondaryMatches = allJobRoles.filter(role => {
          const categoryLower = role.category?.toLowerCase() || '';
          const titleLower = role.job_title?.toLowerCase() || '';
          const descriptionLower = role.job_description?.toLowerCase() || '';
          
          // Check for keyword overlap or general business roles
          const fieldWords = fieldLower.split(' ');
          return fieldWords.some(word => 
            categoryLower.includes(word) || 
            titleLower.includes(word) ||
            descriptionLower.includes(word)
          ) || 
          categoryLower.includes('business') ||
          categoryLower.includes('general') ||
          titleLower.includes('analyst') ||
          titleLower.includes('coordinator');
        });
        
        // Combine primary and secondary matches, remove duplicates
        const combinedMatches = [...primaryMatches];
        secondaryMatches.forEach(role => {
          if (!combinedMatches.find(existing => existing.id === role.id)) {
            combinedMatches.push(role);
          }
        });
        
        filteredRoles = combinedMatches.length >= 4 ? combinedMatches : allJobRoles;
      }
    }

    // Calculate personalized matches for all filtered roles
    let rolesWithMatches = filteredRoles.map(role => {
      const matchPercentage = calculatePersonalizedCareerMatch({
       role,
       profile,
       softSkillsAssessment,
       hardSkillsAssessment
  });

      return {
       ...role,

      // Compatibility with the rest of the app
       ID_num: role.id,
      Industry: role.category,
      Short_description: role.job_description,
      Skills_required: Array.isArray(role.required_skills)
      ? role.required_skills.join(", ")
      : "",
      Pay_grade: role.salary_range,

      match_percentage: matchPercentage
  };
});

    // Sort by match percentage and take top results
    rolesWithMatches = rolesWithMatches
      .sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0))
      .slice(0, limit);

    return rolesWithMatches;
  } catch (error) {
    console.error('Error calculating job matches:', error);
    return [];
  }
};
