
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LearningResource } from "@/types/learningResources";
import { calculateRelevance, filterResources } from "@/utils/learningResourcesUtils.tsx";
import ProUpgradeNotice from "@/components/learningResources/ProUpgradeNotice";
import SearchAndFilters from "@/components/learningResources/SearchAndFilters";
import ResourceCard from "@/components/learningResources/ResourceCard";
import EmptyState from "@/components/learningResources/EmptyState";
import AIGuidanceSection from "@/components/learningResources/AIGuidanceSection";
import RealTimeLearningSection from "@/components/learningResources/RealTimeLearningSection";

const EnhancedLearningResources = () => {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [realTimeResources, setRealTimeResources] = useState<any[]>([]);
  const [guidanceData, setGuidanceData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [realTimeLoading, setRealTimeLoading] = useState(false);

  const isPro = profile?.subscription_status === 'premium';

  useEffect(() => {
    if (user) {
      if (isPro) {
        fetchLearningResources();
        fetchAIGuidance();
        fetchRealTimeLearningResources();
      } else {
        setLoading(false);
      }
    }
  }, [user, isPro]);

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

  const handleResourceClick = async (resource: LearningResource) => {
    if (!user) return;

    try {
      // Log the activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'resource_accessed',
          activity_description: `Accessed learning resource: ${resource.title}`
        });

      // Open resource in new tab
      window.open(resource.url, '_blank');
    } catch (error) {
      console.error('Error logging resource access:', error);
    }
  };

  const handleRefresh = () => {
    fetchAIGuidance();
    fetchRealTimeLearningResources();
  };

  const filteredResources = filterResources(resources, searchTerm, selectedType);
  const resourceTypes = ['all', ...Array.from(new Set(resources.map(r => r.resource_type)))];

  if (!isPro) {
    return <ProUpgradeNotice />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-pathwise-text-muted">Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-pathwise-text">Enhanced Learning Resources</h1>
          <p className="text-pathwise-text-muted mt-2">AI-powered personalized learning with real-time content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={aiLoading || realTimeLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(aiLoading || realTimeLoading) ? 'animate-spin' : ''}`} />
            Refresh AI Content
          </Button>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Pro Feature
          </Badge>
        </div>
      </div>

      {/* AI Guidance Section */}
      <AIGuidanceSection guidanceData={guidanceData} loading={aiLoading} />

      {/* Real-Time Learning Resources */}
      <RealTimeLearningSection resources={realTimeResources} loading={realTimeLoading} />

      {/* Traditional Learning Resources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-pathwise-text">Curated Learning Resources</h2>
        
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          resourceTypes={resourceTypes}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onResourceClick={handleResourceClick}
            />
          ))}
        </div>

        {filteredResources.length === 0 && <EmptyState />}
      </div>
    </div>
  );
};

export default EnhancedLearningResources;
