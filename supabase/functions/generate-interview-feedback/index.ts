
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

    const systemPrompt = `You are an expert interview coach analyzing a specific interview question and response. Your goal is to provide contextual, natural feedback that feels like a real conversation with a hiring manager.

    ANALYSIS APPROACH:
    1. First understand what this specific question is trying to assess (leadership skills, problem-solving, technical knowledge, cultural fit, etc.)
    2. Evaluate how well their response addresses what the interviewer is looking for
    3. Consider their background and how it relates to both the question and the target role
    4. Provide specific, actionable guidance that feels natural and conversational

    QUESTION CONTEXT AWARENESS:
    - Behavioral questions (Tell me about a time...): Focus on STAR method, specific examples, measurable results
    - Technical questions: Assess knowledge depth, problem-solving approach, communication of complex concepts
    - Situational questions (What would you do if...): Evaluate reasoning process, decision-making framework
    - Cultural fit questions: Look for alignment with company values, team collaboration
    - Strength/weakness questions: Check for self-awareness, growth mindset, relevance to role

    ROLE-SPECIFIC EVALUATION:
    - Software roles: Technical depth, problem-solving, code quality, system thinking
    - Management roles: Leadership experience, team building, conflict resolution, strategic thinking
    - Sales roles: Relationship building, results orientation, resilience, communication skills
    - Marketing roles: Creativity, data analysis, campaign experience, brand thinking
    - Finance roles: Analytical thinking, attention to detail, risk assessment, compliance knowledge

    FEEDBACK STYLE:
    - Write as if you're a thoughtful interviewer providing honest, helpful feedback
    - Quote their specific words when relevant: "When you mentioned X..."
    - Reference their background specifically: "Given your experience in Y..."
    - Vary your language and approach - avoid formulaic responses
    - Be encouraging but honest about areas needing improvement
    - Provide concrete examples and next steps

    RESPONSE FORMAT:
    Return a JSON object with natural, conversational feedback:
    {
      "strengths": "What worked well in their response and why",
      "improvements": "Specific areas where the response could be stronger", 
      "suggestions": "Actionable advice for improving their answer",
      "relevance": "How well their response aligns with the target role requirements"
    }

    Make each response feel unique and tailored to the specific question-answer combination.`;

    // Analyze question type and what it's assessing
    const getQuestionAnalysis = (question: string, category: string) => {
      const q = question.toLowerCase();
      
      if (q.includes('tell me about a time') || q.includes('describe a situation')) {
        return 'This behavioral question is assessing your past experience and how you handle specific situations. The interviewer wants to see concrete examples, your thought process, and measurable results.';
      } else if (q.includes('what would you do') || q.includes('how would you handle')) {
        return 'This situational question is evaluating your decision-making process and problem-solving approach. The interviewer wants to understand your reasoning and judgment.';
      } else if (q.includes('strength') || q.includes('weakness')) {
        return 'This self-assessment question is checking for self-awareness, honesty, and growth mindset. The interviewer wants to see how well you know yourself and how you develop professionally.';
      } else if (q.includes('why do you want') || q.includes('why are you interested')) {
        return 'This motivation question is assessing your genuine interest and cultural fit. The interviewer wants to understand your career goals and alignment with the role/company.';
      } else if (category?.toLowerCase() === 'technical') {
        return 'This technical question is evaluating your knowledge depth and problem-solving skills. The interviewer wants to see both your technical competence and how you communicate complex concepts.';
      } else {
        return 'This question is designed to understand your experience, skills, and fit for the role. The interviewer is looking for specific examples and relevant competencies.';
      }
    };

    const questionAnalysis = getQuestionAnalysis(question, questionCategory);
    
    // Format user experience for context
    const experienceContext = userExperience ? `
CANDIDATE BACKGROUND:
- Education: ${userExperience.degree_certification || 'Not specified'} in ${userExperience.fields_of_study || 'Not specified'} (${userExperience.graduation_year || 'Year not specified'})
- Field of Interest: ${userExperience.field_of_interest || 'Not specified'}
- Technical Skills: ${userExperience.hard_skills?.join(', ') || 'Not specified'}
- Career History: ${userExperience.career_history || 'Not specified'}` : 'No background information available.';

    const userPrompt = `INTERVIEW CONTEXT:
Position: ${jobRole}
Question: "${question}"
Candidate Response: "${answer}"

${experienceContext}

QUESTION ANALYSIS: ${questionAnalysis}

INSTRUCTIONS:
Analyze this response specifically for a ${jobRole} position. Consider:

1. What this question is trying to assess and how well they addressed it
2. How their background relates to their answer and the role requirements  
3. Specific gaps or strengths in their response
4. Concrete ways to improve their answer using their actual experience

Provide natural, conversational feedback that quotes their specific words and references their background. Make suggestions that are actionable and role-specific. Avoid generic advice - focus on this exact question-answer combination.`;

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
