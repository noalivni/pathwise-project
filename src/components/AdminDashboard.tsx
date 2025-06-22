
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, PlayCircle, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MonthlyData {
  month: string;
  users: number;
  interviews: number;
}

interface JobRoleData {
  name: string;
  value: number;
  color: string;
}

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [totalJobMatches, setTotalJobMatches] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [popularJobs, setPopularJobs] = useState<JobRoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setTotalUsers(usersCount || 0);

      // Fetch total interview sessions
      const { count: interviewCount } = await supabase
        .from('interview_sessions')
        .select('*', { count: 'exact', head: true });

      setTotalInterviews(interviewCount || 0);

      // Fetch total job matches
      const { count: jobMatchesCount } = await supabase
        .from('user_job_matches')
        .select('*', { count: 'exact', head: true });

      setTotalJobMatches(jobMatchesCount || 0);

      // Fetch monthly user registration data (last 6 months)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      // Process monthly user data
      const monthlyUserData = processMonthlyData(profilesData || [], 'created_at');

      // Fetch monthly interview data
      const { data: interviewData } = await supabase
        .from('interview_sessions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      const monthlyInterviewData = processMonthlyData(interviewData || [], 'created_at');

      // Combine monthly data
      const combinedMonthlyData = combineMonthlyData(monthlyUserData, monthlyInterviewData);
      setMonthlyData(combinedMonthlyData);

      // Fetch popular job roles data
      const { data: jobMatchData } = await supabase
        .from('user_job_matches')
        .select(`
          job_role_id,
          job_roles!inner(job_title)
        `);

      const jobRoleStats = processJobRoleData(jobMatchData || []);
      setPopularJobs(jobRoleStats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (data: any[], dateField: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCount: { [key: string]: number } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = months[date.getMonth()];
      monthlyCount[monthKey] = 0;
    }

    // Count items by month
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = months[date.getMonth()];
      if (monthlyCount.hasOwnProperty(monthKey)) {
        monthlyCount[monthKey]++;
      }
    });

    return monthlyCount;
  };

  const combineMonthlyData = (userData: { [key: string]: number }, interviewData: { [key: string]: number }) => {
    const months = Object.keys(userData);
    return months.map(month => ({
      month,
      users: userData[month] || 0,
      interviews: interviewData[month] || 0,
    }));
  };

  const processJobRoleData = (data: any[]): JobRoleData[] => {
    const jobCounts: { [key: string]: number } = {};
    
    data.forEach(match => {
      const jobTitle = match.job_roles?.job_title || 'Unknown';
      jobCounts[jobTitle] = (jobCounts[jobTitle] ||0) + 1;
    });

    const sortedJobs = Object.entries(jobCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const colors = ['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    return sortedJobs.map(([name, count], index) => ({
      name,
      value: count,
      color: colors[index] || '#6B7280',
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Loading platform analytics...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Platform analytics and insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyData.length > 1 ? 
                `+${Math.round(((monthlyData[monthlyData.length - 1]?.users || 0) / Math.max((monthlyData[monthlyData.length - 2]?.users || 1), 1) - 1) * 100)}%` : 
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly New Users */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly New Users</CardTitle>
            <CardDescription>User growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#14B8A6" 
                  strokeWidth={3}
                  dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Interview Simulations */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Simulations</CardTitle>
            <CardDescription>Monthly interview practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interviews" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Job Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Job Roles</CardTitle>
          <CardDescription>Job roles with the most matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularJobs}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {popularJobs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {popularJobs.length > 0 && (
              <div className="flex flex-col space-y-2 lg:ml-8">
                {popularJobs.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-gray-500">({item.value})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
