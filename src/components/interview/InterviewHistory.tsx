
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Briefcase, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import InterviewFeedback from "./InterviewFeedback";

interface InterviewSession {
  id: string;
  job_role: string;
  completed_at: string;
  questions: Array<{
    id: number;
    question: string;
    category: string;
    difficulty: string;
  }>;
  responses: Array<{
    question: string;
    response: string;
    feedback?: string;
  }>;
}

interface InterviewHistoryProps {
  interviews: InterviewSession[];
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
}

const InterviewHistory = ({ interviews, onBack, isLoading = false, error }: InterviewHistoryProps) => {
  const [selectedInterview, setSelectedInterview] = useState<InterviewSession | null>(null);

  if (selectedInterview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setSelectedInterview(null)} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Interview Details</h1>
            <p className="text-slate-600">
              {selectedInterview.job_role} • {format(new Date(selectedInterview.completed_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {selectedInterview.responses.map((response, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-800">{response.question}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Your Response:</h4>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-slate-700">{response.response}</p>
                  </div>
                </div>
                
                {response.feedback && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Feedback:</h4>
                    <InterviewFeedback feedback={response.feedback} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Practice
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Interview History</h1>
          <p className="text-slate-600">
            Review your past interview practice sessions
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Loading your interview history...</h3>
            <p className="text-slate-600">Please wait while we fetch your past sessions.</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading History</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : interviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No interview history found yet</h3>
            <p className="text-slate-600">Start practicing to see results here!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {interview.job_role}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(interview.completed_at), 'MMM d, yyyy • h:mm a')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {interview.responses.length} questions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-600">
                    <p>{interview.responses.filter(r => r.response.trim()).length} responses completed</p>
                    <p>{interview.responses.filter(r => r.feedback).length} feedback received</p>
                  </div>
                  <Button 
                    onClick={() => setSelectedInterview(interview)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
