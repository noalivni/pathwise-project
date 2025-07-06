
import { useState, useCallback } from "react";
import { InterviewSession } from "@/types/interview";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { parseQuestions, parseResponses } from "@/utils/interviewParsing";

export const useInterviewHistory = () => {
  const { user, profile } = useAuth();
  const [pastInterviews, setPastInterviews] = useState<InterviewSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string>("");

  const isPro = profile?.subscription_status === 'premium';

  const fetchPastInterviews = useCallback(async () => {
    if (!user || !isPro) return;

    setIsLoadingHistory(true);
    setError("");

    try {
      console.log('Fetching past interviews for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      console.log('Raw data from Supabase:', data);

      const formattedInterviews: InterviewSession[] = (data || []).map(session => {
        const questions = parseQuestions(session.questions);
        const responses = parseResponses(session.responses);

        return {
          id: session.id,
          job_role: session.job_role || 'Unknown Role',
          completed_at: session.completed_at || new Date().toISOString(),
          questions,
          responses
        };
      });

      console.log('Formatted interviews:', formattedInterviews);
      setPastInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error fetching past interviews:', error);
      setError('Failed to load interview history. Please try again.');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user, isPro]);

  return {
    pastInterviews,
    isLoadingHistory,
    error,
    fetchPastInterviews,
    isPro
  };
};
