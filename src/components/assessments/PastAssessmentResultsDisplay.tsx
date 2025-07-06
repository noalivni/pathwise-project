
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Lightbulb, User, ArrowRight } from "lucide-react";
import { getSkillLevel as getHardSkillLevel } from "@/utils/hardSkillsUtils";
import { getSkillLevel as getSoftSkillLevel } from "@/utils/skillLevelUtils";

interface PastAssessmentResultsDisplayProps {
  skillRatings: { [key: string]: number };
  assessmentType: 'hard_skills' | 'soft_skills';
  relevantSkills: Array<{ name: string; category?: string; icon?: string }>;
  fieldOfInterest?: string;
}

const PastAssessmentResultsDisplay = ({
  skillRatings,
  assessmentType,
  relevantSkills,
  fieldOfInterest = 'General'
}: PastAssessmentResultsDisplayProps) => {
  const getSkillInfo = (rating: number) => {
    return assessmentType === 'hard_skills' 
      ? getHardSkillLevel(rating) 
      : getSoftSkillLevel(rating);
  };

  const formatSkillName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getMaxRating = () => {
    return 4; // Both assessments use 0-4 scale
  };

  const generateInsights = () => {
    const ratings = Object.values(skillRatings);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const highSkills = Object.entries(skillRatings).filter(([_, rating]) => rating >= 3);

    if (assessmentType === 'hard_skills') {
      const insights = [];
      if (avgRating >= 3) {
        insights.push("You demonstrate strong technical proficiency across multiple areas.");
        insights.push("Consider pursuing senior-level positions or specialized consulting roles.");
      } else if (avgRating >= 2) {
        insights.push("You have solid foundational skills with room for growth.");
        insights.push("Focus on mastering 2-3 key tools to reach expert level.");
      } else {
        insights.push("Building technical skills through hands-on projects will accelerate your growth.");
        insights.push("Consider structured learning programs or certification courses.");
      }

      if (highSkills.length > 0) {
        insights.push(`Your strongest areas include ${highSkills.slice(0, 2).map(([skill]) => formatSkillName(skill)).join(' and ')}.`);
      }

      return insights;
    } else {
      const insights = [];
      if (avgRating >= 3) {
        insights.push("You show excellent interpersonal and leadership capabilities.");
        insights.push("These strengths position you well for collaborative and management roles.");
      } else if (avgRating >= 2) {
        insights.push("You have good foundational soft skills with potential for development.");
        insights.push("Focus on practicing these skills in real work situations.");
      } else {
        insights.push("Developing these interpersonal skills will enhance your career prospects.");
        insights.push("Consider seeking feedback and mentorship opportunities.");
      }

      if (highSkills.length > 0) {
        insights.push(`You excel in ${highSkills.slice(0, 2).map(([skill]) => formatSkillName(skill)).join(' and ')}.`);
      }

      return insights;
    }
  };

  const generateProfessionalProfile = () => {
    const ratings = Object.values(skillRatings);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    if (assessmentType === 'hard_skills') {
      if (avgRating >= 3) {
        return "Your technical expertise qualifies you for senior-level positions in your field. You're ready to take on complex projects, mentor junior team members, and potentially move into technical leadership roles. Consider opportunities in specialized consulting, solution architecture, or team lead positions.";
      } else if (avgRating >= 2) {
        return "You have solid technical foundations that make you a valuable team member. With focused development in your stronger areas, you can advance to intermediate and senior roles. Look for positions that offer growth opportunities and skill development programs.";
      } else {
        return "You're building your technical skill set, which positions you well for entry-level roles with training components. Focus on hands-on experience and consider positions at companies known for strong mentorship and development programs.";
      }
    } else {
      if (avgRating >= 3) {
        return "Your strong interpersonal skills make you an excellent candidate for leadership, management, and client-facing roles. You're well-suited for positions requiring collaboration, team coordination, and stakeholder management. Consider roles in project management, team leadership, or business development.";
      } else if (avgRating >= 2) {
        return "You have good foundational interpersonal skills that serve you well in collaborative environments. You're positioned for roles that involve teamwork and moderate interaction with colleagues and clients. Focus on opportunities that allow you to further develop these strengths.";
      } else {
        return "You're developing your interpersonal skills, which is valuable for any career path. Consider roles with supportive team environments where you can practice and grow these abilities. Look for positions that offer mentorship and professional development opportunities.";
      }
    }
  };

  const insights = generateInsights();
  const professionalProfile = generateProfessionalProfile();

  return (
    <div className="space-y-6">
      {/* Header with Profile Summary */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          {assessmentType === 'hard_skills' ? 'Hard Skills' : 'Soft Skills'} Assessment Results
        </h1>
        <p className="text-muted-foreground mt-2">
          Your Profile: {fieldOfInterest === 'General' ? 'General Skills' : fieldOfInterest}
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relevantSkills.map((skill, index) => {
          const rating = skillRatings[skill.name] || 0;
          const skillInfo = getSkillInfo(rating);
          const maxRating = getMaxRating();
          const formattedName = formatSkillName(skill.name);
          
          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center">
                    {skill.icon && <span className="text-2xl mr-2">{skill.icon}</span>}
                    <div>
                      <span className="text-foreground">{formattedName}</span>
                      {skill.category && <p className="text-sm text-muted-foreground font-normal">{skill.category}</p>}
                    </div>
                  </div>
                  <Badge className={`${skillInfo.color} text-white`}>
                    {skillInfo.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ({rating}/{maxRating}) {skillInfo.level}
                    </div>
                  </div>
                  <Progress value={(rating / maxRating) * 100} className="mb-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">{insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Professional Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <User className="mr-2 h-5 w-5 text-blue-500" />
            Your Current Professional Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {professionalProfile}
          </p>
          <Button 
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-jobs'))}
          >
            View Job Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastAssessmentResultsDisplay;
