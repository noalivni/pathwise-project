import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, RotateCcw, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { softSkillsByField, defaultSoftSkills } from "@/data/fieldSpecificSoftSkills";
import { getSkillLevelDescription, getSkillLevelWithCount } from "@/utils/softSkillsLabels";
import FirstActivityCelebration from "@/components/FirstActivityCelebration";

interface SoftSkillsAssessmentProps {
  onReturnToHub?: () => void;
  selectedField?: string;
}

const SoftSkillsAssessment = ({ onReturnToHub, selectedField }: SoftSkillsAssessmentProps) => {
  const { user, profile } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [softSkillsQuestions, setSoftSkillsQuestions] = useState(defaultSoftSkills);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  useEffect(() => {
    // Use selectedField first, then profile field, then default
    const fieldToUse = selectedField || profile?.field_of_interest || 'General';
    
    if (fieldToUse !== 'General' && softSkillsByField[fieldToUse]) {
      setSoftSkillsQuestions(softSkillsByField[fieldToUse]);
    } else {
      setSoftSkillsQuestions(defaultSoftSkills);
    }
  }, [selectedField, profile]);

  const handleSliderChange = (value: number[]) => {
    const questionKey = softSkillsQuestions[currentQuestion].key;
    setResponses(prev => ({
      ...prev,
      [questionKey]: value[0]
    }));
  };

  const handleNext = () => {
    if (currentQuestion < softSkillsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveAssessmentResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    const questionKey = softSkillsQuestions[currentQuestion].key;
    setResponses(prev => ({
      ...prev,
      [questionKey]: 0
    }));
    handleNext();
  };

  const saveAssessmentResults = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          soft_skills: responses,
          assessment_type: 'soft_skills'
        });

      if (error) throw error;

      // Log the activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'assessment_completed',
          activity_description: 'Completed soft skills assessment'
        });

      setShowResults(true);
      setAssessmentCompleted(true);
      toast({
        title: "Assessment Complete!",
        description: "Your soft skills have been evaluated successfully.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetake = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setResponses({});
  };

  const handleViewJobs = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-jobs'));
  };

  const calculateResults = () => {
    const skillCategories = {
      communication: ['communication', 'active_listening', 'public_speaking'],
      leadership: ['leadership', 'team_collaboration', 'conflict_resolution'],
      problemSolving: ['problem_solving', 'critical_thinking', 'creativity'],
      adaptability: ['adaptability', 'time_management', 'stress_management'],
      interpersonal: ['empathy', 'networking', 'customer_service']
    };

    const categoryScores: { [key: string]: number } = {};
    
    Object.entries(skillCategories).forEach(([category, skills]) => {
      const totalScore = skills.reduce((sum, skill) => sum + (responses[skill] || 0), 0);
      categoryScores[category] = Math.round((totalScore / (skills.length * 4)) * 100);
    });

    return categoryScores;
  };

  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {assessmentCompleted && (
          <FirstActivityCelebration 
            activityType="skills_assessment" 
            activityName="Soft Skills Assessment" 
          />
        )}
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Soft Skills Assessment Results</h1>
          <p className="text-muted-foreground mt-2">Your personality and interpersonal skills profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([category, score]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize text-foreground">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-medium text-foreground">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Developing' : 'Needs attention'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleRetake} 
            variant="outline" 
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
          <Button 
            onClick={handleViewJobs} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Job Matches
          </Button>
        </div>

        {onReturnToHub && (
          <div className="text-center">
            <Button 
              onClick={onReturnToHub} 
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Assessment Hub
            </Button>
          </div>
        )}
      </div>
    );
  }

  const currentQuestionData = softSkillsQuestions[currentQuestion];
  const currentResponse = responses[currentQuestionData.key] || 0;
  const progress = ((currentQuestion + 1) / softSkillsQuestions.length) * 100;
  const fieldToDisplay = selectedField || profile?.field_of_interest || 'General';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Soft Skills Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Evaluate your {fieldToDisplay === 'General' ? 'interpersonal and workplace communication' : `${fieldToDisplay}-focused interpersonal`} skills
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {softSkillsQuestions.length}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <CardTitle className="text-xl mb-3 text-foreground">
              {currentQuestionData.question}
            </CardTitle>
            {currentQuestionData.description && (
              <CardDescription className="text-muted-foreground">
                {currentQuestionData.description}
              </CardDescription>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {getSkillLevelDescription(currentResponse)}
              </div>
              <div className="text-sm text-muted-foreground">
                {getSkillLevelWithCount(currentResponse)}
              </div>
            </div>
            
            <Slider
              value={[currentResponse]}
              onValueChange={handleSliderChange}
              max={4}
              min={0}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not me</span>
              <span>Somewhat</span>
              <span>Moderately</span>
              <span>Very much</span>
              <span>Extremely</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              onClick={handlePrevious} 
              variant="outline"
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="space-x-2">
              <Button 
                onClick={handleSkip} 
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Skip
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                {currentQuestion === softSkillsQuestions.length - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoftSkillsAssessment;
