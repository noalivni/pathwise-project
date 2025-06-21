
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, BookOpen, Users, Award, ChevronRight, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Activity {
  id: string;
  activity_description: string;
  created_at: string;
}

const UserDashboard = () => {
  const { profile, user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [jobMatches, setJobMatches] = useState(0);
  const [completedAssessments, setCompletedAssessments] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch recent activities
    const { data: activitiesData } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (activitiesData) {
      setActivities(activitiesData);
    }

    // Fetch job matches count
    const { count: matchesCount } = await supabase
      .from('user_job_matches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (matchesCount) {
      setJobMatches(matchesCount);
    }

    // Fetch completed assessments count
    const { count: assessmentsCount } = await supabase
      .from('skills_assessments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (assessmentsCount) {
      setCompletedAssessments(assessmentsCount);
    }
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.full_name,
      profile.location,
      profile.degree_certification,
      profile.fields_of_study,
      profile.hard_skills?.length,
      profile.career_history
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleNavigateToAssessment = () => {
    // This will be handled by the parent component
    window.dispatchEvent(new CustomEvent('navigate-to-assessment'));
  };

  const handleNavigateToJobs = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-jobs'));
  };

  const handleNavigateToInterview = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-interview'));
  };

  const profileCompletion = getProfileCompletion();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-slate-600 mt-1">Continue your career journey</p>
        </div>
        <Button 
          onClick={handleNavigateToAssessment}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
        >
          <Brain className="w-4 h-4 mr-2" />
          Take Assessment
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Target className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {profileCompletion < 100 ? 'Complete your profile' : 'Profile completed!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobMatches}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {jobMatches > 0 ? 'Matches found' : 'Complete assessment for matches'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <BookOpen className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssessments}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedAssessments > 0 ? 'Assessments completed' : 'Take your first assessment'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-teal-600" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription>Personalized actions to advance your career</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button 
            onClick={handleNavigateToAssessment}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors w-full text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold">Complete Skills Assessment</h3>
                <p className="text-sm text-slate-600">Get personalized job recommendations</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>

          <button 
            onClick={handleNavigateToJobs}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors w-full text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">View Job Recommendations</h3>
                <p className="text-sm text-slate-600">Explore matching career opportunities</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>

          <button 
            onClick={handleNavigateToInterview}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors w-full text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Practice Interview Questions</h3>
                <p className="text-sm text-slate-600">Prepare for upcoming interviews</p>
                <Badge className="mt-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white">PRO</Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-600">{activity.activity_description}</span>
                <span className="text-slate-400 ml-auto">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500 text-center py-4">
              No recent activity. Start by completing your skills assessment!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
