
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowRight } from "lucide-react";
import { SoftSkill, SkillRatings } from "@/types/softSkills";
import { getSkillLevel } from "@/utils/skillLevelUtils";

interface SkillAssessmentFormProps {
  currentSkill: number;
  softSkills: SoftSkill[];
  skillRatings: SkillRatings;
  onRatingChange: (value: number[]) => void;
  onNext: () => void;
  onSkip: () => void;
}

const SkillAssessmentForm = ({
  currentSkill,
  softSkills,
  skillRatings,
  onRatingChange,
  onNext,
  onSkip
}: SkillAssessmentFormProps) => {
  const progress = ((currentSkill + 1) / softSkills.length) * 100;
  const currentSkillData = softSkills[currentSkill];
  const currentRating = skillRatings[currentSkillData.name] || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-pathwise-text">Soft Skills Assessment</h1>
        <p className="text-pathwise-text-muted mt-2">Rate your interpersonal and personal effectiveness skills</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-pathwise-text">
              <Heart className="mr-2 h-5 w-5 text-pink-600" />
              Skill {currentSkill + 1} of {softSkills.length}
            </CardTitle>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-3">{currentSkillData.icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-pathwise-text">{currentSkillData.name}</h3>
            <p className="text-pathwise-text-muted mb-6">{currentSkillData.description}</p>
            
            <div className="space-y-4">
              <Slider
                value={[currentRating]}
                onValueChange={onRatingChange}
                max={5}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-sm text-pathwise-text-secondary">
                <span>Not Me</span>
                <span>Somewhat</span>
                <span>Moderately</span>
                <span>Quite Me</span>
                <span>Very Much Me</span>
              </div>
              
              <div className="text-center">
                <Badge className={`${getSkillLevel(currentRating).color} text-white text-lg px-4 py-2`}>
                  {getSkillLevel(currentRating).level} ({currentRating}/5)
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onSkip}>
              Skip This Skill
            </Button>
            <Button 
              onClick={onNext}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {currentSkill === softSkills.length - 1 ? 'Complete Assessment' : 'Next Skill'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillAssessmentForm;
