
import { useState } from "react";
import SkillsAssessmentHub from "@/components/SkillsAssessmentHub";
import HardSkillsAssessment from "@/components/HardSkillsAssessment";
import SoftSkillsAssessment from "@/components/SoftSkillsAssessment";

const SkillsAssessment = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<'hub' | 'hard' | 'soft'>('hub');

  const handleSelectAssessment = (type: 'hard' | 'soft') => {
    setSelectedAssessment(type);
  };

  const handleReturnToHub = () => {
    setSelectedAssessment('hub');
  };

  if (selectedAssessment === 'hard') {
    return <HardSkillsAssessment onReturnToHub={handleReturnToHub} />;
  }

  if (selectedAssessment === 'soft') {
    return <SoftSkillsAssessment onReturnToHub={handleReturnToHub} />;
  }

  return <SkillsAssessmentHub onSelectAssessment={handleSelectAssessment} />;
};

export default SkillsAssessment;
