/**
 * ExpansionBloom — practice completion celebration
 * Central orb expands to fill viewport with solfeggio colour
 * Duration: 1597ms (fib-ceremony)
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks';

const SOLFEGGIO_GRADIENTS = {
  indigo: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0.2) 50%, transparent 70%)',
  violet: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
  cyan: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(34,211,238,0.2) 50%, transparent 70%)',
};

export default function ExpansionBloom({ active = false, solfeggio = 'indigo', onComplete }) {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // Stable ref for onComplete — prevents timer restarts when parent re-renders
  // (same pattern as BreathingBox.jsx onCycleCompleteRef)
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (!active) return;

    if (prefersReduced) {
      const t = setTimeout(() => onCompleteRef.current?.(), 89); // fib-snap
      return () => clearTimeout(t);
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onCompleteRef.current?.();
    }, 1597); // fib-ceremony

    return () => clearTimeout(timer);
  }, [active, prefersReduced]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center expansion-bloom"
      style={{ animation: 'expansionBloom 1597ms ease-out forwards' }}
    >
      <div
        className="w-full h-full"
        style={{
          background: SOLFEGGIO_GRADIENTS[solfeggio] || SOLFEGGIO_GRADIENTS.indigo,
        }}
      />
    </div>
  );
}
