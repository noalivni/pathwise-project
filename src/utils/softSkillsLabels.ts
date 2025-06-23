
// Mapping for soft skills assessment labels to ensure consistency
export const skillLevelLabels = {
  0: "Not me",
  1: "Somewhat", 
  2: "Moderately",
  3: "Very much",
  4: "Extremely"
} as const;

export const getSkillLevelDescription = (level: number): string => {
  return skillLevelLabels[level as keyof typeof skillLevelLabels] || "Not assessed";
};

export const getSkillLevelWithCount = (level: number): string => {
  const label = getSkillLevelDescription(level);
  return `${label} (${level}/4)`;
};

// For displaying progress indicators
export const getSkillProgressText = (completedCount: number, totalCount: number = 5): string => {
  if (completedCount === 0) {
    return "Not assessed (0/5)";
  }
  return `In progress (${completedCount}/${totalCount})`;
};
