
interface JobRecommendationsHeaderProps {
  fieldOfInterest?: string | null;
}

const JobRecommendationsHeader = ({ fieldOfInterest }: JobRecommendationsHeaderProps) => {
  const getRecommendationSubtitle = () => {
    if (fieldOfInterest) {
      return `Top 4 ${fieldOfInterest} roles matched to your skills and background`;
    }
    return "Complete your profile and skills assessments for personalized matches";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-main">Personalized Career Matches</h1>
      <p className="text-sub mt-2">
        {getRecommendationSubtitle()}
      </p>
    </div>
  );
};

export default JobRecommendationsHeader;
