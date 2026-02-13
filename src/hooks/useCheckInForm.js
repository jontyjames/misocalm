/**
 * useCheckInForm Hook
 * Manages emotional check-in form state and submission
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { triggerLogService } from '@/services';
import { ROUTES } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

export function useCheckInForm(userId, fromBreathwork = false) {
  const router = useRouter();

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
      setError('Not signed in');
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
      setError('Save failed — no data returned');
      setSaving(false);
      return;
    }

    track(EVENTS.CHECK_IN_LOGGED, {
      energy,
      pleasantness,
      hasBodySensation: bodySensation.trim().length > 0,
      fromBreathwork,
    });

    setSaving(false);

    const entryId = data[0].id;
    const params = new URLSearchParams({ type: 'check_in' });
    if (fromBreathwork) params.set('from', 'breathwork');
    if (entryId) params.set('entry', entryId);
    router.push(`${ROUTES.LOG_SUCCESS}?${params.toString()}`);
  }, [userId, energy, pleasantness, bodySensation, fromBreathwork, saving, router]);

  return {
    energy, setEnergy,
    pleasantness, setPleasantness,
    bodySensation, setBodySensation,
    handleSave,
    saving, error,
  };
}
