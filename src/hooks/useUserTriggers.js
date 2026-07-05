/**
 * useUserTriggers Hook
 * Loads user triggers from database, merges with defaults, sorts by frequency.
 * React Query cached — shared across LogFormContainer and profile pages.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { triggerLogService, userTriggerService } from '@/services';
import { DEFAULT_TRIGGERS, STORAGE_KEYS } from '@/lib/constants';
import { isValidTriggerName } from '@/lib/validators';
import { queryKeys } from '@/lib/queryKeys';

export function useUserTriggers(userId) {
  const queryClient = useQueryClient();
  const [optimisticTriggers, setOptimisticTriggers] = useState([]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: queryKeys.userTriggers(userId),
    queryFn: async () => {
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

  const baseTriggers = data?.triggers ?? DEFAULT_TRIGGERS;
  const triggers = useMemo(() => {
    const pending = optimisticTriggers.filter(trigger => !baseTriggers.includes(trigger));
    return pending.length > 0 ? [...pending, ...baseTriggers] : baseTriggers;
  }, [baseTriggers, optimisticTriggers]);

  useEffect(() => {
    setOptimisticTriggers([]);
  }, [userId]);

  // Ref for optimistic addCustomTrigger closure
  const triggersRef = useRef(triggers);
  triggersRef.current = triggers;

  const loading = !!userId && (isLoading || isPlaceholderData);

  const addCustomTrigger = useCallback(async (name) => {
    const { valid, error } = isValidTriggerName(name);
    if (!valid) return { error };

    const trimmed = name.trim();
    if (triggersRef.current.includes(trimmed)) return { error: 'Already in your list' };
    const queryKey = queryKeys.userTriggers(userId);
    const previousData = queryClient.getQueryData(queryKey);
    const withCustomTrigger = (old) => {
      const triggers = old?.triggers ?? previousData?.triggers ?? triggersRef.current;
      return {
        ...old,
        triggers: [trimmed, ...triggers.filter(t => t !== trimmed)],
        isUsingDefaults: false,
      };
    };

    // Optimistic update
    setOptimisticTriggers(prev => [trimmed, ...prev.filter(t => t !== trimmed)]);
    queryClient.setQueryData(queryKey, withCustomTrigger);

    if (userId) {
      const { error: dbError } = await userTriggerService.addCustomTrigger(userId, trimmed);
      if (dbError) {
        // Rollback
        setOptimisticTriggers(prev => prev.filter(t => t !== trimmed));
        queryClient.setQueryData(queryKey, previousData);
        return { error: 'Could not save. You can try again when ready.' };
      }
      queryClient.setQueryData(queryKey, withCustomTrigger);
    }

    return { error: null };
  }, [userId, queryClient]);

  return {
    triggers,
    loading,
    isUsingDefaults: data?.isUsingDefaults ?? true,
    addCustomTrigger,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.userTriggers(userId) }),
  };
}
