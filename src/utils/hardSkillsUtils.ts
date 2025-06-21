
export const getSkillLevel = (rating: number) => {
  if (rating === 0) return { level: "No Experience", color: "bg-gray-500" };
  if (rating <= 1) return { level: "Beginner", color: "bg-red-500" };
  if (rating <= 2) return { level: "Basic", color: "bg-orange-500" };
  if (rating <= 3) return { level: "Intermediate", color: "bg-yellow-500" };
  if (rating <= 4) return { level: "Advanced", color: "bg-blue-500" };
  return { level: "Expert", color: "bg-green-500" };
};

export const getRecommendations = (skillRatings: { [key: string]: number }) => {
  const highRatings = Object.entries(skillRatings)
    .filter(([_, rating]) => rating >= 4)
    .map(([skill, _]) => skill);

  const mediumRatings = Object.entries(skillRatings)
    .filter(([_, rating]) => rating >= 2 && rating < 4)
    .map(([skill, _]) => skill);

  return {
    strengths: highRatings,
    improvements: mediumRatings.slice(0, 3)
  };
};
