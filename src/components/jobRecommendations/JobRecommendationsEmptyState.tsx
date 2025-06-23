
import { Search } from "lucide-react";

interface JobRecommendationsEmptyStateProps {
  searchTerm: string;
  hasRoles: boolean;
}

const JobRecommendationsEmptyState = ({ searchTerm, hasRoles }: JobRecommendationsEmptyStateProps) => {
  if (!hasRoles) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sub mb-2">No career recommendations available</h3>
        <p className="text-sub">
          Complete your onboarding and skills assessments to see personalized job matches
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-sub mb-2">No matching roles found</h3>
      <p className="text-sub">
        {searchTerm 
          ? "Try adjusting your search terms or clear the search to see all recommendations"
          : "We're working to add more job opportunities to match your profile"
        }
      </p>
    </div>
  );
};

export default JobRecommendationsEmptyState;
