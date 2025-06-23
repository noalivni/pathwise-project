
// Utility to track and display first activity completion message
export const FIRST_ACTIVITY_STORAGE_KEY = 'pathwise_first_activity_completed';

export type FirstActivityType = 'skills_assessment' | 'interview_practice' | 'resume_builder';

export const hasCompletedFirstActivity = (): boolean => {
  return localStorage.getItem(FIRST_ACTIVITY_STORAGE_KEY) === 'true';
};

export const markFirstActivityCompleted = (activityType: FirstActivityType): boolean => {
  const wasAlreadyCompleted = hasCompletedFirstActivity();
  
  if (!wasAlreadyCompleted) {
    localStorage.setItem(FIRST_ACTIVITY_STORAGE_KEY, 'true');
    localStorage.setItem('pathwise_first_activity_type', activityType);
    return true; // Return true if this was the first activity
  }
  
  return false; // Return false if already completed before
};

export const getFirstActivityType = (): FirstActivityType | null => {
  return localStorage.getItem('pathwise_first_activity_type') as FirstActivityType | null;
};
