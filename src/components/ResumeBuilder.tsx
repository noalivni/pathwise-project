
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit3, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const ResumeBuilder = () => {
  const { profile } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    location: "",
    summary: "",
    education: {
      degree: "",
      field: "",
      year: "",
      institution: ""
    },
    skills: [] as string[],
    experience: "",
    careerGoal: "",
    additionalInfo: ""
  });

  // Auto-populate from profile data
  useEffect(() => {
    if (profile) {
      setResumeData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        location: profile.location || "",
        summary: generateSummary(),
        education: {
          degree: profile.degree_certification || "",
          field: profile.fields_of_study || "",
          year: profile.graduation_year || "",
          institution: ""
        },
        skills: profile.hard_skills || [],
        experience: profile.career_history || "",
        careerGoal: profile.field_of_interest || "",
        additionalInfo: `Seeking opportunities in ${profile.field_of_interest || 'professional development'}`
      });
    }
  }, [profile]);

  const generateSummary = () => {
    if (!profile) return "";
    
    const field = profile.field_of_interest || "professional";
    const education = profile.degree_certification || "educated";
    const skills = profile.hard_skills?.slice(0, 3).join(", ") || "various technical skills";
    
    return `${education} professional seeking opportunities in ${field.toLowerCase()}. Skilled in ${skills} with a passion for delivering high-quality results and continuous learning.`;
  };

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Clean design with color accents",
      preview: "Professional layout with modern typography and teal accents"
    },
    {
      id: "classic",
      name: "Traditional Corporate",
      description: "Conservative business format",
      preview: "Traditional serif format with formal styling and clear sections"
    },
    {
      id: "creative",
      name: "Creative Design",
      description: "Bold layout with visual elements",
      preview: "Dynamic layout with gradients, visual sections, and creative styling"
    },
    {
      id: "minimal",
      name: "Clean Minimal",
      description: "Simple, content-focused design",
      preview: "Minimalist approach with ample white space and light typography"
    }
  ];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Updated",
      description: `Switched to ${templates.find(t => t.id === templateId)?.name} template`,
    });
  };

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setResumeData({ ...resumeData, skills: skillsArray });
  };

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case "classic":
        return {
          container: "bg-white border-2 border-gray-400 font-serif shadow-md",
          header: "text-center border-b-2 border-gray-400 pb-6 mb-6",
          section: "mb-6 border-b border-gray-300 pb-4",
          title: "text-xl font-bold text-gray-900 mb-2 uppercase tracking-widest",
          text: "text-gray-800 leading-relaxed text-sm"
        };
      case "creative":
        return {
          container: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-l-8 border-purple-600 shadow-2xl rounded-r-lg",
          header: "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-tr-lg mb-6 relative overflow-hidden",
          section: "mb-6 bg-white/70 p-5 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm",
          title: "text-xl font-bold text-purple-700 mb-3 flex items-center border-b-2 border-purple-200 pb-2",
          text: "text-gray-700 leading-relaxed"
        };
      case "minimal":
        return {
          container: "bg-white border border-gray-100 shadow-sm",
          header: "mb-10 pb-4 border-b border-gray-100",
          section: "mb-10",
          title: "text-lg font-light text-gray-500 mb-4 uppercase tracking-widest text-sm",
          text: "text-gray-900 leading-loose font-light"
        };
      default: // modern
        return {
          container: "bg-white border-l-4 border-teal-500 shadow-xl",
          header: "bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 mb-6 relative",
          section: "mb-6 px-6",
          title: "text-lg font-semibold text-teal-700 mb-3 border-b-2 border-teal-200 pb-2 uppercase tracking-wide",
          text: "text-gray-700 leading-relaxed"
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Smart Resume Builder</h1>
          <p className="text-slate-600 mt-2">Generate a professional resume using your profile data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Preview Mode' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-teal-600" />
              Resume Templates
            </CardTitle>
            <CardDescription>Choose your resume design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-teal-500 bg-teal-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <Badge className="bg-teal-500">Active</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{template.preview}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Resume Content</CardTitle>
              <CardDescription>Customize your resume information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="careerGoal">Career Goal</Label>
                <Input
                  id="careerGoal"
                  value={resumeData.careerGoal}
                  onChange={(e) => setResumeData({ ...resumeData, careerGoal: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Textarea
                  id="skills"
                  value={resumeData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={resumeData.experience}
                  onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Preview */}
        <Card className={`lg:col-span-${isEditing ? '1' : '2'}`}>
          <CardHeader>
            <CardTitle>Resume Preview</CardTitle>
            <CardDescription>
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

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.title}>Technical Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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
      </div>
    </div>
  );
};

export default ResumeBuilder;
