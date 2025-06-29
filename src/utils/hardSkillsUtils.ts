
export const getSkillLevel = (rating: number) => {
  if (rating === 0) return { level: "Not familiar", color: "bg-gray-500" };
  if (rating <= 1) return { level: "Basic", color: "bg-red-500" };
  if (rating <= 2) return { level: "Intermediate", color: "bg-orange-500" };
  if (rating <= 3) return { level: "Advanced", color: "bg-blue-500" };
  return { level: "Expert", color: "bg-green-500" };
};

export const getRecommendations = (skillRatings: { [key: string]: number }) => {
  const highRatings = Object.entries(skillRatings)
    .filter(([_, rating]) => rating >= 3)
    .map(([skill, _]) => skill);

  const mediumRatings = Object.entries(skillRatings)
    .filter(([_, rating]) => rating >= 1 && rating < 3)
    .map(([skill, _]) => skill);

  return {
    strengths: highRatings,
    improvements: mediumRatings.slice(0, 3)
  };
};

export const getActionableInsights = (skillRatings: { [key: string]: number }, fieldOfInterest: string) => {
  const insights = [];
  const avgRating = Object.values(skillRatings).reduce((a, b) => a + b, 0) / Object.values(skillRatings).length;
  
  if (avgRating >= 3) {
    insights.push(`You're ready for senior ${fieldOfInterest} roles - consider leadership positions or specialized consulting work`);
    insights.push("Your strong technical foundation qualifies you for mentoring junior professionals");
  } else if (avgRating >= 2) {
    insights.push(`Focus on mastering 2-3 key ${fieldOfInterest} tools to reach expert level and unlock senior opportunities`);
    insights.push("Consider obtaining professional certifications in your strongest skills to validate your expertise");
  } else if (avgRating >= 1) {
    insights.push("Build proficiency through hands-on projects and structured learning programs");
    insights.push("Seek opportunities to apply these skills in real work scenarios to gain practical experience");
  } else {
    insights.push("Start with online courses and tutorials to build foundational knowledge");
    insights.push("Look for entry-level positions or internships that provide training in these areas");
  }

  // Add skill-specific insights
  const lowSkills = Object.entries(skillRatings).filter(([_, rating]) => rating <= 1);
  if (lowSkills.length > 0) {
    insights.push(`Prioritize learning ${lowSkills[0][0]} as it's fundamental for ${fieldOfInterest} careers`);
  }

  return insights.slice(0, 4); // Return top 4 insights
};
