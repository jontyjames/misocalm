/**
 * Wake Lock Hook
 * Keeps screen on during active practices (meditation, breathing, timer)
 * Uses Screen Wake Lock API — releases on unmount or when disabled
 */

'use client';

import { useEffect, useRef } from 'react';

export default function useWakeLock(enabled) {
  const lockRef = useRef(null);

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return;

    let released = false;

    async function acquire() {
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
        lockRef.current.addEventListener('release', () => {
          lockRef.current = null;
        });
      } catch {
        // Wake lock request failed (low battery, tab hidden, etc.)
      }
    }

    // Re-acquire on tab visibility change (browser releases on hide)
    function handleVisibility() {
      if (!released && document.visibilityState === 'visible') {
        acquire();
      }
    }

    acquire();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (lockRef.current) {
        lockRef.current.release();
        lockRef.current = null;
      }
    };
  }, [enabled]);
}
