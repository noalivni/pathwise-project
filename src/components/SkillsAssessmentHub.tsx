
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Heart, Target, ArrowRight } from "lucide-react";

interface SkillsAssessmentHubProps {
  onSelectAssessment: (type: 'hard' | 'soft') => void;
}

const SkillsAssessmentHub = ({ onSelectAssessment }: SkillsAssessmentHubProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pathwise-text">Choose Your Assessment</h1>
        <p className="text-pathwise-text-muted mt-2">Select the type of skills you'd like to evaluate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-teal-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl text-pathwise-text">Hard Skills Assessment</CardTitle>
            <CardDescription className="text-lg text-pathwise-text-muted">
              Evaluate your proficiency with technical tools and software
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-pathwise-text">What you'll assess:</h4>
              <ul className="text-sm text-pathwise-text-secondary space-y-1">
                <li>• Technical tools (Excel, SQL, Python, etc.)</li>
                <li>• Software proficiency levels (0-5 scale)</li>
                <li>• Domain-specific skills</li>
                <li>• Professional certifications</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-pathwise-text">You'll receive:</h4>
              <ul className="text-sm text-pathwise-text-secondary space-y-1">
                <li>• Skill level breakdown</li>
                <li>• Areas of expertise</li>
                <li>• Learning recommendations</li>
                <li>• Tool suggestions</li>
              </ul>
            </div>
            <Button 
              onClick={() => onSelectAssessment('hard')}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              Start Hard Skills Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-pink-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <CardTitle className="text-2xl text-pathwise-text">Soft Skills Assessment</CardTitle>
            <CardDescription className="text-lg text-pathwise-text-muted">
              Discover your personality type and work style preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-pathwise-text">What you'll assess:</h4>
              <ul className="text-sm text-pathwise-text-secondary space-y-1">
                <li>• Communication style</li>
                <li>• Leadership tendencies</li>
                <li>• Problem-solving approach</li>
                <li>• Collaboration preferences</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-pathwise-text">You'll receive:</h4>
              <ul className="text-sm text-pathwise-text-secondary space-y-1">
                <li>• Personality type profile</li>
                <li>• Work environment preferences</li>
                <li>• Career path suggestions</li>
                <li>• Team role insights</li>
              </ul>
            </div>
            <Button 
              onClick={() => onSelectAssessment('soft')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Start Soft Skills Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Target className="mr-2 h-5 w-5" />
            Pro Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            For the most comprehensive career guidance, we recommend taking both assessments. 
            Each provides unique insights that complement each other to give you a complete 
            picture of your professional strengths and potential career paths.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsAssessmentHub;
