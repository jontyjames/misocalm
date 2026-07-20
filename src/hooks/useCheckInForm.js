/**
 * useCheckInForm Hook
 * Manages emotional check-in form state and submission
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { triggerLogService } from '@/services';
import { buildCheckInSuccessRoute, normalizeCheckInOrigin, normalizeCheckInSource } from '@/lib/checkInContext';
import { track, EVENTS } from '@/lib/analytics';

export function useCheckInForm(userId, source = null, origin = null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const checkInSource = normalizeCheckInSource(source);
  const checkInOrigin = normalizeCheckInOrigin(origin);

  // Scale state (default to midpoint: 3)
  const [energy, setEnergy] = useState(3);
  const [pleasantness, setPleasantness] = useState(3);
  const [bodySensation, setBodySensation] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!userId) {
      setError('Please sign in to save your check-in');
      return;
    }

    setSaving(true);
    setError(null);

    const { data, error: saveError } = await triggerLogService.createCheckIn({
      user_id: userId,
      energy,
      pleasantness,
      body_sensation: bodySensation.trim() || null,
      ...(checkInSource && { source_practice: checkInSource }),
    });

    if (saveError) {
      setError(saveError);
      setSaving(false);
      return;
    }

    if (!data?.length) {
      setError('Something went wrong saving your check-in. You can try again when ready.');
      setSaving(false);
      return;
    }

    track(EVENTS.CHECK_IN_LOGGED, {
      energy,
      pleasantness,
      hasBodySensation: bodySensation.trim().length > 0,
      fromBreathwork: checkInSource === 'breathwork',
      source: checkInSource,
    });

    // Invalidate cached queries so journal/stats/streak update immediately
    queryClient.invalidateQueries({ queryKey: ['triggerLogs'] });
    queryClient.invalidateQueries({ queryKey: ['triggerStats'] });
    queryClient.invalidateQueries({ queryKey: ['streak'] });

    setSaving(false);

    const entryId = data[0].id;
    router.push(buildCheckInSuccessRoute({ source: checkInSource, origin: checkInOrigin, entryId }));
  }, [userId, energy, pleasantness, bodySensation, checkInSource, checkInOrigin, saving, router, queryClient]);

  return {
    energy, setEnergy,
    pleasantness, setPleasantness,
    bodySensation, setBodySensation,
    handleSave,
    saving, error,
  };
}
