
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Wrench, ArrowRight } from "lucide-react";
import { getSkillLevel } from "@/utils/hardSkillsUtils";

interface SkillQuestionProps {
  currentSkill: number;
  totalSkills: number;
  skillData: { name: string; category: string };
  currentRating: number;
  onRatingChange: (value: number[]) => void;
  onNext: () => void;
  onSkip: () => void;
  isLastSkill: boolean;
}

const SkillQuestion = ({
  currentSkill,
  totalSkills,
  skillData,
  currentRating,
  onRatingChange,
  onNext,
  onSkip,
  isLastSkill
}: SkillQuestionProps) => {
  const progress = ((currentSkill + 1) / totalSkills) * 100;
  const skillInfo = getSkillLevel(currentRating);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-foreground">
            <Wrench className="mr-2 h-5 w-5 text-primary" />
            Skill {currentSkill + 1} of {totalSkills}
          </CardTitle>
          <Badge variant="outline" className="border-border text-muted-foreground">
            {skillData.category}
          </Badge>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2 text-foreground">{skillData.name}</h3>
          <p className="text-muted-foreground mb-6">How would you rate your skill level?</p>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {skillInfo.level}
              </div>
              <div className="text-sm text-muted-foreground">
                ({currentRating}/4)
              </div>
            </div>
            
            <Slider
              value={[currentRating]}
              onValueChange={onRatingChange}
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
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onSkip} className="border-border text-foreground hover:bg-accent">
            Skip This Skill
          </Button>
          <Button 
            onClick={onNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLastSkill ? 'Complete Assessment' : 'Next Skill'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillQuestion;
