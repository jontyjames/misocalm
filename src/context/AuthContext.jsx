/**
 * Auth Context
 * Manages user authentication state with Supabase
 * Split into separate contexts to reduce unnecessary re-renders
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth, db } from '@/services/supabase';

// Separate contexts for different concerns
const AuthStateContext = createContext(null);
const ProfileContext = createContext(null);
const AuthActionsContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId) => {
    const { data, error: profileError } = await db.select('users', '*', { id: userId });
    if (profileError) {
      console.error('Failed to fetch profile:', profileError);
      return null;
    }
    return data?.[0] || null;
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { session, error: sessionError } = await auth.getSession();

        if (sessionError) {
          setError(sessionError);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [fetchProfile]);

  // Send OTP code
  const sendOtp = useCallback(async (email) => {
    setError(null);
    const result = await auth.sendOtp(email);
    if (result.error) {
      setError(result.error);
    }
    return result;
  }, []);

  // Verify OTP code
  const verifyOtp = useCallback(async (email, token) => {
    setError(null);
    const result = await auth.verifyOtp(email, token);
    if (result.error) {
      setError(result.error);
    }
    return result;
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setError(null);
    const result = await auth.signOut();
    if (result.error) {
      setError(result.error);
    } else {
      setUser(null);
      setProfile(null);
    }
    return result;
  }, []);

  // Create or update user profile
  const upsertProfile = useCallback(async (data) => {
    if (!user) return { error: 'Not authenticated' };

    setError(null);

    // Check if profile exists
    const { data: existing } = await db.select('users', 'id', { id: user.id });

    let result;
    if (existing?.length) {
      // Update existing
      result = await db.update('users', user.id, data);
    } else {
      // Create new
      result = await db.insert('users', {
        id: user.id,
        email: user.email,
        ...data,
        created_at: new Date().toISOString(),
      });
    }

    if (result.error) {
      setError(result.error);
    }

    // Always refresh from DB to get the latest profile state
    // Supabase upsert may not always return data reliably
    const freshProfile = await fetchProfile(user.id);
    if (freshProfile) {
      setProfile(freshProfile);
    }

    return result;
  }, [user, fetchProfile]);

  // Refresh profile from database
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const userProfile = await fetchProfile(user.id);
    setProfile(userProfile);
    return userProfile;
  }, [user, fetchProfile]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Memoize context values to prevent unnecessary re-renders
  const authStateValue = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
  }), [user, loading, error]);

  const profileValue = useMemo(() => ({
    profile,
    hasCompletedOnboarding: profile?.onboarding_completed ?? false,
  }), [profile]);

  const actionsValue = useMemo(() => ({
    sendOtp,
    verifyOtp,
    signOut,
    upsertProfile,
    refreshProfile,
    clearError,
  }), [sendOtp, verifyOtp, signOut, upsertProfile, refreshProfile, clearError]);

  return (
    <AuthStateContext.Provider value={authStateValue}>
      <ProfileContext.Provider value={profileValue}>
        <AuthActionsContext.Provider value={actionsValue}>
          {children}
        </AuthActionsContext.Provider>
      </ProfileContext.Provider>
    </AuthStateContext.Provider>
  );
}

/**
 * Hook for auth state (user, loading, error)
 * Use when you need to check authentication status
 */
export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook for profile data
 * Use when you need user profile information
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook for auth actions (signIn, signOut, etc.)
 * Use when you need to perform auth operations
 */
export function useAuthActions() {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
}

/**
 * Combined hook for backwards compatibility
 * Use the specific hooks above for better performance
 */
export function useAuth() {
  const authState = useContext(AuthStateContext);
  const profile = useContext(ProfileContext);
  const actions = useContext(AuthActionsContext);

  if (!authState || !profile || !actions) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...authState,
    ...profile,
    ...actions,
  };
}
