
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

  const handleClose = () => {
    setShowUpgradeModal(false);
    // Navigate back to dashboard
    window.dispatchEvent(new CustomEvent('navigate-to-dashboard'));
  };

  // Show upgrade modal for Free users
  if (!isPro) {
    return (
      <>
        <UpgradeModal
          isOpen={true}
          onClose={handleClose}
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
