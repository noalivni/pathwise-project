
import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OnboardingQuestionnaireProps {
  onComplete: () => void;
}

const OnboardingQuestionnaire = ({ onComplete }: OnboardingQuestionnaireProps) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    hard_skills: "",
    career_history: ""
  });

  const totalSteps = 3; // Reduced from 4 since we're removing personal info step
  const progress = (currentStep / totalSteps) * 100;

  // Pre-populate user data from auth
  useEffect(() => {
    if (user) {
      console.log('User data for onboarding:', user);
      // User name and email are already captured during sign-up
      // We don't need to ask for them again
    }
  }, [user]);

  const educationLevels = [
    "High School",
    "Bachelor's",
    "Master's",
    "PhD"
  ];

  const fieldsOfStudy = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Marketing",
    "Finance",
    "Psychology",
    "Design",
    "Data Science",
    "Healthcare",
    "Education",
    "Other"
  ];

  // Generate graduation years from 1985 to 2050
  const graduationYears = Array.from(
    { length: 2050 - 1985 + 1 }, 
    (_, i) => (1985 + i).toString()
  );

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

      // Get user's display name from auth metadata or email
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || '';

      await updateProfile({
        full_name: fullName,
        email: user.email,
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
      console.error('Error completing onboarding:', error);
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter your location (e.g., San Francisco, CA)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="degree_certification">Education Level</Label>
              <Select 
                value={formData.degree_certification} 
                onValueChange={(value) => setFormData({ ...formData, degree_certification: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fields_of_study">Field of Study</Label>
              <Select 
                value={formData.fields_of_study} 
                onValueChange={(value) => setFormData({ ...formData, fields_of_study: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your field of study" />
                </SelectTrigger>
                <SelectContent>
                  {fieldsOfStudy.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Select 
                value={formData.graduation_year} 
                onValueChange={(value) => setFormData({ ...formData, graduation_year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYears.reverse().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hard_skills">Technical Skills</Label>
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
      case 3:
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
        <p className="text-slate-600 mt-2">Let's complete your profile to provide personalized career guidance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of {totalSteps}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Educational Background"}
            {currentStep === 2 && "Skills & Experience"}
            {currentStep === 3 && "All set!"}
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
              {currentStep === totalSteps ? "Complete Onboarding" : "Next"}
              {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingQuestionnaire;
