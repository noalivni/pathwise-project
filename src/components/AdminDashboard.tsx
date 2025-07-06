
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, PlayCircle, Briefcase, UserCheck, Crown } from "lucide-react";
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

interface UserBreakdown {
  total: number;
  free: number;
  premium: number;
}

const AdminDashboard = () => {
  const [userBreakdown, setUserBreakdown] = useState<UserBreakdown>({ total: 0, free: 0, premium: 0 });
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [totalJobMatches, setTotalJobMatches] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [popularJobs, setPopularJobs] = useState<JobRoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          console.log('Profiles updated, refreshing dashboard data');
          fetchDashboardData();
        }
      )
      .subscribe();

    const interviewsChannel = supabase
      .channel('interviews-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'interview_sessions' },
        () => {
          console.log('Interview sessions updated, refreshing dashboard data');
          fetchDashboardData();
        }
      )
      .subscribe();

    const jobMatchesChannel = supabase
      .channel('job-matches-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_job_matches' },
        () => {
          console.log('Job matches updated, refreshing dashboard data');
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(interviewsChannel);
      supabase.removeChannel(jobMatchesChannel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');

      // Fetch user breakdown by subscription status
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('subscription_status');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      } else {
        console.log('All profiles data:', allProfiles);
        const total = allProfiles?.length || 0;
        const free = allProfiles?.filter(p => p.subscription_status === 'free' || !p.subscription_status).length || 0;
        const premium = allProfiles?.filter(p => p.subscription_status === 'premium').length || 0;
        
        setUserBreakdown({ total, free, premium });
        console.log('User breakdown:', { total, free, premium });
      }

      // Fetch total interview sessions
      const { count: interviewCount, error: interviewError } = await supabase
        .from('interview_sessions')
        .select('*', { count: 'exact', head: true });

      if (interviewError) {
        console.error('Error fetching interview count:', interviewError);
      } else {
        console.log('Interview count:', interviewCount);
        setTotalInterviews(interviewCount || 0);
      }

      // Fetch total job matches
      const { count: jobMatchesCount, error: jobMatchesError } = await supabase
        .from('user_job_matches')
        .select('*', { count: 'exact', head: true });

      if (jobMatchesError) {
        console.error('Error fetching job matches count:', jobMatchesError);
      } else {
        console.log('Job matches count:', jobMatchesCount);
        setTotalJobMatches(jobMatchesCount || 0);
      }

      // Fetch monthly user registration data for full year (Jan-Dec)
      const { data: profilesData, error: profilesDataError } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString())
        .order('created_at', { ascending: true });

      if (profilesDataError) {
        console.error('Error fetching profiles data:', profilesDataError);
      }

      // Process monthly user data for full year
      const monthlyUserData = processMonthlyDataFullYear(profilesData || [], 'created_at');

      // Fetch monthly interview data for full year
      const { data: interviewData, error: interviewDataError } = await supabase
        .from('interview_sessions')
        .select('completed_at')
        .not('completed_at', 'is', null)
        .gte('completed_at', new Date(new Date().getFullYear(), 0, 1).toISOString())
        .order('completed_at', { ascending: true });

      if (interviewDataError) {
        console.error('Error fetching interview data:', interviewDataError);
      }

      const monthlyInterviewData = processMonthlyDataFullYear(interviewData || [], 'completed_at');

      // Combine monthly data
      const combinedMonthlyData = combineMonthlyData(monthlyUserData, monthlyInterviewData);
      setMonthlyData(combinedMonthlyData);

      // Fetch popular job roles data based on interactions (views, bookmarks)
      const { data: jobMatchData, error: jobMatchError } = await supabase
        .from('user_job_matches')
        .select(`
          job_role_id,
          is_bookmarked,
          viewed_at,
          job_roles!inner(job_title)
        `);

      if (jobMatchError) {
        console.error('Error fetching job match data:', jobMatchError);
      } else {
        console.log('Job match data:', jobMatchData);
        const jobRoleStats = processJobInteractionData(jobMatchData || []);
        setPopularJobs(jobRoleStats);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyDataFullYear = (data: any[], dateField: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCount: { [key: string]: number } = {};
    const currentYear = new Date().getFullYear();

    // Initialize all 12 months
    months.forEach(month => {
      monthlyCount[month] = 0;
    });

    // Count items by month
    data.forEach(item => {
      if (item[dateField]) {
        const date = new Date(item[dateField]);
        if (date.getFullYear() === currentYear) {
          const monthKey = months[date.getMonth()];
          monthlyCount[monthKey]++;
        }
      }
    });

    return monthlyCount;
  };

  const combineMonthlyData = (userData: { [key: string]: number }, interviewData: {[key: string]: number }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      users: userData[month] || 0,
      interviews: interviewData[month] || 0,
    }));
  };

  const processJobInteractionData = (data: any[]): JobRoleData[] => {
    console.log('Processing job interaction data:', data);
    
    if (!data || data.length === 0) {
      console.log('No job interaction data to process');
      return [];
    }

    const jobStats: { [key: string]: { views: number, bookmarks: number, total: number } } = {};
    
    data.forEach(match => {
      const jobTitle = match.job_roles?.job_title || 'Unknown';
      
      if (!jobStats[jobTitle]) {
        jobStats[jobTitle] = { views: 0, bookmarks: 0, total: 0 };
      }
      
      // Count views (every match record represents a view)
      jobStats[jobTitle].views++;
      
      // Count bookmarks
      if (match.is_bookmarked) {
        jobStats[jobTitle].bookmarks++;
      }
      
      // Calculate total interactions (views + bookmarks weighted)
      jobStats[jobTitle].total = jobStats[jobTitle].views + (jobStats[jobTitle].bookmarks * 2);
    });

    console.log('Job interaction stats:', jobStats);

    const sortedJobs = Object.entries(jobStats)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 5);

    const colors = ['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    const result = sortedJobs.map(([name, stats], index) => ({
      name,
      value: stats.total,
      color: colors[index] || '#6B7280',
    }));

    console.log('Processed job interaction data:', result);
    return result;
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
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

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBreakdown.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBreakdown.free.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Free subscription</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBreakdown.premium.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Premium subscription</p>
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly New Users - Full Year */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly New Users ({new Date().getFullYear()})</CardTitle>
            <CardDescription>User registrations throughout the year</CardDescription>
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

      {/* Most Popular Job Roles - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Job Roles</CardTitle>
          <CardDescription>Job roles with the most user interactions (views and bookmarks)</CardDescription>
        </CardHeader>
        <CardContent>
          {popularJobs.length > 0 ? (
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
              <div className="flex flex-col space-y-2 lg:ml-8">
                {popularJobs.map((item, index) => {
                  const total = popularJobs.reduce((sum, job) => sum + job.value, 0);
                  const percentage = ((item.value / total) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm text-gray-500">({item.value} interactions - {percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No job interaction data available yet</p>
              <p className="text-sm text-gray-400 mt-2">Data will appear as users interact with job roles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
