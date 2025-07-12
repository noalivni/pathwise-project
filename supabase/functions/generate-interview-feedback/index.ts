// generate-interview-feedback.ts

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserExperience {
  degree_certification?: string;
  fields_of_study?: string;
  graduation_year?: string;
  field_of_interest?: string;
  hard_skills?: string[];
  career_history?: string;
}

interface InterviewFeedbackRequest {
  question: string;
  answer: string;
  jobRole: string;
  questionCategory?: string;
  questionDifficulty?: string;
  userExperience?: UserExperience;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const body: InterviewFeedbackRequest = await req.json();

    const {
      question,
      answer,
      jobRole,
      userExperience,
    } = body;

    // Validate required fields
    if (!question || !answer || !jobRole) {
      throw new Error("Missing required fields: question, answer, or jobRole");
    }

    // Build background summary
    const background = userExperience
      ? `They have ${userExperience.degree_certification || "a degree"} in ${userExperience.fields_of_study || "their field"}, graduated ${userExperience.graduation_year || "recently"}, interested in ${userExperience.field_of_interest || "various areas"}, with skills in ${userExperience.hard_skills?.join(", ") || "multiple areas"}, and career history: ${userExperience.career_history || "not provided"}.`
      : "No background information provided.";

    // Single prompt with JSON schema
    const prompt = `
You’re a seasoned hiring manager giving honest, direct feedback on this candidate’s answer. ONLY reply with a single JSON object and NOTHING else. Use exactly these four keys (all values should be strings):

{
  "strengths": "string",
  "improvements": "string",
  "suggestions": "string",
  "relevance": "string"
}

QUESTION: "${question}"
ANSWER: "${answer}"
BACKGROUND: ${background}
`.trim();

    // Call OpenAI
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`OpenAI API error: ${apiRes.status} ${apiRes.statusText} — ${errText}`);
    }

    const apiData = await apiRes.json();
    const raw = apiData.choices?.[0]?.message?.content?.trim();
    if (!raw) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse JSON directly
    let feedback: Record<string, string>;
    try {
      feedback = JSON.parse(raw);
    } catch {
      throw new Error("Failed to parse JSON from OpenAI response: " + raw);
    }

    // Return the structured feedback
    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in generate-interview-feedback:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
