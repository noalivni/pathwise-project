
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LearningResource } from "@/types/learningResources";
import { calculateRelevance } from "@/utils/learningResourcesUtils.tsx";

export const useEnhancedLearningData = () => {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [realTimeResources, setRealTimeResources] = useState<any[]>([]);
  const [guidanceData, setGuidanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [realTimeLoading, setRealTimeLoading] = useState(false);

  const fetchLearningResources = async () => {
    if (!user) return;

    try {
      // Get user's top job recommendations to personalize resources
      const { data: jobMatches } = await supabase
        .from('user_job_matches')
        .select(`
          job_role_id,
          match_percentage,
          job_roles (
            job_title,
            Skills_required
          )
        `)
        .eq('user_id', user.id)
        .order('match_percentage', { ascending: false })
        .limit(3);

      // Get all learning resources
      const { data: allResources, error } = await supabase
        .from('learning_resources')
        .select('*');

      if (error) throw error;

      // Sort resources by relevance to user's top job matches
      const topJobTitles = jobMatches?.map(match => match.job_roles?.job_title) || [];
      const topSkills = jobMatches?.flatMap(match => match.job_roles?.Skills_required ? match.job_roles.Skills_required.split(',').map(s => s.trim()) : []) || [];

      const sortedResources = allResources?.sort((a, b) => {
        const aRelevance = calculateRelevance(a, topJobTitles, topSkills);
        const bRelevance = calculateRelevance(b, topJobTitles, topSkills);
        return bRelevance - aRelevance;
      }) || [];

      setResources(sortedResources);
    } catch (error) {
      console.error('Error fetching learning resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIGuidance = async () => {
    if (!user) return;

    setAiLoading(true);
    try {
      // Get user's assessments and job matches
      const [jobMatchesResult, hardSkillsResult] = await Promise.all([
        supabase
          .from('user_job_matches')
          .select(`
            job_role_id,
            match_percentage,
            job_roles (
              job_title,
              Short_description,
              Industry,
              Skills_required
            )
          `)
          .eq('user_id', user.id)
          .order('match_percentage', { ascending: false })
          .limit(5),
        
        supabase
          .from('skills_assessments')
          .select('technical_skills')
          .eq('user_id', user.id)
          .eq('assessment_type', 'hard_skills')
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      if (jobMatchesResult.data && hardSkillsResult.data) {
        const topJobRecommendations = jobMatchesResult.data.map(match => ({
          job_title: match.job_roles?.job_title || '',
          Short_description: match.job_roles?.Short_description || '',
          Industry: match.job_roles?.Industry || '',
          Skills_required: match.job_roles?.Skills_required || '',
          match_percentage: match.match_percentage || 0
        }));

        const response = await supabase.functions.invoke('generate-career-guidance', {
          body: {
            topJobRecommendations,
            hardSkillsAssessment: hardSkillsResult.data.technical_skills || {},
            fieldOfInterest: profile?.field_of_interest || 'General'
          }
        });

        if (response.data) {
          setGuidanceData(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching AI guidance:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchRealTimeLearningResources = async () => {
    if (!user) return;

    setRealTimeLoading(true);
    try {
      // Get user's top job matches and skills that need improvement
      const [jobMatchesResult, hardSkillsResult] = await Promise.all([
        supabase
          .from('user_job_matches')
          .select(`
            job_roles (job_title)
          `)
          .eq('user_id', user.id)
          .order('match_percentage', { ascending: false })
          .limit(3),
        
        supabase
          .from('skills_assessments')
          .select('technical_skills')
          .eq('user_id', user.id)
          .eq('assessment_type', 'hard_skills')
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      const jobTitles = jobMatchesResult.data?.map(match => match.job_roles?.job_title).filter(Boolean) || [];
      const hardSkills = hardSkillsResult.data?.technical_skills || {};
      const skillsToImprove = Object.entries(hardSkills)
        .filter(([_, rating]) => (rating as number) < 4)
        .map(([skill, _]) => skill)
        .slice(0, 3);

      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles,
          skills: skillsToImprove,
          maxResults: 8
        }
      });

      if (response.data?.resources) {
        setRealTimeResources(response.data.resources);
      }
    } catch (error) {
      console.error('Error fetching real-time resources:', error);
    } finally {
      setRealTimeLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAIGuidance();
    fetchRealTimeLearningResources();
  };

  return {
    resources,
    realTimeResources,
    guidanceData,
    loading,
    aiLoading,
    realTimeLoading,
    fetchLearningResources,
    fetchAIGuidance,
    fetchRealTimeLearningResources,
    handleRefresh
  };
};
