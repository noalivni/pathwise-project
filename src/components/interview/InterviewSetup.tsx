
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Crown, Eye, Loader2 } from "lucide-react";

interface InterviewSetupProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onStartSession: () => void;
  onShowHistory: () => void;
  pastInterviewsCount: number;
  isLoadingHistory: boolean;
  hasQuestions: boolean;
}

const InterviewSetup = ({
  selectedRole,
  onRoleChange,
  onStartSession,
  onShowHistory,
  pastInterviewsCount,
  isLoadingHistory,
  hasQuestions,
}: InterviewSetupProps) => {
  const jobRoles = [
    "Frontend Developer",
    "Backend Developer", 
    "Data Analyst",
    "UX Designer",
    "Product Manager",
    "Marketing Specialist"
  ];

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

      {pastInterviewsCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Past Interviews
            </CardTitle>
            <CardDescription>
              You have {pastInterviewsCount} completed interview{pastInterviewsCount !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onShowHistory}
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
            <Select onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job role" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!hasQuestions ? (
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
            onClick={onStartSession}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            disabled={!selectedRole || !hasQuestions}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start New Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSetup;
