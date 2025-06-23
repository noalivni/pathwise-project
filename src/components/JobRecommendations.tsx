
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CareerRole } from "@/types/jobRecommendations";
import { parseSkillsFromText } from "@/utils/skillsParsing";
import { fetchAndCalculateJobMatches } from "@/utils/sharedJobMatching";
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
      // Use the shared job matching logic
      const rolesWithMatches = await fetchAndCalculateJobMatches(user, profile, 4);

      // Check for bookmarked roles
      const { data: bookmarkedRoles } = await supabase
        .from('user_job_matches')
        .select('job_role_id, is_bookmarked')
        .eq('user_id', user.id)
        .eq('is_bookmarked', true);

      const bookmarkedIds = new Set(bookmarkedRoles?.map(b => b.job_role_id) || []);

      const finalRoles = rolesWithMatches.map(role => ({
        ...role,
        is_bookmarked: bookmarkedIds.has(role.ID_num)
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

    const role = careerRoles.find(r => r.ID_num.toString() === roleId);
    const newBookmarkStatus = !role?.is_bookmarked;

    try {
      const { error } = await supabase
        .from('user_job_matches')
        .upsert({
          user_id: user.id,
          job_role_id: parseInt(roleId),
          is_bookmarked: newBookmarkStatus,
          match_percentage: role?.match_percentage || 0
        });

      if (error) throw error;

      setCareerRoles(careerRoles.map(r => 
        r.ID_num.toString() === roleId ? { ...r, is_bookmarked: newBookmarkStatus } : r
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

  const filteredRoles = careerRoles.filter(role => {
    const skills = parseSkillsFromText(role.Skills_required || '');
    return role.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.Industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
           skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-sub">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const getRecommendationSubtitle = () => {
    if (profile?.field_of_interest) {
      return `Top 4 ${profile.field_of_interest} roles matched to your skills and background`;
    }
    return "Complete your profile and skills assessments for personalized matches";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-main">Personalized Career Matches</h1>
        <p className="text-sub mt-2">
          {getRecommendationSubtitle()}
        </p>
      </div>

      <JobSearchInput 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="grid gap-6">
        {filteredRoles.map((role) => (
          <JobCard
            key={role.ID_num}
            role={{
              id: role.ID_num.toString(),
              job_title: role.job_title,
              job_description: role.Short_description || '',
              category: role.Industry,
              required_skills: parseSkillsFromText(role.Skills_required || ''),
              match_percentage: role.match_percentage,
              is_bookmarked: role.is_bookmarked
            }}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-sub mb-2">No matching roles found</h3>
          <p className="text-sub">
            {searchTerm 
              ? "Try adjusting your search terms or clear the search to see all recommendations"
              : "We're working to add more job opportunities to match your profile"
            }
          </p>
        </div>
      )}

      {careerRoles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-sub mb-2">No career recommendations available</h3>
          <p className="text-sub">
            Complete your onboarding and skills assessments to see personalized job matches
          </p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
