
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Brain, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SkillsAssessment = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      category: "Technical Skills",
      question: "How comfortable are you with HTML/CSS?",
      options: [
        "Beginner - I can create basic web pages",
        "Intermediate - I can create responsive layouts",
        "Advanced - I can create complex animations and layouts",
        "Expert - I can optimize for performance and accessibility"
      ]
    },
    {
      category: "Technical Skills",
      question: "What's your experience with JavaScript?",
      options: [
        "Beginner - I understand basic syntax",
        "Intermediate - I can build interactive features",
        "Advanced - I work with frameworks like React/Vue",
        "Expert - I can architect complex applications"
      ]
    },
    {
      category: "Communication",
      question: "How would you rate your communication skills?",
      options: [
        "I struggle to express ideas clearly",
        "I can communicate basic information effectively",
        "I communicate well and adapt to different audiences",
        "I excel at complex communication and public speaking"
      ]
    },
    {
      category: "Adaptability",
      question: "How do you handle change and new challenges?",
      options: [
        "I find change stressful and prefer routine",
        "I can adapt with some guidance and time",
        "I embrace change and learn quickly",
        "I thrive in dynamic environments and lead change"
      ]
    },
    {
      category: "Leadership",
      question: "How comfortable are you in leadership roles?",
      options: [
        "I prefer to follow others' lead",
        "I can lead when necessary but prefer supporting roles",
        "I naturally take on leadership responsibilities",
        "I excel at inspiring and guiding teams"
      ]
    },
    {
      category: "Problem Solving",
      question: "When faced with a complex problem, you:",
      options: [
        "Feel overwhelmed and need guidance",
        "Break it down into smaller parts",
        "Research solutions and adapt them",
        "Develop innovative approaches and solutions"
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveAssessmentResults(newAnswers);
    }
  };

  const saveAssessmentResults = async (finalAnswers: number[]) => {
    if (!user) return;

    const results = calculateResults(finalAnswers);
    
    try {
      // Save assessment to database
      const { error: assessmentError } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          technical_skills: {
            html_css: finalAnswers[0],
            javascript: finalAnswers[1]
          },
          soft_skills: {
            communication: finalAnswers[2],
            adaptability: finalAnswers[3],
            leadership: finalAnswers[4],
            problem_solving: finalAnswers[5]
          },
          strengths: results.strengths,
          weaknesses: results.weaknesses,
          recommended_paths: results.recommendedPaths
        });

      if (assessmentError) throw assessmentError;

      // Log activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'assessment_completed',
          activity_description: 'Completed Skills Assessment'
        });

      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your skills have been evaluated and saved successfully.",
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

  const calculateResults = (finalAnswers: number[]) => {
    const categories = [
      { name: "HTML/CSS", score: finalAnswers[0] },
      { name: "JavaScript", score: finalAnswers[1] },
      { name: "Communication", score: finalAnswers[2] },
      { name: "Adaptability", score: finalAnswers[3] },
      { name: "Leadership", score: finalAnswers[4] },
      { name: "Problem Solving", score: finalAnswers[5] }
    ];

    const strengths = categories
      .filter(cat => cat.score >= 2)
      .map(cat => cat.name);

    const weaknesses = categories
      .filter(cat => cat.score < 2)
      .map(cat => cat.name);

    // Determine recommended paths based on strengths
    const recommendedPaths = [];
    if (strengths.includes("HTML/CSS") && strengths.includes("JavaScript")) {
      recommendedPaths.push("Frontend Developer");
    }
    if (strengths.includes("Leadership") && strengths.includes("Communication")) {
      recommendedPaths.push("Product Manager");
    }
    if (strengths.includes("Problem Solving") && strengths.includes("Adaptability")) {
      recommendedPaths.push("Data Analyst");
    }

    return { strengths, weaknesses, recommendedPaths };
  };

  const getSkillLevel = (score: number) => {
    if (score <= 1) return { level: "Beginner", color: "bg-red-500" };
    if (score <= 2) return { level: "Intermediate", color: "bg-yellow-500" };
    if (score <= 3) return { level: "Advanced", color: "bg-blue-500" };
    return { level: "Expert", color: "bg-green-500" };
  };

  const getResults = () => {
    const categories = {
      "Technical Skills": (answers[0] + answers[1]) / 2,
      "Communication": answers[2],
      "Adaptability": answers[3],
      "Leadership": answers[4],
      "Problem Solving": answers[5]
    };

    return Object.entries(categories).map(([category, score]) => ({
      category,
      score: score || 0,
      ...getSkillLevel(score || 0)
    }));
  };

  if (showResults) {
    const results = getResults();
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Your Skills Assessment Results</h1>
          <p className="text-slate-600 mt-2">Based on your responses, here's your skill profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{result.category}</span>
                  <Badge className={`${result.color} text-white`}>
                    {result.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(result.score / 3) * 100} className="mb-2" />
                <p className="text-sm text-slate-600">
                  Score: {Math.round(result.score * 10) / 10 + 1}/4
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-teal-600" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-teal-50 rounded-lg">
              <h3 className="font-semibold text-teal-800">Explore Job Recommendations</h3>
              <p className="text-teal-700">Based on your skills, we've identified matching career opportunities for you.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Continue Learning</h3>
              <p className="text-blue-700">Check out personalized learning resources to strengthen your skills.</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setAnswers([]);
            }}
            variant="outline"
            className="mr-4"
          >
            Retake Assessment
          </Button>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-jobs'))}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            View Job Recommendations
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Skills Assessment</h1>
        <p className="text-slate-600 mt-2">Help us understand your capabilities to provide better recommendations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-teal-600" />
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <Badge variant="outline">
              {questions[currentQuestion].category}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-teal-50 hover:border-teal-200"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-start space-x-3">
                    {answers[currentQuestion] === index ? (
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                    )}
                    <span className="text-sm">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsAssessment;
