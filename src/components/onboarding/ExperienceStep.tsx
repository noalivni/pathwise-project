
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award } from "lucide-react";
import type { OnboardingFormData } from "@/types/onboarding";

interface ExperienceStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const ExperienceStep = ({ formData, updateFormData }: ExperienceStepProps) => {
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
            onChange={(e) => updateFormData({ career_history: e.target.value })}
            placeholder="Describe your work experience, internships, or relevant projects"
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceStep;
