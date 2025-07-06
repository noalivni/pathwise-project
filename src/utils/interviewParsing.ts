
import { InterviewQuestion, InterviewResponse } from "@/types/interview";

// Type guard for InterviewQuestion
export const isInterviewQuestion = (obj: any): obj is InterviewQuestion => {
  return obj && 
         typeof obj.id === 'number' &&
         typeof obj.question === 'string' &&
         typeof obj.category === 'string' &&
         typeof obj.difficulty === 'string';
};

// Type guard for interview response
export const isInterviewResponse = (obj: any): obj is InterviewResponse => {
  return obj && 
         typeof obj.question === 'string' &&
         typeof obj.response === 'string' &&
         (obj.feedback === undefined || typeof obj.feedback === 'string');
};

// Safe JSON parser for questions
export const parseQuestions = (data: any): InterviewQuestion[] => {
  try {
    let parsed = data;
    if (typeof data === 'string') {
      parsed = JSON.parse(data);
    }
    
    if (Array.isArray(parsed)) {
      return parsed.filter(isInterviewQuestion);
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to parse questions:', error);
    return [];
  }
};

// Safe JSON parser for responses
export const parseResponses = (data: any): InterviewResponse[] => {
  try {
    let parsed = data;
    if (typeof data === 'string') {
      parsed = JSON.parse(data);
    }
    
    if (Array.isArray(parsed)) {
      return parsed.filter(isInterviewResponse);
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to parse responses:', error);
    return [];
  }
};
