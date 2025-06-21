
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SoftSkillsAssessment = () => {
  const { user } = useAuth();
  const [currentSkill, setCurrentSkill] = useState(0);
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const softSkills = [
    { name: "Communication", description: "Ability to express ideas clearly and listen effectively" },
    { name: "Leadership", description: "Capability to guide, motivate, and inspire others" },
    { name: "Problem Solving", description: "Skill in analyzing issues and finding creative solutions" },
    { name: "Teamwork", description: "Ability to collaborate effectively with others" },
    { name: "Adaptability", description: "Flexibility in adjusting to new situations and changes" },
    { name: "Time Management", description: "Efficiency in organizing and prioritizing tasks" },
    { name: "Creativity", description: "Ability to think outside the box and generate innovative ideas" },
    { name: "Critical Thinking", description: "Skill in analyzing information objectively and making reasoned judgments" },
    { name: "Emotional Intelligence", description: "Understanding and managing emotions in self and others" },
    { name: "Attention to Detail", description: "Thoroughness and accuracy in completing tasks" }
  ];

  const handleRatingChange = (value: number[]) => {
    const skillName = softSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: value[0]
    }));
  };

  const handleNext = () => {
    if (currentSkill < softSkills.length - 1) {
      setCurrentSkill(currentSkill + 1);
    } else {
      saveAssessmentResults();
    }
  };

  const handleSkip = () => {
    const skillName = softSkills[currentSkill].name;
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: 0
    }));
    handleNext();
  };

  const saveAssessmentResults = async () => {
    if (!user) return;

    try {
      const personalityProfile = generatePersonalityProfile();
      
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          soft_skills: skillRatings,
          personality_traits: personalityProfile,
          assessment_type: 'soft_skills'
        });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your soft skills have been evaluated successfully.",
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
    if (rating === 0) return { level: "Developing", color: "bg-gray-500" };
    if (rating <= 1) return { level: "Basic", color: "bg-red-500" };
    if (rating <= 2) return { level: "Fair", color: "bg-orange-500" };
    if (rating <= 3) return { level: "Good", color: "bg-yellow-500" };
    if (rating <= 4) return { level: "Strong", color: "bg-blue-500" };
    return { level: "Exceptional", color: "bg-green-500" };
  };

  const generatePersonalityProfile = () => {
    const communication = skillRatings["Communication"] || 0;
    const leadership = skillRatings["Leadership"] || 0;
    const creativity = skillRatings["Creativity"] || 0;
    const teamwork = skillRatings["Teamwork"] || 0;
    const adaptability = skillRatings["Adaptability"] || 0;

    let profileType = "";
    let workEnvironment = "";
    let strengths = [];

    if (leadership >= 4 && communication >= 4) {
      profileType = "Natural Leader";
      workEnvironment = "You thrive in leadership roles and collaborative environments where you can guide teams and communicate vision effectively.";
    } else if (creativity >= 4 && adaptability >= 4) {
      profileType = "Creative Innovator";
      workEnvironment = "You excel in dynamic, creative environments where you can generate new ideas and adapt to changing requirements.";
    } else if (teamwork >= 4 && communication >= 4) {
      profileType =  "Collaborative Professional";
      workEnvironment = "You perform best in team-oriented environments with strong communication and collaborative workflows.";
    } else if (skillRatings["Problem Solving"] >= 4 && skillRatings["Critical Thinking"] >= 4) {
      profileType = "Analytical Thinker";
      workEnvironment = "You succeed in structured environments that require systematic problem-solving and analytical thinking.";
    } else {
      profileType = "Well-Rounded Professional";
      workEnvironment = "You adapt well to various work environments and can contribute effectively across different areas.";
    }

    // Identify top 3 strengths
    const sortedSkills = Object.entries(skillRatings)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill);

    return {
      type: profileType,
      environment: workEnvironment,
      topStrengths: sortedSkills
    };
  };

  const getPersonalityInsights = () => {
    return generatePersonalityProfile();
  };

  if (showResults) {
    const insights = getPersonalityInsights();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Soft Skills Assessment Results</h1>
          <p className="text-slate-600 mt-2">Your personality profile and work style preferences</p>
        </div>

        <Card className="border-2 border-pink-200 bg-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center text-pink-800">
              <Heart className="mr-2 h-5 w-5" />
              Your Personality Profile: {insights.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pink-700 mb-4">{insights.environment}</p>
            <div className="space-y-2">
              <h4 className="font-semibold text-pink-800">Your Top Strengths:</h4>
              <div className="flex flex-wrap gap-2">
                {insights.topStrengths.map((strength, index) => (
                  <Badge key={index} className="bg-pink-100 text-pink-800">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {softSkills.map((skill, index) => {
            const rating = skillRatings[skill.name] || 0;
            const skillInfo = getSkillLevel(rating);
            
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div>
                      <span>{skill.name}</span>
                      <p className="text-sm text-slate-500 font-normal">{skill.description}</p>
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
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            View Job Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentSkill + 1) / softSkills.length) * 100;
  const currentSkillData = softSkills[currentSkill];
  const currentRating = skillRatings[currentSkillData.name] || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Soft Skills Assessment</h1>
        <p className="text-slate-600 mt-2">Rate your personal and interpersonal skills</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-600" />
              Skill {currentSkill + 1} of {softSkills.length}
            </CardTitle>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">{currentSkillData.name}</h3>
            <p className="text-slate-600 mb-6">{currentSkillData.description}</p>
            
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
                <span>Developing</span>
                <span>Basic</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Strong</span>
                <span>Exceptional</span>
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
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {currentSkill === softSkills.length - 1 ? 'Complete Assessment' : 'Next Skill'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoftSkillsAssessment;
