/**
 * Timer Phase Colour Mapping
 * Shared between TimerPulse and TimerDisplay to avoid duplication.
 *
 * Solfeggio intent:
 *   practice  = indigo (528Hz) - transformation, healing
 *   reminder  = cyan (741Hz) - clarity, gentle return
 *   between   = violet (852Hz) - intuition, depth between rounds
 */

// RGB strings for inline style usage
export const PHASE_COLOURS = {
  idle:      '99,102,241',   // indigo - resting state
  countdown: '99,102,241',   // indigo - preparing to transform
  practice:  '99,102,241',   // indigo (528Hz) - healing, transformation
  reminder:  '34,211,238',   // cyan (741Hz) - clarity, expression
  between:   '139,92,246',   // violet (852Hz) - depth, return to spirit
  complete:  '139,92,246',   // violet (852Hz) - integration
};

/**
 * Compute progress (0-1) for the current timer phase.
 * Extracted as a named function per Pattern Weaver requirement.
 */
export function computeProgress(phase, timeRemaining, durationSec, reminderSec) {
  const phaseDurations = {
    countdown: 3, // Tesla's 3 seconds - the creative prime
    practice: durationSec,
    reminder: reminderSec,
    between: 3,   // Tesla's 3 seconds - brief sacred pause
  };
  const dur = phaseDurations[phase];
  if (!dur) return 0;
  return Math.max(0, Math.min(1, 1 - timeRemaining / dur));
}
