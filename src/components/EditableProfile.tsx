
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccountTypeSection from "@/components/profile/AccountTypeSection";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsExperienceSection from "@/components/profile/SkillsExperienceSection";

const EditableProfile = () => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    field_of_interest: "",
    hard_skills: [] as string[],
    career_history: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        degree_certification: profile.degree_certification || "",
        fields_of_study: profile.fields_of_study || "",
        graduation_year: profile.graduation_year || "",
        field_of_interest: profile.field_of_interest || "",
        hard_skills: profile.hard_skills || [],
        career_history: profile.career_history || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.full_name,
        location: formData.location,
        degree_certification: formData.degree_certification,
        fields_of_study: formData.fields_of_study,
        graduation_year: formData.graduation_year,
        field_of_interest: formData.field_of_interest,
        hard_skills: formData.hard_skills,
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
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        degree_certification: profile.degree_certification || "",
        fields_of_study: profile.fields_of_study || "",
        graduation_year: profile.graduation_year || "",
        field_of_interest: profile.field_of_interest || "",
        hard_skills: profile.hard_skills || [],
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
          hard_skills: formData.hard_skills,
          career_history: formData.career_history
        }}
        onFormDataChange={handleFormDataChange}
        onSkillsChange={handleSkillsChange}
      />
    </div>
  );
};

export default EditableProfile;
