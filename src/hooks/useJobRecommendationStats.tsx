
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface JobRoleData {
  name: string;
  value: number;
  color: string;
}

export const useJobRecommendationStats = () => {
  const [jobRecommendationStats, setJobRecommendationStats] = useState<JobRoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobRecommendationStats();
  }, []);

  const fetchJobRecommendationStats = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching job recommendation statistics...');

      // Get all user profiles to simulate job recommendations
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, field_of_interest, hard_skills, subscription_status')
        .not('field_of_interest', 'is', null);

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        return;
      }

      // Get all job roles for recommendations
      const { data: jobRoles, error: jobRolesError } = await supabase
        .from('job_roles')
        .select('ID_num, job_title, Industry, Skills_required');

      if (jobRolesError) {
        console.error('❌ Error fetching job roles:', jobRolesError);
        return;
      }

      if (!profiles || !jobRoles) {
        setJobRecommendationStats([]);
        return;
      }

      // Simulate job recommendations (4 per user)
      const recommendationCounts: { [key: string]: number } = {};
      
      profiles.forEach(profile => {
        // Simple matching logic based on field of interest
        const matchingJobs = jobRoles
          .filter(job => {
            if (profile.field_of_interest) {
              return job.Industry?.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                     job.job_title?.toLowerCase().includes(profile.field_of_interest.toLowerCase());
            }
            return true;
          })
          .slice(0, 4); // Recommend top 4 jobs

        matchingJobs.forEach(job => {
          const jobTitle = job.job_title || 'Unknown Role';
          recommendationCounts[jobTitle] = (recommendationCounts[jobTitle] || 0) + 1;
        });
      });

      // Convert to chart data
      const colors = [
        '#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', 
        '#EF4444', '#10B981', '#F97316', '#6366F1'
      ];

      const chartData = Object.entries(recommendationCounts)
        .sort(([,a], [,b]) => b - a) // Sort by count descending
        .slice(0, 8) // Top 8 most recommended
        .map(([jobTitle, count], index) => ({
          name: jobTitle,
          value: count,
          color: colors[index] || '#6B7280'
        }));

      setJobRecommendationStats(chartData);
      console.log('✅ Job recommendation stats calculated:', chartData);

    } catch (error) {
      console.error('❌ Error calculating job recommendation stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate job recommendation statistics"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    jobRecommendationStats,
    loading,
    refreshStats: fetchJobRecommendationStats
  };
};
