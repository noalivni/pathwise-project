
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Eye } from "lucide-react";
import { useResumeData } from "@/hooks/useResumeData";
import TemplateSelector from "@/components/resume/TemplateSelector";
import ResumeEditForm from "@/components/resume/ResumeEditForm";
import ResumePreview from "@/components/resume/ResumePreview";

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isEditing, setIsEditing] = useState(false);
  const { resumeData, setResumeData, handleSkillsChange } = useResumeData();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-main">Smart Resume Builder</h1>
          <p className="text-sub mt-2">Generate a professional resume using your profile data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="btn-hover">
            {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Preview Mode' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Top Section: Template Selection and Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <TemplateSelector 
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />

        {/* Edit Form */}
        {isEditing && (
          <ResumeEditForm
            resumeData={resumeData}
            onResumeDataChange={setResumeData}
            onSkillsChange={handleSkillsChange}
          />
        )}
      </div>

      {/* Bottom Section: Full-Width Resume Preview */}
      <ResumePreview 
        resumeData={resumeData}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default ResumeBuilder;
