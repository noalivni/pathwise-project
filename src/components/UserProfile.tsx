
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Award, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const UserProfile = () => {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Loading Profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Your Profile</h1>
        <Badge 
          variant={profile.subscription_status === 'premium' ? 'default' : 'secondary'}
          className={profile.subscription_status === 'premium' ? 'bg-gradient-to-r from-teal-500 to-blue-600' : ''}
        >
          {profile.subscription_status === 'premium' && <Crown className="w-3 h-3 mr-1" />}
          {profile.subscription_status.toUpperCase()}
        </Badge>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-teal-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-1">Full Name</h3>
              <p className="text-slate-800">{profile.full_name || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-1">Email</h3>
              <p className="text-slate-800">{profile.email || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </h3>
              <p className="text-slate-800">{profile.location || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Background */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
            Educational Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-1">Degree/Certification</h3>
              <p className="text-slate-800">{profile.degree_certification || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-1">Fields of Study</h3>
              <p className="text-slate-800">{profile.fields_of_study || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-1">Graduation Year</h3>
              <p className="text-slate-800">{profile.graduation_year || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-green-600" />
            Skills & Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-slate-600 mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.hard_skills && profile.hard_skills.length > 0 ? (
                profile.hard_skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-slate-500">No skills added yet</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-600 mb-1 flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              Career History
            </h3>
            <p className="text-slate-800">{profile.career_history || 'Not provided'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant={profile.onboarding_completed ? 'default' : 'secondary'}>
              {profile.onboarding_completed ? 'Profile Complete' : 'Profile Incomplete'}
            </Badge>
            {!profile.onboarding_completed && (
              <p className="text-sm text-slate-600">
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
