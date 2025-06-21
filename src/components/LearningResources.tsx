import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Search, Filter, Play, FileText, Globe, Crown, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  related_skills: string[];
  related_job_roles: string[];
}

const LearningResources = () => {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const isPro = profile?.subscription_status === 'premium';

  useEffect(() => {
    if (user) {
      if (isPro) {
        fetchLearningResources();
      } else {
        setLoading(false);
      }
    }
  }, [user, isPro]);

  const fetchLearningResources = async () => {
    if (!user) return;

    try {
      // Get user's top job recommendations to personalize resources
      const { data: jobMatches } = await supabase
        .from('user_job_matches')
        .select(`
          job_role_id,
          match_percentage,
          job_roles (
            job_title,
            required_skills
          )
        `)
        .eq('user_id', user.id)
        .order('match_percentage', { ascending: false })
        .limit(3);

      // Get all learning resources
      const { data: allResources, error } = await supabase
        .from('learning_resources')
        .select('*');

      if (error) throw error;

      // Sort resources by relevance to user's top job matches
      const topJobTitles = jobMatches?.map(match => match.job_roles.job_title) || [];
      const topSkills = jobMatches?.flatMap(match => match.job_roles.required_skills || []) || [];

      const sortedResources = allResources?.sort((a, b) => {
        const aRelevance = calculateRelevance(a, topJobTitles, topSkills);
        const bRelevance = calculateRelevance(b, topJobTitles, topSkills);
        return bRelevance - aRelevance;
      }) || [];

      setResources(sortedResources);
    } catch (error) {
      console.error('Error fetching learning resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRelevance = (resource: LearningResource, jobTitles: string[], skills: string[]) => {
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

  const getResourceIcon = (type: string) => {
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

  const getResourceColor = (type: string) => {
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

  const handleResourceClick = async (resource: LearningResource) => {
    if (!user) return;

    try {
      // Log the activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'resource_accessed',
          activity_description: `Accessed learning resource: ${resource.title}`
        });

      // Open resource in new tab
      window.open(resource.url, '_blank');
    } catch (error) {
      console.error('Error logging resource access:', error);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.related_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || resource.resource_type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const resourceTypes = ['all', ...Array.from(new Set(resources.map(r => r.resource_type)))];

  if (!isPro) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Lock className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Pro Feature
            </CardTitle>
            <CardDescription>
              Learning Resources are available for Pro subscribers only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Upgrade to Pro to access personalized learning materials, courses, and resources tailored to your career goals.
            </p>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Learning Resources</h1>
          <p className="text-slate-600 mt-2">Personalized learning materials based on your career goals</p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Pro Feature
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources, skills, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {resourceTypes.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
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
                  <p className="text-xs text-slate-500 mb-1">Relevant for:</p>
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
                onClick={() => handleResourceClick(resource)}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Access Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No resources found</h3>
          <p className="text-slate-500">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default LearningResources;
