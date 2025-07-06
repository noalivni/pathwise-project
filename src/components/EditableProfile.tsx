
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSkillLevel } from "@/utils/hardSkillsUtils";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccountTypeSection from "@/components/profile/AccountTypeSection";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsExperienceSection from "@/components/profile/SkillsExperienceSection";

const EditableProfile = () => {
  const { profile, updateProfile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [assessmentSkills, setAssessmentSkills] = useState<{ skill: string; rating: number; level: string; color: string }[]>([]);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    field_of_interest: "",
    hard_skills: [] as string[], // Only manual skills
    career_history: ""
  });

  useEffect(() => {
    const fetchAssessmentSkills = async () => {
      if (!user) return;

      try {
        const { data: assessments } = await supabase
          .from('skills_assessments')
          .select('technical_skills')
          .eq('user_id', user.id)
          .eq('assessment_type', 'hard_skills')
          .order('completed_at', { ascending: false })
          .limit(1);

        if (assessments && assessments.length > 0 && assessments[0].technical_skills) {
          const technicalSkills = assessments[0].technical_skills;
          if (typeof technicalSkills === 'object' && technicalSkills !== null && !Array.isArray(technicalSkills)) {
            const filteredSkills = Object.entries(technicalSkills)
              .filter(([_, rating]) => (rating as number) >= 2) // Only show Intermediate (2), Advanced (3), Expert (4)
              .map(([skill, rating]) => {
                const skillInfo = getSkillLevel(rating as number);
                return {
                  skill,
                  rating: rating as number,
                  level: skillInfo.level,
                  color: skillInfo.color
                };
              });
            setAssessmentSkills(filteredSkills);
          }
        }
      } catch (error) {
        console.error('Error fetching assessment skills:', error);
      }
    };

    fetchAssessmentSkills();
  }, [user]);

  useEffect(() => {
    if (profile) {
      // Only use manual skills from the profile, don't merge with assessment skills
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        degree_certification: profile.degree_certification || "",
        fields_of_study: profile.fields_of_study || "",
        graduation_year: profile.graduation_year || "",
        field_of_interest: profile.field_of_interest || "",
        hard_skills: profile.hard_skills || [], // Only manual skills
        career_history: profile.career_history || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      // Save only the manual skills to the profile
      await updateProfile({
        full_name: formData.full_name,
        location: formData.location,
        degree_certification: formData.degree_certification,
        fields_of_study: formData.fields_of_study,
        graduation_year: formData.graduation_year,
        field_of_interest: formData.field_of_interest,
        hard_skills: formData.hard_skills, // Only manual skills
        career_history: formData.career_history
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      // Reset to original manual skills only
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        degree_certification: profile.degree_certification || "",
        fields_of_study: profile.fields_of_study || "",
        graduation_year: profile.graduation_year || "",
        field_of_interest: profile.field_of_interest || "",
        hard_skills: profile.hard_skills || [], // Only manual skills
        career_history: profile.career_history || ""
      });
    }
    setIsEditing(false);
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setFormData({ ...formData, hard_skills: skillsArray });
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pathwise-text mb-4">Loading Profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <AccountTypeSection subscriptionStatus={profile.subscription_status} />

      <PersonalInfoSection
        isEditing={isEditing}
        formData={{
          full_name: formData.full_name,
          location: formData.location,
          field_of_interest: formData.field_of_interest
        }}
        profileEmail={profile.email}
        onFormDataChange={handleFormDataChange}
      />

      <EducationSection
        isEditing={isEditing}
        formData={{
          degree_certification: formData.degree_certification,
          fields_of_study: formData.fields_of_study,
          graduation_year: formData.graduation_year
        }}
        onFormDataChange={handleFormDataChange}
      />

      <SkillsExperienceSection
        isEditing={isEditing}
        formData={{
          hard_skills: formData.hard_skills, // Only manual skills for editing
          career_history: formData.career_history
        }}
        assessmentSkills={assessmentSkills} // Pass assessment skills separately
        onFormDataChange={handleFormDataChange}
        onSkillsChange={handleSkillsChange}
      />
    </div>
  );
};

export default EditableProfile;
