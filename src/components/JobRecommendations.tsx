
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CareerRole } from "@/types/jobRecommendations";
import { calculateCareerMatch } from "@/utils/careerMatching";
import JobSearchInput from "@/components/JobSearchInput";
import JobCard from "@/components/JobCard";

const JobRecommendations = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [careerRoles, setCareerRoles] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchCareerRecommendations();
    }
  }, [user, profile]);

  const fetchCareerRecommendations = async () => {
    if (!user || !profile) return;

    try {
      const { data: assessment } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      const { data: jobRoles, error } = await supabase
        .from('job_roles')
        .select('*');

      if (error) throw error;

      const rolesWithMatches = jobRoles?.map(role => {
        const matchPercentage = calculateCareerMatch({ role, assessment, profile });
        return {
          ...role,
          match_percentage: matchPercentage
        };
      }).sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0)) || [];

      const { data: bookmarkedRoles } = await supabase
        .from('user_job_matches')
        .select('job_role_id, is_bookmarked')
        .eq('user_id', user.id)
        .eq('is_bookmarked', true);

      const bookmarkedIds = new Set(bookmarkedRoles?.map(b => b.job_role_id) || []);

      const finalRoles = rolesWithMatches.map(role => ({
        ...role,
        is_bookmarked: bookmarkedIds.has(role.id)
      }));

      setCareerRoles(finalRoles);
    } catch (error) {
      console.error('Error fetching career recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load career recommendations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (roleId: string) => {
    if (!user) return;

    const role = careerRoles.find(r => r.id === roleId);
    const newBookmarkStatus = !role?.is_bookmarked;

    try {
      const { error } = await supabase
        .from('user_job_matches')
        .upsert({
          user_id: user.id,
          job_role_id: roleId,
          is_bookmarked: newBookmarkStatus,
          match_percentage: role?.match_percentage || 0
        });

      if (error) throw error;

      setCareerRoles(careerRoles.map(r => 
        r.id === roleId ? { ...r, is_bookmarked: newBookmarkStatus } : r
      ));

      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: newBookmarkStatus ? 'role_bookmarked' : 'role_unbookmarked',
          activity_description: `${newBookmarkStatus ? 'Bookmarked' : 'Removed bookmark from'} ${role?.job_title} career path`
        });

      toast({
        title: newBookmarkStatus ? "Role Bookmarked" : "Bookmark Removed",
        description: newBookmarkStatus ? "Career role added to your bookmarks" : "Career role removed from bookmarks",
      });
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const filteredRoles = careerRoles.filter(role =>
    role.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Career Path Recommendations</h1>
        <p className="text-slate-600 mt-2">
          Roles matched to your profile: {profile?.field_of_interest || 'Complete profile for better matches'}
        </p>
      </div>

      <JobSearchInput 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="grid gap-6">
        {filteredRoles.map((role) => (
          <JobCard
            key={role.id}
            role={role}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No matching roles found</h3>
          <p className="text-slate-500">
            {!profile?.field_of_interest 
              ? "Complete your profile and skills assessment for personalized recommendations"
              : "Try adjusting your search terms or complete additional assessments"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
