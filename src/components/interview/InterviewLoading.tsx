
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const InterviewLoading = () => {
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
};

export default InterviewLoading;
