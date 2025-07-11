
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

    CRITICAL ANTI-GENERIC RULES:
    - NEVER use phrases like "Great use of STAR method" unless they actually used STAR structure
    - NEVER give templated feedback that could apply to any answer
    - NEVER repeat the same insights across different responses
    - ALWAYS analyze the actual content depth, scenarios described, and specific details they provided
    - FORBIDDEN: Generic praise like "good structure" without citing specific structural elements
    - FORBIDDEN: Vague improvements like "add more detail" without specifying what details are missing

    DEEP CONTENT ANALYSIS REQUIRED:
    - Analyze the specific scenario, situation, or example they described
    - Evaluate the quality and depth of their storytelling
    - Assess their tone, confidence level, and communication clarity
    - Identify gaps in logic, missing context, or weak connections
    - Note any industry-specific knowledge or lack thereof
    - Examine how well they connected their answer to the job role

    Analyze the user's answer thoroughly and provide constructive feedback in this EXACT JSON structure:
    {
      "strengths": "✅ Strengths - Identify what you specifically did well by quoting exact phrases and analyzing the actual content quality. Focus on genuine strengths in your storytelling, specific examples you provided, technical knowledge demonstrated, or communication approach. Reference the actual scenario/situation you described and what made it effective.",
      "improvements": "⚠️ Areas to Improve - Point to specific content weaknesses in your response. Quote exact phrases that were unclear, identify missing context in your examples, note where your logic was weak, or highlight moments where you failed to connect your experience to the role requirements. Be specific about content gaps, not just structure.",
      "suggestions": "💡 Suggestions - Provide specific content improvements based on your actual response. If you mentioned a project/situation, explain exactly how to describe it better. Give alternative phrasings for weak sections. Suggest specific details you should have included, metrics you could have mentioned, or stronger ways to frame your examples. Reference your specific content.",
      "relevance": "🎯 Relevance to Role - Analyze the specific examples, skills, or experiences you mentioned and evaluate how they align with this exact job role. Reference the actual content you shared and explain which parts demonstrate (or fail to demonstrate) key competencies for this position. Be specific about what role-relevant details you should emphasize more or include."
    }

    MANDATORY PERSONALIZATION:
    - Quote their exact words or phrases in every section
    - Reference specific scenarios, projects, or examples they described
    - Analyze the quality and depth of their specific content
    - Comment on their actual word choices and communication style
    - Point to specific moments in their response (beginning, middle, end)
    - Use phrases like "When you said...", "Your example about...", "The way you described...", "I noticed you mentioned..."
    - Make it clear you understood their specific situation/scenario
    - Connect every piece of feedback to their actual response content

    QUALITY STANDARDS:
    - Each piece of feedback must be unique to their specific response
    - Avoid any feedback that could apply to multiple different answers
    - Focus on content quality, not just presentation structure
    - Be specific about what made their examples strong or weak
    - Reference the job role context throughout your analysis
    - Ensure feedback varies significantly between different questions/responses`;

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
