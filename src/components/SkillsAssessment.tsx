
import { useState } from "react";
import SkillsAssessmentHub from "@/components/SkillsAssessmentHub";
import HardSkillsAssessment from "@/components/HardSkillsAssessment";
import SoftSkillsAssessment from "@/components/SoftSkillsAssessment";

const SkillsAssessment = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<'hub' | 'hard' | 'soft'>('hub');
  const [selectedField, setSelectedField] = useState<string>('General');

  const handleSelectAssessment = (type: 'hard' | 'soft', field: string) => {
    setSelectedField(field);
    setSelectedAssessment(type);
  };

  const handleReturnToHub = () => {
    setSelectedAssessment('hub');
  };

  if (selectedAssessment === 'hard') {
    return <HardSkillsAssessment onReturnToHub={handleReturnToHub} selectedField={selectedField} />;
  }

  if (selectedAssessment === 'soft') {
    return <SoftSkillsAssessment onReturnToHub={handleReturnToHub} selectedField={selectedField} />;
  }

  return <SkillsAssessmentHub onSelectAssessment={handleSelectAssessment} />;
};

export default SkillsAssessment;
