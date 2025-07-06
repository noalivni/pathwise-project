
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { useInterviewHistory } from "@/hooks/useInterviewHistory";
import InterviewSetup from "./interview/InterviewSetup";
import InterviewSession from "./interview/InterviewSession";
import InterviewHistory from "./interview/InterviewHistory";
import InterviewError from "./interview/InterviewError";
import InterviewProUpgrade from "./interview/InterviewProUpgrade";
import InterviewLoading from "./interview/InterviewLoading";

const InterviewPractice = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const {
    selectedRole,
    currentQuestion,
    userResponse,
    feedback,
    isSpeaking,
    isGeneratingFeedback,
    sessionQuestions,
    currentQuestionIndex,
    sessionStarted,
    setSelectedRole,
    setUserResponse,
    startInterviewSession,
    generateFeedback,
    nextQuestion,
    endSession,
    skipQuestion,
    speakText,
    stopSpeaking
  } = useInterviewSession();

  const {
    pastInterviews,
    isLoadingHistory,
    error,
    fetchPastInterviews,
    isPro
  } = useInterviewHistory();

  const handleRetry = () => {
    setLoading(true);
    fetchPastInterviews().finally(() => setLoading(false));
  };

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);
        
        if (isPro && user) {
          await fetchPastInterviews();
        }
      } catch (error) {
        console.error('Error initializing Interview Practice:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [user, isPro, fetchPastInterviews]);

  // Show loading state
  if (loading) {
    return <InterviewLoading />;
  }

  // Show error state
  if (error) {
    return <InterviewError error={error} onRetry={handleRetry} />;
  }

  // Non-premium users
  if (!isPro) {
    return <InterviewProUpgrade />;
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
      hasQuestions={true}
    />
  );
};

export default InterviewPractice;
