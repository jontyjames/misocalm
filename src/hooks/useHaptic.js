/**
 * useHaptic — tactile feedback via Vibration API
 * Falls back silently on unsupported devices
 * Respects prefers-reduced-motion
 */

'use client';

import { useCallback } from 'react';
import useReducedMotion from './useReducedMotion';

const PATTERNS = {
  light: 10,
  medium: 25,
  heavy: 50,
};

export default function useHaptic() {
  const prefersReduced = useReducedMotion();

  const vibrate = useCallback((intensity = 'light') => {
    if (prefersReduced) return;
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    const ms = PATTERNS[intensity] || PATTERNS.light;
    navigator.vibrate(ms);
  }, [prefersReduced]);

  return { vibrate };
}
