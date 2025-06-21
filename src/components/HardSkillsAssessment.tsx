
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Wrench, Target, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const HardSkillsAssessment = () => {
  const { user, profile } = useAuth();
  const [currentSkill, setCurrentSkill] = useState(0);
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [relevantSkills, setRelevantSkills] = useState<Array<{ name: string; category: string }>>([]);

  const skillsByField = {
    "UX/UI Design": [
      { name: "Figma", category: "Design Tools" },
      { name: "Adobe XD", category: "Design Tools" },
      { name: "Sketch", category: "Design Tools" },
      { name: "Photoshop", category: "Design Tools" },
      { name: "User Research", category: "Research" },
      { name: "Prototyping", category: "Design Process" },
      { name: "HTML/CSS", category: "Frontend" },
      { name: "JavaScript", category: "Frontend" }
    ],
    "Data Analytics": [
      { name: "Excel", category: "Data Analysis" },
      { name: "SQL", category: "Database" },
      { name: "Python", category: "Programming" },
      { name: "R", category: "Programming" },
      { name: "Tableau", category: "Visualization" },
      { name: "Power BI", category: "Visualization" },
      { name: "Statistics", category: "Analytics" },
      { name: "Machine Learning", category: "Analytics" }
    ],
    "Marketing": [
      { name: "Google Analytics", category: "Analytics" },
      { name: "Facebook Ads", category: "Advertising" },
      { name: "Google Ads", category: "Advertising" },
      { name: "SEO", category: "Digital Marketing" },
      { name: "Content Marketing", category: "Strategy" },
      { name: "Email Marketing", category: "Communication" },
      { name: "Social Media", category: "Social" },
      { name: "Adobe Creative Suite", category: "Design" }
    ],
    "Software Development": [
      { name: "JavaScript", category: "Programming" },
      { name: "Python", category: "Programming" },
      { name: "React", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "SQL", category: "Database" },
      { name: "Git", category: "Version Control" },
      { name: "AWS", category: "Cloud" },
      { name: "Docker", category: "DevOps" }
    ],
    "Product Management": [
      { name: "Roadmapping", category: "Strategy" },
      { name: "User Research", category: "Research" },
      { name: "Analytics", category: "Data" },
      { name: "A/B Testing", category: "Experimentation" },
      { name: "Agile/Scrum", category: "Methodology" },
      { name: "Wireframing", category: "Design" },
      { name: "SQL", category: "Data" },
      { name: "Project Management", category: "Management" }
    ]
  };

  const defaultSkills = [
    { name: "Microsoft Excel", category: "Data Analysis" },
    { name: "SQL", category: "Database" },
    { name: "Python", category: "Programming" },
    { name: "JavaScript", category: "Programming" },
    { name: "Adobe Photoshop", category: "Design" },
    { name: "Google Analytics", category: "Marketing" },
    { name: "Tableau", category: "Data Visualization" },
    { name: "AutoCAD", category: "Engineering" },
    { name: "Salesforce", category: "CRM" },
    { name: "WordPress", category: "Web Development" }
  ];

  useEffect(() => {
    if (profile?.field_of_interest && skillsByField[profile.field_of_interest as keyof typeof skillsByField]) {
      setRelevantSkills(skillsByField[profile.field_of_interest as keyof typeof skillsByField]);
    } else {
      setRelevantSkills(defaultSkills);
    }
  }, [profile]);

  const handleRatingChange = (value: number[]) => {
    const skillName = relevantSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: value[0]
    }));
  };

  const handleNext = () => {
    if (currentSkill < relevantSkills.length - 1) {
      setCurrentSkill(currentSkill + 1);
    } else {
      saveAssessmentResults();
    }
  };

  const handleSkip = () => {
    const skillName = relevantSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: 0
    }));
    handleNext();
  };

  const saveAssessmentResults = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          technical_skills: skillRatings,
          field_specific_skills: {
            field: profile?.field_of_interest || 'General',
            skills: skillRatings
          },
          assessment_type: 'hard_skills'
        });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your hard skills have been evaluated successfully.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSkillLevel = (rating: number) => {
    if (rating === 0) return { level: "No Experience", color: "bg-gray-500" };
    if (rating <= 1) return { level: "Beginner", color: "bg-red-500" };
    if (rating <= 2) return { level: "Basic", color: "bg-orange-500" };
    if (rating <= 3) return { level: "Intermediate", color: "bg-yellow-500" };
    if (rating <= 4) return { level: "Advanced", color: "bg-blue-500" };
    return { level: "Expert", color: "bg-green-500" };
  };

  const getRecommendations = () => {
    const highRatings = Object.entries(skillRatings)
      .filter(([_, rating]) => rating >= 4)
      .map(([skill, _]) => skill);

    const mediumRatings = Object.entries(skillRatings)
      .filter(([_, rating]) => rating >= 2 && rating < 4)
      .map(([skill, _]) => skill);

    return {
      strengths: highRatings,
      improvements: mediumRatings.slice(0, 3)
    };
  };

  if (relevantSkills.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Loading Assessment...</h1>
          <p className="text-slate-600 mt-2">Preparing your personalized skills assessment</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const recommendations = getRecommendations();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Hard Skills Assessment Results</h1>
          <p className="text-slate-600 mt-2">
            Your technical skill proficiency for {profile?.field_of_interest || 'General'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relevantSkills.map((skill, index) => {
            const rating = skillRatings[skill.name] || 0;
            const skillInfo = getSkillLevel(rating);
            
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div>
                      <span>{skill.name}</span>
                      <p className="text-sm text-slate-500 font-normal">{skill.category}</p>
                    </div>
                    <Badge className={`${skillInfo.color} text-white`}>
                      {skillInfo.level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={(rating / 5) * 100} className="mb-2" />
                  <p className="text-sm text-slate-600">Rating: {rating}/5</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-teal-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.strengths.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.strengths.map((skill, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {recommendations.improvements.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Skills to Develop</h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.improvements.map((skill, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-x-4">
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentSkill(0);
              setSkillRatings({});
            }}
            variant="outline"
          >
            Retake Assessment
          </Button>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-jobs'))}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            View Job Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentSkill + 1) / relevantSkills.length) * 100;
  const currentSkillData = relevantSkills[currentSkill];
  const currentRating = skillRatings[currentSkillData.name] || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Hard Skills Assessment</h1>
        <p className="text-slate-600 mt-2">
          Rate your proficiency with {profile?.field_of_interest || 'technical'} tools and skills
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5 text-teal-600" />
              Skill {currentSkill + 1} of {relevantSkills.length}
            </CardTitle>
            <Badge variant="outline">
              {currentSkillData.category}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">{currentSkillData.name}</h3>
            <p className="text-slate-600 mb-6">How would you rate your skill level?</p>
            
            <div className="space-y-4">
              <Slider
                value={[currentRating]}
                onValueChange={handleRatingChange}
                max={5}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-sm text-slate-500">
                <span>No Experience</span>
                <span>Beginner</span>
                <span>Basic</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
              </div>
              
              <div className="text-center">
                <Badge className={`${getSkillLevel(currentRating).color} text-white text-lg px-4 py-2`}>
                  {getSkillLevel(currentRating).level} ({currentRating}/5)
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleSkip}>
              Skip This Skill
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              {currentSkill === relevantSkills.length - 1 ? 'Complete Assessment' : 'Next Skill'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HardSkillsAssessment;
