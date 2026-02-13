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

      let allTriggers;

      if (dbTriggers && dbTriggers.length > 0) {
        // User has saved triggers - show only those
        allTriggers = dbTriggers.map(t => t.name);
      } else {
        // Fallback to localStorage for users mid-onboarding
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
          const onboardingData = raw ? JSON.parse(raw) : {};
          if (onboardingData.triggers?.length > 0) {
            allTriggers = [...onboardingData.triggers];
          }
        } catch { /* ignore parse errors */ }

        // Safety net: no DB triggers and no localStorage triggers
        if (!allTriggers) {
          allTriggers = [...DEFAULT_TRIGGERS];
        }
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
