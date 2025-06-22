
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

interface EducationData {
  degree_certification: string;
  fields_of_study: string;
  graduation_year: string;
}

interface EducationSectionProps {
  isEditing: boolean;
  formData: EducationData;
  onFormDataChange: (data: Partial<EducationData>) => void;
}

const EducationSection = ({ isEditing, formData, onFormDataChange }: EducationSectionProps) => {
  const educationLevels = ["High School", "Bachelor's", "Master's", "PhD"];
  const fieldsOfStudy = [
    "Computer Science", "Business Administration", "Engineering", "Marketing",
    "Finance", "Psychology", "Design", "Data Science", "Healthcare", "Education", "Other"
  ];
  const graduationYears = Array.from({ length: 2050 - 1985 + 1 }, (_, i) => (1985 + i).toString());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-pathwise-text">
          <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
          Educational Background
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="degree_certification" className="text-gray-400">Education Level</Label>
            {isEditing ? (
              <Select value={formData.degree_certification} onValueChange={(value) => onFormDataChange({ degree_certification: value })}>
                <SelectTrigger className="text-pathwise-text-muted">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-pathwise-text-muted mt-1">{formData.degree_certification || 'Not provided'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="fields_of_study" className="text-gray-400">Field of Study</Label>
            {isEditing ? (
              <Select value={formData.fields_of_study} onValueChange={(value) => onFormDataChange({ fields_of_study: value })}>
                <SelectTrigger className="text-pathwise-text-muted">
                  <SelectValue placeholder="Select field of study" />
                </SelectTrigger>
                <SelectContent>
                  {fieldsOfStudy.map((field) => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-pathwise-text-muted mt-1">{formData.fields_of_study || 'Not provided'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="graduation_year" className="text-gray-400">Graduation Year</Label>
            {isEditing ? (
              <Select value={formData.graduation_year} onValueChange={(value) => onFormDataChange({ graduation_year: value })}>
                <SelectTrigger className="text-pathwise-text-muted">
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYears.reverse().map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-pathwise-text-muted mt-1">{formData.graduation_year || 'Not provided'}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationSection;
