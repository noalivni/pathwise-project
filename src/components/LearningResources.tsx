import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LearningResource } from "@/types/learningResources";
import { calculateRelevance, filterResources } from "@/utils/learningResourcesUtils.tsx";
import ProUpgradeNotice from "@/components/learningResources/ProUpgradeNotice";
import SearchAndFilters from "@/components/learningResources/SearchAndFilters";
import ResourceCard from "@/components/learningResources/ResourceCard";
import EmptyState from "@/components/learningResources/EmptyState";

const LearningResources = () => {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const isPro = profile?.subscription_status === 'premium';

  useEffect(() => {
    if (user) {
      if (isPro) {
        fetchLearningResources();
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
            required_skills
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
      const topJobTitles = jobMatches?.map(match => match.job_roles.job_title) || [];
      const topSkills = jobMatches?.flatMap(match => match.job_roles.required_skills || []) || [];

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
          <p className="text-slate-600">Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Learning Resources</h1>
          <p className="text-slate-600 mt-2">Personalized learning materials based on your career goals</p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Pro Feature
        </Badge>
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
