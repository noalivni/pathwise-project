
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  softSkills: string[];
  experience: string;
  careerGoal: string;
  additionalInfo: string;
}

export const useResumeData = () => {
  const { profile, user } = useAuth();
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
    softSkills: [],
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

  const fetchSkillsFromAssessments = async () => {
    if (!user) return { hardSkills: [], softSkills: [] };

    try {
      const { data: assessments } = await supabase
        .from('skills_assessments')
        .select('technical_skills, soft_skills, assessment_type')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      let hardSkills: string[] = [];
      let softSkills: string[] = [];

      if (assessments && assessments.length > 0) {
        // Get latest hard skills assessment
        const hardSkillsAssessment = assessments.find(a => a.assessment_type === 'hard_skills');
        if (hardSkillsAssessment?.technical_skills) {
          hardSkills = Object.entries(hardSkillsAssessment.technical_skills)
            .filter(([_, rating]) => (rating as number) >= 2) // Only include intermediate+ skills
            .map(([skill, _]) => skill);
        }

        // Get latest soft skills assessment
        const softSkillsAssessment = assessments.find(a => a.assessment_type === 'soft_skills');
        if (softSkillsAssessment?.soft_skills) {
          softSkills = Object.entries(softSkillsAssessment.soft_skills)
            .filter(([_, rating]) => (rating as number) >= 2) // Only include moderate+ skills
            .map(([skill, _]) => skill);
        }
      }

      return { hardSkills, softSkills };
    } catch (error) {
      console.error('Error fetching skills from assessments:', error);
      return { hardSkills: [], softSkills: [] };
    }
  };

  // Auto-populate from profile data and assessments
  useEffect(() => {
    const loadResumeData = async () => {
      if (profile) {
        const { hardSkills, softSkills } = await fetchSkillsFromAssessments();
        
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
          skills: hardSkills.length > 0 ? hardSkills : (profile.hard_skills || []),
          softSkills: softSkills,
          experience: profile.career_history || "",
          careerGoal: profile.field_of_interest || "",
          additionalInfo: `Seeking opportunities in ${profile.field_of_interest || 'professional development'}`
        });
      }
    };

    loadResumeData();
  }, [profile, user]);

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setResumeData({ ...resumeData, skills: skillsArray });
  };

  const handleSoftSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setResumeData({ ...resumeData, softSkills: skillsArray });
  };

  return {
    resumeData,
    setResumeData,
    handleSkillsChange,
    handleSoftSkillsChange
  };
};
