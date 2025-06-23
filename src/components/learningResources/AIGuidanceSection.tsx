
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp } from "lucide-react";

interface SkillRecommendation {
  skill: string;
  description: string;
  importance: string;
  careerBenefit: string;
}

interface AIGuidanceData {
  jobExplanation: string;
  skillRecommendations: SkillRecommendation[];
}

interface AIGuidanceSectionProps {
  guidanceData: AIGuidanceData | null;
  loading: boolean;
}

const AIGuidanceSection = ({ guidanceData, loading }: AIGuidanceSectionProps) => {
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
            <Brain className="mr-2 h-5 w-5" />
            AI Career Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
            <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-blue-200 dark:bg-blue-700 rounded"></div>
              <div className="h-3 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!guidanceData) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
          <Brain className="mr-2 h-5 w-5" />
          AI Career Guidance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Match Explanation */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Why These Jobs Match You
          </h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            {guidanceData.jobExplanation}
          </p>
        </div>

        {/* Skill Recommendations */}
        {guidanceData.skillRecommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Priority Skills to Develop
            </h4>
            <div className="space-y-3">
              {guidanceData.skillRecommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                      {recommendation.skill}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>What it is:</strong> {recommendation.description}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Why it matters:</strong> {recommendation.importance}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Career benefit:</strong> {recommendation.careerBenefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIGuidanceSection;
