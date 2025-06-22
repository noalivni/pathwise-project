
// Utility function to parse Skills_required text into array
export const parseSkillsFromText = (skillsText: string): string[] => {
  if (!skillsText || typeof skillsText !== 'string') return [];
  return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
};
