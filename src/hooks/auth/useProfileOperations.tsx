
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Profile } from '@/types/auth';
import { useUserRole } from './useUserRole';

export const useProfileOperations = () => {
  const { fetchUserRole } = useUserRole();

  const fetchProfile = useCallback(async (
    userId: string,
    setProfile: (profile: Profile | null) => void,
    setUserRole: (role: 'user' | 'admin') => void
  ) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);

      // Fetch user role
      const role = await fetchUserRole(userId);
      setUserRole(role);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [fetchUserRole]);

  const updateProfile = useCallback(async (
    user: User | null,
    updates: Partial<Profile>,
    refreshProfile: () => Promise<void>
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, []);

  return {
    fetchProfile,
    updateProfile
  };
};
