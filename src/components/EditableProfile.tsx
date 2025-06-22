
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Award, Edit2, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const EditableProfile = () => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    degree_certification: "",
    fields_of_study: "",
    graduation_year: "",
    hard_skills: [] as string[],
    career_history: ""
  });

  const educationLevels = ["High School", "Bachelor's", "Master's", "PhD"];
  const fieldsOfStudy = [
    "Computer Science", "Business Administration", "Engineering", "Marketing",
    "Finance", "Psychology", "Design", "Data Science", "Healthcare", "Education", "Other"
  ];
  const graduationYears = Array.from({ length: 2050 - 1985 + 1 }, (_, i) => (1985 + i).toString());

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        degree_certification: profile.degree_certification || "",
        fields_of_study: profile.fields_of_study || "",
        graduation_year: profile.graduation_year || "",
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
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        degree_certification: profile.degree_certification || "",
        fields_of_study: profile.fields_of_study || "",
        graduation_year: profile.graduation_year || "",
        hard_skills: profile.hard_skills || [],
        career_history: profile.career_history || ""
      });
    }
    setIsEditing(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pathwise-text">Your Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <User className="mr-2 h-5 w-5 text-teal-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name" className="text-gray-400">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="text-pathwise-text-muted"
                />
              ) : (
                <p className="text-pathwise-text-muted mt-1">{profile.full_name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label className="text-gray-400">Email</Label>
              <p className="text-pathwise-text-muted mt-1">{profile.email || 'Not provided'}</p>
            </div>
            <div>
              <Label htmlFor="location" className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="text-pathwise-text-muted"
                />
              ) : (
                <p className="text-pathwise-text-muted mt-1">{profile.location || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Background */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
            Educational Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree_certification" className="text-gray-400">Education Level</Label>
              {isEditing ? (
                <Select value={formData.degree_certification} onValueChange={(value) => setFormData({ ...formData, degree_certification: value })}>
                  <SelectTrigger className="text-pathwise-text-muted">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-pathwise-text-muted mt-1">{profile.degree_certification || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="fields_of_study" className="text-gray-400">Field of Study</Label>
              {isEditing ? (
                <Select value={formData.fields_of_study} onValueChange={(value) => setFormData({ ...formData, fields_of_study: value })}>
                  <SelectTrigger className="text-pathwise-text-muted">
                    <SelectValue placeholder="Select field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldsOfStudy.map((field) => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-pathwise-text-muted mt-1">{profile.fields_of_study || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="graduation_year" className="text-gray-400">Graduation Year</Label>
              {isEditing ? (
                <Select value={formData.graduation_year} onValueChange={(value) => setFormData({ ...formData, graduation_year: value })}>
                  <SelectTrigger className="text-pathwise-text-muted">
                    <SelectValue placeholder="Select graduation year" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduationYears.reverse().map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-pathwise-text-muted mt-1">{profile.graduation_year || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <Award className="mr-2 h-5 w-5 text-green-600" />
            Skills & Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hard_skills" className="text-gray-400">Technical Skills</Label>
            {isEditing ? (
              <Textarea
                id="hard_skills"
                placeholder="Enter skills separated by commas"
                value={formData.hard_skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                className="text-pathwise-text-muted"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.hard_skills && profile.hard_skills.length > 0 ? (
                  profile.hard_skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-pathwise-text-secondary">No skills added yet</p>
                )}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="career_history" className="flex items-center text-gray-400">
              <Briefcase className="w-4 h-4 mr-1" />
              Career History
            </Label>
            {isEditing ? (
              <Textarea
                id="career_history"
                value={formData.career_history}
                onChange={(e) => setFormData({ ...formData, career_history: e.target.value })}
                className="text-pathwise-text-muted"
              />
            ) : (
              <p className="text-pathwise-text-muted mt-1">{profile.career_history || 'Not provided'}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableProfile;
