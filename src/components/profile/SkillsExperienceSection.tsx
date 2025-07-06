
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase } from "lucide-react";

interface SkillsExperienceData {
  hard_skills: string[];
  career_history: string;
}

interface AssessmentSkill {
  skill: string;
  rating: number;
  level: string;
  color: string;
}

interface SkillsExperienceSectionProps {
  isEditing: boolean;
  formData: SkillsExperienceData;
  assessmentSkills: AssessmentSkill[];
  onFormDataChange: (data: Partial<SkillsExperienceData>) => void;
  onSkillsChange: (skillsString: string) => void;
}

const SkillsExperienceSection = ({ 
  isEditing, 
  formData, 
  assessmentSkills, 
  onFormDataChange, 
  onSkillsChange 
}: SkillsExperienceSectionProps) => {
  
  const formatSkillName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get assessment data for a skill to show rating
  const getAssessmentDataForSkill = (skillName: string) => {
    return assessmentSkills.find(assessmentSkill => {
      const formattedAssessmentSkill = formatSkillName(assessmentSkill.skill);
      return formattedAssessmentSkill.toLowerCase() === skillName.toLowerCase();
    });
  };

  // Create a merged display list without duplicates
  const getMergedSkillsForDisplay = () => {
    const manualSkills = formData.hard_skills || [];
    const allSkills = [...manualSkills];
    
    assessmentSkills.forEach(assessmentSkill => {
      const formattedAssessmentSkill = formatSkillName(assessmentSkill.skill);
      const isAlreadyIncluded = manualSkills.some(manualSkill => 
        manualSkill.toLowerCase() === formattedAssessmentSkill.toLowerCase()
      );
      
      if (!isAlreadyIncluded) {
        allSkills.push(formattedAssessmentSkill);
      }
    });
    
    return allSkills;
  };

  const mergedSkills = getMergedSkillsForDisplay();

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
            <div className="space-y-2">
              <Textarea
                id="hard_skills"
                placeholder="Enter your manual skills separated by commas"
                value={formData.hard_skills.join(', ')} // Only show manual skills for editing
                onChange={(e) => onSkillsChange(e.target.value)}
                className="text-pathwise-text-muted"
              />
              {assessmentSkills.length > 0 && (
                <div className="text-sm text-pathwise-text-muted">
                  <p className="mb-2">Skills from your Hard Skills Assessment (read-only):</p>
                  <div className="flex flex-wrap gap-2">
                    {assessmentSkills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className={`${skill.color} text-white`}
                      >
                        {formatSkillName(skill.skill)} ({skill.rating}/4)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {mergedSkills.length > 0 ? (
                mergedSkills.map((skill, index) => {
                  const assessmentData = getAssessmentDataForSkill(skill);
                  const isManualSkill = formData.hard_skills.some(manualSkill => 
                    manualSkill.toLowerCase() === skill.toLowerCase()
                  );
                  
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <Badge 
                        variant="outline" 
                        className={assessmentData ? `${assessmentData.color} text-white` : 'bg-blue-100 text-blue-800 border-blue-200'}
                      >
                        {skill}
                        {isManualSkill && !assessmentData && (
                          <span className="ml-1 text-xs opacity-75">(Manual)</span>
                        )}
                      </Badge>
                      {assessmentData && (
                        <span className="text-xs text-muted-foreground">
                          ({assessmentData.rating}/4)
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-pathwise-text-secondary">No skills added yet. Add skills manually or complete a Hard Skills Assessment.</p>
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
