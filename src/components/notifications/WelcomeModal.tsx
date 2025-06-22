
import { Brain, ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnboarding: () => void;
  userName?: string;
}

const WelcomeModal = ({ 
  isOpen, 
  onClose, 
  onStartOnboarding, 
  userName = "there" 
}: WelcomeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
          
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Pathwise, {userName}!</h2>
            <p className="text-teal-100">Your AI-powered career companion is ready to help you succeed</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-800">Complete Your Profile</h3>
                  <p className="text-sm text-slate-600">Tell us about your background and career goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-800">Get Personalized Recommendations</h3>
                  <p className="text-sm text-slate-600">Discover jobs and resources tailored just for you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-800">Track Your Progress</h3>
                  <p className="text-sm text-slate-600">Watch your career journey unfold with AI guidance</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="flex-1"
              >
                Skip for now
              </Button>
              <Button 
                onClick={onStartOnboarding}
                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
