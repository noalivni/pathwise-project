
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, MessageCircle, Star, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";
import UpgradeModal from "@/components/notifications/UpgradeModal";

const InterviewProUpgrade = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = () => {
    // Profile will refresh automatically via auth context
    setShowUpgradeModal(false);
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Unlimited Practice Sessions",
      description: "Practice with endless AI-generated interview questions"
    },
    {
      icon: Star,
      title: "Personalized Feedback",
      description: "Get detailed AI feedback on your responses"
    },
    {
      icon: Clock,
      title: "Session History",
      description: "Track your progress and review past sessions"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed insights into your interview performance"
    }
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-pathwise-text mb-2">
            Unlock AI-Powered Interview Practice
          </h1>
          <p className="text-pathwise-text-muted text-lg">
            Master your interview skills with personalized AI feedback and unlimited practice sessions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-2 border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-pathwise-text">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="w-4 h-4 text-orange-600" />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-pathwise-text-muted">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
            <div className="text-2xl font-bold text-orange-600 mb-1">$9.99/month</div>
            <div className="text-sm text-orange-600">Cancel anytime</div>
          </div>
          
          <Button 
            onClick={() => setShowUpgradeModal(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        featureName="AI-Powered Interview Practice"
      />
    </>
  );
};

export default InterviewProUpgrade;
