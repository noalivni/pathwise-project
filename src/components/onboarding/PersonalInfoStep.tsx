
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import type { OnboardingFormData } from "@/types/onboarding";

interface PersonalInfoStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const PersonalInfoStep = ({ formData, updateFormData }: PersonalInfoStepProps) => {
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
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="City, Country"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoStep;
