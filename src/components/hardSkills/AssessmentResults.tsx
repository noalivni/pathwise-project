
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";
import { getSkillLevel, getRecommendations } from "@/utils/hardSkillsUtils";

interface AssessmentResultsProps {
  skillRatings: { [key: string]: number };
  relevantSkills: Array<{ name: string; category: string }>;
  fieldOfInterest: string;
  onRetake: () => void;
  onViewJobs: () => void;
}

const AssessmentResults = ({
  skillRatings,
  relevantSkills,
  fieldOfInterest,
  onRetake,
  onViewJobs
}: AssessmentResultsProps) => {
  const recommendations = getRecommendations(skillRatings);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Hard Skills Assessment Results</h1>
        <p className="text-slate-600 mt-2">
          Your technical skill proficiency for {fieldOfInterest || 'General'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relevantSkills.map((skill, index) => {
          const rating = skillRatings[skill.name] || 0;
          const skillInfo = getSkillLevel(rating);
          
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div>
                    <span>{skill.name}</span>
                    <p className="text-sm text-slate-500 font-normal">{skill.category}</p>
                  </div>
                  <Badge className={`${skillInfo.color} text-white`}>
                    {skillInfo.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(rating / 5) * 100} className="mb-2" />
                <p className="text-sm text-slate-600">Rating: {rating}/5</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-teal-600" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.strengths.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Your Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.strengths.map((skill, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {recommendations.improvements.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Skills to Develop</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.improvements.map((skill, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-x-4">
        <Button onClick={onRetake} variant="outline">
          Retake Assessment
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
