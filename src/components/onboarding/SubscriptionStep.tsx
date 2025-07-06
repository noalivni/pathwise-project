
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown } from "lucide-react";
import { useState } from "react";
import type { OnboardingFormData } from "@/types/onboarding";
import CreditCardModal from "@/components/payment/CreditCardModal";

interface SubscriptionStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const SubscriptionStep = ({ formData, updateFormData }: SubscriptionStepProps) => {
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const handleSubscriptionChange = (value: string) => {
    updateFormData({ subscription_status: value });
    
    if (value === 'premium') {
      setShowCreditCardModal(true);
    }
  };

  const handleCreditCardSuccess = () => {
    // Premium subscription is already set, credit card form handles the upgrade
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="mr-2 h-5 w-5 text-yellow-600" />
            Choose Your Plan
          </CardTitle>
          <CardDescription>Select the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup 
            value={formData.subscription_status} 
            onValueChange={handleSubscriptionChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50">
              <RadioGroupItem value="free" id="free" />
              <div className="flex-1">
                <Label htmlFor="free" className="text-lg font-medium cursor-pointer">
                  Free Plan
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  • Basic skills assessment
                  • Job recommendations
                  • Profile creation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 border-teal-200 bg-teal-50">
              <RadioGroupItem value="premium" id="premium" />
              <div className="flex-1">
                <Label htmlFor="premium" className="text-lg font-medium cursor-pointer flex items-center">
                  <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                  Pro Plan
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  • Everything in Free
                  • Advanced learning resources
                  • Interview practice sessions
                  • Priority support
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <CreditCardModal
        isOpen={showCreditCardModal}
        onClose={() => {
          setShowCreditCardModal(false);
          // Reset to free if user cancels
          if (formData.subscription_status === 'premium') {
            updateFormData({ subscription_status: 'free' });
          }
        }}
        onSuccess={handleCreditCardSuccess}
      />
    </>
  );
};

export default SubscriptionStep;
