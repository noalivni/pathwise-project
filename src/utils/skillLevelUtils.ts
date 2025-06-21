
import { SkillLevel } from "@/types/softSkills";

export const getSkillLevel = (rating: number): SkillLevel => {
  if (rating === 0) return { level: "Not Assessed", color: "bg-gray-500" };
  if (rating <= 1) return { level: "Developing", color: "bg-red-500" };
  if (rating <= 2) return { level: "Basic", color: "bg-orange-500" };
  if (rating <= 3) return { level: "Competent", color: "bg-yellow-500" };
  if (rating <= 4) return { level: "Proficient", color: "bg-blue-500" };
  return { level: "Expert", color: "bg-green-500" };
};
