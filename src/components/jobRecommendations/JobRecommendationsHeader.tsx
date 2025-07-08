
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobRecommendationsHeaderProps {
  fieldOfInterest?: string;
  hasSkillsAssessment?: boolean;
}

const JobRecommendationsHeader = ({ fieldOfInterest, hasSkillsAssessment = false }: JobRecommendationsHeaderProps) => {
  const handleSkillsAssessmentClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-assessment'));
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pathwise-text">
          Career Recommendations
        </h1>
        <p className="text-pathwise-text-muted mt-2">
          {fieldOfInterest 
            ? `Discover career opportunities in ${fieldOfInterest} tailored to your profile`
            : "Discover career opportunities tailored to your profile"
          }
        </p>
      </div>

      {!hasSkillsAssessment && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <div className="flex items-center justify-between">
              <span>
                Match percentages are estimates based on your profile. Complete a skills assessment for more accurate recommendations.
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSkillsAssessmentClick}
                className="ml-4 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
              >
                Take Skills Assessment
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default JobRecommendationsHeader;
