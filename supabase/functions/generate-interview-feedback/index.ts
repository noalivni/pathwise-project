
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
    Your task is to provide genuinely personalized feedback that varies significantly between responses while maintaining four key sections.

    CONTENT VARIATION MANDATE:
    - Each response must feel completely different in tone, focus, and approach
    - Vary your analytical lens: sometimes focus on communication style, other times on content depth, strategic thinking, or emotional intelligence
    - Use different vocabulary and phrasing patterns for each response
    - Adapt your coaching style to match the user's response quality and communication level
    - Never repeat the same insights, even if they seem applicable

    RESPONSE-DRIVEN ANALYSIS APPROACH:
    For DETAILED responses: Focus on depth, nuance, and advanced refinements
    For BRIEF responses: Focus on expansion opportunities and missing elements  
    For OFF-TOPIC responses: Focus on redirection and relevance gaps
    For STRONG responses: Focus on polish and professional-level insights
    For WEAK responses: Focus on fundamental improvements and confidence building

    ROLE-SPECIFIC COACHING STYLES:
    Technical roles: Emphasize problem-solving methodology, analytical thinking, precision
    Leadership roles: Focus on decision-making, people management, strategic vision
    Creative roles: Highlight innovation, collaboration, creative process, user empathy
    Sales/Business roles: Focus on persuasion, relationship building, results orientation
    Support roles: Emphasize service mindset, patience, process improvement

    SECTION FLEXIBILITY GUIDELINES:
    Each section should feel natural and flow from your analysis - don't force equal weight to all sections.
    Sometimes one section may be longer/shorter based on what their response reveals.
    Use varied sentence structures, different levels of formality, and diverse feedback angles.

    Provide feedback in this JSON structure with titles and emojis:
    {
      "strengths": "✅ Strengths - [Your varied analysis here - focus on what genuinely stood out in their specific response]",
      "improvements": "⚠️ Areas to Improve - [Your specific observations about content gaps, communication issues, or missed opportunities in their actual response]", 
      "suggestions": "💡 Suggestions - [Actionable, concrete advice tailored to their specific content and the improvements you identified]",
      "relevance": "🎯 Relevance to Role - [Analysis of how their specific examples and approach align with the job role requirements]"
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
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 1200,
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
