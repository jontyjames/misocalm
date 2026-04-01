/**
 * useCheckInForm Hook
 * Manages emotional check-in form state and submission
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { triggerLogService } from '@/services';
import { ROUTES } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

export function useCheckInForm(userId, fromBreathwork = false) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      ...(fromBreathwork && { source_practice: 'breathwork' }),
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
      fromBreathwork,
    });

    // Invalidate cached queries so journal/stats/streak update immediately
    queryClient.invalidateQueries({ queryKey: ['triggerLogs'] });
    queryClient.invalidateQueries({ queryKey: ['triggerStats'] });
    queryClient.invalidateQueries({ queryKey: ['streak'] });

    setSaving(false);

    const entryId = data[0].id;
    const params = new URLSearchParams({ type: 'check_in' });
    if (fromBreathwork) params.set('from', 'breathwork');
    if (entryId) params.set('entry', entryId);
    router.push(`${ROUTES.LOG_SUCCESS}?${params.toString()}`);
  }, [userId, energy, pleasantness, bodySensation, fromBreathwork, saving, router, queryClient]);

  return {
    energy, setEnergy,
    pleasantness, setPleasantness,
    bodySensation, setBodySensation,
    handleSave,
    saving, error,
  };
}
