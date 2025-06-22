
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/hooks/useResumeData";

interface ResumeEditFormProps {
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
  onSkillsChange: (skillsString: string) => void;
}

const ResumeEditForm = ({ resumeData, onResumeDataChange, onSkillsChange }: ResumeEditFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-main">Edit Resume Content</CardTitle>
        <CardDescription className="text-sub">Customize your resume information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-sub">Full Name</Label>
          <Input
            id="fullName"
            value={resumeData.fullName}
            onChange={(e) => onResumeDataChange({ ...resumeData, fullName: e.target.value })}
            className="text-main"
          />
        </div>
        <div>
          <Label htmlFor="careerGoal" className="text-sub">Career Goal</Label>
          <Input
            id="careerGoal"
            value={resumeData.careerGoal}
            onChange={(e) => onResumeDataChange({ ...resumeData, careerGoal: e.target.value })}
            className="text-main"
          />
        </div>
        <div>
          <Label htmlFor="summary" className="text-sub">Professional Summary</Label>
          <Textarea
            id="summary"
            value={resumeData.summary}
            onChange={(e) => onResumeDataChange({ ...resumeData, summary: e.target.value })}
            rows={3}
            className="text-main"
          />
        </div>
        <div>
          <Label htmlFor="skills" className="text-sub">Skills (comma separated)</Label>
          <Textarea
            id="skills"
            value={resumeData.skills.join(', ')}
            onChange={(e) => onSkillsChange(e.target.value)}
            rows={2}
            className="text-main"
          />
        </div>
        <div>
          <Label htmlFor="experience" className="text-sub">Experience</Label>
          <Textarea
            id="experience"
            value={resumeData.experience}
            onChange={(e) => onResumeDataChange({ ...resumeData, experience: e.target.value })}
            rows={4}
            className="text-main"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeEditForm;
