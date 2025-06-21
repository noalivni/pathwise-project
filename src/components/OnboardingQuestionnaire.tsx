
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { TOTAL_STEPS } from "@/data/onboardingData";
import type { OnboardingFormData } from "@/types/onboarding";
import PersonalInfoStep from "@/components/onboarding/PersonalInfoStep";
import EducationStep from "@/components/onboarding/EducationStep";
import CareerGoalsStep from "@/components/onboarding/CareerGoalsStep";
import ExperienceStep from "@/components/onboarding/ExperienceStep";
import SubscriptionStep from "@/components/onboarding/SubscriptionStep";

interface OnboardingQuestionnairProps {
  onComplete: () => void;
}

const OnboardingQuestionnaire = ({ onComplete }: OnboardingQuestionnairProps) => {
  const { updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    full_name: "",
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    field_of_interest: "",
    hard_skills: "",
    career_history: "",
    subscription_status: "free"
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const skillsArray = formData.hard_skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      await updateProfile({
        full_name: formData.full_name,
        location: formData.location,
        degree_certification: formData.degree_certification,
        fields_of_study: formData.fields_of_study,
        graduation_year: formData.graduation_year,
        field_of_interest: formData.field_of_interest,
        hard_skills: skillsArray,
        career_history: formData.career_history,
        subscription_status: formData.subscription_status,
        onboarding_completed: true
      });

      toast({
        title: "Profile Created!",
        description: "Your profile has been set up successfully.",
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <EducationStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <CareerGoalsStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ExperienceStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <SubscriptionStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Complete Your Profile</h1>
        <p className="text-slate-600 mt-2">Help us personalize your experience</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Step {currentStep} of {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {renderStep()}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
        >
          {currentStep === TOTAL_STEPS ? 'Complete Profile' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
