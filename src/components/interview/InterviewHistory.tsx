
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Briefcase, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
}

const InterviewHistory = ({ interviews, onBack }: InterviewHistoryProps) => {
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

      {interviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No interviews yet</h3>
            <p className="text-slate-600">Start your first interview practice session to see it here.</p>
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
