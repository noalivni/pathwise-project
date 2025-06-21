
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bookmark, Target, TrendingUp, Search, Filter } from "lucide-react";
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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [careerRoles, setCareerRoles] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCareerRecommendations();
    }
  }, [user]);

  const fetchCareerRecommendations = async () => {
    if (!user) return;

    try {
      const { data: assessment } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
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

    // Skills match (50% weight) - more emphasis on skills alignment
    if (role.required_skills && profile?.hard_skills) {
      const skillsInCommon = role.required_skills.filter((skill: string) =>
        profile.hard_skills.some((userSkill: string) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ).length;
      
      const skillsMatch = skillsInCommon / role.required_skills.length;
      matchScore += skillsMatch * 50;
      totalFactors += 50;
    }

    // Assessment results match (30% weight)
    if (assessment) {
      let techSkillsAvg = 0;
      let softSkillsAvg = 0;
      
      if (assessment.technical_skills && typeof assessment.technical_skills === 'object') {
        const techValues = Object.values(assessment.technical_skills) as number[];
        techSkillsAvg = techValues.length > 0 ? 
          techValues.reduce((a, b) => a + b, 0) / techValues.length : 0;
      }
      
      if (assessment.soft_skills && typeof assessment.soft_skills === 'object') {
        const softValues = Object.values(assessment.soft_skills) as number[];
        softSkillsAvg = softValues.length > 0 ?
          softValues.reduce((a, b) => a + b, 0) / softValues.length : 0;
      }

      const assessmentMatch = (techSkillsAvg + softSkillsAvg) / 6;
      matchScore += assessmentMatch * 30;
      totalFactors += 30;
    }

    // Category/field alignment (20% weight)
    if (profile?.fields_of_study && role.category) {
      const fieldAlignment = profile.fields_of_study.toLowerCase().includes(role.category.toLowerCase()) ||
                            role.category.toLowerCase().includes(profile.fields_of_study.toLowerCase());
      if (fieldAlignment) {
        matchScore += 20;
      }
    }
    totalFactors += 20;

    const finalMatch = totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 60;
    return Math.min(Math.max(finalMatch, 40), 95);
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
        title: newBookmarkStatus ? "Career Role Bookmarked" : "Bookmark Removed",
        description: newBookmarkStatus ? "Career path added to your bookmarks" : "Career path removed from bookmarks",
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
    if (match >= 85) return "bg-green-500";
    if (match >= 75) return "bg-blue-500";
    if (match >= 65) return "bg-yellow-500";
    return "bg-gray-500";
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
          <p className="text-slate-600">Loading career recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Career Path Recommendations</h1>
        <p className="text-slate-600 mt-2">Discover career roles that match your skills and interests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search career roles, categories, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
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
                  <CardDescription className="text-lg font-medium text-slate-700">
                    {role.category}
                  </CardDescription>
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
              
              <div className="flex flex-wrap gap-2">
                {role.required_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Career Path
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Growth Potential
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No career paths found</h3>
          <p className="text-slate-500">Try adjusting your search terms or complete your skills assessment</p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
