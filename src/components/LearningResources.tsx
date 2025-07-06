
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LearningResourcesContainer from "@/components/learningResources/LearningResourcesContainer";
import UpgradeModal from "@/components/notifications/UpgradeModal";

const LearningResources = () => {
  const { profile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = profile?.subscription_status === 'premium';

  // Show upgrade modal for Free users on component mount
  useState(() => {
    if (!isPro) {
      setShowUpgradeModal(true);
    }
  });

  const handleUpgrade = () => {
    // Profile will refresh automatically via auth context
    setShowUpgradeModal(false);
  };

  const handleClose = () => {
    setShowUpgradeModal(false);
  };

  // Show upgrade modal for Free users
  if (!isPro) {
    return (
      <>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={handleClose}
          onUpgrade={handleUpgrade}
          featureName="Personalized Learning Resources"
        />
        {/* Show the actual component in the background when modal is closed */}
        {!showUpgradeModal && <LearningResourcesContainer />}
      </>
    );
  }

  // Show actual learning resources for Pro users
  return <LearningResourcesContainer />;
};

export default LearningResources;
