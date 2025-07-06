
import { useState, useEffect } from "react";
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

export const useAdminDashboardData = () => {
  const [userBreakdown, setUserBreakdown] = useState<UserBreakdown>({ total: 0, free: 0, premium: 0 });
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [totalJobMatches, setTotalJobMatches] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [popularJobs, setPopularJobs] = useState<JobRoleData[]>([]);
  const [loading, setLoading] = useState(true);

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

  return {
    userBreakdown,
    totalInterviews,
    totalJobMatches,
    monthlyData,
    popularJobs,
    loading
  };
};
