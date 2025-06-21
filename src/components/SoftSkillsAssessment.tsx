
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, ArrowRight, CheckCircle, Circle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SoftSkillsAssessment = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      category: "Communication",
      question: "How comfortable are you presenting ideas to a group?",
      options: [
        "I avoid presentations and prefer written communication",
        "I can present when necessary but feel nervous",
        "I'm comfortable presenting to familiar groups",
        "I enjoy presenting and can adapt to any audience"
      ]
    },
    {
      category: "Leadership",
      question: "When working in a team, how do you typically contribute?",
      options: [
        "I prefer to follow others' lead and support their decisions",
        "I contribute ideas but let others take charge",
        "I naturally step up to coordinate and guide the team",
        "I actively lead, delegate, and inspire team members"
      ]
    },
    {
      category: "Problem Solving",
      question: "When faced with a complex problem, your approach is to:",
      options: [
        "Seek help from others or look for existing solutions",
        "Break it down into smaller, manageable parts",
        "Research thoroughly before developing a strategy",
        "Think creatively and develop innovative solutions"
      ]
    },
    {
      category: "Adaptability",
      question: "How do you handle sudden changes in plans or priorities?",
      options: [
        "I find changes stressful and need time to adjust",
        "I can adapt but prefer advance notice when possible",
        "I adjust quickly and help others navigate changes",
        "I thrive in dynamic environments and embrace uncertainty"
      ]
    },
    {
      category: "Collaboration",
      question: "In group projects, you typically:",
      options: [
        "Work independently and merge contributions later",
        "Contribute your part and coordinate when needed",
        "Actively collaborate and build on others' ideas",
        "Foster team synergy and bring out the best in everyone"
      ]
    },
    {
      category: "Time Management",
      question: "How do you handle multiple deadlines and priorities?",
      options: [
        "I often feel overwhelmed and may miss some deadlines",
        "I manage with effort but sometimes struggle with prioritization",
        "I organize my tasks well and usually meet deadlines",
        "I excel at prioritizing and often help others manage their time"
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
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          technical_skills: {},
          soft_skills: {
            communication: finalAnswers[0],
            leadership: finalAnswers[1],
            problem_solving: finalAnswers[2],
            adaptability: finalAnswers[3],
            collaboration: finalAnswers[4],
            time_management: finalAnswers[5]
          },
          strengths: results.strengths,
          weaknesses: results.improvements,
          personality_type: results.personalityType,
          assessment_type: 'soft_skills'
        });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your soft skills profile has been created successfully.",
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
      { name: "Communication", score: finalAnswers[0] },
      { name: "Leadership", score: finalAnswers[1] },
      { name: "Problem Solving", score: finalAnswers[2] },
      { name: "Adaptability", score: finalAnswers[3] },
      { name: "Collaboration", score: finalAnswers[4] },
      { name: "Time Management", score: finalAnswers[5] }
    ];

    const strengths = categories
      .filter(cat => cat.score >= 2)
      .map(cat => cat.name);

    const improvements = categories
      .filter(cat => cat.score < 2)
      .map(cat => cat.name);

    // Determine personality type based on strengths
    let personalityType = "Balanced Professional";
    if (strengths.includes("Leadership") && strengths.includes("Communication")) {
      personalityType = "Natural Leader";
    } else if (strengths.includes("Problem Solving") && strengths.includes("Adaptability")) {
      personalityType = "Strategic Thinker";
    } else if (strengths.includes("Collaboration") && strengths.includes("Communication")) {
      personalityType = "Team Player";
    } else if (strengths.includes("Problem Solving") && strengths.includes("Time Management")) {
      personalityType = "Efficient Executor";
    }

    return { strengths, improvements, personalityType };
  };

  const getSkillLevel = (score: number) => {
    if (score <= 1) return { level: "Developing", color: "bg-orange-500" };
    if (score <= 2) return { level: "Competent", color: "bg-yellow-500" };
    if (score <= 3) return { level: "Strong", color: "bg-blue-500" };
    return { level: "Exceptional", color: "bg-green-500" };
  };

  const getPersonalityInsights = (personalityType: string) => {
    const insights = {
      "Natural Leader": {
        description: "You excel at guiding others and communicating vision effectively.",
        workEnvironment: "Thrive in leadership roles, team management, and client-facing positions.",
        advice: "Consider roles that involve strategic planning, team leadership, or business development."
      },
      "Strategic Thinker": {
        description: "You combine analytical thinking with adaptability to solve complex challenges.",
        workEnvironment: "Excel in consulting, project management, or roles requiring strategic planning.",
        advice: "Look for opportunities that involve problem-solving, analysis, and strategic decision-making."
      },
      "Team Player": {
        description: "You build strong relationships and create collaborative environments.",
        workEnvironment: "Work well in collaborative teams, customer service, or HR-related roles.",
        advice: "Consider positions that involve teamwork, relationship building, or community engagement."
      },
      "Efficient Executor": {
        description: "You combine strong problem-solving skills with excellent time management.",
        workEnvironment: "Excel in operational roles, project coordination, or process improvement.",
        advice: "Look for roles that involve project management, operations, or process optimization."
      },
      "Balanced Professional": {
        description: "You demonstrate well-rounded soft skills across multiple areas.",
        workEnvironment: "Adaptable to various work environments and team structures.",
        advice: "You have the flexibility to succeed in many different career paths."
      }
    };

    return insights[personalityType] || insights["Balanced Professional"];
  };

  if (showResults) {
    const categories = [
      { name: "Communication", score: answers[0] || 0 },
      { name: "Leadership", score: answers[1] || 0 },
      { name: "Problem Solving", score: answers[2] || 0 },
      { name: "Adaptability", score: answers[3] || 0 },
      { name: "Collaboration", score: answers[4] || 0 },
      { name: "Time Management", score: answers[5] || 0 }
    ];

    const results = calculateResults(answers);
    const personalityInsights = getPersonalityInsights(results.personalityType);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Soft Skills Assessment Results</h1>
          <p className="text-slate-600 mt-2">Your personality profile and work style insights</p>
        </div>

        <Card className="border-2 border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
            <CardTitle className="text-2xl text-center text-teal-800">
              {results.personalityType}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {personalityInsights.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Ideal Work Environment</h3>
                <p className="text-blue-700">{personalityInsights.workEnvironment}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Career Advice</h3>
                <p className="text-green-700">{personalityInsights.advice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const skillInfo = getSkillLevel(category.score);
            
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{category.name}</span>
                    <Badge className={`${skillInfo.color} text-white`}>
                      {skillInfo.level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={(category.score / 3) * 100} className="mb-2" />
                  <p className="text-sm text-slate-600">Level: {category.score + 1}/4</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-x-4">
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setAnswers([]);
            }}
            variant="outline"
          >
            Retake Assessment
          </Button>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-jobs'))}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            View Job Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Soft Skills Assessment</h1>
        <p className="text-slate-600 mt-2">Discover your personality type and work style preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-teal-600" />
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

export default SoftSkillsAssessment;
