/**
 * useLogForm Hook
 * Manages trigger log form state, submission, and crisis detection
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { triggerLogService } from '@/services';
import { ROUTES } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

const TIME_OF_DAY_OPTIONS = [
  { value: 'now', label: 'Just now' },
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Midday' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

const BODY_RESPONSE_OPTIONS = [
  'Jaw tension',
  'Chest tightness',
  'Heat or flushing',
  'Urge to escape',
  'Stomach knot',
  'Shallow breathing',
  'Heart racing',
  'Fists clenching',
  'Muscle tension',
  'Numbness',
  'Trembling',
];

export { TIME_OF_DAY_OPTIONS, BODY_RESPONSE_OPTIONS };

export function useLogForm(userId) {
  const router = useRouter();

  // Core fields
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [sources, setSources] = useState([]);
  const [intensity, setIntensity] = useState(5);

  // Optional fields
  const [timeOfDay, setTimeOfDay] = useState('now');
  const [bodyResponses, setBodyResponses] = useState([]);
  const [notes, setNotes] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const toggleTrigger = useCallback((trigger) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  }, []);

  const toggleSource = useCallback((value) => {
    setSources(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  }, []);

  const toggleBodyResponse = useCallback((response) => {
    setBodyResponses(prev =>
      prev.includes(response)
        ? prev.filter(r => r !== response)
        : [...prev, response]
    );
  }, []);

  const handleSave = useCallback(async (skipCrisisCheck = false) => {
    if (saving) return;
    if (selectedTriggers.length === 0) return;

    // Show crisis modal for high intensity (9-10)
    if (!skipCrisisCheck && intensity >= 9) {
      setShowCrisisModal(true);
      return;
    }

    setSaving(true);
    setError(null);

    const { data, error: saveError } = await triggerLogService.create({
      user_id: userId,
      triggers: selectedTriggers,
      source: sources.length > 0 ? sources : null,
      intensity,
      time_of_day: timeOfDay,
      body_responses: bodyResponses.length > 0 ? bodyResponses : null,
      notes: notes.trim() || null,
    });

    if (saveError) {
      setError(saveError);
      setSaving(false);
      return;
    }

    track(EVENTS.TRIGGER_LOGGED, {
      triggerCount: selectedTriggers.length,
      intensity,
      sources,
      hasBodyResponses: bodyResponses.length > 0,
    });

    setSaving(false);

    // Get the created entry ID for the deeper processing flow
    const entryId = data?.[0]?.id;
    router.push(`${ROUTES.LOG_SUCCESS}${entryId ? `?entry=${entryId}` : ''}`);
  }, [userId, selectedTriggers, sources, intensity, timeOfDay, bodyResponses, notes, saving, router]);

  const handleCrisisContinue = useCallback(() => {
    setShowCrisisModal(false);
    handleSave(true);
  }, [handleSave]);

  const handleCrisisSupport = useCallback(() => {
    setShowCrisisModal(false);
    handleSave(true);
    // Will be redirected to support page after save
  }, [handleSave]);

  return {
    // Core state
    selectedTriggers, toggleTrigger,
    sources, toggleSource,
    intensity, setIntensity,
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
