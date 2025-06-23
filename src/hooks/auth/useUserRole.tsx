
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const useUserRole = () => {
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { user_uuid: userId });

      if (error) {
        console.error('Error fetching user role:', error);
        return 'user';
      }

      return data as UserRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  }, []);

  return { fetchUserRole };
};
