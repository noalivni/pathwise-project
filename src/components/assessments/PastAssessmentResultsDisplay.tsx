
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSkillLevel as getHardSkillLevel } from "@/utils/hardSkillsUtils";
import { getSkillLevel as getSoftSkillLevel } from "@/utils/skillLevelUtils";

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
  const getSkillInfo = (rating: number) => {
    return assessmentType === 'hard_skills' 
      ? getHardSkillLevel(rating) 
      : getSoftSkillLevel(rating);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relevantSkills.map((skill, index) => {
        const rating = skillRatings[skill.name] || 0;
        const skillInfo = getSkillInfo(rating);
        
        return (
          <Card key={index} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center">
                  {skill.icon && <span className="text-2xl mr-2">{skill.icon}</span>}
                  <div>
                    <span className="text-foreground">{skill.name}</span>
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
                    ({rating}/4)
                  </div>
                </div>
                <Progress value={(rating / 4) * 100} className="mb-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PastAssessmentResultsDisplay;
