import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, Target, TrendingUp, Brain, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SkillRecommendation {
  skill: string;
  description: string;
  importance: string;
  careerBenefit: string;
  currentLevel: number;
  resources: SkillResource[];
}

interface SkillResource {
  title: string;
  description: string;
  url: string;
  resource_type: string;
}

const SkillsDevelopmentTab = () => {
  const { user, profile } = useAuth();
  const [skillRecommendations, setSkillRecommendations] = useState<SkillRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSkillsDevelopmentData();
    }
  }, [user]);

  const fetchSkillsDevelopmentData = async () => {
    if (!user) return;

    try {
      // Get user's assessments and job matches
      const [jobMatchesResult, hardSkillsResult] = await Promise.all([
        supabase
          .from('user_job_matches')
          .select(`
            job_role_id,
            match_percentage,
            job_roles (
              job_title,
              Short_description,
              Industry,
              Skills_required
            )
          `)
          .eq('user_id', user.id)
          .order('match_percentage', { ascending: false })
          .limit(3),
        
        supabase
          .from('skills_assessments')
          .select('technical_skills')
          .eq('user_id', user.id)
          .eq('assessment_type', 'hard_skills')
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      if (jobMatchesResult.data && hardSkillsResult.data) {
        const topJobRecommendations = jobMatchesResult.data.map(match => ({
          job_title: match.job_roles?.job_title || '',
          Short_description: match.job_roles?.Short_description || '',
          Industry: match.job_roles?.Industry || '',
          Skills_required: match.job_roles?.Skills_required || '',
          match_percentage: match.match_percentage || 0
        }));

        const hardSkills = hardSkillsResult.data.technical_skills || {};
        
        // Get skills that need improvement (rating < 4)
        const skillsToImprove = Object.entries(hardSkills)
          .filter(([_, rating]) => (rating as number) < 4)
          .sort(([_, a], [__, b]) => (a as number) - (b as number))
          .slice(0, 6);

        // Generate AI guidance for skills
        const response = await supabase.functions.invoke('generate-career-guidance', {
          body: {
            topJobRecommendations,
            hardSkillsAssessment: hardSkills,
            fieldOfInterest: profile?.field_of_interest || 'General'
          }
        });

        let aiSkillRecommendations = [];
        if (response.data?.skillRecommendations) {
          aiSkillRecommendations = response.data.skillRecommendations;
        }

        // Fetch resources for each skill
        const enhancedSkills = await Promise.all(
          skillsToImprove.map(async ([skill, rating], index) => {
            const aiRecommendation = aiSkillRecommendations.find(
              (rec: any) => rec.skill.toLowerCase() === skill.toLowerCase()
            );

            const resources = await fetchSkillResources(skill);

            return {
              skill,
              description: aiRecommendation?.description || `${skill} is an important technical skill`,
              importance: aiRecommendation?.importance || `Essential for your target career roles`,
              careerBenefit: aiRecommendation?.careerBenefit || 'Will increase your competitiveness in the job market',
              currentLevel: rating as number,
              resources: resources || []
            };
          })
        );

        setSkillRecommendations(enhancedSkills);
      }
    } catch (error) {
      console.error('Error fetching skills development data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillResources = async (skill: string) => {
    try {
      const response = await supabase.functions.invoke('fetch-learning-resources', {
        body: {
          jobTitles: [],
          skills: [skill],
          maxResults: 3
        }
      });

      if (response.data?.resources) {
        return response.data.resources.slice(0, 3);
      }
    } catch (error) {
      console.error('Error fetching skill resources:', error);
    }
    return [];
  };

  const getSkillLevelColor = (level: number) => {
    if (level <= 2) return 'bg-red-500';
    if (level <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSkillLevelText = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 3) return 'Intermediate';
    return 'Advanced';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-pathwise-text-muted">
          Focused skill development based on your assessment results and career goals
        </p>
      </div>

      <div className="space-y-4">
        {skillRecommendations.map((skillRec, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500 text-white">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{skillRec.skill}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getSkillLevelColor(skillRec.currentLevel)} text-white`}>
                        Current: {getSkillLevelText(skillRec.currentLevel)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Level {skillRec.currentLevel}/5
                      </Badge>
                    </div>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* AI-Generated Guidance */}
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Insight
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-700 dark:text-purple-300">
                    <strong>What it is:</strong> {skillRec.description}
                  </p>
                  <p className="text-purple-700 dark:text-purple-300">
                    <strong>Why it matters:</strong> {skillRec.importance}
                  </p>
                  <p className="text-purple-700 dark:text-purple-300">
                    <strong>Career benefit:</strong> {skillRec.careerBenefit}
                  </p>
                </div>
              </div>

              {/* Learning Resources with Collapsible Section */}
              {skillRec.resources.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm font-medium">Learning Resources ({skillRec.resources.length})</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {skillRec.resources.map((resource, resourceIndex) => (
                      <Button
                        key={resourceIndex}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium text-sm line-clamp-1">{resource.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{resource.description}</div>
                          <Badge variant="secondary" className="text-xs mt-1 capitalize">
                            {resource.resource_type?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {skillRec.resources.length === 0 && (
                <div className="text-center py-4 text-sm text-pathwise-text-muted">
                  No external resources found for this skill at the moment.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {skillRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-pathwise-text mb-2">No Skills Assessment Yet</h3>
          <p className="text-pathwise-text-muted">
            Complete your skills assessment to get personalized skill development recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsDevelopmentTab;
