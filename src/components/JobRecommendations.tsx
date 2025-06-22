import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CareerRole } from "@/types/jobRecommendations";
import { calculateEnhancedCareerMatch } from "@/utils/careerMatching";
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
      // Get user's latest skills assessments
      const { data: softSkillsAssessment } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'soft_skills')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: hardSkillsAssessment } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'hard_skills')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get all job roles from Supabase
      const { data: jobRoles, error } = await supabase
        .from('job_roles')
        .select('*');

      if (error) throw error;

      // Calculate enhanced matches and get top 4 roles most relevant to user's field of interest
      let rolesWithMatches = jobRoles?.map(role => {
        const matchPercentage = calculateEnhancedCareerMatch({
          role,
          profile,
          softSkillsAssessment,
          hardSkillsAssessment
        });
        return {
          ...role,
          match_percentage: matchPercentage
        };
      }) || [];

      // If user has a field of interest, prioritize roles in that field
      if (profile.field_of_interest) {
        // First get roles that match the field of interest
        const fieldMatchingRoles = rolesWithMatches.filter(role =>
          role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
          profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
          role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase())
        ).sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

        // If we have enough field-matching roles, use top 4 from those
        if (fieldMatchingRoles.length >= 4) {
          rolesWithMatches = fieldMatchingRoles.slice(0, 4);
        } else {
          // Otherwise, take all field-matching roles and supplement with highest-scoring others
          const otherRoles = rolesWithMatches
            .filter(role => !fieldMatchingRoles.some(fr => fr.id === role.id))
            .sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));
          
          rolesWithMatches = [...fieldMatchingRoles, ...otherRoles].slice(0, 4);
        }
      } else {
        // No field preference, just take top 4 by match score
        rolesWithMatches = rolesWithMatches
          .sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0))
          .slice(0, 4);
      }

      // Check for bookmarked roles
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
          <p className="text-sub">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const getRecommendationSubtitle = () => {
    if (profile?.field_of_interest) {
      return `Top roles in ${profile.field_of_interest} matched to your skills and background`;
    }
    return "Complete your profile and skills assessment for personalized matches based on your field of interest";
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
            key={role.id}
            role={role}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-sub mb-2">No matching roles found</h3>
          <p className="text-sub">
            {!profile?.field_of_interest 
              ? "Complete your profile to get personalized recommendations based on your field of interest"
              : "Try adjusting your search terms or complete additional assessments for better matches"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
