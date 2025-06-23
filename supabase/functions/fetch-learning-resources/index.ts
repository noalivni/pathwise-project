
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LearningResourcesRequest {
  jobTitles: string[];
  skills: string[];
  maxResults?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitles, skills, maxResults = 10 }: LearningResourcesRequest = await req.json();

    const serpApiKey = Deno.env.get('SERPAPI_KEY');
    if (!serpApiKey) {
      throw new Error('SerpAPI key not configured');
    }

    const resources = [];

    // Search for job-related resources
    for (const jobTitle of jobTitles.slice(0, 2)) {
      const jobQuery = `"${jobTitle}" tutorial guide career "how to become"`;
      const jobUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(jobQuery)}&api_key=${serpApiKey}&num=3`;
      
      try {
        const jobResponse = await fetch(jobUrl);
        const jobData = await jobResponse.json();
        
        if (jobData.organic_results) {
          jobData.organic_results.forEach((result: any) => {
            resources.push({
              title: result.title,
              description: result.snippet,
              url: result.link,
              resource_type: 'career_guide',
              related_job_roles: [jobTitle],
              related_skills: [],
              source: 'SerpAPI'
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching resources for ${jobTitle}:`, error);
      }
    }

    // Search for skill-related resources
    for (const skill of skills.slice(0, 3)) {
      const skillQuery = `"${skill}" tutorial course learn online certification`;
      const skillUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(skillQuery)}&api_key=${serpApiKey}&num=2`;
      
      try {
        const skillResponse = await fetch(skillUrl);
        const skillData = await skillResponse.json();
        
        if (skillData.organic_results) {
          skillData.organic_results.forEach((result: any) => {
            resources.push({
              title: result.title,
              description: result.snippet,
              url: result.link,
              resource_type: 'skill_tutorial',
              related_job_roles: [],
              related_skills: [skill],
              source: 'SerpAPI'
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching resources for ${skill}:`, error);
      }
    }

    // Limit results and remove duplicates
    const uniqueResources = resources
      .filter((resource, index, self) => 
        index === self.findIndex(r => r.url === resource.url)
      )
      .slice(0, maxResults);

    return new Response(JSON.stringify({ resources: uniqueResources }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-learning-resources function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
