
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useJobRecommendationStats } from "./useJobRecommendationStats";

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
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { jobRecommendationStats, loading: jobStatsLoading, refreshStats } = useJobRecommendationStats();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching admin dashboard data...');

      // First, check user role to ensure admin access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ No authenticated user found');
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in as an admin to view this dashboard"
        });
        return;
      }

      const userRole = await supabase.rpc('get_user_role', { user_uuid: user.id });
      console.log('👤 Current user role:', userRole.data);

      if (userRole.data !== 'admin') {
        console.error('❌ User is not an admin');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be an admin to view this dashboard"
        });
        return;
      }

      // Fetch ALL user profiles with enhanced debugging
      console.log('📊 Fetching all profiles with admin privileges...');
      const { data: allProfiles, error: profilesError, count: totalProfilesCount } = await supabase
        .from('profiles')
        .select('id, subscription_status, created_at, email, full_name', { count: 'exact' });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        toast({
          variant: "destructive",
          title: "Error fetching user data",
          description: profilesError.message
        });
      } else {
        console.log('✅ Raw profiles data:', allProfiles);
        console.log('✅ Total profiles count from query:', totalProfilesCount);
        
        const total = allProfiles?.length || 0;
        const free = allProfiles?.filter(p => p.subscription_status === 'free' || !p.subscription_status).length || 0;
        const premium = allProfiles?.filter(p => p.subscription_status === 'premium').length || 0;
        
        setUserBreakdown({ total, free, premium });
        console.log('📊 User breakdown calculated:', { total, free, premium });
      }

      // Fetch total interview sessions with enhanced debugging
      console.log('🎤 Fetching interview sessions...');
      const { count: interviewCount, error: interviewError } = await supabase
        .from('interview_sessions')
        .select('*', { count: 'exact', head: true });

      if (interviewError) {
        console.error('❌ Error fetching interview count:', interviewError);
      } else {
        console.log('✅ Total interview sessions count:', interviewCount);
        setTotalInterviews(interviewCount || 0);
      }

      // Fetch total job matches
      const { count: jobMatchesCount, error: jobMatchesError } = await supabase
        .from('user_job_matches')
        .select('*', { count: 'exact', head: true });

      if (jobMatchesError) {
        console.error('❌ Error fetching job matches count:', jobMatchesError);
      } else {
        console.log('✅ Job matches count:', jobMatchesCount);
        setTotalJobMatches(jobMatchesCount || 0);
      }

      // Process monthly data for all profiles
      if (allProfiles && allProfiles.length > 0) {
        console.log('📈 Processing user monthly data...');
        const monthlyUserData = processMonthlyDataFullYear(allProfiles, 'created_at');
        console.log('📈 Monthly user data:', monthlyUserData);
        
        // Fetch detailed interview data for monthly processing
        console.log('🎤 Fetching detailed interview sessions for monthly chart...');
        const { data: interviewData, error: interviewDataError } = await supabase
          .from('interview_sessions')
          .select('completed_at, id, job_role')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: true });

        if (interviewDataError) {
          console.error('❌ Error fetching interview sessions for chart:', interviewDataError);
        } else {
          console.log('✅ Raw interview sessions data for chart:', interviewData);
          console.log('✅ Interview sessions count for chart:', interviewData?.length || 0);
          
          // Fixed processing for interview data
          const monthlyInterviewData = processMonthlyInterviewData(interviewData || []);
          console.log('📈 Monthly interview data processed:', monthlyInterviewData);
          
          const combinedMonthlyData = combineMonthlyData(monthlyUserData, monthlyInterviewData);
          console.log('📈 Combined monthly data:', combinedMonthlyData);
          
          setMonthlyData(combinedMonthlyData);
        }
      } else {
        // Even if no user profiles, still try to get interview data
        console.log('🎤 No user profiles found, fetching interview data separately...');
        const { data: interviewData, error: interviewDataError } = await supabase
          .from('interview_sessions')
          .select('completed_at, id, job_role')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: true });

        if (!interviewDataError && interviewData) {
          console.log('✅ Interview data found without user profiles:', interviewData);
          const monthlyInterviewData = processMonthlyInterviewData(interviewData);
          const emptyUserData = createEmptyMonthlyData();
          const combinedMonthlyData = combineMonthlyData(emptyUserData, monthlyInterviewData);
          setMonthlyData(combinedMonthlyData);
        }
      }

      setLastUpdated(new Date());
      console.log('🎉 Dashboard data fetch completed successfully');

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Dashboard Error",
        description: "Failed to fetch dashboard data. Please check your admin permissions."
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmptyMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCount: { [key: string]: number } = {};
    months.forEach(month => {
      monthlyCount[month] = 0;
    });
    return monthlyCount;
  };

  const processMonthlyDataFullYear = (data: any[], dateField: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCount: { [key: string]: number } = {};

    // Initialize all 12 months
    months.forEach(month => {
      monthlyCount[month] = 0;
    });

    console.log(`🔍 Processing ${data.length} records for field: ${dateField}`);

    // Count items by month
    data.forEach((item, index) => {
      if (item[dateField]) {
        const date = new Date(item[dateField]);
        console.log(`📅 Processing item ${index + 1}: ${item[dateField]} -> Year: ${date.getFullYear()}, Month: ${date.getMonth()}`);
        
        const monthKey = months[date.getMonth()];
        if (monthKey) {
          monthlyCount[monthKey]++;
          console.log(`✅ Added to ${monthKey}: now ${monthlyCount[monthKey]}`);
        }
      } else {
        console.log(`⚠️ Item ${index + 1} has no ${dateField} field:`, item);
      }
    });

    console.log(`📊 Final monthly counts for ${dateField}:`, monthlyCount);
    return monthlyCount;
  };

  // New dedicated function for processing interview data
  const processMonthlyInterviewData = (interviewData: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCount: { [key: string]: number } = {};

    // Initialize all 12 months
    months.forEach(month => {
      monthlyCount[month] = 0;
    });

    console.log(`🎤 Processing ${interviewData.length} interview sessions for monthly chart`);

    // Count interview sessions by month
    interviewData.forEach((session, index) => {
      if (session.completed_at) {
        const date = new Date(session.completed_at);
        const monthIndex = date.getMonth(); // 0-11
        const monthKey = months[monthIndex];
        
        console.log(`🎤 Interview ${index + 1}: ${session.completed_at} -> Month: ${monthKey} (${monthIndex})`);
        
        if (monthKey) {
          monthlyCount[monthKey]++;
          console.log(`✅ Interview added to ${monthKey}: now ${monthlyCount[monthKey]}`);
        }
      } else {
        console.log(`⚠️ Interview session ${index + 1} has no completed_at:`, session);
      }
    });

    console.log(`🎤 Final interview monthly counts:`, monthlyCount);
    return monthlyCount;
  };

  const combineMonthlyData = (userData: { [key: string]: number }, interviewData: {[key: string]: number }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    console.log('🔄 Combining monthly data...');
    console.log('👥 User data input:', userData);
    console.log('🎤 Interview data input:', interviewData);
    
    const combined = months.map(month => ({
      month,
      users: userData[month] || 0,
      interviews: interviewData[month] || 0,
    }));
    
    console.log('📈 Combined result:', combined);
    
    // Validate that interview data is being preserved
    const totalInterviews = combined.reduce((sum, data) => sum + data.interviews, 0);
    console.log('🎤 Total interviews in combined data:', totalInterviews);
    
    return combined;
  };

  const refreshData = () => {
    console.log('🔄 Manual refresh triggered');
    fetchDashboardData();
    refreshStats();
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions for live updates
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          console.log('🔄 Profiles updated, refreshing dashboard data');
          fetchDashboardData();
        }
      )
      .subscribe();

    const interviewsChannel = supabase
      .channel('interviews-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'interview_sessions' },
        () => {
          console.log('🔄 Interview sessions updated, refreshing dashboard data');
          fetchDashboardData();
        }
      )
      .subscribe();

    const jobMatchesChannel = supabase
      .channel('job-matches-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_job_matches' },
        () => {
          console.log('🔄 Job matches updated, refreshing dashboard data');
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
    popularJobs: jobRecommendationStats,
    loading: loading || jobStatsLoading,
    lastUpdated,
    refreshData
  };
};
