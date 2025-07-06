
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import InterviewSetup from "./interview/InterviewSetup";
import InterviewSession from "./interview/InterviewSession";
import InterviewHistory from "./interview/InterviewHistory";
import InterviewError from "./interview/InterviewError";

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

// Type guard for InterviewQuestion
const isInterviewQuestion = (obj: any): obj is InterviewQuestion => {
  return obj && 
         typeof obj.id === 'number' &&
         typeof obj.question === 'string' &&
         typeof obj.category === 'string' &&
         typeof obj.difficulty === 'string';
};

// Type guard for interview response
const isInterviewResponse = (obj: any): obj is {question: string; response: string; feedback?: string} => {
  return obj && 
         typeof obj.question === 'string' &&
         typeof obj.response === 'string' &&
         (obj.feedback === undefined || typeof obj.feedback === 'string');
};

// Safe JSON parser for questions
const parseQuestions = (data: any): InterviewQuestion[] => {
  try {
    let parsed = data;
    if (typeof data === 'string') {
      parsed = JSON.parse(data);
    }
    
    if (Array.isArray(parsed)) {
      return parsed.filter(isInterviewQuestion);
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to parse questions:', error);
    return [];
  }
};

// Safe JSON parser for responses
const parseResponses = (data: any): Array<{question: string; response: string; feedback?: string}> => {
  try {
    let parsed = data;
    if (typeof data === 'string') {
      parsed = JSON.parse(data);
    }
    
    if (Array.isArray(parsed)) {
      return parsed.filter(isInterviewResponse);
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to parse responses:', error);
    return [];
  }
};

const InterviewPractice = () => {
  const { user, profile } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  // Core state
  const [selectedRole, setSelectedRole] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  
  // Session state
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionResponses, setSessionResponses] = useState<Array<{
    question: string;
    response: string;
    feedback?: string;
  }>>([]);

  // History state
  const [showHistory, setShowHistory] = useState(false);
  const [pastInterviews, setPastInterviews] = useState<InterviewSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const isPro = profile?.subscription_status === 'premium';

  // Sample questions - in a real app, these would come from a database
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

  const fetchPastInterviews = useCallback(async () => {
    if (!user || !isPro) return;

    setIsLoadingHistory(true);
    setError("");

    try {
      console.log('Fetching past interviews for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      console.log('Raw data from Supabase:', data);

      const formattedInterviews: InterviewSession[] = (data || []).map(session => {
        const questions = parseQuestions(session.questions);
        const responses = parseResponses(session.responses);

        return {
          id: session.id,
          job_role: session.job_role || 'Unknown Role',
          completed_at: session.completed_at || new Date().toISOString(),
          questions,
          responses
        };
      });

      console.log('Formatted interviews:', formattedInterviews);
      setPastInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error fetching past interviews:', error);
      setError('Failed to load interview history. Please try again.');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user, isPro]);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);
        setError("");
        
        if (isPro && user) {
          await fetchPastInterviews();
        }
      } catch (error) {
        console.error('Error initializing Interview Practice:', error);
        setError('Failed to initialize Interview Practice. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [user, isPro, fetchPastInterviews]);

  const startInterviewSession = useCallback(() => {
    if (!selectedRole) {
      toast({
        title: "Select a Role",
        description: "Please select a job role to practice for.",
        variant: "destructive"
      });
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start interview session. Please try again.');
    }
  }, [selectedRole]);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window && text) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const generateFeedback = useCallback(async () => {
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
      // Fallback feedback
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
  }, [userResponse, currentQuestion, selectedRole, speakText]);

  const nextQuestion = useCallback(async () => {
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
  }, [currentQuestion, userResponse, feedback, sessionResponses, currentQuestionIndex, sessionQuestions, speakText]);

  const endSession = useCallback(async () => {
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

      await fetchPastInterviews();
    } catch (error) {
      console.error('Error saving interview session:', error);
      toast({
        title: "Save Error",
        description: "Failed to save your session, but you can continue practicing.",
        variant: "destructive"
      });
    }

    setSessionStarted(false);
    setCurrentQuestion(null);
    setSessionQuestions([]);
    setCurrentQuestionIndex(0);
    setSessionResponses([]);
  }, [user, selectedRole, sessionQuestions, sessionResponses, currentQuestion, userResponse, feedback, currentQuestionIndex, fetchPastInterviews]);

  const skipQuestion = useCallback(() => {
    const randomQuestion = sessionQuestions[Math.floor(Math.random() * sessionQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setUserResponse("");
    setFeedback("");
    speakText(randomQuestion.question);
  }, [sessionQuestions, speakText]);

  const handleRetry = useCallback(() => {
    setError("");
    setLoading(true);
    fetchPastInterviews().finally(() => setLoading(false));
  }, [fetchPastInterviews]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Loading Interview Practice...</h3>
            <p className="text-slate-600">Please wait while we set up your interview environment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return <InterviewError error={error} onRetry={handleRetry} />;
  }

  // Non-premium users
  if (!isPro) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md text-center">
          <CardContent className="py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Lock className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Pro Feature
            </h3>
            <p className="text-slate-600 mb-6">
              Interview Practice is available for Pro subscribers only. Upgrade to access AI-powered interview practice with personalized feedback and voice recording capabilities.
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
      <InterviewHistory
        interviews={pastInterviews}
        onBack={() => setShowHistory(false)}
        isLoading={isLoadingHistory}
        error={error}
      />
    );
  }

  // Active interview session
  if (sessionStarted && currentQuestion) {
    return (
      <InterviewSession
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={sessionQuestions.length}
        selectedRole={selectedRole}
        userResponse={userResponse}
        feedback={feedback}
        isSpeaking={isSpeaking}
        isGeneratingFeedback={isGeneratingFeedback}
        onResponseChange={setUserResponse}
        onGenerateFeedback={generateFeedback}
        onNextQuestion={nextQuestion}
        onSkipQuestion={skipQuestion}
        onEndSession={endSession}
        onSpeakText={speakText}
        onStopSpeaking={stopSpeaking}
      />
    );
  }

  // Setup view
  return (
    <InterviewSetup
      selectedRole={selectedRole}
      onRoleChange={setSelectedRole}
      onStartSession={startInterviewSession}
      onShowHistory={() => setShowHistory(true)}
      pastInterviewsCount={pastInterviews.length}
      isLoadingHistory={isLoadingHistory}
      hasQuestions={interviewQuestions.length > 0}
    />
  );
};

export default InterviewPractice;
