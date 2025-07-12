
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

    // Search for job-related resources with broader approach
    for (const jobTitle of jobTitles.slice(0, 2)) {
      const jobQueries = [
        `"${jobTitle}" career guide how to become`,
        `"${jobTitle}" job description requirements skills`,
        `"${jobTitle}" training course certification`,
        `${jobTitle} career path entry level`
      ];
      
      for (const jobQuery of jobQueries) {
        if (resources.filter(r => r.related_job_roles.includes(jobTitle)).length >= 3) break;
        
        const jobUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(jobQuery)}&api_key=${serpApiKey}&num=5`;
        
        try {
          const jobResponse = await fetch(jobUrl);
          const jobData = await jobResponse.json();
          
          console.log(`SerpAPI response for "${jobQuery}":`, JSON.stringify(jobData, null, 2));
          
          if (jobData.organic_results && jobData.organic_results.length > 0) {
            jobData.organic_results.forEach((result: any) => {
              // More permissive filtering - exclude only obvious non-educational sites
              if (result.link && 
                  result.title && 
                  result.snippet &&
                  !result.link.includes('facebook.com') && 
                  !result.link.includes('twitter.com') &&
                  !result.link.includes('instagram.com') &&
                  !result.link.includes('youtube.com/watch') &&
                  !result.link.includes('tiktok.com') &&
                  result.link.startsWith('http')) {
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
          }
        } catch (error) {
          console.error(`Error fetching resources for ${jobTitle} with query "${jobQuery}":`, error);
        }
      }
    }

    // Search for skill-related resources with broader approach
    for (const skill of skills.slice(0, 3)) {
      const skillQueries = [
        `"${skill}" tutorial learn online`,
        `"${skill}" course training guide`,
        `"${skill}" certification bootcamp`,
        `${skill} programming tutorial`
      ];
      
      for (const skillQuery of skillQueries) {
        if (resources.filter(r => r.related_skills.includes(skill)).length >= 3) break;
        
        const skillUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(skillQuery)}&api_key=${serpApiKey}&num=5`;
        
        try {
          const skillResponse = await fetch(skillUrl);
          const skillData = await skillResponse.json();
          
          console.log(`SerpAPI response for "${skillQuery}":`, JSON.stringify(skillData, null, 2));
          
          if (skillData.organic_results && skillData.organic_results.length > 0) {
            skillData.organic_results.forEach((result: any) => {
              // More permissive filtering - exclude only obvious non-educational sites
              if (result.link && 
                  result.title && 
                  result.snippet &&
                  !result.link.includes('facebook.com') && 
                  !result.link.includes('twitter.com') &&
                  !result.link.includes('instagram.com') &&
                  !result.link.includes('youtube.com/watch') &&
                  !result.link.includes('tiktok.com') &&
                  result.link.startsWith('http')) {
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
