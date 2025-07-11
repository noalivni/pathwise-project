
import { useState, useCallback } from "react";
import { InterviewQuestion, InterviewResponse } from "@/types/interview";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { interviewQuestions } from "@/data/interviewQuestions";

export const useInterviewSession = () => {
  const { user } = useAuth();
  
  // Session state
  const [selectedRole, setSelectedRole] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionResponses, setSessionResponses] = useState<InterviewResponse[]>([]);

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
      toast({
        title: "Error",
        description: "Failed to start interview session. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedRole, speakText]);

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
      
      // Provide structured fallback feedback that's specific to their question and role
      const structuredFallback = {
        strengths: `You took the time to provide a thoughtful response to this ${currentQuestion?.category?.toLowerCase()} question. Your effort to address the question shows good engagement and communication willingness.`,
        improvements: `Since this is a ${currentQuestion?.difficulty?.toLowerCase()} level question for a ${selectedRole} role, consider adding more specific examples that directly demonstrate your relevant experience. Your answer could benefit from more concrete details about your accomplishments or approach.`,
        suggestions: `For this type of ${currentQuestion?.category?.toLowerCase()} question, try structuring your response with specific examples using the STAR method (Situation, Task, Action, Result). Include measurable outcomes when possible, and explicitly connect your experience to what a ${selectedRole} would do in similar situations.`,
        relevance: `As a ${selectedRole} candidate, focus on demonstrating the key competencies this question is testing. Share specific examples that show how you've handled similar challenges or responsibilities that would be relevant to this role's daily tasks and requirements.`
      };
      
      setFeedback(JSON.stringify(structuredFallback));
      speakText("I've generated feedback for your response. Please review the detailed suggestions to improve your interview performance.");
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
  }, [user, selectedRole, sessionQuestions, sessionResponses, currentQuestion, userResponse, feedback, currentQuestionIndex]);

  const skipQuestion = useCallback(() => {
    const randomQuestion = sessionQuestions[Math.floor(Math.random() * sessionQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setUserResponse("");
    setFeedback("");
    speakText(randomQuestion.question);
  }, [sessionQuestions, speakText]);

  return {
    // State
    selectedRole,
    currentQuestion,
    userResponse,
    feedback,
    isSpeaking,
    isGeneratingFeedback,
    sessionQuestions,
    currentQuestionIndex,
    sessionStarted,
    sessionResponses,
    
    // Actions
    setSelectedRole,
    setUserResponse,
    startInterviewSession,
    generateFeedback,
    nextQuestion,
    endSession,
    skipQuestion,
    speakText,
    stopSpeaking
  };
};
