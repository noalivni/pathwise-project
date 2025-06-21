
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";
import { CAREER_FIELDS } from "@/data/onboardingData";
import type { OnboardingFormData } from "@/types/onboarding";

interface CareerGoalsStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const CareerGoalsStep = ({ formData, updateFormData }: CareerGoalsStepProps) => {
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
          <Select 
            value={formData.field_of_interest} 
            onValueChange={(value) => updateFormData({ field_of_interest: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your career field of interest" />
            </SelectTrigger>
            <SelectContent>
              {CAREER_FIELDS.map((field) => (
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
            onChange={(e) => updateFormData({ hard_skills: e.target.value })}
            placeholder="List your technical skills (comma separated)"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerGoalsStep;
