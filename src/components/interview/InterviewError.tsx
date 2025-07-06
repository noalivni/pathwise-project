
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface InterviewErrorProps {
  error: string;
  onRetry: () => void;
}

const InterviewError = ({ error, onRetry }: InterviewErrorProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            Interview Practice Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            We encountered an issue loading the Interview Practice module:
          </p>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-mono">{error}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewError;
