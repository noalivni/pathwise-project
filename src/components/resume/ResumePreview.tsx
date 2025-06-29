
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/hooks/useResumeData";
import { getTemplateStyles, templates } from "@/utils/resumeTemplateStyles";

interface ResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate: string;
}

const ResumePreview = ({ resumeData, selectedTemplate }: ResumePreviewProps) => {
  const styles = getTemplateStyles(selectedTemplate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-main">Resume Preview</CardTitle>
        <CardDescription className="text-sub">
          Template: {templates.find(t => t.id === selectedTemplate)?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`p-8 rounded-lg ${styles.container}`} style={{ minHeight: '700px' }}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className="text-3xl font-bold mb-2">{resumeData.fullName || 'Your Name'}</h1>
            <div className="space-y-1 text-sm opacity-90">
              <p>{resumeData.email}</p>
              <p>{resumeData.location}</p>
              {resumeData.careerGoal && (
                <p className="font-semibold">Goal: {resumeData.careerGoal}</p>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className={styles.section}>
              <h2 className={styles.title}>Professional Summary</h2>
              <p className={styles.text}>{resumeData.summary}</p>
            </div>
          )}

          {/* Education */}
          {(resumeData.education.degree || resumeData.education.field) && (
            <div className={styles.section}>
              <h2 className={styles.title}>Education</h2>
              <div className={styles.text}>
                <p className="font-semibold">
                  {resumeData.education.degree} {resumeData.education.field && `in ${resumeData.education.field}`}
                </p>
                {resumeData.education.year && <p className="text-sm opacity-75">{resumeData.education.year}</p>}
                {resumeData.education.institution && <p className="text-sm opacity-75">{resumeData.education.institution}</p>}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {resumeData.skills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.title}>Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-black bg-white border-gray-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {resumeData.softSkills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.title}>Key Strengths</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.softSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience && (
            <div className={styles.section}>
              <h2 className={styles.title}>Experience</h2>
              <p className={styles.text}>{resumeData.experience}</p>
            </div>
          )}

          {/* Additional Information */}
          {resumeData.additionalInfo && (
            <div className={styles.section}>
              <h2 className={styles.title}>Additional Information</h2>
              <p className={styles.text}>{resumeData.additionalInfo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
