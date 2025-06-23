
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
            <Slider
              value={[currentRating]}
              onValueChange={onRatingChange}
              max={5}
              min={0}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>No Experience</span>
              <span>Beginner</span>
              <span>Basic</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
            
            <div className="text-center">
              <Badge className={`${getSkillLevel(currentRating).color} text-white text-lg px-4 py-2`}>
                {getSkillLevel(currentRating).level} ({currentRating}/5)
              </Badge>
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
