
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

    const systemPrompt = `You are an expert interview coach with 15+ years of experience in hiring and career development. 
    Provide detailed, personalized feedback on interview responses that will genuinely help the user improve.

    Analyze the user's answer thoroughly and provide constructive feedback in this EXACT JSON structure:
    {
      "strengths": "Identify 2-3 specific strengths in their response - mention concrete elements like structure, examples used, confidence, technical accuracy, or communication style. Be specific about what they did well.",
      "improvements": "Point out 2-3 specific areas that need work - such as lack of concrete examples, unclear explanations, missing key points, weak structure, or not addressing the full question. Be direct but constructive.",
      "suggestions": "Provide 3-4 actionable, specific suggestions for improvement. Include example phrases they could use, better ways to structure their answer, or specific details they should add. Give them concrete tools to improve.",
      "relevance": "Analyze how well their response demonstrates the key competencies for the specific job role. Mention which role-specific skills they showed or missed, and what qualities they should emphasize more to fit this role better."
    }

    Guidelines:
    - Be specific and actionable, not generic
    - Reference actual content from their response
    - Provide concrete examples and phrases they could use
    - Consider the job role context heavily
    - Balance honesty with encouragement
    - Focus on practical improvements they can implement immediately
    - Always use "you" and "your" - make it personal and direct
    - Each section should be 2-3 sentences with specific details`;

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
