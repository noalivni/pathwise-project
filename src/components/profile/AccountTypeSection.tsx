
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, CreditCard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import CreditCardModal from "@/components/payment/CreditCardModal";
import ConfirmationModal from "@/components/notifications/ConfirmationModal";
import { toast } from "@/hooks/use-toast";

interface AccountTypeSectionProps {
  subscriptionStatus: string;
}

const AccountTypeSection = ({ subscriptionStatus }: AccountTypeSectionProps) => {
  const { updateProfile } = useAuth();
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgradeClick = () => {
    setShowCreditCardModal(true);
  };

  const handleCreditCardSuccess = () => {
    // Profile will refresh automatically via auth context
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      await updateProfile({ subscription_status: 'free' });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You are now on the Free plan.",
      });
      setShowCancelModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
            
            {subscriptionStatus === 'premium' ? (
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Premium Subscription
              </Button>
            ) : (
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

      <ConfirmationModal
        title="Cancel Premium Subscription"
        description="Are you sure you want to cancel your Premium subscription? You will lose access to premium features."
        isOpen={showCancelModal}
        onConfirm={handleCancelSubscription}
        onCancel={() => setShowCancelModal(false)}
        confirmText="Yes, Cancel"
        cancelText="No, Keep Premium"
        variant="destructive"
      />
    </>
  );
};

export default AccountTypeSection;
