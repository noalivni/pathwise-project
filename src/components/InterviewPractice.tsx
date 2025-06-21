
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Pause, RotateCcw, Mic, MicOff, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const InterviewPractice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      category: "Behavioral",
      question: "Tell me about a time when you had to overcome a significant challenge.",
      tips: "Use the STAR method: Situation, Task, Action, Result. Be specific and focus on your role.",
      difficulty: "Medium"
    },
    {
      category: "Technical",
      question: "How would you explain a complex technical concept to a non-technical stakeholder?",
      tips: "Use analogies, avoid jargon, and focus on the business impact.",
      difficulty: "Medium"
    },
    {
      category: "Leadership",
      question: "Describe a situation where you had to lead a team through a difficult project.",
      tips: "Highlight your communication skills, problem-solving abilities, and team management.",
      difficulty: "Hard"
    },
    {
      category: "Problem Solving",
      question: "How do you approach a problem you've never encountered before?",
      tips: "Show your analytical thinking process and willingness to learn.",
      difficulty: "Easy"
    }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    toast({
      title: "Recording Started",
      description: "You can now answer the question. Take your time!",
    });
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "Continue with your answer" : "Recording paused",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    toast({
      title: "Recording Stopped",
      description: "Analyzing your response...",
    });
    
    // Simulate analysis delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Interview Practice Results</h1>
          <p className="text-slate-600 mt-2">Here's how you performed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">85%</div>
              <Badge className="bg-teal-100 text-teal-700">Excellent</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
              <Badge className="bg-blue-100 text-blue-700">Outstanding</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Confidence</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">78%</div>
              <Badge className="bg-green-100 text-green-700">Good</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Strengths</h3>
              <ul className="text-green-700 mt-2 space-y-1">
                <li>• Clear and structured responses</li>
                <li>• Good use of specific examples</li>
                <li>• Professional tone and language</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Areas for Improvement</h3>
              <ul className="text-yellow-700 mt-2 space-y-1">
                <li>• Could be more concise in some responses</li>
                <li>• Add more quantifiable results</li>
                <li>• Practice maintaining eye contact</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
            }}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            Practice Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Interview Practice</h1>
          <p className="text-slate-600 mt-2">Practice with AI-powered mock interviews</p>
        </div>
        <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center gap-1">
          <Crown className="h-4 w-4" />
          PRO Feature
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {questions[currentQuestion].category}
              </Badge>
              <Badge className={`${getDifficultyColor(questions[currentQuestion].difficulty)} text-white`}>
                {questions[currentQuestion].difficulty}
              </Badge>
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>
            <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <strong>💡 Tip:</strong> {questions[currentQuestion].tips}
            </div>
          </div>

          <div className="text-center space-y-4">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                    <span className="text-sm font-medium">
                      {isPaused ? 'Paused' : 'Recording...'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handlePauseRecording}
                    variant="outline"
                    size="lg"
                  >
                    {isPaused ? (
                      <>
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleStopRecording}
                    variant="destructive"
                    size="lg"
                  >
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop & Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  index < currentQuestion
                    ? 'bg-green-50 border-green-200'
                    : index === currentQuestion
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-sm font-medium">Q{index + 1}</div>
                <div className="text-xs text-slate-600">
                  {index < currentQuestion ? 'Completed' : 
                   index === currentQuestion ? 'Current' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewPractice;
