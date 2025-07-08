
import JobCard from "@/components/JobCard";
import { CareerRole } from "@/types/jobRecommendations";
import { parseSkillsFromText } from "@/utils/skillsParsing";
import { useAuth } from "@/hooks/useAuth";

interface JobRecommendationsListProps {
  roles: CareerRole[];
  onBookmark: (roleId: string) => void;
  hasSkillsAssessment?: boolean;
}

const JobRecommendationsList = ({ roles, onBookmark, hasSkillsAssessment = false }: JobRecommendationsListProps) => {
  const { profile } = useAuth();

  // Get user's skills for skill fit highlighting
  const getUserSkillFit = (requiredSkills: string[]) => {
    if (!profile?.hard_skills) return [];
    
    const userSkills = profile.hard_skills.map(skill => skill.toLowerCase());
    return requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill)
      )
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {roles.map((role) => {
        const requiredSkills = parseSkillsFromText(role.Skills_required || '');
        const skillFitTags = getUserSkillFit(requiredSkills);
        
        return (
          <JobCard
            key={role.ID_num}
            role={{
              id: role.ID_num.toString(),
              job_title: role.job_title,
              job_description: role.Short_description,
              category: role.Industry,
              required_skills: requiredSkills,
              match_percentage: role.match_percentage,
              is_bookmarked: role.is_bookmarked
            }}
            onBookmark={onBookmark}
            skillFitTags={skillFitTags}
            hasSkillsAssessment={hasSkillsAssessment}
          />
        );
      })}
    </div>
  );
};

export default JobRecommendationsList;
