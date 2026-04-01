/**
 * useUserTriggers Hook
 * Loads user triggers from database, merges with defaults, sorts by frequency.
 * React Query cached — shared across LogFormContainer and profile pages.
 */

import { useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { triggerLogService, userTriggerService } from '@/services';
import { DEFAULT_TRIGGERS, STORAGE_KEYS } from '@/lib/constants';
import { isValidTriggerName } from '@/lib/validators';
import { queryKeys } from '@/lib/queryKeys';

export function useUserTriggers(userId) {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKeys.userTriggers(userId),
    queryFn: async () => {
      if (!userId) return { triggers: DEFAULT_TRIGGERS, isUsingDefaults: true };

      const { data: dbTriggers } = await userTriggerService.getUserTriggers(userId);

      let allTriggers;
      let usingDefaults = true;

      if (dbTriggers && dbTriggers.length > 0) {
        allTriggers = dbTriggers.map(t => t.name);
        usingDefaults = false;
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
          const onboardingData = raw ? JSON.parse(raw) : {};
          if (onboardingData.triggers?.length > 0) {
            allTriggers = [...onboardingData.triggers];
            usingDefaults = false;
          }
        } catch { /* ignore parse errors */ }

        if (!allTriggers) {
          allTriggers = [...DEFAULT_TRIGGERS];
        }
      }

      // Sort by log frequency for non-default users
      if (!usingDefaults) {
        const { stats } = await triggerLogService.getStats(userId, 90);
        if (stats?.triggerCounts) {
          allTriggers.sort((a, b) =>
            (stats.triggerCounts[b] || 0) - (stats.triggerCounts[a] || 0)
          );
        }
      }

      return { triggers: allTriggers, isUsingDefaults: usingDefaults };
    },
    enabled: !!userId,
    placeholderData: { triggers: DEFAULT_TRIGGERS, isUsingDefaults: true },
  });

  // Ref for optimistic addCustomTrigger closure
  const triggersRef = useRef(data?.triggers ?? DEFAULT_TRIGGERS);
  triggersRef.current = data?.triggers ?? DEFAULT_TRIGGERS;

  const addCustomTrigger = useCallback(async (name) => {
    const { valid, error } = isValidTriggerName(name);
    if (!valid) return { error };

    const trimmed = name.trim();
    if (triggersRef.current.includes(trimmed)) return { error: 'Already in your list' };

    // Optimistic update
    queryClient.setQueryData(queryKeys.userTriggers(userId), (old) => ({
      ...old,
      triggers: [trimmed, ...(old?.triggers || [])],
    }));

    if (userId) {
      const { error: dbError } = await userTriggerService.addCustomTrigger(userId, trimmed);
      if (dbError) {
        // Rollback
        queryClient.setQueryData(queryKeys.userTriggers(userId), (old) => ({
          ...old,
          triggers: (old?.triggers || []).filter(t => t !== trimmed),
        }));
        return { error: 'Could not save. You can try again when ready.' };
      }
    }

    return { error: null };
  }, [userId, queryClient]);

  return {
    triggers: data?.triggers ?? DEFAULT_TRIGGERS,
    loading,
    isUsingDefaults: data?.isUsingDefaults ?? true,
    addCustomTrigger,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.userTriggers(userId) }),
  };
}
