
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Briefcase } from "lucide-react";

interface UserBreakdown {
  total: number;
  free: number;
  premium: number;
}

interface AdminDashboardStatsProps {
  userBreakdown: UserBreakdown;
  totalInterviews: number;
  totalJobMatches: number;
}

const AdminDashboardStats = ({ userBreakdown, totalInterviews, totalJobMatches }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interview Sessions</CardTitle>
          <PlayCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInterviews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Completed sessions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
          <Briefcase className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobMatches.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total matches created</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
