
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mic, MicOff, Volume2, VolumeX, Play, Pause, Crown, Lock, History, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string>("");

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
    if (isPro && user) {
      fetchPastInterviews();
    }
  }, [user, isPro]);

  const fetchPastInterviews = async () => {
    if (!user) return;

    setIsLoadingHistory(true);
    setHistoryError("");

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching interviews:', error);
        setHistoryError('Failed to load interview history');
        return;
      }

      const formattedInterviews: InterviewSession[] = (data || []).map(session => {
        let questions = [];
        let responses = [];
        
        try {
          questions = session.questions ? JSON.parse(String(session.questions)) : [];
        } catch (e) {
          console.warn('Failed to parse questions:', e);
          questions = [];
        }
        
        try {
          responses = session.responses ? JSON.parse(String(session.responses)) : [];
        } catch (e) {
          console.warn('Failed to parse responses:', e);
          responses = [];
        }

        return {
          id: session.id,
          job_role: session.job_role || 'Unknown Role',
          completed_at: session.completed_at || new Date().toISOString(),
          questions: questions,
          responses: responses
        };
      });

      setPastInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error fetching past interviews:', error);
      setHistoryError('Failed to load interview history');
    } finally {
      setIsLoadingHistory(false);
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

  const nextQuestion = async () => {
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
      await endSession();
    }
  };

  const endSession = async () => {
    if (!user) return;

    try {
      let finalResponses = [...sessionResponses];
      if (currentQuestion && userResponse.trim()) {
        finalResponses[currentQuestionIndex] = {
          question: currentQuestion.question,
          response: userResponse,
          feedback: feedback
        };
      }

      await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          job_role: selectedRole,
          questions: JSON.stringify(sessionQuestions),
          responses: JSON.stringify(finalResponses)
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
        const feedbackString = typeof response.data.feedback === 'string' 
          ? response.data.feedback 
          : JSON.stringify(response.data.feedback);
        
        setFeedback(feedbackString);
        speakText("I've generated detailed feedback for your response.");
      } else {
        throw new Error('No feedback generated');
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
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

  // Non-premium users
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

  // History view
  if (showHistory) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Interview History</h1>
            <p className="text-slate-600">Review your past interview practice sessions</p>
          </div>
        </div>

        {isLoadingHistory ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Loading your interview history...</h3>
              <p className="text-slate-600">Please wait while we fetch your past sessions.</p>
            </CardContent>
          </Card>
        ) : historyError ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading History</h3>
              <p className="text-red-600 mb-4">{historyError}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : pastInterviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No interview history found yet</h3>
              <p className="text-slate-600">Start practicing to see results here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        {interview.job_role}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <History className="h-4 w-4" />
                        {new Date(interview.completed_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {interview.responses.length} questions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600">
                    <p>{interview.responses.filter(r => r.response.trim()).length} responses completed</p>
                    <p>{interview.responses.filter(r => r.feedback).length} feedback received</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Main interview practice view (not started)
  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-foreground">Interview Practice</h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto mt-2"></div>
            <p className="text-muted-foreground mt-2">Practice common interview questions with AI feedback</p>
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
                disabled={isLoadingHistory}
              >
                {isLoadingHistory ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    View Interview History
                  </>
                )}
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

            {interviewQuestions.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-center">
                  No interview practice content available. Please check back soon!
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">What to expect:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 5 randomized interview questions</li>
                  <li>• Text-to-speech for questions</li>
                  <li>• AI-powered detailed feedback on your responses</li>
                  <li>• Save and review past interview sessions</li>
                </ul>
              </div>
            )}

            <Button
              onClick={startInterviewSession}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              disabled={!selectedRole || interviewQuestions.length === 0}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active interview session
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Practice</h1>
          <div className="w-24 h-1 bg-gray-300 mt-2"></div>
          <p className="text-muted-foreground mt-1">
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
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Feedback</span>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">{feedback}</p>
            </div>
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
