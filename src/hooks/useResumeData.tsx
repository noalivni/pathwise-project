
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface ResumeData {
  fullName: string;
  email: string;
  location: string;
  summary: string;
  education: {
    degree: string;
    field: string;
    year: string;
    institution: string;
  };
  skills: string[];
  experience: string;
  careerGoal: string;
  additionalInfo: string;
}

export const useResumeData = () => {
  const { profile } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "",
    email: "",
    location: "",
    summary: "",
    education: {
      degree: "",
      field: "",
      year: "",
      institution: ""
    },
    skills: [],
    experience: "",
    careerGoal: "",
    additionalInfo: ""
  });

  const generateSummary = () => {
    if (!profile) return "";
    
    const field = profile.field_of_interest || "professional";
    const education = profile.degree_certification || "educated";
    const skills = profile.hard_skills?.slice(0, 3).join(", ") || "various technical skills";
    
    return `${education} professional seeking opportunities in ${field.toLowerCase()}. Skilled in ${skills} with a passion for delivering high-quality results and continuous learning.`;
  };

  // Auto-populate from profile data
  useEffect(() => {
    if (profile) {
      setResumeData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        location: profile.location || "",
        summary: generateSummary(),
        education: {
          degree: profile.degree_certification || "",
          field: profile.fields_of_study || "",
          year: profile.graduation_year || "",
          institution: ""
        },
        skills: profile.hard_skills || [],
        experience: profile.career_history || "",
        careerGoal: profile.field_of_interest || "",
        additionalInfo: `Seeking opportunities in ${profile.field_of_interest || 'professional development'}`
      });
    }
  }, [profile]);

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setResumeData({ ...resumeData, skills: skillsArray });
  };

  return {
    resumeData,
    setResumeData,
    handleSkillsChange
  };
};
