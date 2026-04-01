/**
 * useStreak Hook
 * Tracks active days — no pressure, no "streak broken" language.
 * React Query cached with background refetch.
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { streakService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

const DEFAULT_ACTIVITY = {
  activeDays: 0,
  longestRun: 0,
  hasActivityToday: false,
  lastActivityDate: null,
};

export function useStreak(userId, options = {}) {
  const { autoFetch = true } = options;
  const queryClient = useQueryClient();

  const { data: activity, isLoading: loading, error, refetch } = useQuery({
    queryKey: queryKeys.streak(userId),
    queryFn: async () => {
      const { summary, error: fetchError } = await streakService.getSummary(userId);
      if (fetchError) throw new Error(fetchError);
      return summary ?? DEFAULT_ACTIVITY;
    },
    enabled: !!userId && autoFetch,
    placeholderData: DEFAULT_ACTIVITY,
  });

  const recordMutation = useMutation({
    mutationFn: () => streakService.recordActivity(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.streak(userId) });
    },
  });

  const recordActivity = useCallback(async () => {
    if (!userId) return { error: 'Not authenticated' };
    try {
      const result = await recordMutation.mutateAsync();
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }, [userId, recordMutation]);

  const checkActivityToday = useCallback(async () => {
    if (!userId) return { hasActivity: false, error: 'Not authenticated' };
    return streakService.hasActivityToday(userId);
  }, [userId]);

  const safeActivity = activity ?? DEFAULT_ACTIVITY;

  return {
    ...safeActivity,
    loading,
    error: error?.message ?? null,
    fetch: refetch,
    refresh: refetch,
    recordActivity,
    checkActivityToday,
  };
}

export default useStreak;
