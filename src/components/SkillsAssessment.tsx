
import { useState } from "react";
import SkillsAssessmentHub from "@/components/SkillsAssessmentHub";
import HardSkillsAssessment from "@/components/HardSkillsAssessment";
import SoftSkillsAssessment from "@/components/SoftSkillsAssessment";
import FieldSelector from "@/components/FieldSelector";

const SkillsAssessment = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<'hub' | 'hard' | 'soft'>('hub');
  const [selectedField, setSelectedField] = useState<string>('General');

  const handleSelectAssessment = (type: 'hard' | 'soft') => {
    setSelectedAssessment(type);
  };

  const handleReturnToHub = () => {
    setSelectedAssessment('hub');
  };

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
  };

  if (selectedAssessment === 'hard') {
    return <HardSkillsAssessment onReturnToHub={handleReturnToHub} selectedField={selectedField} />;
  }

  if (selectedAssessment === 'soft') {
    return <SoftSkillsAssessment onReturnToHub={handleReturnToHub} selectedField={selectedField} />;
  }

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <FieldSelector selectedField={selectedField} onFieldChange={handleFieldChange} />
      </div>
      <SkillsAssessmentHub onSelectAssessment={handleSelectAssessment} />
    </div>
  );
};

export default SkillsAssessment;
