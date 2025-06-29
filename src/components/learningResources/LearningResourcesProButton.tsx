
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UpgradeModal from "@/components/notifications/UpgradeModal";

const LearningResourcesProButton = () => {
  const { profile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = profile?.subscription_status === 'premium';

  const handleClick = () => {
    if (isPro) {
      // Navigate to learning resources
      window.dispatchEvent(new CustomEvent('navigate-to-learning'));
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleUpgrade = () => {
    console.log('Upgrade to premium');
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
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Learning Resources</span>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Access curated content for skill development
          </p>
        </Button>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        featureName="Personalized Learning Resources"
      />
    </>
  );
};

export default LearningResourcesProButton;
