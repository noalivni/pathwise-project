
import { ArrowRight, X } from "lucide-react";
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card border-border">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <div className="bg-primary p-8 text-center text-primary-foreground">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/a434d155-ce05-4ed6-99dc-48727d407120.png" 
                alt="Pathwise Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Pathwise, {userName}!</h2>
            <p className="text-primary-foreground/80">Your AI-powered career companion is ready to help you succeed</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground">Tell us about your background and career goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Personalized Recommendations</h3>
                  <p className="text-sm text-muted-foreground">Discover jobs and resources tailored just for you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-foreground">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground">Watch your career journey unfold with AI guidance</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="flex-1 border-border text-foreground hover:bg-muted"
              >
                Skip for now
              </Button>
              <Button 
                onClick={onStartOnboarding}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
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
