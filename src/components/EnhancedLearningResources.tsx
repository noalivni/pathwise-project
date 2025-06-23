
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LearningResource } from "@/types/learningResources";
import { filterResources } from "@/utils/learningResourcesUtils.tsx";
import ProUpgradeNotice from "@/components/learningResources/ProUpgradeNotice";
import AIGuidanceSection from "@/components/learningResources/AIGuidanceSection";
import RealTimeLearningSection from "@/components/learningResources/RealTimeLearningSection";
import EnhancedResourcesHeader from "@/components/learningResources/EnhancedResourcesHeader";
import CuratedResourcesSection from "@/components/learningResources/CuratedResourcesSection";
import { useEnhancedLearningData } from "@/hooks/useEnhancedLearningData";

const EnhancedLearningResources = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const isPro = profile?.subscription_status === 'premium';

  const {
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
  } = useEnhancedLearningData();

  useEffect(() => {
    if (user) {
      if (isPro) {
        fetchLearningResources();
        fetchAIGuidance();
        fetchRealTimeLearningResources();
      }
    }
  }, [user, isPro]);

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
          <p className="text-pathwise-text-muted">Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnhancedResourcesHeader
        onRefresh={handleRefresh}
        aiLoading={aiLoading}
        realTimeLoading={realTimeLoading}
      />

      {/* AI Guidance Section */}
      <AIGuidanceSection guidanceData={guidanceData} loading={aiLoading} />

      {/* Real-Time Learning Resources */}
      <RealTimeLearningSection resources={realTimeResources} loading={realTimeLoading} />

      {/* Traditional Learning Resources */}
      <CuratedResourcesSection
        filteredResources={filteredResources}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        resourceTypes={resourceTypes}
        onResourceClick={handleResourceClick}
      />
    </div>
  );
};

export default EnhancedLearningResources;
