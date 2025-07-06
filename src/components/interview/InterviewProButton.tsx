
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UpgradeModal from "@/components/notifications/UpgradeModal";

const InterviewProButton = () => {
  const { profile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = profile?.subscription_status === 'premium';

  const handleClick = () => {
    if (isPro) {
      // Navigate to interview practice
      window.dispatchEvent(new CustomEvent('navigate-to-interview'));
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleUpgrade = () => {
    // Profile will refresh automatically via auth context
    setShowUpgradeModal(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          onClick={handleClick}
          variant="outline"
          className="w-full justify-start text-left p-4 h-auto flex-col items-start space-y-2"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Practice Interview Questions</span>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered interview practice with personalized feedback
          </p>
        </Button>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        featureName="AI-Powered Interview Practice"
      />
    </>
  );
};

export default InterviewProButton;
