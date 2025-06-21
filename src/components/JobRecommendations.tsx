
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bookmark, MapPin, DollarSign, Clock, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface JobRole {
  id: string;
  job_title: string;
  job_description: string;
  category: string;
  required_skills: string[];
  salary_range: string;
  location: string;
  match_percentage?: number;
  is_bookmarked?: boolean;
}

const JobRecommendations = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJobRecommendations();
    }
  }, [user]);

  const fetchJobRecommendations = async () => {
    if (!user) return;

    try {
      // Fetch user's skills assessment
      const { data: assessment } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch all job roles
      const { data: jobRoles, error } = await supabase
        .from('job_roles')
        .select('*');

      if (error) throw error;

      // Calculate match percentages
      const jobsWithMatches = jobRoles?.map(job => {
        const matchPercentage = calculateJobMatch(job, assessment, profile);
        return {
          ...job,
          match_percentage: matchPercentage
        };
      }).sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0)) || [];

      // Check bookmarked jobs
      const { data: bookmarkedJobs } = await supabase
        .from('user_job_matches')
        .select('job_role_id, is_bookmarked')
        .eq('user_id', user.id)
        .eq('is_bookmarked', true);

      const bookmarkedIds = new Set(bookmarkedJobs?.map(b => b.job_role_id) || []);

      const finalJobs = jobsWithMatches.map(job => ({
        ...job,
        is_bookmarked: bookmarkedIds.has(job.id)
      }));

      setJobs(finalJobs);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load job recommendations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateJobMatch = (job: any, assessment: any, profile: any) => {
    let matchScore = 0;
    let totalFactors = 0;

    // Skills match (40% weight)
    if (job.required_skills && profile?.hard_skills) {
      const skillsInCommon = job.required_skills.filter((skill: string) =>
        profile.hard_skills.some((userSkill: string) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ).length;
      
      const skillsMatch = skillsInCommon / job.required_skills.length;
      matchScore += skillsMatch * 40;
      totalFactors += 40;
    }

    // Assessment results match (30% weight)
    if (assessment) {
      const techSkillsAvg = assessment.technical_skills ? 
        Object.values(assessment.technical_skills).reduce((a: any, b: any) => a + b, 0) / 
        Object.keys(assessment.technical_skills).length : 0;
      
      const softSkillsAvg = assessment.soft_skills ?
        Object.values(assessment.soft_skills).reduce((a: any, b: any) => a + b, 0) /
        Object.keys(assessment.soft_skills).length : 0;

      const assessmentMatch = (techSkillsAvg + softSkillsAvg) / 6; // Scale to 0-1
      matchScore += assessmentMatch * 30;
      totalFactors += 30;
    }

    // Category preference (20% weight)
    if (assessment?.recommended_paths?.includes(job.job_title)) {
      matchScore += 20;
    }
    totalFactors += 20;

    // Experience level match (10% weight)
    const careerHistoryBonus = profile?.career_history ? 10 : 0;
    matchScore += careerHistoryBonus;
    totalFactors += 10;

    const finalMatch = totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 50;
    return Math.min(Math.max(finalMatch, 30), 95); // Ensure realistic range
  };

  const handleBookmark = async (jobId: string) => {
    if (!user) return;

    const job = jobs.find(j => j.id === jobId);
    const newBookmarkStatus = !job?.is_bookmarked;

    try {
      const { error } = await supabase
        .from('user_job_matches')
        .upsert({
          user_id: user.id,
          job_role_id: jobId,
          is_bookmarked: newBookmarkStatus,
          match_percentage: job?.match_percentage || 0
        });

      if (error) throw error;

      // Update local state
      setJobs(jobs.map(j => 
        j.id === jobId ? { ...j, is_bookmarked: newBookmarkStatus } : j
      ));

      // Log activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: newBookmarkStatus ? 'job_bookmarked' : 'job_unbookmarked',
          activity_description: `${newBookmarkStatus ? 'Bookmarked' : 'Removed bookmark from'} ${job?.job_title} role`
        });

      toast({
        title: newBookmarkStatus ? "Job Bookmarked" : "Bookmark Removed",
        description: newBookmarkStatus ? "Job added to your bookmarks" : "Job removed from bookmarks",
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

  const handleJobView = async (job: JobRole) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'job_viewed',
          activity_description: `Viewed ${job.job_title} role at ${job.location}`
        });
    } catch (error) {
      console.error('Error logging job view:', error);
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-500";
    if (match >= 80) return "bg-blue-500";
    if (match >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const filteredJobs = jobs.filter(job =>
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Job Recommendations</h1>
        <p className="text-slate-600 mt-2">Personalized job matches based on your skills and preferences</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs, categories, or skills..."
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

      {/* Job Cards */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{job.job_title}</CardTitle>
                    <Badge className={`${getMatchColor(job.match_percentage || 0)} text-white`}>
                      {job.match_percentage || 0}% Match
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium text-slate-700">
                    {job.category}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(job.id)}
                  className="flex items-center gap-1"
                >
                  <Bookmark className={`h-4 w-4 ${job.is_bookmarked ? 'fill-current text-teal-600' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">{job.job_description}</p>
              
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary_range}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Full-time
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-slate-500">Updated recently</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleJobView(job)}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search terms or complete your skills assessment</p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
