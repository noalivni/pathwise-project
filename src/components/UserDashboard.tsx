
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, BookOpen, Users, Award, ChevronRight } from "lucide-react";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, Sarah!</h1>
          <p className="text-slate-600 mt-1">Continue your career journey</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
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
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Complete your skills assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-2">New matches this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground mt-2">Courses completed</p>
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
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
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
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Practice Interview Questions</h3>
                <p className="text-sm text-slate-600">Prepare for upcoming interviews</p>
                <Badge className="mt-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white">PRO</Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Learn React Development</h3>
                <p className="text-sm text-slate-600">Recommended based on your career goals</p>
                <Badge className="mt-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white">PRO</Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
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
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span className="text-slate-600">Completed "Frontend Developer" skills assessment</span>
            <span className="text-slate-400 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">Bookmarked 3 new job opportunities</span>
            <span className="text-slate-400 ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">Updated resume with new skills</span>
            <span className="text-slate-400 ml-auto">3 days ago</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
