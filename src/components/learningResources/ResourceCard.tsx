
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Target, Briefcase, Brain } from "lucide-react";
import { getResourceIcon, getResourceColor } from "@/utils/learningResourcesUtils.tsx";
import { formatAIContent } from "@/utils/aiContentFormatter";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string;
    url: string;
    resource_type: string;
    related_skills: string[];
    related_job_roles: string[];
    skillName?: string;
    aiExplanation?: string;
    jobTitle?: string;
    aiSummary?: string;
    resources?: Array<{
      title: string;
      description: string;
      url: string;
    }>;
  };
  onResourceClick: (resource: any) => void;
}

const ResourceCard = ({ resource, onResourceClick }: ResourceCardProps) => {
  const isSkillResource = resource.resource_type === 'skill_development';
  const isJobResource = resource.resource_type === 'career_exploration';
  const hasMultipleResources = resource.resources && resource.resources.length > 0;

  const handleResourceClick = (url: string, title: string) => {
    onResourceClick({ ...resource, url, title });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getResourceColor(resource.resource_type)} text-white`}>
              {isSkillResource ? <Target className="h-5 w-5" /> : 
               isJobResource ? <Briefcase className="h-5 w-5" /> : 
               getResourceIcon(resource.resource_type)}
            </div>
            <Badge variant="secondary" className="capitalize">
              {isSkillResource ? 'Skill Development' : 
               isJobResource ? 'Career Exploration' : 
               resource.resource_type.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        {/* Display skill or job name prominently */}
        {(resource.skillName || resource.jobTitle) && (
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-pathwise-text">
              {resource.skillName || resource.jobTitle}
            </h3>
          </div>
        )}
        
        <CardTitle className="text-base">{resource.title}</CardTitle>
        <CardDescription className="text-sm">{resource.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI-Generated Explanation/Summary */}
        {(resource.aiExplanation || resource.aiSummary) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Insight
              </span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed whitespace-pre-line">
              {formatAIContent(resource.aiExplanation || resource.aiSummary || '')}
            </div>
          </div>
        )}

        {/* Multiple Learning Resources */}
        {hasMultipleResources ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-pathwise-text">Learning Resources:</h4>
            {resource.resources!.map((res, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                <div>
                  <h5 className="font-medium text-sm text-pathwise-text line-clamp-2 leading-tight">
                    {res.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  onClick={() => handleResourceClick(res.url, res.title)}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Access Resource
                </Button>
              </div>
            ))}
          </div>
        ) : (
          /* Single Resource Button */
          resource.url && (
            <Button
              onClick={() => onResourceClick(resource)}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Access Resource
            </Button>
          )
        )}

        {/* Skills tags */}
        {resource.related_skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resource.related_skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
