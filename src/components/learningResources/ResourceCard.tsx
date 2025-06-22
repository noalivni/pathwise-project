
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { LearningResource } from "@/types/learningResources";
import { getResourceIcon, getResourceColor } from "@/utils/learningResourcesUtils.tsx";

interface ResourceCardProps {
  resource: LearningResource;
  onResourceClick: (resource: LearningResource) => void;
}

const ResourceCard = ({ resource, onResourceClick }: ResourceCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getResourceColor(resource.resource_type)} text-white`}>
              {getResourceIcon(resource.resource_type)}
            </div>
            <Badge variant="secondary" className="capitalize">
              {resource.resource_type}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg text-main">{resource.title}</CardTitle>
        <CardDescription className="text-sub">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {resource.related_skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        {resource.related_job_roles.length > 0 && (
          <div>
            <p className="text-xs text-sub mb-1">Relevant for:</p>
            <div className="flex flex-wrap gap-1">
              {resource.related_job_roles.map((role, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Button
          onClick={() => onResourceClick(resource)}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Access Resource
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
