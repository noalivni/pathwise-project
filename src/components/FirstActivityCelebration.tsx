
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { markFirstActivityCompleted, FirstActivityType } from "@/utils/firstActivityTracker";

interface FirstActivityCelebrationProps {
  activityType: FirstActivityType;
  activityName: string;
}

const FirstActivityCelebration = ({ activityType, activityName }: FirstActivityCelebrationProps) => {
  useEffect(() => {
    const wasFirstActivity = markFirstActivityCompleted(activityType);
    
    if (wasFirstActivity) {
      // Show celebration message after a short delay for better UX
      setTimeout(() => {
        toast({
          title: "🎉 Congratulations!",
          description: `You've completed your first activity: ${activityName}! Keep going to unlock more career opportunities.`,
          duration: 6000,
        });
      }, 1500);
    }
  }, [activityType, activityName]);

  return null; // This component only handles side effects
};

export default FirstActivityCelebration;
