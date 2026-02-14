/**
 * useUserTriggers Hook
 * Loads user triggers from database, merges with defaults, sorts by frequency
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { triggerLogService, userTriggerService } from '@/services';
import { DEFAULT_TRIGGERS, STORAGE_KEYS } from '@/lib/constants';
import { isValidTriggerName } from '@/lib/validators';

export function useUserTriggers(userId) {
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS);
  const [loading, setLoading] = useState(true);
  const [isUsingDefaults, setIsUsingDefaults] = useState(true);

  // Ref to avoid stale closure in addCustomTrigger
  const triggersRef = useRef(triggers);
  useEffect(() => { triggersRef.current = triggers; }, [triggers]);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }

    setLoading(true);

    // Load user's triggers from database
    const { data: dbTriggers } = await userTriggerService.getUserTriggers(userId);

    let allTriggers;
    let usingDefaults = true;

    if (dbTriggers && dbTriggers.length > 0) {
      // User has saved triggers - show only those
      allTriggers = dbTriggers.map(t => t.name);
      usingDefaults = false;
    } else {
      // Fallback to localStorage for users mid-onboarding
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
        const onboardingData = raw ? JSON.parse(raw) : {};
        if (onboardingData.triggers?.length > 0) {
          allTriggers = [...onboardingData.triggers];
          usingDefaults = false;
        }
      } catch { /* ignore parse errors */ }

      // Safety net: no DB triggers and no localStorage triggers
      if (!allTriggers) {
        allTriggers = [...DEFAULT_TRIGGERS];
      }
    }

    // Only fetch stats for sorting if user has DB triggers
    if (!usingDefaults) {
      const { stats } = await triggerLogService.getStats(userId, 90);
      if (stats?.triggerCounts) {
        allTriggers.sort((a, b) =>
          (stats.triggerCounts[b] || 0) - (stats.triggerCounts[a] || 0)
        );
      }
    }

    setTriggers(allTriggers);
    setIsUsingDefaults(usingDefaults);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const addCustomTrigger = useCallback(async (name) => {
    const { valid, error } = isValidTriggerName(name);
    if (!valid) return { error };

    const trimmed = name.trim();
    if (triggersRef.current.includes(trimmed)) return { error: 'Already in your list' };

    // Optimistic update
    setTriggers(prev => [trimmed, ...prev]);

    // Save to database in background
    if (userId) {
      const { error: dbError } = await userTriggerService.addCustomTrigger(userId, trimmed);
      if (dbError) {
        // Rollback on failure
        setTriggers(prev => prev.filter(t => t !== trimmed));
        return { error: 'Could not save. You can try again when ready.' };
      }
    }

    return { error: null };
  }, [userId]);

  return { triggers, loading, isUsingDefaults, addCustomTrigger, refresh: load };
}
