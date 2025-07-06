
export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
}

export interface InterviewSession {
  id: string;
  job_role: string;
  completed_at: string;
  questions: InterviewQuestion[];
  responses: Array<{
    question: string;
    response: string;
    feedback?: string;
  }>;
}

export interface InterviewResponse {
  question: string;
  response: string;
  feedback?: string;
}
