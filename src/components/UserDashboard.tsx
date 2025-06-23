import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, BookOpen, Users, Award, ChevronRight, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { trackSkillsAssessment, trackJobEvent, trackInterviewPractice } from "@/utils/analytics";

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
    trackSkillsAssessment('start', 'hard');
    window.dispatchEvent(new CustomEvent('navigate-to-assessment'));
  };

  const handleNavigateToJobs = () => {
    trackJobEvent('view');
    window.dispatchEvent(new CustomEvent('navigate-to-jobs'));
  };

  const handleNavigateToInterview = () => {
    trackInterviewPractice('start');
    window.dispatchEvent(new CustomEvent('navigate-to-interview'));
  };

  const profileCompletion = getProfileCompletion();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-pathwise-text">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-pathwise-text-secondary mt-1">Continue your career journey</p>
        </div>
        <Button 
          onClick={handleNavigateToAssessment}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Brain className="w-4 h-4 mr-2" />
          Take Assessment
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pathwise-text">Profile Completion</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pathwise-text">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-2" />
            <p className="text-xs text-pathwise-text-secondary mt-2">
              {profileCompletion < 100 ? 'Complete your profile' : 'Profile completed!'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pathwise-text">Job Matches</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pathwise-text">{jobMatches}</div>
            <p className="text-xs text-pathwise-text-secondary mt-2">
              {jobMatches > 0 ? 'Matches found' : 'Complete assessment for matches'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pathwise-text">Assessments</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pathwise-text">{completedAssessments}</div>
            <p className="text-xs text-pathwise-text-secondary mt-2">
              {completedAssessments > 0 ? 'Assessments completed' : 'Take your first assessment'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription className="text-pathwise-text-secondary">Personalized actions to advance your career</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button 
            onClick={handleNavigateToAssessment}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover-pathwise transition-all duration-200 w-full text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-pathwise-text">Complete Skills Assessment</h3>
                <p className="text-sm text-pathwise-text-secondary">Get personalized job recommendations</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-pathwise-text-secondary" />
          </button>

          <button 
            onClick={handleNavigateToJobs}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover-pathwise transition-all duration-200 w-full text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-pathwise-text">View Job Recommendations</h3>
                <p className="text-sm text-pathwise-text-secondary">Explore matching career opportunities</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-pathwise-text-secondary" />
          </button>

          <button 
            onClick={handleNavigateToInterview}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover-pathwise transition-all duration-200 w-full text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-pathwise-text">Practice Interview Questions</h3>
                <p className="text-sm text-pathwise-text-secondary">Prepare for upcoming interviews</p>
                <Badge className="mt-1 bg-primary text-primary-foreground">PRO</Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-pathwise-text-secondary" />
          </button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <Award className="mr-2 h-5 w-5 text-secondary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-pathwise-text-secondary">{activity.activity_description}</span>
                <span className="text-pathwise-text-secondary/60 ml-auto">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-pathwise-text-secondary text-center py-4">
              No recent activity. Start by completing your skills assessment!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
