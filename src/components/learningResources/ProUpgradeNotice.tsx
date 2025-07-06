
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import CreditCardModal from "@/components/payment/CreditCardModal";

interface ProUpgradeNoticeProps {
  featureName?: string;
}

const ProUpgradeNotice = ({ featureName = "Learning Resources" }: ProUpgradeNoticeProps) => {
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowCreditCardModal(true);
  };

  const handleSuccess = () => {
    // Profile will refresh automatically via auth context
    setShowCreditCardModal(false);
  };

  const handleClose = () => {
    setShowCreditCardModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Lock className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Pro Feature
            </CardTitle>
            <CardDescription>
              {featureName} {featureName === "Learning Resources" ? "are" : "is"} available for Pro subscribers only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Upgrade to Pro to access {featureName === "AI-Powered Interview Practice" 
                ? "personalized interview practice with AI feedback and detailed analytics" 
                : "personalized learning materials, courses, and resources tailored to your career goals"}.
            </p>
            <Button 
              onClick={handleUpgradeClick}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreditCardModal
        isOpen={showCreditCardModal}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default ProUpgradeNotice;
