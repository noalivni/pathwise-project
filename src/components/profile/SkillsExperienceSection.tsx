
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Award, Briefcase, Edit3, Save, X } from "lucide-react";
import { useState } from "react";
import { getSkillLevel } from "@/utils/hardSkillsUtils";

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
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [skillRating, setSkillRating] = useState(2);

  const handleSkillEdit = (skillName: string) => {
    setEditingSkill(skillName);
    // You could fetch the current rating from assessment data here
    setSkillRating(2);
  };

  const handleSkillSave = () => {
    // Here you would save the skill rating to Supabase
    console.log(`Saving skill: ${editingSkill} with rating: ${skillRating}`);
    setEditingSkill(null);
  };

  const skillInfo = getSkillLevel(skillRating);

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
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="cursor-pointer" onClick={() => handleSkillEdit(skill)}>
                      {skill}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSkillEdit(skill)}
                      className="p-1 h-6 w-6"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-pathwise-text-secondary">No skills added yet</p>
              )}
            </div>
          )}
          
          {editingSkill && (
            <Card className="mt-4 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Edit {editingSkill}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSkill(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {skillInfo.level}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    ({skillRating}/4)
                  </div>
                </div>
                
                <Slider
                  value={[skillRating]}
                  onValueChange={(value) => setSkillRating(value[0])}
                  max={4}
                  min={0}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not familiar</span>
                  <span>Basic</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
                
                <Button onClick={handleSkillSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Rating
                </Button>
              </div>
            </Card>
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
