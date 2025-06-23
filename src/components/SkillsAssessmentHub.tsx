
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, Target } from "lucide-react";
import FieldSelector from "@/components/FieldSelector";

interface SkillsAssessmentHubProps {
  onSelectAssessment: (type: 'hard' | 'soft', field: string) => void;
}

const SkillsAssessmentHub = ({ onSelectAssessment }: SkillsAssessmentHubProps) => {
  const [selectedField, setSelectedField] = useState("General");

  const handleAssessmentSelect = (type: 'hard' | 'soft') => {
    onSelectAssessment(type, selectedField);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Skills Assessment Hub</h1>
        <p className="text-muted-foreground mt-2">Evaluate your professional capabilities</p>
      </div>

      <FieldSelector 
        selectedField={selectedField}
        onFieldChange={setSelectedField}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Brain className="mr-2 h-6 w-6 text-primary" />
              Hard Skills Assessment
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Evaluate your technical abilities and professional tools knowledge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Field-specific technical skills</p>
                <p>• Software and tools proficiency</p>
                <p>• Industry-relevant capabilities</p>
              </div>
              <Button 
                onClick={() => handleAssessmentSelect('hard')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Hard Skills Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Users className="mr-2 h-6 w-6 text-primary" />
              Soft Skills Assessment
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Assess your interpersonal and workplace communication abilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Communication and collaboration</p>
                <p>• Leadership and teamwork</p>
                <p>• Problem-solving and adaptability</p>
              </div>
              <Button 
                onClick={() => handleAssessmentSelect('soft')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Soft Skills Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Both assessments are tailored to your selected field: <strong>{selectedField}</strong></p>
      </div>
    </div>
  );
};

export default SkillsAssessmentHub;
