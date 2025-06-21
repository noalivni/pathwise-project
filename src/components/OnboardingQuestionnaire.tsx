
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { User, GraduationCap, Award, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface OnboardingQuestionnairProps {
  onComplete: () => void;
}

const OnboardingQuestionnaire = ({ onComplete }: OnboardingQuestionnairProps) => {
  const { updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    field_of_interest: "",
    hard_skills: "",
    career_history: ""
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const educationLevels = ["High School", "Bachelor's", "Master's", "PhD"];
  const fieldsOfStudy = [
    "Computer Science", "Business Administration", "Engineering", "Marketing",
    "Finance", "Psychology", "Design", "Data Science", "Healthcare", "Education", "Other"
  ];
  const graduationYears = Array.from({ length: 2050 - 1985 + 1 }, (_, i) => (1985 + i).toString());
  
  const careerFields = [
    "UX/UI Design", "Data Analytics", "Marketing", "Product Management", 
    "Human Resources", "Software Development", "Finance", "Sales", 
    "Operations", "Content Creation", "Consulting", "Healthcare", "Education"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
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
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-teal-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                Educational Background
              </CardTitle>
              <CardDescription>Your educational qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="degree_certification">Education Level</Label>
                <Select value={formData.degree_certification} onValueChange={(value) => setFormData({ ...formData, degree_certification: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fields_of_study">Field of Study</Label>
                <Select value={formData.fields_of_study} onValueChange={(value) => setFormData({ ...formData, fields_of_study: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldsOfStudy.map((field) => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Select value={formData.graduation_year} onValueChange={(value) => setFormData({ ...formData, graduation_year: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select graduation year" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduationYears.reverse().map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-green-600" />
                Career Goals
              </CardTitle>
              <CardDescription>What field are you looking to pursue?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="field_of_interest">Field of Interest</Label>
                <Select value={formData.field_of_interest} onValueChange={(value) => setFormData({ ...formData, field_of_interest: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your career field of interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerFields.map((field) => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hard_skills">Technical Skills</Label>
                <Textarea
                  id="hard_skills"
                  value={formData.hard_skills}
                  onChange={(e) => setFormData({ ...formData, hard_skills: e.target.value })}
                  placeholder="List your technical skills (comma separated)"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-purple-600" />
                Experience & Background
              </CardTitle>
              <CardDescription>Tell us about your career history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="career_history">Career History</Label>
                <Textarea
                  id="career_history"
                  value={formData.career_history}
                  onChange={(e) => setFormData({ ...formData, career_history: e.target.value })}
                  placeholder="Describe your work experience, internships, or relevant projects"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        );

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
          <span>Step {currentStep} of {totalSteps}</span>
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
          {currentStep === totalSteps ? 'Complete Profile' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
