/**
 * useUserTriggers Hook
 * Loads user triggers from database, merges with defaults, sorts by frequency
 */

import { useState, useEffect, useCallback } from 'react';
import { triggerLogService, userTriggerService } from '@/services';
import { DEFAULT_TRIGGERS, STORAGE_KEYS } from '@/lib/constants';

export function useUserTriggers(userId) {
  const [triggers, setTriggers] = useState(DEFAULT_TRIGGERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userId) { setLoading(false); return; }

      // Get frequency stats for sorting
      const { stats } = await triggerLogService.getStats(userId, 90);

      // Load user's triggers from database
      const { data: dbTriggers } = await userTriggerService.getUserTriggers(userId);

      let allTriggers = [...DEFAULT_TRIGGERS];

      if (dbTriggers && dbTriggers.length > 0) {
        const userTriggerNames = dbTriggers.map(t => t.name);
        const remainingDefaults = DEFAULT_TRIGGERS.filter(
          t => !userTriggerNames.includes(t)
        );
        allTriggers = [...userTriggerNames, ...remainingDefaults];
      } else {
        // Fallback to localStorage for users who onboarded before DB save
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
          const onboardingData = raw ? JSON.parse(raw) : {};
          if (onboardingData.triggers?.length > 0) {
            const remaining = DEFAULT_TRIGGERS.filter(
              t => !onboardingData.triggers.includes(t)
            );
            allTriggers = [...onboardingData.triggers, ...remaining];
          }
        } catch { /* ignore parse errors */ }
      }

      // Sort by frequency (most used first)
      if (stats?.triggerCounts) {
        allTriggers.sort((a, b) =>
          (stats.triggerCounts[b] || 0) - (stats.triggerCounts[a] || 0)
        );
      }

      setTriggers(allTriggers);
      setLoading(false);
    };

    load();
  }, [userId]);

  const addCustomTrigger = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed || triggers.includes(trimmed)) return;

    // Add to local list immediately (at the front)
    setTriggers(prev => [trimmed, ...prev]);

    // Save to database in background
    if (userId) {
      await userTriggerService.addCustomTrigger(userId, trimmed);
    }
  }, [userId, triggers]);

  return { triggers, loading, addCustomTrigger };
}
