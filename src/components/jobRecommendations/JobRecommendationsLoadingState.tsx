
const JobRecommendationsLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-sub">Loading personalized recommendations...</p>
      </div>
    </div>
  );
};

export default JobRecommendationsLoadingState;
