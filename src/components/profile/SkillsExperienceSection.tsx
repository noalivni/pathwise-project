
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase, X } from "lucide-react";
import { useState } from "react";

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
  const [skillInput, setSkillInput] = useState('');
  
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

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkills = [...formData.hard_skills, skillInput.trim()];
      onSkillsChange(newSkills.join(', '));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = formData.hard_skills.filter(skill => skill !== skillToRemove);
    onSkillsChange(updatedSkills.join(', '));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

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
              {/* Manual Skills - Editable */}
              <div>
                <Label className="text-sm text-pathwise-text-muted mb-2 block">Manual Skills (Editable)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hard_skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a skill and press Enter or comma"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Assessment Skills - Read-only */}
              {assessmentSkills.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm text-pathwise-text-muted mb-2 block">Skills from Hard Skills Assessment (Read-only)</Label>
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
