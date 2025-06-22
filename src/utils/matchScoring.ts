
export const getMatchColor = (match: number): string => {
  if (match >= 80) return "bg-green-500";
  if (match >= 65) return "bg-blue-500";
  if (match >= 50) return "bg-yellow-500";
  return "bg-gray-500";
};

export const getMatchDescription = (match: number): string => {
  if (match >= 80) return "Excellent fit based on your goals and skills";
  if (match >= 65) return "Good alignment with your profile";
  if (match >= 50) return "Potential match worth exploring";
  return "Consider developing skills in this area";
};
