
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // First attempt a normal sign out
      const { error } = await supabase.auth.signOut();
      
      // If there's an error, try to handle it gracefully
      if (error) {
        console.warn('Sign out error:', error.message);
        
        // If it's a session-related error, clear local storage and proceed
        if (error.message.includes('session') || error.message.includes('token')) {
          // Clear any remaining auth tokens from localStorage
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
              localStorage.removeItem(key);
            }
          });
          
          // Don't throw the error, just log it and continue
          console.log('Cleared auth tokens due to session error');
          return;
        }
        
        // For other errors, still throw them
        throw error;
      }
    } catch (error: any) {
      // Only show error toast for non-session related errors
      if (!error.message.includes('session') && !error.message.includes('token')) {
        toast({
          title: "Logout Error",
          description: "There was an issue logging out. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      // For session errors, just clear storage and proceed silently
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);

  return {
    signIn,
    signUp,
    signOut
  };
};
