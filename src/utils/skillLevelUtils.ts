
import { SkillLevel } from "@/types/softSkills";

export const getSkillLevel = (rating: number): SkillLevel => {
  if (rating === 0) return { level: "Not me", color: "bg-gray-500" };
  if (rating <= 1) return { level: "Somewhat", color: "bg-red-500" };
  if (rating <= 2) return { level: "Moderately", color: "bg-orange-500" };
  if (rating <= 3) return { level: "Very much", color: "bg-blue-500" };
  return { level: "Extremely", color: "bg-green-500" };
};
