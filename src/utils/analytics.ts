
// Google Analytics utility functions for tracking user interactions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics (called automatically via script in index.html)
export const initGA = () => {
  if (typeof window.gtag !== 'undefined') {
    console.log('Google Analytics initialized');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-DWN4NLF6QJ', {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user identification (when they log in)
export const trackUserLogin = (userId: string, userRole?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-DWN4NLF6QJ', {
      user_id: userId,
      custom_map: { role: userRole }
    });
    trackEvent('login', 'user_engagement', userRole);
  }
};

// Track user registration
export const trackUserRegistration = (method: string = 'email') => {
  trackEvent('sign_up', 'user_engagement', method);
};

// Track skills assessment events
export const trackSkillsAssessment = (action: 'start' | 'complete' | 'abandon', assessmentType: 'hard' | 'soft') => {
  trackEvent(action, 'skills_assessment', assessmentType);
};

// Track job-related events
export const trackJobEvent = (action: 'view' | 'apply' | 'save', jobTitle?: string) => {
  trackEvent(action, 'job_interaction', jobTitle);
};

// Track interview practice events
export const trackInterviewPractice = (action: 'start' | 'complete' | 'feedback_viewed', questionCategory?: string) => {
  trackEvent(action, 'interview_practice', questionCategory);
};

// Track learning resource interactions
export const trackLearningResource = (action: 'view' | 'click', resourceType?: string) => {
  trackEvent(action, 'learning_resources', resourceType);
};

// Track profile completion events
export const trackProfileUpdate = (section: string) => {
  trackEvent('profile_update', 'user_engagement', section);
};

// Track career guidance usage
export const trackCareerGuidance = (action: string, feature?: string) => {
  trackEvent(action, 'career_guidance', feature);
};
