
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, RefreshCw } from "lucide-react";

interface EnhancedResourcesHeaderProps {
  onRefresh: () => void;
  aiLoading: boolean;
  realTimeLoading: boolean;
}

const EnhancedResourcesHeader = ({ onRefresh, aiLoading, realTimeLoading }: EnhancedResourcesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-pathwise-text">Enhanced Learning Resources</h1>
        <p className="text-pathwise-text-muted mt-2">AI-powered personalized learning with real-time content</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={aiLoading || realTimeLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(aiLoading || realTimeLoading) ? 'animate-spin' : ''}`} />
          Refresh AI Content
        </Button>
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Pro Feature
        </Badge>
      </div>
    </div>
  );
};

export default EnhancedResourcesHeader;
