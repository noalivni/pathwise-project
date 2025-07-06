
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, CreditCard } from "lucide-react";
import { useState } from "react";
import CreditCardModal from "@/components/payment/CreditCardModal";

interface AccountTypeSectionProps {
  subscriptionStatus: string;
}

const AccountTypeSection = ({ subscriptionStatus }: AccountTypeSectionProps) => {
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowCreditCardModal(true);
  };

  const handleCreditCardSuccess = () => {
    // Profile will refresh automatically via auth context
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-pathwise-text">
            <CreditCard className="mr-2 h-5 w-5 text-orange-600" />
            Account Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge 
                variant={subscriptionStatus === 'premium' ? 'default' : 'secondary'}
                className={subscriptionStatus === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' : 'bg-gray-100 text-gray-700'}
              >
                {subscriptionStatus === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                {subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
              </Badge>
              {subscriptionStatus === 'premium' ? (
                <span className="text-sm text-pathwise-text-muted">
                  You have access to all premium features
                </span>
              ) : (
                <span className="text-sm text-pathwise-text-muted">
                  Upgrade to unlock premium features
                </span>
              )}
            </div>
            
            {subscriptionStatus !== 'premium' && (
              <Button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                size="sm"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CreditCardModal
        isOpen={showCreditCardModal}
        onClose={() => setShowCreditCardModal(false)}
        onSuccess={handleCreditCardSuccess}
      />
    </>
  );
};

export default AccountTypeSection;
