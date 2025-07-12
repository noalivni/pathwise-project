
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SkillResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  related_skills: string[];
  related_job_roles: string[];
  skillName?: string;
  aiExplanation?: string;
  resources?: Array<{
    title: string;
    description: string;
    url: string;
  }>;
}

export const useSkillResources = () => {
  const { user, profile } = useAuth();
  const [skillResources, setSkillResources] = useState<SkillResource[]>([]);

  const fetchSkillBasedResources = async () => {
    if (!user) return;

    try {
      // Get user's skills assessment to find skills needing improvement
      const { data: hardSkillsResult } = await supabase
        .from('skills_assessments')
        .select('technical_skills')
        .eq('user_id', user.id)
        .eq('assessment_type', 'hard_skills')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (hardSkillsResult?.technical_skills) {
        const hardSkills = hardSkillsResult.technical_skills;
        
        // Get skills that need improvement (rating < 4)
        const skillsToImprove = Object.entries(hardSkills)
          .filter(([_, rating]) => (rating as number) < 4)
          .sort(([_, a], [__, b]) => (a as number) - (b as number))
          .slice(0, 6)
          .map(([skill, _]) => skill);

        // Generate AI explanations and fetch resources for each skill
        const enhancedSkills = await Promise.all(
          skillsToImprove.map(async (skill) => {
            const [aiExplanation, resources] = await Promise.all([
              generateSkillExplanation(skill),
              fetchSkillResources(skill)
            ]);

            return {
              id: `skill-${skill}`,
              title: `${skill} Learning Resources`,
              description: `Curated resources to improve your ${skill} skills`,
              url: '',
              skillName: skill,
              aiExplanation,
              resource_type: 'skill_development',
              related_skills: [skill],
              related_job_roles: [],
              resources: resources
            };
          })
        );

        setSkillResources(enhancedSkills);
      }
    } catch (error) {
      console.error('Error fetching skill-based resources:', error);
    }
  };

  const generateSkillExplanation = async (skill: string) => {
    try {
      const response = await supabase.functions.invoke('generate-career-guidance', {
        body: {
          topJobRecommendations: [],
          hardSkillsAssessment: {},
          fieldOfInterest: profile?.field_of_interest || 'General',
          generateSkillExplanation: true,
          skill: skill
        }
      });

      if (response.data?.skillExplanation) {
        return response.data.skillExplanation;
      }
    } catch (error) {
      console.error('Error generating skill explanation:', error);
    }
    return `${skill} is an important technical skill that will enhance your professional capabilities.`;
  };

  const fetchSkillResources = async (skill: string) => {
    try {
      console.log(`Fetching resources for skill: ${skill}`);
      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles: [],
          skills: [skill],
          maxResults: 5
        }
      });

      console.log(`Response for ${skill}:`, response);

      if (response.data?.resources && response.data.resources.length > 0) {
        console.log(`Found ${response.data.resources.length} resources for ${skill}`);
        return response.data.resources.map((resource: any) => ({
          title: resource.title,
          description: resource.description,
          url: resource.url
        }));
      }
      
      console.log(`No resources found for ${skill}, providing fallback`);
    } catch (error) {
      console.error('Error fetching skill resources:', error);
    }
    
    // Provide a direct educational resource as fallback
    return [{
      title: `${skill} Learning Guide`,
      description: `Comprehensive guide to learning ${skill} with tutorials and examples`,
      url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(skill)}`
    }];
  };

  return {
    skillResources,
    fetchSkillBasedResources
  };
};
