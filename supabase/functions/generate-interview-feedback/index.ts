
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
    Provide detailed, personalized feedback that feels like a one-on-one coaching conversation about their specific response.

    CRITICAL: Make this feedback feel personal and specific to their actual answer. Quote their exact words, reference their specific examples, and respond to what they actually said, not generic interview advice.

    Analyze the user's answer thoroughly and provide constructive feedback in this EXACT JSON structure:
    {
      "strengths": "Quote specific phrases or words they used that were effective. Reference their actual examples, stories, or technical points they mentioned. Acknowledge their communication style, tone, or approach that worked well. Make them feel heard by showing you understood their specific response.",
      "improvements": "Point to specific parts of their answer that need work. Quote phrases that were unclear, mention specific examples they started but didn't finish, or reference parts where they went off-topic. Be direct about what exactly in their response could be stronger.",
      "suggestions": "Give them specific, actionable advice based on their actual response. If they mentioned a project, tell them how to elaborate on it better. If they used certain words, suggest better alternatives. Provide exact phrases they could have used instead of what they said. Reference their specific context.",
      "relevance": "Analyze their specific examples, experiences, or skills they mentioned in relation to the job role. Reference the actual content they shared and explain how it does or doesn't demonstrate key competencies for this specific position. Be specific about which parts of their answer were most/least relevant."
    }

    PERSONALIZATION REQUIREMENTS:
    - ALWAYS quote their exact words or phrases when giving feedback
    - Reference specific examples, stories, or details they mentioned
    - Respond to their communication style and approach
    - Make observations about their actual word choices and expressions
    - If they gave an example, comment specifically on that example
    - If they missed something, point to exactly where in their response they could have added it
    - Make it feel like you're having a conversation about their specific answer, not giving generic advice
    - Use phrases like "When you said..." "Your example about..." "The way you described..." "I noticed you mentioned..."

    Guidelines:
    - Every piece of feedback must connect to their actual response
    - Quote their words to show you listened carefully
    - Be specific about what they said vs. what they could have said
    - Reference their tone, confidence level, or communication style based on their actual words
    - Make suggestions that build on what they already shared
    - Always use "you" and "your" - make it conversational and direct
    - Each section should feel like personalized coaching, not template feedback`;

    const userPrompt = `
    CONTEXT:
    Job Role: ${jobRole}
    Question Category: ${questionCategory} 
    Question Difficulty: ${questionDifficulty}
    
    INTERVIEW QUESTION: "${question}"
    
    CANDIDATE'S RESPONSE: "${answer}"
    
    INSTRUCTIONS: Analyze this specific response and provide personalized feedback that shows you carefully listened to their answer. Quote their exact words, reference their specific examples, and make suggestions that build on what they actually said. Focus on their actual communication style, examples, and approach - not generic interview advice.
    
    Remember: This candidate is applying for a ${jobRole} position, so evaluate how their specific response demonstrates relevant competencies for this role.`;

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
