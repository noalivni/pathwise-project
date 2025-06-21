
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingQuestionnaireProps {
  onComplete: () => void;
}

const OnboardingQuestionnaire = ({ onComplete }: OnboardingQuestionnaireProps) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    hard_skills: "",
    career_history: ""
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      const skillsArray = formData.hard_skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
        location: formData.location,
        degree_certification: formData.degree_certification,
        fields_of_study: formData.fields_of_study,
        graduation_year: formData.graduation_year,
        hard_skills: skillsArray,
        career_history: formData.career_history,
        onboarding_completed: true,
      });

      // Log activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'onboarding_completed',
        activity_description: 'Completed onboarding questionnaire',
      });

      toast({
        title: "Welcome to Pathwise!",
        description: "Your profile has been created successfully.",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter your location (e.g., San Francisco, CA)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="degree_certification">Degree/Certification</Label>
              <Input
                id="degree_certification"
                placeholder="Enter your degree or certification"
                value={formData.degree_certification}
                onChange={(e) => setFormData({ ...formData, degree_certification: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fields_of_study">Fields of Study</Label>
              <Input
                id="fields_of_study"
                placeholder="Enter your fields of study"
                value={formData.fields_of_study}
                onChange={(e) => setFormData({ ...formData, fields_of_study: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="graduation_year">Graduation Year/Expected</Label>
              <Input
                id="graduation_year"
                placeholder="Enter graduation year (e.g., 2023, Expected 2025)"
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hard_skills">Hard/Technical Skills</Label>
              <Textarea
                id="hard_skills"
                placeholder="List your technical skills separated by commas (e.g., JavaScript, Python, React, SQL)"
                value={formData.hard_skills}
                onChange={(e) => setFormData({ ...formData, hard_skills: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="career_history">Career History</Label>
              <Textarea
                id="career_history"
                placeholder="Describe your career history, past roles, or industries you've worked in"
                value={formData.career_history}
                onChange={(e) => setFormData({ ...formData, career_history: e.target.value })}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profile Setup Complete!</h3>
              <p className="text-slate-600">
                Your responses have been saved. We'll use this information to provide 
                personalized career recommendations and resources.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome to Pathwise!</h1>
        <p className="text-slate-600 mt-2">Let's get to know you better to provide personalized career guidance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of {totalSteps}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Educational Background"}
            {currentStep === 3 && "Skills & Experience"}
            {currentStep === 4 && "All set!"}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              {currentStep === totalSteps ? "Complete" : "Next"}
              {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingQuestionnaire;
