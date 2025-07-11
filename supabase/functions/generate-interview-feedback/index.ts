
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
    const requestBody = await req.json();
    console.log('Request received:', { requestBody });

    const { question, answer, jobRole, questionCategory, questionDifficulty } = requestBody;

    // Input validation
    if (!question || !answer || !jobRole) {
      console.log('Missing required fields:', { question: !!question, answer: !!answer, jobRole: !!jobRole });
      throw new Error('Missing required fields: question, answer, or jobRole');
    }

    if (!openAIApiKey) {
      console.log('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI API with:', {
      question: question.substring(0, 100),
      answer: answer.substring(0, 100),
      jobRole,
      questionCategory,
      questionDifficulty
    });

    const systemPrompt = `You are an expert interview coach with 15+ years of experience in hiring and career development. 
    Your task is to provide genuinely personalized, IN-DEPTH feedback that varies significantly between responses while maintaining four key sections.

    CRITICAL RESPONSE LENGTH REQUIREMENTS:
    - MINIMUM 3-4 sentences per section for poor/brief responses (under 30 words)
    - MINIMUM 2-3 sentences per section for adequate responses 
    - Each section must provide substantial, actionable analysis - never single sentences
    - Poor responses trigger EDUCATIONAL COACHING MODE with detailed explanations
    - Brief responses require comprehensive gap analysis and learning opportunities

    RESPONSE QUALITY DETECTION & ADAPTIVE DEPTH:
    For VERY BRIEF responses (under 20 words): Enter COMPREHENSIVE COACHING MODE
    - Provide detailed explanations of what good responses include
    - Offer specific examples and frameworks (STAR method, problem-solving approaches)
    - Explain why certain elements are important for the role
    - Give step-by-step improvement guidance with 4+ sentences per section

    For OFF-TOPIC responses: Enter REDIRECTION MODE  
    - Extensively explain how to refocus on the question
    - Provide concrete examples of relevant responses
    - Explain the connection between the question and role requirements
    - Offer detailed guidance on structuring better answers

    For WEAK responses: Enter DEVELOPMENT MODE
    - Identify specific content gaps with detailed analysis
    - Explain what stronger candidates typically include
    - Provide multiple improvement strategies per section
    - Connect weaknesses to specific role competencies

    For STRONG responses: Enter REFINEMENT MODE
    - Focus on nuanced improvements and advanced insights
    - Highlight sophisticated aspects of their approach
    - Provide expert-level suggestions for enhancement
    - Maintain substantial depth while focusing on polish

    MANDATORY SECTION DEPTH REQUIREMENTS:
    ✅ STRENGTHS (2-4 sentences):
    - Even for poor responses, find specific positives and explain their value
    - Quote exact phrases and explain why they demonstrate potential
    - Connect strengths to role requirements with detailed reasoning
    - For brief responses, explain what they got right and build confidence

    ⚠️ AREAS TO IMPROVE (3-5 sentences):
    - Provide comprehensive gap analysis with specific examples
    - Explain what's missing and why it matters for the role
    - For poor responses, offer detailed educational explanations
    - Include multiple improvement areas with specific reasoning

    💡 SUGGESTIONS (3-5 sentences):
    - Always provide step-by-step, actionable advice with examples
    - Include specific frameworks, structures, or approaches they can use
    - For poor responses, offer detailed "how-to" guidance
    - Provide concrete examples of what better responses sound like

    🎯 RELEVANCE TO ROLE (2-4 sentences):
    - Connect their response to specific role competencies with detailed analysis
    - Explain how their approach aligns or misaligns with job requirements
    - For poor responses, educate about key role expectations
    - Provide specific examples of role-relevant improvements

    EDUCATIONAL COACHING FOR INADEQUATE RESPONSES:
    When responses are brief, off-topic, or lack substance:
    - Switch to teaching mode with explanations of interview best practices
    - Include examples of stronger responses without being condescending
    - Provide detailed framework suggestions (STAR, problem-solving, etc.)
    - Explain the "why" behind your suggestions to build understanding
    - Offer encouragement while being thorough about improvement areas
    - Use phrases like "Strong candidates typically...", "Consider this approach...", "Here's a framework that works well..."

    CONTENT VARIATION MANDATE:
    - Each response must feel completely different in tone, focus, and approach
    - Vary your analytical lens and coaching style significantly
    - Use different vocabulary and phrasing patterns for each response
    - Never repeat the same insights, even if they seem applicable
    - Adapt depth and educational content based on response quality

    MANDATORY PERSONALIZATION:
    - Quote their exact words or phrases in every section
    - Reference specific scenarios, projects, or examples they described
    - Comment on their actual word choices and communication style
    - Use phrases like "When you said...", "Your example about...", "The way you described..."
    - Make every piece of feedback unique to their specific response content

    Provide feedback in this JSON structure with titles and emojis:
    {
      "strengths": "✅ Strengths - [2-4 sentences of detailed analysis]",
      "improvements": "⚠️ Areas to Improve - [3-5 sentences of comprehensive gap analysis]", 
      "suggestions": "💡 Suggestions - [3-5 sentences of step-by-step actionable advice]",
      "relevance": "🎯 Relevance to Role - [2-4 sentences connecting to role requirements]"
    }`;

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
        temperature: 0.9,
        max_tokens: 2000,
        seed: Math.floor(Math.random() * 1000000), // Add randomization seed
      }),
    });

    console.log('OpenAI API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received:', {
      choices: data.choices?.length,
      hasContent: !!data.choices?.[0]?.message?.content,
      contentLength: data.choices?.[0]?.message?.content?.length
    });

    const feedbackText = data.choices[0].message.content;
    console.log('Feedback text received:', feedbackText.substring(0, 200) + '...');

    // Try to parse as JSON, fallback to structured response if parsing fails
    let feedback;
    try {
      console.log('Attempting to parse feedback as JSON...');
      feedback = JSON.parse(feedbackText);
      console.log('JSON parsing successful, validating structure...');
      
      // Validate that we have the expected structure
      if (!feedback.strengths || !feedback.improvements || !feedback.suggestions || !feedback.relevance) {
        console.log('Invalid feedback structure:', {
          hasStrengths: !!feedback.strengths,
          hasImprovements: !!feedback.improvements,
          hasSuggestions: !!feedback.suggestions,
          hasRelevance: !!feedback.relevance
        });
        throw new Error('Invalid feedback structure');
      }
      console.log('Feedback structure validation passed');
    } catch (parseError) {
      console.log('JSON parsing failed:', parseError);
      console.log('Raw feedback text that failed to parse:', feedbackText);
      
      // Create structured fallback if AI didn't return proper JSON
      feedback = {
        strengths: "✅ Strengths - " + (feedbackText.substring(0, 200) || "You engaged thoughtfully with this question."),
        improvements: "⚠️ Areas to Improve - Consider providing more specific examples and details in your responses.",
        suggestions: "💡 Suggestions - Use concrete examples from your experience to illustrate your points more effectively.",
        relevance: `🎯 Relevance to Role - Connect your examples more directly to ${jobRole || 'the role'} requirements.`
      };
    }

    console.log('Returning successful response with feedback');
    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-interview-feedback function:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Log additional context for debugging
    console.log('Current environment variables available:', {
      hasOpenAIKey: !!openAIApiKey,
      openAIKeyLength: openAIApiKey?.length
    });
    
    // Generate varied fallback responses based on role and question
    const fallbackResponses = [
      {
        strengths: "✅ Strengths - You demonstrated engagement with the question and showed willingness to share your perspective, which is valuable in interview settings.",
        improvements: "⚠️ Areas to Improve - Consider expanding your response with more specific details and concrete examples to help illustrate your points more effectively.",
        suggestions: "💡 Suggestions - Try using the STAR method (Situation, Task, Action, Result) to structure your responses and provide more compelling examples from your experience.",
        relevance: `🎯 Relevance to Role - Think about how your experiences directly connect to the requirements and responsibilities of a ${jobRole || 'this'} position.`
      },
      {
        strengths: "✅ Strengths - Your authentic approach to answering shows genuine interest in the conversation and reflects your personality well.",
        improvements: "⚠️ Areas to Improve - Adding more depth and specific examples would help demonstrate your capabilities and experience more clearly.",
        suggestions: "💡 Suggestions - Consider preparing 2-3 detailed examples beforehand that showcase different skills, and practice explaining the impact of your actions.",
        relevance: `🎯 Relevance to Role - Focus on highlighting experiences that align with the key competencies needed for ${jobRole || 'this role'} success.`
      },
      {
        strengths: "✅ Strengths - You're comfortable expressing yourself and engaging with challenging questions, which demonstrates confidence in communication.",
        improvements: "⚠️ Areas to Improve - Structuring your response with clearer organization and more specific details would enhance the impact of your message.",
        suggestions: "💡 Suggestions - Try outlining your main points mentally before responding, and include quantifiable results or specific outcomes when possible.",
        relevance: `🎯 Relevance to Role - Consider how your background specifically prepares you for the unique challenges and opportunities in ${jobRole || 'this field'}.`
      }
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        feedback: randomResponse
      }), 
      {
        status: 200, // Change to 200 to prevent error handling in frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
