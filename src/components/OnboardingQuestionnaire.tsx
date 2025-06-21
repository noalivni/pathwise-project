
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const OnboardingQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    interests: "",
    goals: "",
    timeline: "",
    skills: []
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Onboarding Complete!",
        description: "Your profile has been created successfully.",
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                  <SelectItem value="career-change">Career Changer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="interests">Career Interests</Label>
              <Textarea
                id="interests"
                placeholder="What type of work interests you? (e.g., technology, healthcare, finance)"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goals">Career Goals</Label>
              <Textarea
                id="goals"
                placeholder="What are your career goals for the next 2-3 years?"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="When are you looking to make a career move?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediately</SelectItem>
                  <SelectItem value="3months">Within 3 months</SelectItem>
                  <SelectItem value="6months">Within 6 months</SelectItem>
                  <SelectItem value="1year">Within 1 year</SelectItem>
                  <SelectItem value="exploring">Just exploring</SelectItem>
                </SelectContent>
              </Select>
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
            {currentStep === 1 && "Tell us about yourself"}
            {currentStep === 2 && "What interests you?"}
            {currentStep === 3 && "Your career aspirations"}
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
