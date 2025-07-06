
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LearningResourcesContainer from "@/components/learningResources/LearningResourcesContainer";
import UpgradeModal from "@/components/notifications/UpgradeModal";

const LearningResources = () => {
  const { profile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = profile?.subscription_status === 'premium';

  const handleUpgrade = () => {
    // Profile will refresh automatically via auth context
    setShowUpgradeModal(false);
  };

  // Show upgrade modal for Free users
  if (!isPro) {
    return (
      <>
        <UpgradeModal
          isOpen={true}
          onClose={() => {}} // Don't allow closing since this is the main content
          onUpgrade={handleUpgrade}
          featureName="Personalized Learning Resources"
        />
      </>
    );
  }

  // Show actual learning resources for Pro users
  return <LearningResourcesContainer />;
};

export default LearningResources;
