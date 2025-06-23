
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, BookOpen, Video } from "lucide-react";

interface RealTimeLearningResource {
  title: string;
  description: string;
  url: string;
  resource_type: string;
  related_job_roles: string[];
  related_skills: string[];
  source: string;
}

interface RealTimeLearningProps {
  resources: RealTimeLearningResource[];
  loading: boolean;
}

const RealTimeLearningSection = ({ resources, loading }: RealTimeLearningProps) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'career_guide':
        return <BookOpen className="h-4 w-4" />;
      case 'skill_tutorial':
        return <Video className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'career_guide':
        return 'bg-green-500';
      case 'skill_tutorial':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800 dark:text-green-200">
            <Globe className="mr-2 h-5 w-5" />
            Real-Time Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="h-4 bg-green-200 dark:bg-green-700 rounded mb-2"></div>
                <div className="h-3 bg-green-200 dark:bg-green-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-green-200 dark:bg-green-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!resources.length) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800 dark:text-green-200">
            <Globe className="mr-2 h-5 w-5" />
            Real-Time Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 dark:text-green-300 text-center py-8">
            No real-time resources available at the moment. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 dark:text-green-200">
          <Globe className="mr-2 h-5 w-5" />
          Real-Time Learning Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${getResourceColor(resource.resource_type)} text-white flex-shrink-0`}>
                  {getResourceIcon(resource.resource_type)}
                </div>
                <Badge variant="secondary" className="ml-2 text-xs capitalize">
                  {resource.resource_type.replace('_', ' ')}
                </Badge>
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {resource.title}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                {resource.description}
              </p>
              
              {(resource.related_skills.length > 0 || resource.related_job_roles.length > 0) && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.related_skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {resource.related_job_roles.map((role, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              )}
              
              <Button
                onClick={() => window.open(resource.url, '_blank')}
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                View Resource
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeLearningSection;
