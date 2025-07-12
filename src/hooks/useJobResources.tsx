
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchAndCalculateJobMatches } from "@/utils/sharedJobMatching";

interface JobResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  related_skills: string[];
  related_job_roles: string[];
  jobTitle?: string;
  aiSummary?: string;
  resources?: Array<{
    title: string;
    description: string;
    url: string;
  }>;
}

export const useJobResources = () => {
  const { user, profile } = useAuth();
  const [jobResources, setJobResources] = useState<JobResource[]>([]);

  const fetchJobBasedResources = async () => {
    if (!user || !profile) return;

    try {
      // Use the shared job matching logic
      const jobMatches = await fetchAndCalculateJobMatches(user, profile, 4);

      if (jobMatches.length > 0) {
        const jobsWithDetails = jobMatches.map(match => ({
          job_title: match.job_title || '',
          Short_description: match.Short_description || '',
          Industry: match.Industry || '',
          match_percentage: match.match_percentage || 0
        }));

        // Generate AI summaries and fetch resources for each job
        const enhancedJobs = await Promise.all(
          jobsWithDetails.map(async (job) => {
            const [aiSummary, resources] = await Promise.all([
              generateJobSummary(job),
              fetchJobResources(job.job_title)
            ]);

            return {
              id: `job-${job.job_title}`,
              title: `${job.job_title} Career Resources`,
              description: `Explore resources and opportunities in ${job.job_title}`,
              url: '',
              jobTitle: job.job_title,
              aiSummary,
              resource_type: 'career_exploration',
              related_skills: [],
              related_job_roles: [job.job_title],
              resources: resources
            };
          })
        );

        setJobResources(enhancedJobs);
      }
    } catch (error) {
      console.error('Error fetching job-based resources:', error);
    }
  };

  const generateJobSummary = async (job: any) => {
    try {
      const response = await supabase.functions.invoke('generate-career-guidance', {
        body: {
          topJobRecommendations: [job],
          hardSkillsAssessment: {},
          fieldOfInterest: job.Industry,
          generateJobSummary: true
        }
      });

      if (response.data?.jobSummary) {
        return response.data.jobSummary;
      }
    } catch (error) {
      console.error('Error generating job summary:', error);
    }
    return `${job.job_title} is a role in the ${job.Industry} industry. ${job.Short_description}`;
  };

  const fetchJobResources = async (jobTitle: string) => {
    try {
      console.log(`Fetching resources for job: ${jobTitle}`);
      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles: [jobTitle],
          skills: [],
          maxResults: 5
        }
      });

      console.log(`Response for ${jobTitle}:`, response);

      if (response.data?.resources && response.data.resources.length > 0) {
        console.log(`Found ${response.data.resources.length} resources for ${jobTitle}`);
        return response.data.resources.map((resource: any) => ({
          title: resource.title,
          description: resource.description,
          url: resource.url
        }));
      }
      
      console.log(`No resources found for ${jobTitle}, providing fallback`);
    } catch (error) {
      console.error('Error fetching job resources:', error);
    }
    
    // Provide a direct career resource as fallback
    return [{
      title: `${jobTitle} Career Information`,
      description: `Learn about ${jobTitle} career requirements, salary, and job outlook`,
      url: `https://www.bls.gov/ooh/search.htm?search=${encodeURIComponent(jobTitle)}`
    }];
  };

  return {
    jobResources,
    fetchJobBasedResources
  };
};
