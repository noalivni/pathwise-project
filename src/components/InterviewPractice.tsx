
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mic, MicOff, Volume2, VolumeX, Play, Pause, Crown, Lock, History, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import InterviewHistory from "@/components/interview/InterviewHistory";
import InterviewFeedback from "@/components/interview/InterviewFeedback";

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
}

interface InterviewSession {
  id: string;
  job_role: string;
  completed_at: string;
  questions: InterviewQuestion[];
  responses: Array<{
    question: string;
    response: string;
    feedback?: string;
  }>;
}

const InterviewPractice = () => {
  const { user, profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [pastInterviews, setPastInterviews] = useState<InterviewSession[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [sessionResponses, setSessionResponses] = useState<Array<{
    question: string;
    response: string;
    feedback?: string;
  }>>([]);

  const isPro = profile?.subscription_status === 'premium';

  const interviewQuestions: InterviewQuestion[] = [
    { id: 1, question: "Tell me about yourself and your background.", category: "General", difficulty: "Easy" },
    { id: 2, question: "Why are you interested in this position?", category: "General", difficulty: "Easy" },
    { id: 3, question: "What are your greatest strengths?", category: "General", difficulty: "Easy" },
    { id: 4, question: "Describe a challenging project you worked on.", category: "Technical", difficulty: "Medium" },
    { id: 5, question: "How do you handle working under pressure?", category: "Behavioral", difficulty: "Medium" },
    { id: 6, question: "Where do you see yourself in 5 years?", category: "General", difficulty: "Medium" },
    { id: 7, question: "Describe a time when you had to work with a difficult team member.", category: "Behavioral", difficulty: "Hard" },
    { id: 8, question: "How would you approach learning a new technology?", category: "Technical", difficulty: "Medium" },
    { id: 9, question: "What motivates you in your work?", category: "General", difficulty: "Easy" },
    { id: 10, question: "Tell me about a time you failed and how you handled it.", category: "Behavioral", difficulty: "Hard" }
  ];

  useEffect(() => {
    checkPremiumAccess();
    if (isPro) {
      fetchPastInterviews();
    }
  }, [user, isPro]);

  const checkPremiumAccess = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (profile?.subscription_status !== 'premium') {
        toast({
          title: "Premium Feature",
          description: "Interview Practice is available for premium users. Upgrade to access this feature.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking premium access:', error);
    }
  };

  const fetchPastInterviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const formattedInterviews: InterviewSession[] = data?.map(session => ({
        id: session.id,
        job_role: session.job_role || 'Unknown Role',
        completed_at: session.completed_at || new Date().toISOString(),
        questions: JSON.parse(session.questions || '[]'),
        responses: JSON.parse(session.responses || '[]')
      })) || [];

      setPastInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error fetching past interviews:', error);
    }
  };

  const startInterviewSession = () => {
    if (!selectedRole) {
      toast({
        title: "Select a Role",
        description: "Please select a job role to practice for.",
        variant: "destructive"
      });
      return;
    }

    const shuffled = [...interviewQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    setSessionQuestions(selected);
    setCurrentQuestion(selected[0]);
    setCurrentQuestionIndex(0);
    setSessionStarted(true);
    setUserResponse("");
    setFeedback("");
    setSessionResponses([]);

    speakText(selected[0].question);
  };

  const nextQuestion = () => {
    // Save current response
    if (currentQuestion && userResponse.trim()) {
      const updatedResponses = [...sessionResponses];
      updatedResponses[currentQuestionIndex] = {
        question: currentQuestion.question,
        response: userResponse,
        feedback: feedback
      };
      setSessionResponses(updatedResponses);
    }

    if (currentQuestionIndex < sessionQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(sessionQuestions[nextIndex]);
      setUserResponse("");
      setFeedback("");
      speakText(sessionQuestions[nextIndex].question);
    } else {
      endSession();
    }
  };

  const endSession = async () => {
    if (!user) return;

    try {
      // Save final response if exists
      let finalResponses = [...sessionResponses];
      if (currentQuestion && userResponse.trim()) {
        finalResponses[currentQuestionIndex] = {
          question: currentQuestion.question,
          response: userResponse,
          feedback: feedback
        };
      }

      const questionsJson = JSON.stringify(sessionQuestions);
      const responsesJson = JSON.stringify(finalResponses);

      await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          job_role: selectedRole,
          questions: questionsJson,
          responses: responsesJson
        });

      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'interview_completed',
          activity_description: `Completed interview practice for ${selectedRole}`
        });

      toast({
        title: "Session Complete",
        description: "Your interview practice session has been saved.",
      });

      fetchPastInterviews();
    } catch (error) {
      console.error('Error saving interview session:', error);
    }

    setSessionStarted(false);
    setCurrentQuestion(null);
    setSessionQuestions([]);
    setCurrentQuestionIndex(0);
    setSessionResponses([]);
  };

  const generateFeedback = async () => {
    if (!userResponse.trim()) {
      toast({
        title: "No Response",
        description: "Please provide a response before getting feedback.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingFeedback(true);

    try {
      const response = await supabase.functions.invoke('generate-interview-feedback', {
        body: {
          question: currentQuestion?.question,
          answer: userResponse,
          jobRole: selectedRole,
          questionCategory: currentQuestion?.category,
          questionDifficulty: currentQuestion?.difficulty
        }
      });

      if (response.data?.feedback) {
        setFeedback(response.data.feedback);
        speakText("I've generated detailed feedback for your response.");
      } else {
        throw new Error('No feedback generated');
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Fallback to simple feedback
      const feedbackPoints = [
        "Good structure in your response.",
        "Consider providing more specific examples.",
        "Your answer shows good self-awareness.",
        "Try to be more concise in your explanation.",
        "Great use of the STAR method (Situation, Task, Action, Result)."
      ];
      const randomFeedback = feedbackPoints[Math.floor(Math.random() * feedbackPoints.length)];
      setFeedback(randomFeedback);
      speakText(randomFeedback);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isPro) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Lock className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Pro Feature
            </CardTitle>
            <CardDescription>
              Interview Practice is available for Pro subscribers only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Upgrade to Pro to access AI-powered interview practice with personalized feedback and voice recording capabilities.
            </p>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showHistory) {
    return (
      <InterviewHistory 
        interviews={pastInterviews}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-slate-800">Interview Practice</h1>
            <p className="text-slate-600 mt-2">Practice common interview questions with AI feedback</p>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Pro Feature
          </Badge>
        </div>

        {pastInterviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Past Interviews
              </CardTitle>
              <CardDescription>
                You have {pastInterviews.length} completed interview{pastInterviews.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowHistory(true)}
                variant="outline"
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Interview History
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Start Your Interview Practice</CardTitle>
            <CardDescription>
              Select a job role to practice for and get personalized interview questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Job Role
              </label>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job role" />
                </SelectTrigger>
                <SelectContent>
                  {["Frontend Developer", "Backend Developer", "Data Analyst", "UX Designer", "Product Manager", "Marketing Specialist"].map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">What to expect:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 5 randomized interview questions</li>
                <li>• Text-to-speech for questions</li>
                <li>• AI-powered detailed feedback on your responses</li>
                <li>• Save and review past interview sessions</li>
              </ul>
            </div>

            <Button
              onClick={startInterviewSession}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              disabled={!selectedRole}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Interview Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Interview Practice</h1>
          <p className="text-slate-600 mt-1">
            Question {currentQuestionIndex + 1} of {sessionQuestions.length} • {selectedRole}
          </p>
        </div>
        <Button onClick={endSession} variant="outline">
          End Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">Interview Question</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{currentQuestion?.category}</Badge>
              <Badge variant="outline">{currentQuestion?.difficulty}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-lg text-slate-800">{currentQuestion?.question}</p>
          </div>

          <div className="flex gap-2">
            {isSpeaking ? (
              <Button onClick={stopSpeaking} variant="outline" size="sm">
                <VolumeX className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button onClick={() => speakText(currentQuestion?.question || "")} variant="outline" size="sm">
                <Volume2 className="w-4 h-4 mr-2" />
                Repeat Question
              </Button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Response
            </label>
            <Textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your response here..."
              rows={6}
              className="mb-4"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={generateFeedback} 
                variant="outline" 
                size="sm"
                disabled={isGeneratingFeedback || !userResponse.trim()}
              >
                {isGeneratingFeedback ? "Generating..." : "Get Feedback"}
              </Button>
            </div>
          </div>

          {feedback && (
            <InterviewFeedback feedback={feedback} />
          )}

          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentQuestion(sessionQuestions[Math.floor(Math.random() * sessionQuestions.length)])}
              variant="outline"
            >
              Skip Question
            </Button>
            <Button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              {currentQuestionIndex < sessionQuestions.length - 1 ? "Next Question" : "Complete Session"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewPractice;
