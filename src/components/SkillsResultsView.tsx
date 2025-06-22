import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, ArrowRight, Users, Brain, Lightbulb, Home, RotateCcw } from "lucide-react";
import { SoftSkill, SkillRatings, PersonalityProfile } from "@/types/softSkills";
import { getSkillLevel } from "@/utils/skillLevelUtils";

interface SkillsResultsViewProps {
  skillRatings: SkillRatings;
  softSkills: SoftSkill[];
  personalityProfile: PersonalityProfile;
  detailedFeedback: string[];
  onRetake: () => void;
  onViewJobs: () => void;
  onReturnToHub?: () => void;
}

const SkillsResultsView = ({
  skillRatings,
  softSkills,
  personalityProfile,
  detailedFeedback,
  onRetake,
  onViewJobs,
  onReturnToHub
}: SkillsResultsViewProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pathwise-text">Your Soft Skills Profile</h1>
        <p className="text-pathwise-text-muted mt-2">Personalized insights about your work style and career fit</p>
      </div>

      {/* Personality Profile Card */}
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-pink-800 text-xl">
            <Heart className="mr-3 h-6 w-6" />
            Your Profile: {personalityProfile.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-2 flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Ideal Work Environment
            </h4>
            <p className="text-pink-700">{personalityProfile.environment}</p>
          </div>
          
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-2 flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Recommended Career Paths
            </h4>
            <div className="flex flex-wrap gap-2">
              {personalityProfile.careerSuggestions.map((suggestion, index) => (
                <Badge key={index} className="bg-pink-100 text-pink-800 border-pink-200">
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-semibold text-pink-800 mb-2 flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              Your Top Strengths
            </h4>
            <div className="flex flex-wrap gap-2">
              {personalityProfile.topStrengths.map((strength, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
            Personalized Career Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedFeedback.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-700">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {softSkills.map((skill, index) => {
          const rating = skillRatings[skill.name] || 0;
          const skillInfo = getSkillLevel(rating);
          
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base text-pathwise-text">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{skill.icon}</span>
                    <span>{skill.name}</span>
                  </div>
                  <Badge className={`${skillInfo.color} text-white`}>
                    {skillInfo.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(rating / 5) * 100} className="mb-2" />
                <p className="text-sm text-pathwise-text-secondary">Rating: {rating}/5</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetake} variant="outline" className="flex items-center">
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Assessment
        </Button>
        {onReturnToHub && (
          <Button onClick={onReturnToHub} variant="outline" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Skills Assessment Home
          </Button>
        )}
        <Button 
          onClick={onViewJobs}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          View Job Recommendations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SkillsResultsView;
