
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Award, Crown, CreditCard, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const UserProfile = () => {
  const { profile } = useAuth();

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
