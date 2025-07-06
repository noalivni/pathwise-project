
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

  const isPro = profile?.subscription_status === 'premium';

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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <JobSearchInput 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        
        {filteredRoles.length > 0 && (
          <Button 
            onClick={handleLearnMoreClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learn More About These Careers
          </Button>
        )}
      </div>

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
