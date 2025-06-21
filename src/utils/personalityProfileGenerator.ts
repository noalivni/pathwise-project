
import { SkillRatings, PersonalityProfile } from "@/types/softSkills";

export const generatePersonalityProfile = (skillRatings: SkillRatings): PersonalityProfile => {
  const communication = skillRatings["Communication"] || 0;
  const leadership = skillRatings["Leadership"] || 0;
  const creativity = skillRatings["Creativity"] || 0;
  const teamwork = skillRatings["Teamwork"] || 0;
  const adaptability = skillRatings["Adaptability"] || 0;
  const problemSolving = skillRatings["Problem Solving"] || 0;
  const criticalThinking = skillRatings["Critical Thinking"] || 0;
  const emotionalIntelligence = skillRatings["Emotional Intelligence"] || 0;

  let profileType = "";
  let workEnvironment = "";
  let careerSuggestions = [];

  if (leadership >= 4 && communication >= 4) {
    profileType = "Natural Leader";
    workEnvironment = "You thrive in leadership roles and collaborative environments where you can guide teams and communicate vision effectively.";
    careerSuggestions = ["Team Lead", "Project Manager", "Department Head", "Executive Roles"];
  } else if (creativity >= 4 && adaptability >= 4) {
    profileType = "Creative Innovator";
    workEnvironment = "You excel in dynamic, creative environments where you can generate new ideas and adapt to changing requirements.";
    careerSuggestions = ["Design Roles", "Marketing", "Product Development", "Startup Environment"];
  } else if (teamwork >= 4 && emotionalIntelligence >= 4) {
    profileType = "Collaborative Professional";
    workEnvironment = "You perform best in team-oriented environments with strong interpersonal dynamics and collaborative workflows.";
    careerSuggestions = ["HR Roles", "Customer Success", "Team-based Projects", "Consulting"];
  } else if (problemSolving >= 4 && criticalThinking >= 4) {
    profileType = "Analytical Thinker";
    workEnvironment = "You succeed in structured environments that require systematic problem-solving and analytical thinking.";
    careerSuggestions = ["Data Analysis", "Research", "Strategy", "Technical Roles"];
  } else if (communication >= 3 && teamwork >= 3) {
    profileType = "Balanced Communicator";
    workEnvironment = "You work well in diverse environments and can adapt to both independent and team-based work.";
    careerSuggestions = ["Cross-functional Roles", "Client-facing Positions", "Versatile Team Member"];
  } else {
    profileType = "Developing Professional";
    workEnvironment = "You're building your interpersonal skills and would benefit from mentorship and structured learning environments.";
    careerSuggestions = ["Entry-level Positions", "Training Programs", "Structured Mentorship"];
  }

  const sortedSkills = Object.entries(skillRatings)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill);

  return {
    type: profileType,
    environment: workEnvironment,
    topStrengths: sortedSkills,
    careerSuggestions
  };
};

export const generateDetailedFeedback = (skillRatings: SkillRatings): string[] => {
  const insights = [];
  const ratings = skillRatings;
  
  // Communication insights
  if (ratings["Communication"] >= 4) {
    insights.push("Your strong communication skills make you valuable in client-facing roles and team leadership positions.");
  } else if (ratings["Communication"] <= 2) {
    insights.push("Consider developing communication skills through practice, training, or joining speaking groups like Toastmasters.");
  }

  // Leadership insights
  if (ratings["Leadership"] >= 4 && ratings["Teamwork"] >= 4) {
    insights.push("Your combination of leadership and teamwork skills suggests you'd excel in collaborative leadership roles.");
  } else if (ratings["Leadership"] >= 4 && ratings["Leadership"] > ratings["Teamwork"]) {
    insights.push("You show strong leadership potential. Consider roles where you can mentor others and drive initiatives.");
  }

  // Problem-solving and creativity
  if (ratings["Problem Solving"] >= 4 && ratings["Creativity"] >= 4) {
    insights.push("Your creative problem-solving approach makes you ideal for innovation-focused roles and complex challenge resolution.");
  }

  // Adaptability insights
  if (ratings["Adaptability"] >= 4) {
    insights.push("Your high adaptability means you'd thrive in fast-paced, changing environments like startups or dynamic teams.");
  } else if (ratings["Adaptability"] <= 2) {
    insights.push("You may prefer structured, predictable work environments with clear processes and stable routines.");
  }

  // Emotional intelligence
  if (ratings["Emotional Intelligence"] >= 4) {
    insights.push("Your emotional intelligence is a significant asset for roles involving people management, counseling, or customer relations.");
  }

  // Work style recommendations
  const avgRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;
  if (avgRating >= 4) {
    insights.push("Your overall high skill ratings suggest you're ready for senior or specialized roles with significant responsibility.");
  } else if (avgRating >= 3) {
    insights.push("You demonstrate solid interpersonal skills suitable for mid-level positions with growth potential.");
  } else {
    insights.push("Focus on developing key soft skills through training, practice, and seeking feedback to advance your career.");
  }

  return insights;
};
