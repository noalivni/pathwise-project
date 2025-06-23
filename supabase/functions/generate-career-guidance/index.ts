
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CareerGuidanceRequest {
  topJobRecommendations: Array<{
    job_title: string;
    Short_description: string;
    Industry: string;
    Skills_required: string;
    match_percentage: number;
  }>;
  hardSkillsAssessment: Record<string, number>;
  softSkillsAssessment?: Record<string, number>;
  fieldOfInterest: string;
  generateSkillExplanation?: boolean;
  generateJobSummary?: boolean;
  skill?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      topJobRecommendations, 
      hardSkillsAssessment, 
      softSkillsAssessment,
      fieldOfInterest,
      generateSkillExplanation,
      generateJobSummary,
      skill
    }: CareerGuidanceRequest = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    let responseStructure = {};

    // Handle skill explanation request
    if (generateSkillExplanation && skill) {
      prompt = `As a career guidance AI, provide a brief, practical explanation about the skill "${skill}" for someone in the ${fieldOfInterest} field.

Explain in 2-3 sentences:
- What this skill is
- Why it's valuable for their career
- How it will benefit them professionally

Keep it concise and actionable.`;

      responseStructure = {
        "skillExplanation": "string"
      };
    }
    // Handle job summary request
    else if (generateJobSummary && topJobRecommendations.length > 0) {
      const job = topJobRecommendations[0];
      prompt = `As a career guidance AI, provide a brief, engaging summary about the "${job.job_title}" role in the ${job.Industry} industry.

Write 2-3 sentences that explain:
- What this role involves day-to-day
- Why it's an exciting career opportunity
- What makes it appealing for someone interested in ${fieldOfInterest}

Keep it concise and inspiring.`;

      responseStructure = {
        "jobSummary": "string"
      };
    }
    // Original career guidance request
    else {
      const skillsToImprove = Object.entries(hardSkillsAssessment)
        .filter(([_, rating]) => rating < 4)
        .sort(([_, a], [__, b]) => a - b)
        .slice(0, 5)
        .map(([skill, _]) => skill);

      const topJobTitles = topJobRecommendations.slice(0, 3).map(job => job.job_title);

      prompt = `As a career guidance AI, provide personalized advice for someone interested in ${fieldOfInterest}. 

Their top job matches are: ${topJobTitles.join(', ')}

Skills they need to improve: ${skillsToImprove.join(', ')}

Please provide:
1. A brief explanation (2-3 sentences) of why these job roles are good matches
2. For each skill they need to improve, explain:
   - What the skill is
   - Why it's important for their target roles
   - How improving it will benefit their career

Format your response as JSON with this structure:
{
  "jobExplanation": "string",
  "skillRecommendations": [
    {
      "skill": "string",
      "description": "string", 
      "importance": "string",
      "careerBenefit": "string"
    }
  ]
}`;

      responseStructure = {
        "jobExplanation": "string",
        "skillRecommendations": [
          {
            "skill": "string",
            "description": "string", 
            "importance": "string",
            "careerBenefit": "string"
          }
        ]
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a career guidance expert. Provide practical, actionable advice in a concise manner. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let guidanceData;
    try {
      guidanceData = JSON.parse(content);
    } catch (e) {
      // Fallback for different request types
      if (generateSkillExplanation) {
        guidanceData = {
          skillExplanation: content || `${skill} is a valuable technical skill that will enhance your professional capabilities.`
        };
      } else if (generateJobSummary) {
        guidanceData = {
          jobSummary: content || `This role offers exciting opportunities in the ${fieldOfInterest} field.`
        };
      } else {
        // Original fallback
        const skillsToImprove = Object.entries(hardSkillsAssessment)
          .filter(([_, rating]) => rating < 4)
          .sort(([_, a], [__, b]) => a - b)
          .slice(0, 5)
          .map(([skill, _]) => skill);

        const topJobTitles = topJobRecommendations.slice(0, 3).map(job => job.job_title);

        guidanceData = {
          jobExplanation: content,
          skillRecommendations: skillsToImprove.map(skill => ({
            skill,
            description: `${skill} is a valuable technical skill`,
            importance: `Essential for ${topJobTitles.join(' and ')} roles`,
            careerBenefit: 'Will increase your competitiveness in the job market'
          }))
        };
      }
    }

    return new Response(JSON.stringify(guidanceData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-career-guidance function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
