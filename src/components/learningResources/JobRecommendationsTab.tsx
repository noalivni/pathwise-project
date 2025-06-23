
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Briefcase, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface JobRecommendation {
  job_title: string;
  Short_description: string;
  Industry: string;
  Skills_required: string;
  match_percentage: number;
}

interface JobResource {
  title: string;
  description: string;
  url: string;
}

interface JobWithResources extends JobRecommendation {
  aiExplanation?: string;
  resources?: JobResource[];
}

const JobRecommendationsTab = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobWithResources[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJobRecommendations();
    }
  }, [user]);

  const fetchJobRecommendations = async () => {
    if (!user) return;

    try {
      // Get user's top 4 job recommendations
      const { data: jobMatches } = await supabase
        .from('user_job_matches')
        .select(`
          job_role_id,
          match_percentage,
          job_roles (
            job_title,
            Short_description,
            Industry,
            Skills_required
          )
        `)
        .eq('user_id', user.id)
        .order('match_percentage', { ascending: false })
        .limit(4);

      if (jobMatches) {
        const jobsWithDetails = jobMatches.map(match => ({
          job_title: match.job_roles?.job_title || '',
          Short_description: match.job_roles?.Short_description || '',
          Industry: match.job_roles?.Industry || '',
          Skills_required: match.job_roles?.Skills_required || '',
          match_percentage: match.match_percentage || 0
        }));

        // Fetch AI explanations and resources for each job
        const enhancedJobs = await Promise.all(
          jobsWithDetails.map(async (job) => {
            const [aiExplanation, resources] = await Promise.all([
              generateJobExplanation(job),
              fetchJobResources(job.job_title)
            ]);

            return {
              ...job,
              aiExplanation,
              resources
            };
          })
        );

        setJobs(enhancedJobs);
      }
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateJobExplanation = async (job: JobRecommendation) => {
    try {
      const response = await supabase.functions.invoke('generate-career-guidance', {
        body: {
          topJobRecommendations: [job],
          hardSkillsAssessment: {},
          fieldOfInterest: job.Industry,
          generateJobExplanation: true
        }
      });

      if (response.data?.jobExplanation) {
        return response.data.jobExplanation;
      }
    } catch (error) {
      console.error('Error generating job explanation:', error);
    }
    return `${job.job_title} is a role in the ${job.Industry} industry. ${job.Short_description}`;
  };

  const fetchJobResources = async (jobTitle: string) => {
    try {
      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles: [jobTitle],
          skills: [],
          maxResults: 3
        }
      });

      if (response.data?.resources) {
        return response.data.resources.slice(0, 3);
      }
    } catch (error) {
      console.error('Error fetching job resources:', error);
    }
    return [];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-pathwise-text-muted">
          Explore your top job recommendations with AI-generated insights and external resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {job.match_percentage}% Match
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl">{job.job_title}</CardTitle>
              <p className="text-sm text-pathwise-text-muted">{job.Industry}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* AI-Generated Explanation */}
              {job.aiExplanation && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      AI Insight
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {job.aiExplanation}
                  </p>
                </div>
              )}

              {/* External Resources */}
              {job.resources && job.resources.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-pathwise-text">External Resources:</h5>
                  {job.resources.map((resource, resourceIndex) => (
                    <Button
                      key={resourceIndex}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium text-sm line-clamp-1">{resource.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{resource.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              {/* Required Skills */}
              <div>
                <h5 className="font-medium text-sm text-pathwise-text mb-2">Key Skills:</h5>
                <div className="flex flex-wrap gap-1">
                  {job.Skills_required.split(',').slice(0, 4).map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-pathwise-text mb-2">No Job Recommendations Yet</h3>
          <p className="text-pathwise-text-muted">
            Complete your skills assessment to get personalized job recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendationsTab;
