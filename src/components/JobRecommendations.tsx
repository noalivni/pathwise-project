
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { careerRoles, loading, handleBookmark } = useJobRecommendations();

  const filteredRoles = careerRoles.filter(role => {
    const skills = parseSkillsFromText(role.Skills_required || '');
    return role.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.Industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
           skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleLearnMoreClick = () => {
    navigate('/learning-resources');
  };

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
        <>
          <JobRecommendationsList 
            roles={filteredRoles}
            onBookmark={handleBookmark}
          />
          
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleLearnMoreClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Learn More About These Careers
            </Button>
          </div>
        </>
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
