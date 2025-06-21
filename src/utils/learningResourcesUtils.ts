
import { LearningResource } from "@/types/learningResources";
import { Play, BookOpen, FileText, Globe } from "lucide-react";

export const calculateRelevance = (resource: LearningResource, jobTitles: string[], skills: string[]) => {
  let relevance = 0;
  
  // Check job role relevance
  resource.related_job_roles.forEach(role => {
    if (jobTitles.some(title => title.toLowerCase().includes(role.toLowerCase()))) {
      relevance += 2;
    }
  });

  // Check skill relevance
  resource.related_skills.forEach(skill => {
    if (skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))) {
      relevance += 1;
    }
  });

  return relevance;
};

export const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video':
      return <Play className="h-5 w-5" />;
    case 'course':
      return <BookOpen className="h-5 w-5" />;
    case 'article':
      return <FileText className="h-5 w-5" />;
    default:
      return <Globe className="h-5 w-5" />;
  }
};

export const getResourceColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video':
      return 'bg-red-500';
    case 'course':
      return 'bg-blue-500';
    case 'article':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const filterResources = (resources: LearningResource[], searchTerm: string, selectedType: string) => {
  return resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.related_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || resource.resource_type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesType;
  });
};
