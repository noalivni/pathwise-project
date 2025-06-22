
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight, Home, RotateCcw } from "lucide-react";
import { getSkillLevel, getRecommendations, getActionableInsights } from "@/utils/hardSkillsUtils";

interface AssessmentResultsProps {
  skillRatings: { [key: string]: number };
  relevantSkills: Array<{ name: string; category: string }>;
  fieldOfInterest: string;
  onRetake: () => void;
  onViewJobs: () => void;
  onReturnToHub: () => void;
}

const AssessmentResults = ({
  skillRatings,
  relevantSkills,
  fieldOfInterest,
  onRetake,
  onViewJobs,
  onReturnToHub
}: AssessmentResultsProps) => {
  const recommendations = getRecommendations(skillRatings);
  const actionableInsights = getActionableInsights(skillRatings, fieldOfInterest);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Hard Skills Assessment Results</h1>
        <p className="text-muted-foreground mt-2">
          Your technical skill proficiency for {fieldOfInterest || 'General'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relevantSkills.map((skill, index) => {
          const rating = skillRatings[skill.name] || 0;
          const skillInfo = getSkillLevel(rating);
          
          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div>
                    <span className="text-foreground">{skill.name}</span>
                    <p className="text-sm text-muted-foreground font-normal">{skill.category}</p>
                  </div>
                  <Badge className={`${skillInfo.color} text-white`}>
                    {skillInfo.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(rating / 5) * 100} className="mb-2" />
                <p className="text-sm text-muted-foreground">Rating: {rating}/5</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Target className="mr-2 h-5 w-5 text-teal-600" />
            Personalized Career Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.strengths.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Your Technical Strengths</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {recommendations.strengths.map((skill, index) => (
                  <Badge key={index} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                These skills make you competitive for senior-level positions and specialized roles.
              </p>
            </div>
          )}
          
          {recommendations.improvements.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Skills to Develop</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {recommendations.improvements.map((skill, index) => (
                  <Badge key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Improving these skills will unlock new career opportunities and higher-level positions.
              </p>
            </div>
          )}

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Actionable Next Steps</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              {actionableInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetake} variant="outline" className="flex items-center border-border text-foreground hover:bg-accent">
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Assessment
        </Button>
        <Button onClick={onReturnToHub} variant="outline" className="flex items-center border-border text-foreground hover:bg-accent">
          <Home className="mr-2 h-4 w-4" />
          Skills Assessment Home
        </Button>
        <Button 
          onClick={onViewJobs}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
        >
          View Job Recommendations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResults;
