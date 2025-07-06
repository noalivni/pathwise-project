
import { Crown, X, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreditCardModal from "@/components/payment/CreditCardModal";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
}

const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  featureName 
}: UpgradeModalProps) => {
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const premiumFeatures = [
    "Unlimited Skills Assessments",
    "Personalized Learning Resources",
    "AI-Powered Interview Practice",
    "Advanced Job Matching",
    "Priority Support",
    "Resume Builder Templates"
  ];

  const handleUpgradeClick = () => {
    setShowCreditCardModal(true);
  };

  const handleCreditCardSuccess = () => {
    onUpgrade();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-orange-100 transition-colors"
            >
              <X className="h-4 w-4 text-orange-600" />
            </button>
            
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Unlock {featureName}</h2>
              <p className="text-yellow-100">Upgrade to Premium to access this powerful feature</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-4">Premium includes:</h3>
                <div className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">$9.99/month</div>
                  <div className="text-sm text-orange-600">Cancel anytime</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={handleUpgradeClick}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreditCardModal
        isOpen={showCreditCardModal}
        onClose={() => setShowCreditCardModal(false)}
        onSuccess={handleCreditCardSuccess}
      />
    </>
  );
};

export default UpgradeModal;
