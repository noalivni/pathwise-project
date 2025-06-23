
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer, jobRole, questionCategory, questionDifficulty } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert interview coach providing personalized, direct feedback on interview responses. 
    Analyze the user's answer and provide constructive, specific feedback in the following JSON structure:
    {
      "strengths": "What you did well in your response (speak directly to the user using 'you')",
      "improvements": "Specific areas where your response could be enhanced (use 'you' and 'your')",
      "suggestions": "Concrete suggestions for better phrasing or structure (direct advice using 'you should')",
      "relevance": "How well your response relates to the job role and demonstrates relevant skills (use 'you' and 'your')"
    }
    
    Be encouraging but honest. Focus on actionable feedback that will help the user improve their interview performance. 
    Always speak directly to the user using second person pronouns like 'you', 'your', 'you should', etc. 
    Never refer to 'the candidate' - make it personal and direct.`;

    const userPrompt = `
    Job Role: ${jobRole}
    Question Category: ${questionCategory}
    Question Difficulty: ${questionDifficulty}
    
    Interview Question: "${question}"
    
    User's Answer: "${answer}"
    
    Please provide detailed, personalized feedback on this interview response.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const feedbackText = data.choices[0].message.content;

    // Try to parse as JSON, fallback to plain text if parsing fails
    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch {
      feedback = feedbackText;
    }

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-interview-feedback function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        feedback: "I apologize, but I'm unable to generate detailed feedback at the moment. Your response shows good effort - consider providing more specific examples and relating your answer more directly to the job requirements."
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
