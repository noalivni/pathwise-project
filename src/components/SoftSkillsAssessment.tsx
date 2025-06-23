import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { softSkills } from "@/data/softSkillsData";
import { SkillRatings } from "@/types/softSkills";
import { generatePersonalityProfile, generateDetailedFeedback } from "@/utils/personalityProfileGenerator";
import SkillAssessmentForm from "@/components/SkillAssessmentForm";
import SkillsResultsView from "@/components/SkillsResultsView";

interface SoftSkillsAssessmentProps {
  onReturnToHub?: () => void;
}

const SoftSkillsAssessment = ({ onReturnToHub }: SoftSkillsAssessmentProps) => {
  const { user } = useAuth();
  const [currentSkill, setCurrentSkill] = useState(0);
  const [skillRatings, setSkillRatings] = useState<SkillRatings>({});
  const [showResults, setShowResults] = useState(false);

  const handleRatingChange = (value: number[]) => {
    const skillName = softSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: value[0]
    }));
  };

  const handleNext = () => {
    if (currentSkill < softSkills.length - 1) {
      setCurrentSkill(currentSkill + 1);
    } else {
      saveAssessmentResults();
    }
  };

  const handleSkip = () => {
    const skillName = softSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: 0
    }));
    handleNext();
  };

  const saveAssessmentResults = async () => {
    if (!user) return;

    try {
      const personalityProfile = generatePersonalityProfile(skillRatings);
      const detailedFeedback = generateDetailedFeedback(skillRatings);
      
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          soft_skills: skillRatings,
          personality_traits: {
            ...personalityProfile,
            detailed_feedback: detailedFeedback
          },
          assessment_type: 'soft_skills'
        });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your soft skills have been evaluated and feedback generated.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetake = () => {
    setShowResults(false);
    setCurrentSkill(0);
    setSkillRatings({});
  };

  const handleViewJobs = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-jobs'));
  };

  const handleReturnToHub = () => {
    if (onReturnToHub) {
      onReturnToHub();
    }
  };

  if (showResults) {
    const personalityProfile = generatePersonalityProfile(skillRatings);
    const detailedFeedback = generateDetailedFeedback(skillRatings);
    
    return (
      <SkillsResultsView
        skillRatings={skillRatings}
        softSkills={softSkills}
        personalityProfile={personalityProfile}
        detailedFeedback={detailedFeedback}
        onRetake={handleRetake}
        onViewJobs={handleViewJobs}
        onReturnToHub={handleReturnToHub}
      />
    );
  }

  return (
    <SkillAssessmentForm
      currentSkill={currentSkill}
      softSkills={softSkills}
      skillRatings={skillRatings}
      onRatingChange={handleRatingChange}
      onNext={handleNext}
      onSkip={handleSkip}
    />
  );
};

export default SoftSkillsAssessment;
