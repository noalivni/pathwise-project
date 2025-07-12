
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

    // Search for job-related resources with high-quality educational content
    for (const jobTitle of jobTitles.slice(0, 2)) {
      const jobQueries = [
        `"${jobTitle}" career guide site:indeed.com OR site:glassdoor.com OR site:linkedin.com/advice`,
        `"how to become ${jobTitle}" site:coursera.org OR site:edx.org OR site:udemy.com`,
        `"${jobTitle}" requirements skills site:bls.gov OR site:onetcenter.org`,
        `"${jobTitle}" career path training certification`
      ];
      
      for (const jobQuery of jobQueries) {
        const jobUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(jobQuery)}&api_key=${serpApiKey}&num=3`;
        
        try {
          const jobResponse = await fetch(jobUrl);
          const jobData = await jobResponse.json();
          
          if (jobData.organic_results && jobData.organic_results.length > 0) {
            jobData.organic_results.forEach((result: any) => {
              // Only include direct links to educational/career content
              if (result.link && 
                  !result.link.includes('google.com') &&
                  !result.link.includes('facebook.com') && 
                  !result.link.includes('twitter.com') &&
                  !result.link.includes('instagram.com') &&
                  result.title && result.snippet) {
                resources.push({
                  title: result.title,
                  description: result.snippet,
                  url: result.link,
                  resource_type: 'career_guide',
                  related_job_roles: [jobTitle],
                  related_skills: [],
                  source: 'SerpAPI'
                });
              }
            });
            // Continue to try more queries to get more results
          }
        } catch (error) {
          console.error(`Error fetching resources for ${jobTitle} with query "${jobQuery}":`, error);
        }
      }
    }

    // Search for skill-related resources with targeted educational platforms
    for (const skill of skills.slice(0, 3)) {
      const skillQueries = [
        `"${skill}" tutorial site:freecodecamp.org OR site:codecademy.com OR site:w3schools.com`,
        `"learn ${skill}" site:coursera.org OR site:udemy.com OR site:pluralsight.com`,
        `"${skill}" course site:edx.org OR site:khanacademy.org OR site:lynda.com`,
        `"${skill}" certification training guide`
      ];
      
      for (const skillQuery of skillQueries) {
        const skillUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(skillQuery)}&api_key=${serpApiKey}&num=3`;
        
        try {
          const skillResponse = await fetch(skillUrl);
          const skillData = await skillResponse.json();
          
          if (skillData.organic_results && skillData.organic_results.length > 0) {
            skillData.organic_results.forEach((result: any) => {
              // Only include direct links to educational content
              if (result.link && 
                  !result.link.includes('google.com') &&
                  !result.link.includes('facebook.com') && 
                  !result.link.includes('twitter.com') &&
                  !result.link.includes('instagram.com') &&
                  result.title && result.snippet) {
                resources.push({
                  title: result.title,
                  description: result.snippet,
                  url: result.link,
                  resource_type: 'skill_tutorial',
                  related_job_roles: [],
                  related_skills: [skill],
                  source: 'SerpAPI'
                });
              }
            });
            // Continue to try more queries to get more results
          }
        } catch (error) {
          console.error(`Error fetching resources for ${skill} with query "${skillQuery}":`, error);
        }
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
