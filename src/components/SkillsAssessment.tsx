
import { useState } from "react";
import SkillsAssessmentHub from "@/components/SkillsAssessmentHub";
import HardSkillsAssessment from "@/components/HardSkillsAssessment";
import SoftSkillsAssessment from "@/components/SoftSkillsAssessment";

const SkillsAssessment = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<'hub' | 'hard' | 'soft'>('hub');

  const handleSelectAssessment = (type: 'hard' | 'soft') => {
    setSelectedAssessment(type);
  };

  if (selectedAssessment === 'hard') {
    return <HardSkillsAssessment />;
  }

  if (selectedAssessment === 'soft') {
    return <SoftSkillsAssessment />;
  }

  return <SkillsAssessmentHub onSelectAssessment={handleSelectAssessment} />;
};

export default SkillsAssessment;
