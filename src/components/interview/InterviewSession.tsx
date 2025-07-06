
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { InterviewQuestion } from "@/types/interview";

interface InterviewSessionProps {
  currentQuestion: InterviewQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedRole: string;
  userResponse: string;
  feedback: string;
  isSpeaking: boolean;
  isGeneratingFeedback: boolean;
  onResponseChange: (response: string) => void;
  onGenerateFeedback: () => void;
  onNextQuestion: () => void;
  onSkipQuestion: () => void;
  onEndSession: () => void;
  onSpeakText: (text: string) => void;
  onStopSpeaking: () => void;
}

const InterviewSession = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedRole,
  userResponse,
  feedback,
  isSpeaking,
  isGeneratingFeedback,
  onResponseChange,
  onGenerateFeedback,
  onNextQuestion,
  onSkipQuestion,
  onEndSession,
  onSpeakText,
  onStopSpeaking,
}: InterviewSessionProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Practice</h1>
          <div className="w-24 h-1 bg-gray-300 mt-2"></div>
          <p className="text-muted-foreground mt-1">
            Question {currentQuestionIndex + 1} of {totalQuestions} • {selectedRole}
          </p>
        </div>
        <Button onClick={onEndSession} variant="outline">
          End Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">Interview Question</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{currentQuestion.category}</Badge>
              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-lg text-slate-800">{currentQuestion.question}</p>
          </div>

          <div className="flex gap-2">
            {isSpeaking ? (
              <Button onClick={onStopSpeaking} variant="outline" size="sm">
                <VolumeX className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button onClick={() => onSpeakText(currentQuestion.question)} variant="outline" size="sm">
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
              onChange={(e) => onResponseChange(e.target.value)}
              placeholder="Type your response here..."
              rows={6}
              className="mb-4"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={onGenerateFeedback} 
                variant="outline" 
                size="sm"
                disabled={isGeneratingFeedback || !userResponse.trim()}
              >
                {isGeneratingFeedback ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Get Feedback"
                )}
              </Button>
            </div>
          </div>

          {feedback && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-green-800">Feedback</span>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">{feedback}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={onSkipQuestion} variant="outline">
              Skip Question
            </Button>
            <Button
              onClick={onNextQuestion}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Complete Session"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSession;
