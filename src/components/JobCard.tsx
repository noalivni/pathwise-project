
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Target, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { CareerRole } from "@/types/jobRecommendations";
import { getMatchColor, getMatchDescription } from "@/utils/careerMatching";
import { parseSkillsFromText } from "@/utils/skillsParsing";

interface JobCardProps {
  role: {
    id: string;
    job_title: string;
    job_description: string;
    category: string;
    required_skills: string[];
    match_percentage?: number;
    is_bookmarked?: boolean;
  };
  onBookmark: (roleId: string) => void;
  skillFitTags?: string[];
  hasSkillsAssessment?: boolean;
}

const JobCard = ({ role, onBookmark, skillFitTags = [], hasSkillsAssessment = false }: JobCardProps) => {
  const handleSkillsAssessmentClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-assessment'));
  };

  return (
    <Card className="card-hover transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl text-main">{role.job_title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={`${getMatchColor(role.match_percentage || 0)} text-white`}>
                  {role.match_percentage || 0}% Match
                </Badge>
                {!hasSkillsAssessment && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" title="Match estimate - complete skills assessment for accuracy" />
                )}
              </div>
            </div>
            <CardDescription className="text-lg font-medium text-sub mb-2">
              {role.category}
            </CardDescription>
            <p className="text-sm text-sub">
              {getMatchDescription(role.match_percentage || 0)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(role.id)}
            className="flex items-center gap-1 hover:bg-accent"
          >
            <Bookmark className={`h-4 w-4 ${role.is_bookmarked ? 'fill-current text-teal-600' : 'text-sub'}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sub">{role.job_description}</p>
        
        {!hasSkillsAssessment && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800 dark:text-yellow-200">
                  Complete a skills assessment for more accurate matching
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSkillsAssessmentClick}
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
              >
                Take Assessment
              </Button>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-semibold text-main mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {role.required_skills.map((skill, index) => {
              const isSkillFit = skillFitTags.includes(skill.toLowerCase());
              return (
                <Badge 
                  key={index} 
                  variant={isSkillFit ? "default" : "secondary"}
                  className={isSkillFit ? "bg-green-100 text-green-800 border-green-300" : ""}
                >
                  {isSkillFit && <CheckCircle className="w-3 h-3 mr-1" />}
                  {skill}
                </Badge>
              );
            })}
          </div>
        </div>

        {skillFitTags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-2">Your Skill Matches:</h4>
            <div className="flex flex-wrap gap-2">
              {skillFitTags.slice(0, 3).map((skill, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-sub">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Career Path
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {role.match_percentage && role.match_percentage >= 65 ? 'Recommended' : 'Explore Further'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
