/**
 * useStreak Hook
 * Manages user activity streaks
 */

import { useState, useEffect, useCallback } from 'react';
import { streakService } from '@/services';

export function useStreak(userId, options = {}) {
  const { autoFetch = true } = options;

  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
    hasActivityToday: false,
    lastActivityDate: null,
  });
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { summary, error: fetchError } = await streakService.getSummary(userId);

    if (fetchError) {
      setError(fetchError);
    } else if (summary) {
      setStreak(summary);
    }

    setLoading(false);
  }, [userId]);

  /**
   * Record activity for today
   */
  const recordActivity = useCallback(async () => {
    if (!userId) return { error: 'Not authenticated' };

    setError(null);
    const result = await streakService.recordActivity(userId);

    if (result.error) {
      setError(result.error);
    } else {
      // Refresh to get updated streak
      await fetch();
    }

    return result;
  }, [userId, fetch]);

  /**
   * Check if user has activity today
   */
  const checkActivityToday = useCallback(async () => {
    if (!userId) return { hasActivity: false, error: 'Not authenticated' };

    const result = await streakService.hasActivityToday(userId);
    return result;
  }, [userId]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && userId) {
      fetch();
    }
  }, [autoFetch, userId, fetch]);

  return {
    ...streak,
    loading,
    error,
    fetch,
    refresh: fetch,
    recordActivity,
    checkActivityToday,
  };
}

export default useStreak;
