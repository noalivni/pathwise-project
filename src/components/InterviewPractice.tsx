
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { useInterviewHistory } from "@/hooks/useInterviewHistory";
import InterviewSetup from "./interview/InterviewSetup";
import InterviewSession from "./interview/InterviewSession";
import InterviewHistory from "./interview/InterviewHistory";
import InterviewError from "./interview/InterviewError";
import InterviewLoading from "./interview/InterviewLoading";
import InterviewProUpgrade from "./interview/InterviewProUpgrade";
import UpgradeModal from "./notifications/UpgradeModal";

const InterviewPractice = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  const handleUpgrade = () => {
    // Profile will refresh automatically via auth context
    setShowUpgradeModal(false);
  };

  const handleClose = () => {
    setShowUpgradeModal(false);
  };

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);
        
        if (isPro && user) {
          await fetchPastInterviews();
        } else if (!isPro) {
          // Show upgrade modal for free users
          setShowUpgradeModal(true);
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

  // Non-premium users - show upgrade modal
  if (!isPro) {
    return (
      <>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={handleClose}
          onUpgrade={handleUpgrade}
          featureName="AI-Powered Interview Practice"
        />
        {/* Show the pro upgrade component when modal is closed */}
        {!showUpgradeModal && <InterviewProUpgrade />}
      </>
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
      hasQuestions={true}
    />
  );
};

export default InterviewPractice;
