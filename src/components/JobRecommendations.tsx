
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CareerRole } from "@/types/jobRecommendations";
import { calculatePersonalizedCareerMatch, parseSkillsFromText } from "@/utils/careerMatching";
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

      // Get all job roles first
      const { data: allJobRoles, error } = await supabase
        .from('job_roles')
        .select('*');

      if (error) throw error;

      if (!allJobRoles || allJobRoles.length === 0) {
        console.log('No job roles found in database');
        setCareerRoles([]);
        return;
      }

      console.log('All job roles:', allJobRoles.length);
      console.log('User field of interest:', profile.field_of_interest);

      // Filter by field of interest with more flexible matching
      let filteredRoles = allJobRoles;
      
      if (profile.field_of_interest) {
        const fieldLower = profile.field_of_interest.toLowerCase();
        
        // Primary filter: exact or partial matches
        const primaryMatches = allJobRoles.filter(role => {
          const categoryLower = role.Industry?.toLowerCase() || '';
          const titleLower = role.job_title?.toLowerCase() || '';
          
          return categoryLower.includes(fieldLower) || 
                 fieldLower.includes(categoryLower) ||
                 titleLower.includes(fieldLower) ||
                 fieldLower.includes(titleLower);
        });
        
        console.log('Primary matches:', primaryMatches.length);
        
        // If we have enough primary matches, use them
        if (primaryMatches.length >= 4) {
          filteredRoles = primaryMatches;
        } else {
          // Fallback: include broader matches and general roles
          const secondaryMatches = allJobRoles.filter(role => {
            const categoryLower = role.Industry?.toLowerCase() || '';
            const titleLower = role.job_title?.toLowerCase() || '';
            const descriptionLower = role.Short_description?.toLowerCase() || '';
            
            // Check for keyword overlap or general business roles
            const fieldWords = fieldLower.split(' ');
            return fieldWords.some(word => 
              categoryLower.includes(word) || 
              titleLower.includes(word) ||
              descriptionLower.includes(word)
            ) || 
            categoryLower.includes('business') ||
            categoryLower.includes('general') ||
            titleLower.includes('analyst') ||
            titleLower.includes('coordinator');
          });
          
          // Combine primary and secondary matches, remove duplicates
          const combinedMatches = [...primaryMatches];
          secondaryMatches.forEach(role => {
            if (!combinedMatches.find(existing => existing.ID_num === role.ID_num)) {
              combinedMatches.push(role);
            }
          });
          
          filteredRoles = combinedMatches.length >= 4 ? combinedMatches : allJobRoles;
        }
      }

      console.log('Filtered roles:', filteredRoles.length);

      // Calculate personalized matches for all filtered roles
      let rolesWithMatches = filteredRoles.map(role => {
        const matchPercentage = calculatePersonalizedCareerMatch({
          role,
          profile,
          softSkillsAssessment,
          hardSkillsAssessment
        });
        return {
          ...role,
          match_percentage: matchPercentage
        };
      });

      // Sort by match percentage and take top 4
      rolesWithMatches = rolesWithMatches
        .sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0))
        .slice(0, 4);

      console.log('Final roles with matches:', rolesWithMatches.length);

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
