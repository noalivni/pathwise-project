
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, Plus, Minus, Briefcase, GraduationCap, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ResumeBuilder = () => {
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      website: "sarahjohnson.dev",
      summary: "Passionate frontend developer with 3+ years of experience creating responsive web applications."
    },
    experience: [
      {
        title: "Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "Jan 2022",
        endDate: "Present",
        description: "Developed and maintained responsive web applications using React, TypeScript, and modern CSS frameworks."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        graduationDate: "May 2021"
      }
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git", "Node.js"],
    achievements: [
      "Led the development of a new customer dashboard that increased user engagement by 25%",
      "Mentored 3 junior developers and conducted code reviews"
    ]
  });

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "classic", name: "Classic", description: "Traditional and professional layout" },
    { id: "creative", name: "Creative", description: "Unique design for creative roles" }
  ];

  const handleDownload = () => {
    toast({
      title: "Resume Downloaded",
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Opening resume preview in new window.",
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    });
  };

  const removeExperience = (index: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setResumeData({ ...resumeData, experience: newExperience });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Resume Builder</h1>
          <p className="text-slate-600 mt-2">Create a professional resume tailored to your target role</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleDownload} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief summary of your professional background..."
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Work Experience</CardTitle>
                      <CardDescription>Your professional work history</CardDescription>
                    </div>
                    <Button onClick={addExperience} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                        {resumeData.experience.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExperience(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Job Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={resumeData.education[0].degree}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          education: [{ ...resumeData.education[0], degree: e.target.value }]
                        })}
                      />
                    </div>
                    <div>
                      <Label>School</Label>
                      <Input
                        value={resumeData.education[0].school}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          education: [{ ...resumeData.education[0], school: e.target.value }]
                        })}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={resumeData.education[0].location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          education: [{ ...resumeData.education[0], location: e.target.value }]
                        })}
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        value={resumeData.education[0].graduationDate}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          education: [{ ...resumeData.education[0], graduationDate: e.target.value }]
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                          <button
                            onClick={() => setResumeData({
                              ...resumeData,
                              skills: resumeData.skills.filter((_, i) => i !== index)
                            })}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              setResumeData({
                                ...resumeData,
                                skills: [...resumeData.skills, input.value.trim()]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your notable accomplishments and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resumeData.achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          value={achievement}
                          onChange={(e) => {
                            const newAchievements = [...resumeData.achievements];
                            newAchievements[index] = e.target.value;
                            setResumeData({ ...resumeData, achievements: newAchievements });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResumeData({
                            ...resumeData,
                            achievements: resumeData.achievements.filter((_, i) => i !== index)
                          })}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setResumeData({
                        ...resumeData,
                        achievements: [...resumeData.achievements, ""]
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Template Selection & Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Template</CardTitle>
              <CardDescription>Select a template that fits your style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    activeTemplate === template.id ? 'border-teal-500 bg-teal-50' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveTemplate(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      activeTemplate === template.id ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                    }`}></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resume Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-6 text-sm space-y-4 max-h-96 overflow-y-auto">
                <div className="text-center border-b pb-4">
                  <h1 className="text-xl font-bold">{resumeData.personalInfo.name}</h1>
                  <p className="text-slate-600">{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                  <p className="text-slate-600">{resumeData.personalInfo.location}</p>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2">Professional Summary</h2>
                  <p className="text-slate-700">{resumeData.personalInfo.summary}</p>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2 flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Experience
                  </h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exp.title}</h3>
                        <span className="text-slate-500">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-slate-600">{exp.company} | {exp.location}</p>
                      <p className="text-sm text-slate-700 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2 flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Education
                  </h2>
                  <div>
                    <h3 className="font-medium">{resumeData.education[0].degree}</h3>
                    <p className="text-slate-600">{resumeData.education[0].school}</p>
                    <p className="text-slate-500">{resumeData.education[0].graduationDate}</p>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
