/**
 * Daily Practice Utility
 * Single source of truth for daily practice rotation.
 * Replaces 3 inline copies of getDailyPractice().
 */

import { DAILY_PRACTICES_ROTATION } from '@/lib/constants';
import { getDayOfYear } from '@/lib/dateUtils';

/**
 * Get today's practice from the unified rotation (tools + experiences).
 * Rotates daily via getDayOfYear(). Total: 13 entries (prime).
 */
export function getDailyPractice() {
  return DAILY_PRACTICES_ROTATION[getDayOfYear() % DAILY_PRACTICES_ROTATION.length];
}

/**
 * Get today's breathwork practice (type: 'tool' only).
 * Used by "Breathe" buttons so they always lead to breathwork, never an experience.
 * Preserves the torus: "Breathe" means breathwork.
 */
export function getBreathworkPractice() {
  const toolsOnly = DAILY_PRACTICES_ROTATION.filter((p) => p.type === 'tool');
  return toolsOnly[getDayOfYear() % toolsOnly.length];
}

/**
 * Build the correct href for any practice in the rotation.
 * Tools -> /tools/{id}?duration={duration}
 * Experiences -> their route (e.g. /tools/experiences/grounding)
 * Fallback -> /tools (safe waypoint)
 */
export function buildPracticeHref(practice) {
  if (practice.type === 'tool') {
    return `/tools/${practice.id}?duration=${practice.duration}`;
  }
  if (practice.type === 'experience' && practice.route) {
    return practice.route;
  }
  return '/tools';
}
