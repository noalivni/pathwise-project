
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SearchAndFilters from "@/components/learningResources/SearchAndFilters";
import ResourceCard from "@/components/learningResources/ResourceCard";
import EmptyState from "@/components/learningResources/EmptyState";
import ProUpgradeNotice from "@/components/learningResources/ProUpgradeNotice";
import { fetchAndCalculateJobMatches } from "@/utils/sharedJobMatching";

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
}

interface JobResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  related_skills: string[];
  related_job_roles: string[];
  jobTitle?: string;
  aiSummary?: string;
}

type LearningResource = SkillResource | JobResource;

const LearningResources = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [skillResources, setSkillResources] = useState<SkillResource[]>([]);
  const [jobResources, setJobResources] = useState<JobResource[]>([]);
  const [loading, setLoading] = useState(true);

  const isPro = profile?.subscription_status === 'premium';
  const resourceTypes = ['all', 'improve your skills', 'explore careers'];

  useEffect(() => {
    if (user && isPro) {
      fetchResourcesData();
    } else {
      setLoading(false);
    }
  }, [user, isPro]);

  const fetchResourcesData = async () => {
    if (!user) return;

    try {
      await Promise.all([
        fetchSkillBasedResources(),
        fetchJobBasedResources()
      ]);
    } catch (error) {
      console.error('Error fetching resources data:', error);
    } finally {
      setLoading(false);
    }
  };

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

            return resources.map(resource => ({
              ...resource,
              id: `skill-${skill}-${resource.url}`,
              skillName: skill,
              aiExplanation,
              resource_type: 'skill_development'
            }));
          })
        );

        setSkillResources(enhancedSkills.flat());
      }
    } catch (error) {
      console.error('Error fetching skill-based resources:', error);
    }
  };

  const fetchJobBasedResources = async () => {
    if (!user || !profile) return;

    try {
      // Use the shared job matching logic
      const jobMatches = await fetchAndCalculateJobMatches(user, profile, 4);

      if (jobMatches.length > 0) {
        const jobsWithDetails = jobMatches.map(match => ({
          job_title: match.job_title || '',
          Short_description: match.Short_description || '',
          Industry: match.Industry || '',
          match_percentage: match.match_percentage || 0
        }));

        // Generate AI summaries and fetch resources for each job
        const enhancedJobs = await Promise.all(
          jobsWithDetails.map(async (job) => {
            const [aiSummary, resources] = await Promise.all([
              generateJobSummary(job),
              fetchJobResources(job.job_title)
            ]);

            return resources.map(resource => ({
              ...resource,
              id: `job-${job.job_title}-${resource.url}`,
              jobTitle: job.job_title,
              aiSummary,
              resource_type: 'career_exploration'
            }));
          })
        );

        setJobResources(enhancedJobs.flat());
      }
    } catch (error) {
      console.error('Error fetching job-based resources:', error);
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

  const generateJobSummary = async (job: any) => {
    try {
      const response = await supabase.functions.invoke('generate-career-guidance', {
        body: {
          topJobRecommendations: [job],
          hardSkillsAssessment: {},
          fieldOfInterest: job.Industry,
          generateJobSummary: true
        }
      });

      if (response.data?.jobSummary) {
        return response.data.jobSummary;
      }
    } catch (error) {
      console.error('Error generating job summary:', error);
    }
    return `${job.job_title} is a role in the ${job.Industry} industry. ${job.Short_description}`;
  };

  const fetchSkillResources = async (skill: string) => {
    try {
      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles: [],
          skills: [skill],
          maxResults: 3
        }
      });

      if (response.data?.resources) {
        return response.data.resources.map((resource: any) => ({
          title: resource.title,
          description: resource.description,
          url: resource.url,
          related_skills: [skill],
          related_job_roles: []
        }));
      }
    } catch (error) {
      console.error('Error fetching skill resources:', error);
    }
    return [];
  };

  const fetchJobResources = async (jobTitle: string) => {
    try {
      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles: [jobTitle],
          skills: [],
          maxResults: 3
        }
      });

      if (response.data?.resources) {
        return response.data.resources.map((resource: any) => ({
          title: resource.title,
          description: resource.description,
          url: resource.url,
          related_skills: [],
          related_job_roles: [jobTitle]
        }));
      }
    } catch (error) {
      console.error('Error fetching job resources:', error);
    }
    return [];
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

  const filterResources = (resources: LearningResource[], searchTerm: string, selectedType: string) => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.related_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesType = true;
      if (selectedType === "improve your skills") {
        matchesType = resource.resource_type === 'skill_development';
      } else if (selectedType === "explore careers") {
        matchesType = resource.resource_type === 'career_exploration';
      }
      
      return matchesSearch && matchesType;
    });
  };

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

  const allResources = [...skillResources, ...jobResources];
  const filteredResources = filterResources(allResources, searchTerm, selectedType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-pathwise-text">Learning Resources</h1>
        <p className="text-pathwise-text-muted mt-2">Personalized learning content based on your skills and career goals</p>
      </div>

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
  );
};

export default LearningResources;
