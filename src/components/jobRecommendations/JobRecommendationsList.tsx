
import { CareerRole } from "@/types/jobRecommendations";
import { parseSkillsFromText } from "@/utils/skillsParsing";
import JobCard from "@/components/JobCard";

interface JobRecommendationsListProps {
  roles: CareerRole[];
  onBookmark: (roleId: string) => void;
}

const JobRecommendationsList = ({ roles, onBookmark }: JobRecommendationsListProps) => {
  return (
    <div className="grid gap-6">
      {roles.map((role) => (
        <JobCard
          key={role.ID_num}
          role={{
            id: role.ID_num.toString(),
            job_title: role.job_title,
            job_description: role.Short_description || '',
            category: role.Industry,
            required_skills: parseSkillsFromText(role.Skills_required || ''),
            match_percentage: role.match_percentage,
            is_bookmarked: role.is_bookmarked
          }}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
};

export default JobRecommendationsList;
