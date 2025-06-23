
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SearchAndFilters from "@/components/learningResources/SearchAndFilters";
import ResourceCard from "@/components/learningResources/ResourceCard";
import EmptyState from "@/components/learningResources/EmptyState";
import ProUpgradeNotice from "@/components/learningResources/ProUpgradeNotice";
import { useSkillResources } from "@/hooks/useSkillResources";
import { useJobResources } from "@/hooks/useJobResources";

interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  related_skills: string[];
  related_job_roles: string[];
  skillName?: string;
  aiExplanation?: string;
  jobTitle?: string;
  aiSummary?: string;
}

const LearningResourcesContainer = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const { skillResources, fetchSkillBasedResources } = useSkillResources();
  const { jobResources, fetchJobBasedResources } = useJobResources();

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

export default LearningResourcesContainer;
