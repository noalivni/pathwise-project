
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { parseSkillsFromText } from "@/utils/skillsParsing";
import { useJobRecommendations } from "@/hooks/useJobRecommendations";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import JobSearchInput from "@/components/JobSearchInput";
import JobRecommendationsHeader from "@/components/jobRecommendations/JobRecommendationsHeader";
import JobRecommendationsLoadingState from "@/components/jobRecommendations/JobRecommendationsLoadingState";
import JobRecommendationsEmptyState from "@/components/jobRecommendations/JobRecommendationsEmptyState";
import JobRecommendationsList from "@/components/jobRecommendations/JobRecommendationsList";

const JobRecommendations = () => {
  const { profile, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSkillsAssessment, setHasSkillsAssessment] = useState(false);
  const { careerRoles, loading, handleBookmark } = useJobRecommendations();

  const isPro = profile?.subscription_status === 'premium';

  useEffect(() => {
    const checkSkillsAssessment = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('skills_assessments')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        setHasSkillsAssessment(data && data.length > 0);
      } catch (error) {
        console.error('Error checking skills assessment:', error);
      }
    };

    checkSkillsAssessment();
  }, [user]);

  const filteredRoles = careerRoles.filter(role => {
    const skills = parseSkillsFromText(role.Skills_required || '');
    return role.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.Industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
           skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleLearnMoreClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-learning'));
  };

  if (loading) {
    return <JobRecommendationsLoadingState />;
  }

  return (
    <div className="space-y-6">
      <JobRecommendationsHeader 
        fieldOfInterest={profile?.field_of_interest} 
        hasSkillsAssessment={hasSkillsAssessment}
      />

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
          hasSkillsAssessment={hasSkillsAssessment}
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
