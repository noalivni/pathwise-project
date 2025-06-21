
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, ArrowRight, Users, Brain, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SoftSkillsAssessment = () => {
  const { user } = useAuth();
  const [currentSkill, setCurrentSkill] = useState(0);
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const softSkills = [
    { name: "Communication", description: "Ability to express ideas clearly and listen effectively", icon: "💬" },
    { name: "Leadership", description: "Capability to guide, motivate, and inspire others", icon: "👑" },
    { name: "Problem Solving", description: "Skill in analyzing issues and finding creative solutions", icon: "🧩" },
    { name: "Teamwork", description: "Ability to collaborate effectively with others", icon: "🤝" },
    { name: "Adaptability", description: "Flexibility in adjusting to new situations and changes", icon: "🔄" },
    { name: "Time Management", description: "Efficiency in organizing and prioritizing tasks", icon: "⏰" },
    { name: "Creativity", description: "Ability to think outside the box and generate innovative ideas", icon: "💡" },
    { name: "Critical Thinking", description: "Skill in analyzing information objectively and making reasoned judgments", icon: "🔍" },
    { name: "Emotional Intelligence", description: "Understanding and managing emotions in self and others", icon: "❤️" },
    { name: "Attention to Detail", description: "Thoroughness and accuracy in completing tasks", icon: "🔎" }
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
      const detailedFeedback = generateDetailedFeedback();
      
      const { error } = await supabase
        .from('skills_assessments')
        .insert({
          user_id: user.id,
          soft_skills: skillRatings,
          personality_traits: {
            ...personalityProfile,
            detailed_feedback: detailedFeedback
          },
          assessment_type: 'soft_skills'
        });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Assessment Complete!",
        description: "Your soft skills have been evaluated and feedback generated.",
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
    if (rating === 0) return { level: "Not Assessed", color: "bg-gray-500" };
    if (rating <= 1) return { level: "Developing", color: "bg-red-500" };
    if (rating <= 2) return { level: "Basic", color: "bg-orange-500" };
    if (rating <= 3) return { level: "Competent", color: "bg-yellow-500" };
    if (rating <= 4) return { level: "Proficient", color: "bg-blue-500" };
    return { level: "Expert", color: "bg-green-500" };
  };

  const generatePersonalityProfile = () => {
    const communication = skillRatings["Communication"] || 0;
    const leadership = skillRatings["Leadership"] || 0;
    const creativity = skillRatings["Creativity"] || 0;
    const teamwork = skillRatings["Teamwork"] || 0;
    const adaptability = skillRatings["Adaptability"] || 0;
    const problemSolving = skillRatings["Problem Solving"] || 0;
    const criticalThinking = skillRatings["Critical Thinking"] || 0;
    const emotionalIntelligence = skillRatings["Emotional Intelligence"] || 0;

    let profileType = "";
    let workEnvironment = "";
    let careerSuggestions = [];

    if (leadership >= 4 && communication >= 4) {
      profileType = "Natural Leader";
      workEnvironment = "You thrive in leadership roles and collaborative environments where you can guide teams and communicate vision effectively.";
      careerSuggestions = ["Team Lead", "Project Manager", "Department Head", "Executive Roles"];
    } else if (creativity >= 4 && adaptability >= 4) {
      profileType = "Creative Innovator";
      workEnvironment = "You excel in dynamic, creative environments where you can generate new ideas and adapt to changing requirements.";
      careerSuggestions = ["Design Roles", "Marketing", "Product Development", "Startup Environment"];
    } else if (teamwork >= 4 && emotionalIntelligence >= 4) {
      profileType = "Collaborative Professional";
      workEnvironment = "You perform best in team-oriented environments with strong interpersonal dynamics and collaborative workflows.";
      careerSuggestions = ["HR Roles", "Customer Success", "Team-based Projects", "Consulting"];
    } else if (problemSolving >= 4 && criticalThinking >= 4) {
      profileType = "Analytical Thinker";
      workEnvironment = "You succeed in structured environments that require systematic problem-solving and analytical thinking.";
      careerSuggestions = ["Data Analysis", "Research", "Strategy", "Technical Roles"];
    } else if (communication >= 3 && teamwork >= 3) {
      profileType = "Balanced Communicator";
      workEnvironment = "You work well in diverse environments and can adapt to both independent and team-based work.";
      careerSuggestions = ["Cross-functional Roles", "Client-facing Positions", "Versatile Team Member"];
    } else {
      profileType = "Developing Professional";
      workEnvironment = "You're building your interpersonal skills and would benefit from mentorship and structured learning environments.";
      careerSuggestions = ["Entry-level Positions", "Training Programs", "Structured Mentorship"];
    }

    const sortedSkills = Object.entries(skillRatings)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill);

    return {
      type: profileType,
      environment: workEnvironment,
      topStrengths: sortedSkills,
      careerSuggestions
    };
  };

  const generateDetailedFeedback = () => {
    const insights = [];
    const ratings = skillRatings;
    
    // Communication insights
    if (ratings["Communication"] >= 4) {
      insights.push("Your strong communication skills make you valuable in client-facing roles and team leadership positions.");
    } else if (ratings["Communication"] <= 2) {
      insights.push("Consider developing communication skills through practice, training, or joining speaking groups like Toastmasters.");
    }

    // Leadership insights
    if (ratings["Leadership"] >= 4 && ratings["Teamwork"] >= 4) {
      insights.push("Your combination of leadership and teamwork skills suggests you'd excel in collaborative leadership roles.");
    } else if (ratings["Leadership"] >= 4 && ratings["Leadership"] > ratings["Teamwork"]) {
      insights.push("You show strong leadership potential. Consider roles where you can mentor others and drive initiatives.");
    }

    // Problem-solving and creativity
    if (ratings["Problem Solving"] >= 4 && ratings["Creativity"] >= 4) {
      insights.push("Your creative problem-solving approach makes you ideal for innovation-focused roles and complex challenge resolution.");
    }

    // Adaptability insights
    if (ratings["Adaptability"] >= 4) {
      insights.push("Your high adaptability means you'd thrive in fast-paced, changing environments like startups or dynamic teams.");
    } else if (ratings["Adaptability"] <= 2) {
      insights.push("You may prefer structured, predictable work environments with clear processes and stable routines.");
    }

    // Emotional intelligence
    if (ratings["Emotional Intelligence"] >= 4) {
      insights.push("Your emotional intelligence is a significant asset for roles involving people management, counseling, or customer relations.");
    }

    // Work style recommendations
    const avgRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;
    if (avgRating >= 4) {
      insights.push("Your overall high skill ratings suggest you're ready for senior or specialized roles with significant responsibility.");
    } else if (avgRating >= 3) {
      insights.push("You demonstrate solid interpersonal skills suitable for mid-level positions with growth potential.");
    } else {
      insights.push("Focus on developing key soft skills through training, practice, and seeking feedback to advance your career.");
    }

    return insights;
  };

  if (showResults) {
    const insights = generatePersonalityProfile();
    const detailedFeedback = generateDetailedFeedback();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Your Soft Skills Profile</h1>
          <p className="text-slate-600 mt-2">Personalized insights about your work style and career fit</p>
        </div>

        {/* Personality Profile Card */}
        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center text-pink-800 text-xl">
              <Heart className="mr-3 h-6 w-6" />
              Your Profile: {insights.type}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-800 mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Ideal Work Environment
              </h4>
              <p className="text-pink-700">{insights.environment}</p>
            </div>
            
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-800 mb-2 flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Recommended Career Paths
              </h4>
              <div className="flex flex-wrap gap-2">
                {insights.careerSuggestions.map((suggestion, index) => (
                  <Badge key={index} className="bg-pink-100 text-pink-800 border-pink-200">
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-800 mb-2 flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                Your Top Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {insights.topStrengths.map((strength, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
              Personalized Career Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {detailedFeedback.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {softSkills.map((skill, index) => {
            const rating = skillRatings[skill.name] || 0;
            const skillInfo = getSkillLevel(rating);
            
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{skill.icon}</span>
                      <span>{skill.name}</span>
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
        <p className="text-slate-600 mt-2">Rate your interpersonal and personal effectiveness skills</p>
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
            <div className="text-4xl mb-3">{currentSkillData.icon}</div>
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
                <span>Not Me</span>
                <span>Somewhat</span>
                <span>Moderately</span>
                <span>Quite Me</span>
                <span>Very Much Me</span>
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
