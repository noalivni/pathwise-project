
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase } from "lucide-react";

interface SkillsExperienceData {
  hard_skills: string[];
  career_history: string;
}

interface SkillsExperienceSectionProps {
  isEditing: boolean;
  formData: SkillsExperienceData;
  onFormDataChange: (data: Partial<SkillsExperienceData>) => void;
  onSkillsChange: (skillsString: string) => void;
}

const SkillsExperienceSection = ({ isEditing, formData, onFormDataChange, onSkillsChange }: SkillsExperienceSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-pathwise-text">
          <Award className="mr-2 h-5 w-5 text-green-600" />
          Skills & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="hard_skills" className="text-gray-400">Technical Skills</Label>
          {isEditing ? (
            <Textarea
              id="hard_skills"
              placeholder="Enter skills separated by commas"
              value={formData.hard_skills.join(', ')}
              onChange={(e) => onSkillsChange(e.target.value)}
              className="text-pathwise-text-muted"
            />
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hard_skills && formData.hard_skills.length > 0 ? (
                formData.hard_skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-pathwise-text-secondary">No skills added yet</p>
              )}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="career_history" className="flex items-center text-gray-400">
            <Briefcase className="w-4 h-4 mr-1" />
            Career History
          </Label>
          {isEditing ? (
            <Textarea
              id="career_history"
              value={formData.career_history}
              onChange={(e) => onFormDataChange({ career_history: e.target.value })}
              className="text-pathwise-text-muted"
            />
          ) : (
            <p className="text-pathwise-text-muted mt-1">{formData.career_history || 'Not provided'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsExperienceSection;
