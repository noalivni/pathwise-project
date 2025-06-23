
import { Brain, CheckCircle, AlertCircle, Lightbulb, Target } from "lucide-react";

interface InterviewFeedbackProps {
  feedback: string;
}

const InterviewFeedback = ({ feedback }: InterviewFeedbackProps) => {
  // Parse structured feedback if it's JSON, otherwise display as plain text
  const parseFeedback = (feedbackText: string) => {
    try {
      // If feedback is already an object (shouldn't happen but let's handle it)
      if (typeof feedbackText === 'object' && feedbackText !== null) {
        const obj = feedbackText as any;
        return {
          strengths: typeof obj.strengths === 'string' ? obj.strengths : '',
          improvements: typeof obj.improvements === 'string' ? obj.improvements : '',
          suggestions: typeof obj.suggestions === 'string' ? obj.suggestions : '',
          relevance: typeof obj.relevance === 'string' ? obj.relevance : '',
          general: null
        };
      }

      // Try to parse as JSON string
      const parsed = JSON.parse(feedbackText);
      if (parsed && typeof parsed === 'object' && (parsed.strengths || parsed.improvements || parsed.suggestions || parsed.relevance)) {
        return {
          strengths: typeof parsed.strengths === 'string' ? parsed.strengths : '',
          improvements: typeof parsed.improvements === 'string' ? parsed.improvements : '',
          suggestions: typeof parsed.suggestions === 'string' ? parsed.suggestions : '',
          relevance: typeof parsed.relevance === 'string' ? parsed.relevance : '',
          general: null
        };
      }
    } catch {
      // Not JSON, treat as plain text
    }
    
    // Fallback to plain text
    return { 
      general: String(feedbackText), 
      strengths: null, 
      improvements: null, 
      suggestions: null, 
      relevance: null 
    };
  };

  const parsedFeedback = parseFeedback(feedback);

  if (parsedFeedback.general) {
    // Plain text feedback
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Feedback</span>
        </div>
        <p className="text-green-700 text-sm leading-relaxed">{parsedFeedback.general}</p>
      </div>
    );
  }

  // Structured feedback
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">Feedback</span>
      </div>

      {parsedFeedback.strengths && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Strengths</span>
          </div>
          <p className="text-green-700 text-sm leading-relaxed">{parsedFeedback.strengths}</p>
        </div>
      )}

      {parsedFeedback.improvements && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Areas to Improve</span>
          </div>
          <p className="text-orange-700 text-sm leading-relaxed">{parsedFeedback.improvements}</p>
        </div>
      )}

      {parsedFeedback.suggestions && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Suggestions</span>
          </div>
          <p className="text-blue-700 text-sm leading-relaxed">{parsedFeedback.suggestions}</p>
        </div>
      )}

      {parsedFeedback.relevance && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Relevance to Role</span>
          </div>
          <p className="text-purple-700 text-sm leading-relaxed">{parsedFeedback.relevance}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewFeedback;
