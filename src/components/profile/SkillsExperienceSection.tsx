
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const { user } = useAuth();
  const [assessmentSkills, setAssessmentSkills] = useState<{ skill: string; rating: number; level: string; color: string }[]>([]);

  useEffect(() => {
    const fetchAssessmentSkills = async () => {
      if (!user) return;

      try {
        const { data: assessments } = await supabase
          .from('skills_assessments')
          .select('technical_skills')
          .eq('user_id', user.id)
          .eq('assessment_type', 'hard_skills')
          .order('completed_at', { ascending: false })
          .limit(1);

        if (assessments && assessments.length > 0 && assessments[0].technical_skills) {
          const technicalSkills = assessments[0].technical_skills;
          if (typeof technicalSkills === 'object' && technicalSkills !== null && !Array.isArray(technicalSkills)) {
            const filteredSkills = Object.entries(technicalSkills)
              .filter(([_, rating]) => (rating as number) >= 2) // Only show Intermediate (2), Advanced (3), Expert (4)
              .map(([skill, rating]) => {
                const skillInfo = getSkillLevel(rating as number);
                return {
                  skill,
                  rating: rating as number,
                  level: skillInfo.level,
                  color: skillInfo.color
                };
              });
            setAssessmentSkills(filteredSkills);
          }
        }
      } catch (error) {
        console.error('Error fetching assessment skills:', error);
      }
    };

    fetchAssessmentSkills();
  }, [user]);

  const formatSkillName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Merge manual skills and assessment skills, avoiding duplicates
  const getMergedSkills = () => {
    const manualSkills = formData.hard_skills || [];
    const assessmentSkillNames = assessmentSkills.map(s => s.skill.toLowerCase().replace(/_/g, ' '));
    
    // Create a combined list avoiding duplicates
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

  // Get assessment data for a skill to show rating
  const getAssessmentDataForSkill = (skillName: string) => {
    return assessmentSkills.find(assessmentSkill => {
      const formattedAssessmentSkill = formatSkillName(assessmentSkill.skill);
      return formattedAssessmentSkill.toLowerCase() === skillName.toLowerCase();
    });
  };

  const mergedSkills = getMergedSkills();

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
              value={mergedSkills.join(', ')}
              onChange={(e) => onSkillsChange(e.target.value)}
              className="text-pathwise-text-muted"
            />
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {mergedSkills.length > 0 ? (
                mergedSkills.map((skill, index) => {
                  const assessmentData = getAssessmentDataForSkill(skill);
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <Badge 
                        variant="outline" 
                        className={assessmentData ? `${assessmentData.color} text-white` : 'bg-blue-100 text-blue-800 border-blue-200'}
                      >
                        {skill}
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
