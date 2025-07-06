
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, RotateCcw, Eye, Lightbulb, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { softSkillsQuestions } from "@/data/softSkillsData";
import { getSkillLevelDescription, getSkillLevelWithCount } from "@/utils/softSkillsLabels";
import { softSkillsByField, defaultSoftSkills } from "@/data/fieldSpecificSoftSkills";

interface SoftSkillsAssessmentProps {
  onReturnToHub?: () => void;
  selectedField?: string;
}

const SoftSkillsAssessment = ({ onReturnToHub, selectedField = 'General' }: SoftSkillsAssessmentProps) => {
  const { user, profile } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [relevantQuestions, setRelevantQuestions] = useState(defaultSoftSkills);

  useEffect(() => {
    if (selectedField && selectedField !== 'General' && softSkillsByField[selectedField]) {
      setRelevantQuestions(softSkillsByField[selectedField]);
    } else {
      setRelevantQuestions(defaultSoftSkills);
    }
    // Reset current question when field changes
    setCurrentQuestion(0);
    setResponses({});
  }, [selectedField]);

  const handleSliderChange = (value: number[]) => {
    const questionKey = relevantQuestions[currentQuestion].key;
    setResponses(prev => ({
      ...prev,
      [questionKey]: value[0]
    }));
  };

  const handleNext = () => {
    if (currentQuestion < relevantQuestions.length - 1) {
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
    const questionKey = relevantQuestions[currentQuestion].key;
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

  const generateInsights = () => {
    const ratings = Object.values(responses);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const highSkills = Object.entries(responses).filter(([_, rating]) => rating >= 3);

    const insights = [];
    if (avgRating >= 3) {
      insights.push("You show excellent interpersonal and leadership capabilities.");
      insights.push("These strengths position you well for collaborative and management roles.");
    } else if (avgRating >= 2) {
      insights.push("You have good foundational soft skills with potential for development.");
      insights.push("Focus on practicing these skills in real work situations.");
    } else {
      insights.push("Developing these interpersonal skills will enhance your career prospects.");
      insights.push("Consider seeking feedback and mentorship opportunities.");
    }

    if (highSkills.length > 0) {
      const formatSkillName = (name: string) => {
        return name
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
      insights.push(`You excel in ${highSkills.slice(0, 2).map(([skill]) => formatSkillName(skill)).join(' and ')}.`);
    }

    return insights;
  };

  const generateProfessionalProfile = () => {
    const ratings = Object.values(responses);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    if (avgRating >= 3) {
      return "Your strong interpersonal skills make you an excellent candidate for leadership, management, and client-facing roles. You're well-suited for positions requiring collaboration, team coordination, and stakeholder management. Consider roles in project management, team leadership, or business development.";
    } else if (avgRating >= 2) {
      return "You have good foundational interpersonal skills that serve you well in collaborative environments. You're positioned for roles that involve teamwork and moderate interaction with colleagues and clients. Focus on opportunities that allow you to further develop these strengths.";
    } else {
      return "You're developing your interpersonal skills, which is valuable for any career path. Consider roles with supportive team environments where you can practice and grow these abilities. Look for positions that offer mentorship and professional development opportunities.";
    }
  };

  if (showResults) {
    const results = calculateResults();
    const insights = generateInsights();
    const professionalProfile = generateProfessionalProfile();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Soft Skills Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            Your Profile: {selectedField === 'General' ? 'General Skills' : selectedField}
          </p>
        </div>

        {/* Professional Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              Your Profile: {selectedField === 'General' ? 'General Skills' : selectedField}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {professionalProfile}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([category, score]) => (
            <Card key={category} className="bg-card border-border">
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

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

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
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Job Recommendations
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

  const currentQuestionData = relevantQuestions[currentQuestion];
  const currentResponse = responses[currentQuestionData.key] || 0;
  const progress = ((currentQuestion + 1) / relevantQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Soft Skills Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Evaluate your interpersonal and workplace communication skills for {selectedField === 'General' ? 'general roles' : selectedField}
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-foreground">
              Question {currentQuestion + 1} of {relevantQuestions.length}
            </CardTitle>
            <Badge variant="outline" className="border-border text-muted-foreground">
              {Math.round(progress)}% Complete
            </Badge>
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
              <div className="text-3xl font-bold text-primary mb-2">
                {getSkillLevelDescription(currentResponse)}
              </div>
              <div className="text-lg text-muted-foreground">
                ({currentResponse}/4)
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {currentQuestion === relevantQuestions.length - 1 ? 'Complete' : 'Next'}
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
