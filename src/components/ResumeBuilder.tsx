
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit3, Eye } from "lucide-react";
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
        additionalInfo: `Career Interest: ${profile.field_of_interest || 'Not specified'}`
      });
    }
  }, [profile]);

  const generateSummary = () => {
    if (!profile) return "";
    
    const field = profile.field_of_interest || "professional";
    const education = profile.degree_certification || "educated";
    const skills = profile.hard_skills?.slice(0, 3).join(", ") || "various technical skills";
    
    return `${education} professional with expertise in ${field.toLowerCase()}. Skilled in ${skills} with a passion for delivering high-quality results and continuous learning.`;
  };

  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and contemporary design",
      preview: "Clean layout with modern typography and subtle colors"
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional and professional",
      preview: "Traditional format with clear sections and conservative styling"
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and eye-catching",
      preview: "Creative layout with visual elements and dynamic sections"
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant",
      preview: "Minimalist design with emphasis on content and white space"
    }
  ];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Updated",
      description: `Switched to ${templates.find(t => t.id === templateId)?.name} template`,
    });
  };

  const handleExport = () => {
    // In a real application, this would generate and download a PDF
    toast({
      title: "CV Generated",
      description: "Your CV has been generated successfully!",
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
          container: "bg-white border-2 border-gray-300 font-serif",
          header: "text-center border-b-2 border-gray-300 pb-4 mb-6",
          section: "mb-6 border-b border-gray-200 pb-4",
          title: "text-xl font-bold text-gray-800 mb-2 uppercase tracking-wide",
          text: "text-gray-700 leading-relaxed"
        };
      case "creative":
        return {
          container: "bg-gradient-to-br from-blue-50 to-purple-50 border-l-8 border-purple-500 shadow-xl",
          header: "bg-purple-600 text-white p-6 rounded-t-lg mb-6",
          section: "mb-6 bg-white/50 p-4 rounded-lg backdrop-blur-sm",
          title: "text-xl font-bold text-purple-700 mb-3 flex items-center",
          text: "text-gray-700 leading-relaxed"
        };
      case "minimal":
        return {
          container: "bg-white border border-gray-100 shadow-sm",
          header: "mb-8 pb-2 border-b border-gray-200",
          section: "mb-8",
          title: "text-lg font-light text-gray-600 mb-3 uppercase letter-spacing-wide",
          text: "text-gray-800 leading-loose font-light"
        };
      default: // modern
        return {
          container: "bg-white border border-teal-200 shadow-lg",
          header: "bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-t-lg mb-6",
          section: "mb-6 px-2",
          title: "text-lg font-semibold text-teal-700 mb-3 border-b border-teal-200 pb-1",
          text: "text-gray-700 leading-relaxed"
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Smart CV Builder</h1>
          <p className="text-slate-600 mt-2">Generate a professional CV using your profile data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <Button onClick={handleExport} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-teal-600" />
              Template Selection
            </CardTitle>
            <CardDescription>Choose your CV template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <Badge className="bg-teal-500">Selected</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">{template.preview}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit CV Content</CardTitle>
              <CardDescription>Customize your CV information</CardDescription>
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
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={resumeData.additionalInfo}
                  onChange={(e) => setResumeData({ ...resumeData, additionalInfo: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* CV Preview */}
        <Card className={`lg:col-span-${isEditing ? '1' : '2'}`}>
          <CardHeader>
            <CardTitle>CV Preview</CardTitle>
            <CardDescription>
              Template: {templates.find(t => t.id === selectedTemplate)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`p-6 rounded-lg ${styles.container}`} style={{ minHeight: '600px' }}>
              {/* Header */}
              <div className={styles.header}>
                <h1 className="text-2xl font-bold">{resumeData.fullName || 'Your Name'}</h1>
                <div className="mt-2 space-y-1">
                  <p>{resumeData.email}</p>
                  <p>{resumeData.location}</p>
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
                    {resumeData.education.year && <p>{resumeData.education.year}</p>}
                    {resumeData.education.institution && <p>{resumeData.education.institution}</p>}
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
