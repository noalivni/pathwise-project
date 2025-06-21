
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bookmark, Target, TrendingUp, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CareerRole {
  id: string;
  job_title: string;
  job_description: string;
  category: string;
  required_skills: string[];
  match_percentage?: number;
  is_bookmarked?: boolean;
}

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
        const matchPercentage = calculateCareerMatch(role, assessment, profile);
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

  const calculateCareerMatch = (role: any, assessment: any, profile: any) => {
    let matchScore = 0;
    let totalFactors = 0;

    // Field of Interest Match (40% weight) - highest priority
    if (profile?.field_of_interest && role.category) {
      const fieldMatch = profile.field_of_interest.toLowerCase().includes(role.category.toLowerCase()) ||
                        role.category.toLowerCase().includes(profile.field_of_interest.toLowerCase()) ||
                        role.job_title.toLowerCase().includes(profile.field_of_interest.toLowerCase());
      if (fieldMatch) {
        matchScore += 40;
      }
    }
    totalFactors += 40;

    // Skills Match (35% weight) - technical alignment
    if (role.required_skills && profile?.hard_skills) {
      const skillsInCommon = role.required_skills.filter((skill: string) =>
        profile.hard_skills.some((userSkill: string) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ).length;
      
      const skillsMatch = role.required_skills.length > 0 ? 
        skillsInCommon / role.required_skills.length : 0;
      matchScore += skillsMatch * 35;
    }
    totalFactors += 35;

    // Assessment Results Match (25% weight) - soft skills and personality fit
    if (assessment) {
      let overallAssessmentScore = 0;
      let assessmentFactors = 0;
      
      if (assessment.technical_skills && typeof assessment.technical_skills === 'object') {
        const techValues = Object.values(assessment.technical_skills) as number[];
        const techSkillsAvg = techValues.length > 0 ? 
          techValues.reduce((a, b) => a + b, 0) / techValues.length : 0;
        overallAssessmentScore += (techSkillsAvg / 5) * 15; // Convert to percentage and weight
        assessmentFactors += 15;
      }
      
      if (assessment.soft_skills && typeof assessment.soft_skills === 'object') {
        const softValues = Object.values(assessment.soft_skills) as number[];
        const softSkillsAvg = softValues.length > 0 ?
          softValues.reduce((a, b) => a + b, 0) / softValues.length : 0;
        overallAssessmentScore += (softSkillsAvg / 5) * 10; // Convert to percentage and weight
        assessmentFactors += 10;
      }

      if (assessmentFactors > 0) {
        matchScore += overallAssessmentScore;
      }
    }
    totalFactors += 25;

    // Calculate final match percentage
    const finalMatch = totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 50;
    return Math.min(Math.max(finalMatch, 30), 95); // Ensure reasonable range
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

  const getMatchColor = (match: number) => {
    if (match >= 80) return "bg-green-500";
    if (match >= 65) return "bg-blue-500";
    if (match >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getMatchDescription = (match: number) => {
    if (match >= 80) return "Excellent fit based on your goals and skills";
    if (match >= 65) return "Good alignment with your profile";
    if (match >= 50) return "Potential match worth exploring";
    return "Consider developing skills in this area";
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

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search career roles, categories, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{role.job_title}</CardTitle>
                    <Badge className={`${getMatchColor(role.match_percentage || 0)} text-white`}>
                      {role.match_percentage || 0}% Match
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium text-slate-700 mb-2">
                    {role.category}
                  </CardDescription>
                  <p className="text-sm text-slate-500">
                    {getMatchDescription(role.match_percentage || 0)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(role.id)}
                  className="flex items-center gap-1"
                >
                  <Bookmark className={`h-4 w-4 ${role.is_bookmarked ? 'fill-current text-teal-600' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">{role.job_description}</p>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.required_skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Career Path
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {role.match_percentage && role.match_percentage >= 65 ? 'Recommended' : 'Explore Further'}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
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
