
export const EDUCATION_LEVELS = ["High School", "Bachelor's", "Master's", "PhD"];

export const FIELDS_OF_STUDY = [
  "Computer Science", "Business Administration", "Engineering", "Marketing",
  "Finance", "Psychology", "Design", "Data Science", "Healthcare", "Education", "Other"
];

export const GRADUATION_YEARS = Array.from(
  { length: 2050 - 1985 + 1 }, 
  (_, i) => (1985 + i).toString()
);

export const CAREER_FIELDS = [
  "UX/UI Design", "Data Analytics", "Marketing", "Product Management", 
  "Human Resources", "Software Development", "Finance", "Sales", 
  "Operations", "Content Creation", "Consulting", "Healthcare", "Education"
];

export const TOTAL_STEPS = 5;
