import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wrench, Heart, Target, ArrowRight, Clock, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getSkillLevel } from "@/utils/skillLevelUtils";
import { generatePersonalityProfile, generateDetailedFeedback } from "@/utils/personalityProfileGenerator";
import { softSkills } from "@/data/softSkillsData";

interface SkillsAssessmentHubProps {
  onSelectAssessment: (type: 'hard' | 'soft') => void;
}

const SkillsAssessmentHub = ({ onSelectAssessment }: SkillsAssessmentHubProps) => {
  const { user } = useAuth();
  const [pastAssessments, setPastAssessments] = useState<{
    hardSkills: any | null;
    softSkills: any | null;
  }>({ hardSkills: null, softSkills: null });
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPastAssessments();
    }
  }, [user]);

  const fetchPastAssessments = async () => {
    if (!user) return;

    try {
      const { data: hardSkillsData } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'hard_skills')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: softSkillsData } = await supabase
        .from('skills_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'soft_skills')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setPastAssessments({
        hardSkills: hardSkillsData,
        softSkills: softSkillsData
      });
    } catch (error) {
      console.error('Error fetching past assessments:', error);
    }
  };

  const handleViewPastAssessment = (assessment: any, type: 'hard' | 'soft') => {
    setSelectedAssessment({ ...assessment, type });
    setShowModal(true);
  };

  const renderPastAssessmentModal = () => {
    if (!selectedAssessment) return null;

    const isHardSkills = selectedAssessment.type === 'hard';
    const completedDate = new Date(selectedAssessment.completed_at).toLocaleDateString();

    if (isHardSkills) {
      const technicalSkills = selectedAssessment.technical_skills || {};
      const skillEntries = Object.entries(technicalSkills);

      return (
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5 text-teal-600" />
              Hard Skills Assessment Results
            </DialogTitle>
            <p className="text-sm text-slate-600 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Completed on {completedDate}
            </p>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid gap-3">
              {skillEntries.map(([skill, rating], index) => {
                const skillInfo = getSkillLevel(rating as number);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium">{skill}</span>
                      <p className="text-sm text-slate-600">Rating: {rating}/5</p>
                    </div>
                    <Badge className={`${skillInfo.color} text-white`}>
                      {skillInfo.level}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t">
              <Button 
                onClick={() => {
                  setShowModal(false);
                  onSelectAssessment('hard');
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                Retake Hard Skills Assessment
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    } else {
      const softSkillsData = selectedAssessment.soft_skills || {};
      const personalityProfile = generatePersonalityProfile(softSkillsData);
      const detailedFeedback = generateDetailedFeedback(softSkillsData);

      return (
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-600" />
              Soft Skills Assessment Results
            </DialogTitle>
            <p className="text-sm text-slate-600 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Completed on {completedDate}
            </p>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-pink-800 mb-2">Your Profile: {personalityProfile.type}</h4>
              <p className="text-pink-700 text-sm mb-3">{personalityProfile.environment}</p>
              <div className="flex flex-wrap gap-2">
                {personalityProfile.topStrengths.map((strength, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid gap-3">
              {Object.entries(softSkillsData).map(([skill, rating], index) => {
                const skillInfo = getSkillLevel(rating as number);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium">{skill}</span>
                      <Progress value={((rating as number) / 5) * 100} className="w-32 mt-1" />
                    </div>
                    <Badge className={`${skillInfo.color} text-white`}>
                      {skillInfo.level}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Career Insights:</h4>
              {detailedFeedback.slice(0, 2).map((insight, index) => (
                <p key={index} className="text-sm text-slate-700 bg-blue-50 p-2 rounded">
                  {insight}
                </p>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={() => {
                  setShowModal(false);
                  onSelectAssessment('soft');
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Retake Soft Skills Assessment
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pathwise-text">Choose Your Assessment</h1>
          <p className="text-pathwise-text-muted mt-2">Select the type of skills you'd like to evaluate</p>
        </div>

        {/* Past Assessments Section */}
        {(pastAssessments.hardSkills || pastAssessments.softSkills) && (
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-pathwise-text mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Your Past Assessments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastAssessments.hardSkills && (
                <Button
                  variant="outline"
                  onClick={() => handleViewPastAssessment(pastAssessments.hardSkills, 'hard')}
                  className="flex items-center justify-between p-4 h-auto"
                >
                  <div className="flex items-center">
                    <Wrench className="mr-2 h-4 w-4 text-teal-600" />
                    <span>View Past Hard Skills Assessment</span>
                  </div>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {pastAssessments.softSkills && (
                <Button
                  variant="outline"
                  onClick={() => handleViewPastAssessment(pastAssessments.softSkills, 'soft')}
                  className="flex items-center justify-between p-4 h-auto"
                >
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-pink-600" />
                    <span>View Past Soft Skills Assessment</span>
                  </div>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-teal-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-teal-600" />
              </div>
              <CardTitle className="text-2xl text-pathwise-text">Hard Skills Assessment</CardTitle>
              <CardDescription className="text-lg text-pathwise-text-muted">
                Evaluate your proficiency with technical tools and software
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-pathwise-text">What you'll assess:</h4>
                <ul className="text-sm text-pathwise-text-secondary space-y-1">
                  <li>• Technical tools (Excel, SQL, Python, etc.)</li>
                  <li>• Software proficiency levels (0-5 scale)</li>
                  <li>• Domain-specific skills</li>
                  <li>• Professional certifications</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-pathwise-text">You'll receive:</h4>
                <ul className="text-sm text-pathwise-text-secondary space-y-1">
                  <li>• Skill level breakdown</li>
                  <li>• Areas of expertise</li>
                  <li>• Learning recommendations</li>
                  <li>• Tool suggestions</li>
                </ul>
              </div>
              <Button 
                onClick={() => onSelectAssessment('hard')}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                Start Hard Skills Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-pink-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <CardTitle className="text-2xl text-pathwise-text">Soft Skills Assessment</CardTitle>
              <CardDescription className="text-lg text-pathwise-text-muted">
                Discover your personality type and work style preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-pathwise-text">What you'll assess:</h4>
                <ul className="text-sm text-pathwise-text-secondary space-y-1">
                  <li>• Communication style</li>
                  <li>• Leadership tendencies</li>
                  <li>• Problem-solving approach</li>
                  <li>• Collaboration preferences</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-pathwise-text">You'll receive:</h4>
                <ul className="text-sm text-pathwise-text-secondary space-y-1">
                  <li>• Personality type profile</li>
                  <li>• Work environment preferences</li>
                  <li>• Career path suggestions</li>
                  <li>• Team role insights</li>
                </ul>
              </div>
              <Button 
                onClick={() => onSelectAssessment('soft')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Start Soft Skills Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Target className="mr-2 h-5 w-5" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              For the most comprehensive career guidance, we recommend taking both assessments. 
              Each provides unique insights that complement each other to give you a complete 
              picture of your professional strengths and potential career paths.
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        {renderPastAssessmentModal()}
      </Dialog>
    </>
  );
};

export default SkillsAssessmentHub;
