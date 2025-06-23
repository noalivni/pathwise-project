
import { useState } from "react";
import { parseSkillsFromText } from "@/utils/skillsParsing";
import { useJobRecommendations } from "@/hooks/useJobRecommendations";
import { useAuth } from "@/hooks/useAuth";
import JobSearchInput from "@/components/JobSearchInput";
import JobRecommendationsHeader from "@/components/jobRecommendations/JobRecommendationsHeader";
import JobRecommendationsLoadingState from "@/components/jobRecommendations/JobRecommendationsLoadingState";
import JobRecommendationsEmptyState from "@/components/jobRecommendations/JobRecommendationsEmptyState";
import JobRecommendationsList from "@/components/jobRecommendations/JobRecommendationsList";

const JobRecommendations = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { careerRoles, loading, handleBookmark } = useJobRecommendations();

  const filteredRoles = careerRoles.filter(role => {
    const skills = parseSkillsFromText(role.Skills_required || '');
    return role.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.Industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
           skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (loading) {
    return <JobRecommendationsLoadingState />;
  }

  return (
    <div className="space-y-6">
      <JobRecommendationsHeader fieldOfInterest={profile?.field_of_interest} />

      <JobSearchInput 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredRoles.length > 0 ? (
        <JobRecommendationsList 
          roles={filteredRoles}
          onBookmark={handleBookmark}
        />
      ) : (
        <JobRecommendationsEmptyState 
          searchTerm={searchTerm}
          hasRoles={careerRoles.length > 0}
        />
      )}
    </div>
  );
};

export default JobRecommendations;
