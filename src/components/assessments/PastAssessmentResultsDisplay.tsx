
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSkillLevel as getHardSkillLevel } from "@/utils/hardSkillsUtils";
import { getSkillLevel as getSoftSkillLevel } from "@/utils/skillLevelUtils";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PastAssessmentResultsDisplayProps {
  skillRatings: { [key: string]: number };
  assessmentType: 'hard_skills' | 'soft_skills';
  relevantSkills: Array<{ name: string; category?: string; icon?: string }>;
}

const PastAssessmentResultsDisplay = ({
  skillRatings,
  assessmentType,
  relevantSkills
}: PastAssessmentResultsDisplayProps) => {
  const { user } = useAuth();
  const [personalizedAdvice, setPersonalizedAdvice] = useState<string>("");

  useEffect(() => {
    const fetchPersonalizedAdvice = async () => {
      if (!user || assessmentType !== 'hard_skills') return;

      try {
        const { data: assessments } = await supabase
          .from('skills_assessments')
          .select('personality_traits')
          .eq('user_id', user.id)
          .eq('assessment_type', 'soft_skills')
          .order('completed_at', { ascending: false })
          .limit(1);

        if (assessments && assessments.length > 0 && assessments[0].personality_traits) {
          const traits = assessments[0].personality_traits as any;
          if (traits.advice) {
            setPersonalizedAdvice(traits.advice);
          }
        }
      } catch (error) {
        console.error('Error fetching personalized advice:', error);
      }
    };

    fetchPersonalizedAdvice();
  }, [user, assessmentType]);

  const getSkillInfo = (rating: number) => {
    return assessmentType === 'hard_skills' 
      ? getHardSkillLevel(rating) 
      : getSoftSkillLevel(rating);
  };

  const formatSkillName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getMaxRating = () => {
    return assessmentType === 'hard_skills' ? 4 : 4; // Both use 0-4 scale now
  };

  return (
    <div className="space-y-6">
      {/* Personalized Advice for Hard Skills */}
      {assessmentType === 'hard_skills' && personalizedAdvice && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Your Personalized Career Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-300">{personalizedAdvice}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relevantSkills.map((skill, index) => {
          const rating = skillRatings[skill.name] || 0;
          const skillInfo = getSkillInfo(rating);
          const maxRating = getMaxRating();
          const formattedName = formatSkillName(skill.name);
          
          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center">
                    {skill.icon && <span className="text-2xl mr-2">{skill.icon}</span>}
                    <div>
                      <span className="text-foreground">{formattedName}</span>
                      {skill.category && <p className="text-sm text-muted-foreground font-normal">{skill.category}</p>}
                    </div>
                  </div>
                  <Badge className={`${skillInfo.color} text-white`}>
                    {skillInfo.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {skillInfo.level}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ({rating}/{maxRating})
                    </div>
                  </div>
                  <Progress value={(rating / maxRating) * 100} className="mb-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PastAssessmentResultsDisplay;
