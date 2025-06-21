
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";

const ProUpgradeNotice = () => {
  return (
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
            Learning Resources are available for Pro subscribers only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Upgrade to Pro to access personalized learning materials, courses, and resources tailored to your career goals.
          </p>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProUpgradeNotice;
