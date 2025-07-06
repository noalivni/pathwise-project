import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, GraduationCap, Briefcase, Award, Crown, CreditCard, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSkillLevel } from "@/utils/hardSkillsUtils";

const UserProfile = () => {
  const { profile, user } = useAuth();
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});
  const [softSkillRatings, setSoftSkillRatings] = useState<{ [key: string]: number }>({});
  const [assessmentSkills, setAssessmentSkills] = useState<{ skill: string; rating: number; level: string; color: string }[]>([]);

  useEffect(() => {
    const fetchSkillRatings = async () => {
      if (!user) return;

      try {
        const { data: assessments } = await supabase
          .from('skills_assessments')
          .select('technical_skills, soft_skills, assessment_type')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (assessments && assessments.length > 0) {
          const hardSkillsAssessment = assessments.find(a => a.assessment_type === 'hard_skills');
          const softSkillsAssessment = assessments.find(a => a.assessment_type === 'soft_skills');

          if (hardSkillsAssessment?.technical_skills) {
            const technicalSkills = hardSkillsAssessment.technical_skills;
            if (typeof technicalSkills === 'object' && technicalSkills !== null && !Array.isArray(technicalSkills)) {
              const skillsObj: { [key: string]: number } = {};
              Object.entries(technicalSkills).forEach(([key, value]) => {
                if (typeof value === 'number') {
                  skillsObj[key] = value;
                }
              });
              setSkillRatings(skillsObj);

              // Create filtered skills for display (only 2+)
              const filteredSkills = Object.entries(technicalSkills)
                .filter(([_, rating]) => (rating as number) >= 2)
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

          if (softSkillsAssessment?.soft_skills) {
            const softSkills = softSkillsAssessment.soft_skills;
            if (typeof softSkills === 'object' && softSkills !== null && !Array.isArray(softSkills)) {
              const skillsObj: { [key: string]: number } = {};
              Object.entries(softSkills).forEach(([key, value]) => {
                if (typeof value === 'number') {
                  skillsObj[key] = value;
                }
              });
              setSoftSkillRatings(skillsObj);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching skill ratings:', error);
      }
    };

    fetchSkillRatings();
  }, [user]);

  const formatSkillName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Merge manual skills and assessment skills, avoiding duplicates
  const getMergedSkills = () => {
    const manualSkills = profile?.hard_skills || [];
    
    // Create a combined list avoiding duplicates
    const allSkills = [...manualSkills];
    
    assessmentSkills.forEach(assessmentSkill => {
      const formattedAssessmentSkill = formatSkillName(assessmentSkill.skill);
      const isAlreadyIncluded = manualSkills.some(manualSkill => 
        manualSkill.toLowerCase() === formattedAssessmentSkill.toLowerCase()
      );
      
      if (!isAlreadyIncluded) {
        allSkills.push(formattedAssessmentSkill);
      }
    });
    
    return allSkills;
  };

  // Get assessment data for a skill to show rating
  const getAssessmentDataForSkill = (skillName: string) => {
    return assessmentSkills.find(assessmentSkill => {
      const formattedAssessmentSkill = formatSkillName(assessmentSkill.skill);
      return formattedAssessmentSkill.toLowerCase() === skillName.toLowerCase();
    });
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

  const mergedSkills = getMergedSkills();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pathwise-text">Your Profile</h1>
        <Badge 
          variant={profile.subscription_status === 'premium' ? 'default' : 'secondary'}
          className={profile.subscription_status === 'premium' ? 'bg-gradient-to-r from-teal-500 to-blue-600' : ''}
        >
          {profile.subscription_status === 'premium' && <Crown className="w-3 h-3 mr-1" />}
          {profile.subscription_status.toUpperCase()}
        </Badge>
      </div>

      {/* Account Type Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <CreditCard className="mr-2 h-5 w-5 text-orange-600" />
            Account Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Badge 
              variant={profile.subscription_status === 'premium' ? 'default' : 'secondary'}
              className={profile.subscription_status === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gray-100 text-gray-700'}
            >
              {profile.subscription_status === 'premium' && <Crown className="w-3 h-3 mr-1" />}
              {profile.subscription_status === 'premium' ? 'Premium' : 'Free'}
            </Badge>
            {profile.subscription_status === 'premium' ? (
              <span className="text-sm text-pathwise-text-muted">
                You have access to all premium features
              </span>
            ) : (
              <span className="text-sm text-pathwise-text-muted">
                Upgrade to unlock premium features
              </span>
            )}
          </div>
        </CardContent>
      </Card>

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
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1">Full Name</h3>
              <p className="text-pathwise-text">{profile.full_name || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1">Email</h3>
              <p className="text-pathwise-text">{profile.email || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </h3>
              <p className="text-pathwise-text">{profile.location || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Field of Interest
              </h3>
              <p className="text-pathwise-text">{profile.field_of_interest || 'Not provided'}</p>
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
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1">Degree/Certification</h3>
              <p className="text-pathwise-text">{profile.degree_certification || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1">Fields of Study</h3>
              <p className="text-pathwise-text">{profile.fields_of_study || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1">Graduation Year</h3>
              <p className="text-pathwise-text">{profile.graduation_year || 'Not provided'}</p>
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
            <h3 className="font-semibold text-sm text-pathwise-text-muted mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {mergedSkills.length > 0 ? (
                mergedSkills.map((skill, index) => {
                  const assessmentData = getAssessmentDataForSkill(skill);
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <Badge 
                        variant="outline" 
                        className={assessmentData ? `${assessmentData.color} text-white` : 'bg-blue-100 text-blue-800 border-blue-200'}
                      >
                        {skill}
                      </Badge>
                      {assessmentData && (
                        <span className="text-xs text-muted-foreground">
                          ({assessmentData.rating}/4)
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-pathwise-text-secondary">No skills added yet. Add skills manually or complete a Hard Skills Assessment.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-pathwise-text-muted mb-2">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(softSkillRatings).length > 0 ? (
                Object.entries(softSkillRatings).map(([skill, rating], index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Badge variant="secondary">
                      {formatSkillName(skill)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({rating}/4)
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-pathwise-text-secondary">No soft skills assessed yet</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-pathwise-text-muted mb-1 flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              Career History
            </h3>
            <p className="text-pathwise-text">{profile.career_history || 'Not provided'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-pathwise-text">Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant={profile.onboarding_completed ? 'default' : 'secondary'}>
              {profile.onboarding_completed ? 'Profile Complete' : 'Profile Incomplete'}
            </Badge>
            {!profile.onboarding_completed && (
              <p className="text-sm text-pathwise-text-muted">
                Complete your onboarding to unlock all features
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
