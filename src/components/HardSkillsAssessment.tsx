import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { skillsByField, defaultSkills } from "@/data/hardSkillsData";
import SkillQuestion from "@/components/hardSkills/SkillQuestion";
import AssessmentResults from "@/components/hardSkills/AssessmentResults";
import FirstActivityCelebration from "@/components/FirstActivityCelebration";

interface HardSkillsAssessmentProps {
  onReturnToHub?: () => void;
  selectedField?: string;
}

const HardSkillsAssessment = ({ onReturnToHub, selectedField = 'General' }: HardSkillsAssessmentProps) => {
  const { user, profile } = useAuth();
  const [currentSkill, setCurrentSkill] = useState(0);
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [relevantSkills, setRelevantSkills] = useState<Array<{ name: string; category: string }>>([]);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  useEffect(() => {
    if (selectedField && selectedField !== 'General' && skillsByField[selectedField as keyof typeof skillsByField]) {
      setRelevantSkills(skillsByField[selectedField as keyof typeof skillsByField]);
    } else {
      setRelevantSkills(defaultSkills);
    }
  }, [selectedField]);

  const handleRatingChange = (value: number[]) => {
    const skillName = relevantSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: value[0]
    }));
  };

  const handleNext = () => {
    if (currentSkill < relevantSkills.length - 1) {
      setCurrentSkill(currentSkill + 1);
    } else {
      saveAssessmentResults();
    }
  };

  const handleSkip = () => {
    const skillName = relevantSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: 0
    }));
    handleNext();
  };

  const saveAssessmentResults = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          technical_skills: skillRatings,
          field_specific_skills: {
            field: profile?.field_of_interest || 'General',
            skills: skillRatings
          },
          assessment_type: 'hard_skills'
        });

      if (error) throw error;

      setShowResults(true);
      setAssessmentCompleted(true);
      toast({
        title: "Assessment Complete!",
        description: "Your hard skills have been evaluated successfully.",
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
    setAssessmentCompleted(false);
  };

  const handleViewJobs = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-jobs'));
  };

  const handleReturnToHub = () => {
    if (onReturnToHub) {
      onReturnToHub();
    }
  };

  if (relevantSkills.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Loading Assessment...</h1>
          <p className="text-muted-foreground mt-2">Preparing your personalized skills assessment</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <>
        {assessmentCompleted && (
          <FirstActivityCelebration 
            activityType="skills_assessment" 
            activityName="Hard Skills Assessment" 
          />
        )}
        <AssessmentResults
          skillRatings={skillRatings}
          relevantSkills={relevantSkills}
          fieldOfInterest={selectedField}
          onRetake={handleRetake}
          onViewJobs={handleViewJobs}
          onReturnToHub={handleReturnToHub}
        />
      </>
    );
  }

  const currentSkillData = relevantSkills[currentSkill];
  const currentRating = skillRatings[currentSkillData.name] || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hard Skills Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Rate your proficiency with {selectedField === 'General' ? 'technical' : selectedField} tools and skills
        </p>
      </div>

      <SkillQuestion
        currentSkill={currentSkill}
        totalSkills={relevantSkills.length}
        skillData={currentSkillData}
        currentRating={currentRating}
        onRatingChange={handleRatingChange}
        onNext={handleNext}
        onSkip={handleSkip}
        isLastSkill={currentSkill === relevantSkills.length - 1}
      />
    </div>
  );
};

export default HardSkillsAssessment;
