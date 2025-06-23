
import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole, AuthContextType } from '@/types/auth';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { useProfileOperations } from '@/hooks/auth/useProfileOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  const { signIn, signUp, signOut: authSignOut } = useAuthOperations();
  const { fetchProfile, updateProfile: profileUpdate } = useProfileOperations();

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, setProfile, setUserRole);
    }
  }, [user, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    await profileUpdate(user, updates, refreshProfile);
  }, [user, profileUpdate, refreshProfile]);

  const signOut = useCallback(async () => {
    try {
      await authSignOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole('user');
    } catch (error) {
      // Error already handled in useAuthOperations
    }
  }, [authSignOut]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id, setProfile, setUserRole);
            }
          }, 100);
        } else {
          setProfile(null);
          setUserRole('user');
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && mounted) {
        fetchProfile(session.user.id, setProfile, setUserRole);
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const contextValue = {
    user,
    session,
    profile,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
