/**
 * useLogForm Hook
 * Manages trigger log form state, submission, and crisis detection
 * Per-trigger intensity model: each trigger gets its own 0-10 intensity
 */

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { triggerLogService } from '@/services';
import { ROUTES, TIME_OF_DAY_OPTIONS, BODY_RESPONSE_OPTIONS } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

// Re-export from constants for backward compat
export { TIME_OF_DAY_OPTIONS, BODY_RESPONSE_OPTIONS };

export function useLogForm(userId) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Core fields — per-trigger intensity map: { "Chewing": 7, "Sniffing": 4 }
  const [triggerEntries, setTriggerEntries] = useState({});
  const [environment, setEnvironment] = useState(null);

  // Optional fields
  const [timeOfDay, setTimeOfDay] = useState('now');
  const [bodyResponses, setBodyResponses] = useState([]);
  const [notes, setNotes] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const submittingRef = useRef(false);

  // Toggle a trigger on/off (default intensity 5 when adding)
  const toggleTrigger = useCallback((name) => {
    setTriggerEntries(prev => {
      if (name in prev) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: 5 };
    });
  }, []);

  // Set intensity for a specific trigger
  const setTriggerIntensity = useCallback((name, value) => {
    setTriggerEntries(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const toggleBodyResponse = useCallback((response) => {
    setBodyResponses(prev =>
      prev.includes(response)
        ? prev.filter(r => r !== response)
        : [...prev, response]
    );
  }, []);

  const handleSave = useCallback(async (skipCrisisCheck = false, { skipNavigate = false } = {}) => {
    if (submittingRef.current) return;
    if (!userId) { setError('Please sign in to save your log'); return; }

    const triggerNames = Object.keys(triggerEntries);
    if (triggerNames.length === 0) return;

    // Crisis check: any trigger intensity >= 9
    const maxIntensity = Math.max(...Object.values(triggerEntries));
    if (!skipCrisisCheck && maxIntensity >= 9) {
      setShowCrisisModal(true);
      return;
    }

    submittingRef.current = true;
    setSaving(true);
    setError(null);

    // Backward-compatible average intensity
    const avgIntensity = Math.round(
      triggerNames.reduce((sum, t) => sum + triggerEntries[t], 0) / triggerNames.length
    );

    const { data, error: saveError } = await triggerLogService.create({
      user_id: userId,
      triggers: triggerNames,                    // backward compat
      intensity: avgIntensity,                   // backward compat
      trigger_intensities: triggerEntries,       // new: per-trigger
      environment: environment || null,          // new: replaces source
      source: null,                              // deprecated
      time_of_day: timeOfDay,
      body_responses: bodyResponses.length > 0 ? bodyResponses : null,
      notes: notes.trim() || null,
    });

    if (saveError) {
      setError(saveError);
      setSaving(false);
      submittingRef.current = false;
      return;
    }

    track(EVENTS.TRIGGER_LOGGED, {
      triggerCount: triggerNames.length,
      intensity: avgIntensity,
      hasBodyResponses: bodyResponses.length > 0,
      environment,
    });

    // Invalidate cached queries so journal/stats/streak update immediately
    queryClient.invalidateQueries({ queryKey: ['triggerLogs'] });
    queryClient.invalidateQueries({ queryKey: ['triggerStats'] });
    queryClient.invalidateQueries({ queryKey: ['streak'] });

    setSaving(false);
    submittingRef.current = false;

    if (!skipNavigate) {
      const params = new URLSearchParams();
      const entryId = data?.[0]?.id;
      if (entryId) params.set('entry', entryId);
      if (maxIntensity) params.set('intensity', String(maxIntensity));
      if (bodyResponses.length > 0) {
        params.set('body', bodyResponses.slice(0, 5).join('|'));
      }

      const query = params.toString();
      router.push(`${ROUTES.LOG_SUCCESS}${query ? `?${query}` : ''}`);
    }
  }, [userId, triggerEntries, environment, timeOfDay, bodyResponses, notes, router, queryClient]);

  const handleCrisisContinue = useCallback(() => {
    setShowCrisisModal(false);
    return handleSave(true);
  }, [handleSave]);

  const handleCrisisSupport = useCallback(async () => {
    setShowCrisisModal(false);
    await handleSave(true, { skipNavigate: true });
    router.push(ROUTES.LOG_SUPPORT);
  }, [handleSave, router]);

  return {
    // Core state — per-trigger intensity
    triggerEntries, toggleTrigger, setTriggerIntensity,
    // Environment (replaces sources)
    environment, setEnvironment,
    // Optional state
    timeOfDay, setTimeOfDay,
    bodyResponses, toggleBodyResponse,
    notes, setNotes,
    // Actions
    handleSave, handleCrisisContinue, handleCrisisSupport,
    // UI state
    saving, error, showCrisisModal, setShowCrisisModal,
  };
}
