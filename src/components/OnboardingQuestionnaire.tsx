
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
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
  const { showSuccess, showError } = useNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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

      showSuccess("Your profile has been created successfully! Welcome to Pathwise.");
      onComplete();
    } catch (error) {
      showError("Failed to save profile. Please try again.", "modal");
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-main">Complete Your Profile</h1>
        <p className="text-sub mt-2">Help us personalize your experience</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-sub">
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
          disabled={currentStep === 1 || loading}
          className="hover:bg-standard-hover active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (currentStep === TOTAL_STEPS ? 'Complete Profile' : 'Next')}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
