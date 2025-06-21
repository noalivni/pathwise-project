
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Brain, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SkillsAssessment = () => {
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
      category: "Soft Skills",
      question: "How do you handle working in a team?",
      options: [
        "I prefer working alone most of the time",
        "I can work in teams but prefer clear individual tasks",
        "I actively collaborate and communicate well",
        "I naturally take leadership roles and facilitate team success"
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
    },
    {
      category: "Communication",
      question: "How comfortable are you presenting to stakeholders?",
      options: [
        "Very nervous, avoid when possible",
        "Somewhat nervous but can manage",
        "Comfortable with proper preparation",
        "Confident and engaging presenter"
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
      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your skills have been evaluated successfully.",
      });
    }
  };

  const getSkillLevel = (score: number) => {
    if (score <= 1) return { level: "Beginner", color: "bg-red-500" };
    if (score <= 2) return { level: "Intermediate", color: "bg-yellow-500" };
    if (score <= 3) return { level: "Advanced", color: "bg-blue-500" };
    return { level: "Expert", color: "bg-green-500" };
  };

  const calculateResults = () => {
    const categories = {
      "Technical Skills": answers.slice(0, 2).reduce((a, b) => a + b, 0) / 2,
      "Soft Skills": answers[2] || 0,
      "Problem Solving": answers[3] || 0,
      "Communication": answers[4] || 0
    };

    return Object.entries(categories).map(([category, score]) => ({
      category,
      score: score,
      ...getSkillLevel(score)
    }));
  };

  if (showResults) {
    const results = calculateResults();
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
                  Score: {result.score + 1}/4
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
              <h3 className="font-semibold text-teal-800">Strengthen Technical Skills</h3>
              <p className="text-teal-700">Consider taking advanced JavaScript or React courses to boost your technical capabilities.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Enhance Communication</h3>
              <p className="text-blue-700">Practice presentation skills and consider joining professional speaking groups.</p>
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
          <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
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
