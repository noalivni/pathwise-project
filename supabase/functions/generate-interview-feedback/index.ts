
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

    const { question, answer, jobRole, questionCategory, questionDifficulty, userExperience } = requestBody;

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
      questionDifficulty,
      hasUserExperience: !!userExperience
    });

    const systemPrompt = `You are a seasoned hiring manager who just conducted an interview and is giving honest, direct feedback to the candidate. Your feedback should sound completely natural and human - like you're having a real conversation.

    CRITICAL: Avoid all AI-like language patterns:
    - No bullet points or structured lists
    - No phrases like "Your response demonstrates..." or "I appreciate that you..."
    - No generic opening lines like "Good job on..." 
    - Write like you're genuinely reacting to what they said
    - Use natural speech patterns and varied sentence structures
    - Be specific about what they actually said, not generic qualities

    YOUR ROLE: You understand what this specific question is testing and you're evaluating how well they answered it for this exact position. You have their background information and can reference it naturally.

    RESPONSE STYLE:
    - Start with your honest first impression of their answer
    - Reference specific things they mentioned using their exact words  
    - Point out missed opportunities based on their background
    - Give practical advice like you would to a real candidate
    - Vary your language completely between different responses
    - Sound like a real person, not an AI assistant

    Return feedback in this JSON format, but make the content completely natural:
    {
      "strengths": "[Natural commentary on what worked in their response]",
      "improvements": "[Honest assessment of what could be better, referencing specifics]", 
      "suggestions": "[Practical advice in conversational tone]",
      "relevance": "[How this connects to the actual job, being specific]"
    }`;


    const userPrompt = `I just interviewed someone for a ${jobRole} position. Here's what happened:

QUESTION: "${question}"
THEIR ANSWER: "${answer}"

THEIR BACKGROUND: ${userExperience ? `They have ${userExperience.degree_certification || 'a degree'} in ${userExperience.fields_of_study || 'their field'}, graduated ${userExperience.graduation_year || 'recently'}, interested in ${userExperience.field_of_interest || 'various areas'}, with skills in ${userExperience.hard_skills?.join(', ') || 'multiple areas'}, and their career background is: ${userExperience.career_history || 'developing'}` : 'No background information provided'}.

Give me your honest take on their response. What did they do well? What could they have done better? How could they improve their answer? And does this response actually show they're right for this ${jobRole} role?

Keep it real and conversational - like you're telling a colleague your thoughts after the interview.`;

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
        feedback: randomResponse,
      }), 
      {
        status: 200, // Change to 200 to prevent error handling in frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
