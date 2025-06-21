
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { EDUCATION_LEVELS, FIELDS_OF_STUDY, GRADUATION_YEARS } from "@/data/onboardingData";
import type { OnboardingFormData } from "@/types/onboarding";

interface EducationStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const EducationStep = ({ formData, updateFormData }: EducationStepProps) => {
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
          <Select 
            value={formData.degree_certification} 
            onValueChange={(value) => updateFormData({ degree_certification: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fields_of_study">Field of Study</Label>
          <Select 
            value={formData.fields_of_study} 
            onValueChange={(value) => updateFormData({ fields_of_study: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field of study" />
            </SelectTrigger>
            <SelectContent>
              {FIELDS_OF_STUDY.map((field) => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="graduation_year">Graduation Year</Label>
          <Select 
            value={formData.graduation_year} 
            onValueChange={(value) => updateFormData({ graduation_year: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select graduation year" />
            </SelectTrigger>
            <SelectContent>
              {GRADUATION_YEARS.reverse().map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationStep;
