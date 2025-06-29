
export type FirstActivityType = 'skills_assessment' | 'interview_practice' | 'resume_builder' | 'job_matching';

const STORAGE_KEY = 'pathwise_first_activities';

interface CompletedActivities {
  [key: string]: boolean;
}

export const markFirstActivityCompleted = (activityType: FirstActivityType): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const completed: CompletedActivities = stored ? JSON.parse(stored) : {};
    
    // Check if this activity was already completed
    if (completed[activityType]) {
      return false; // Not the first time
    }
    
    // Mark as completed
    completed[activityType] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    
    return true; // This was the first time
  } catch (error) {
    console.error('Error managing first activity tracking:', error);
    return false;
  }
};

export const isFirstActivity = (activityType: FirstActivityType): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const completed: CompletedActivities = stored ? JSON.parse(stored) : {};
    return !completed[activityType];
  } catch (error) {
    console.error('Error checking first activity status:', error);
    return false;
  }
};

export const resetFirstActivityTracking = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting first activity tracking:', error);
  }
};
