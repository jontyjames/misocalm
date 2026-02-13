/**
 * useLongPress — activation at 377ms (fib-flow)
 * Glow pulses at 3.7s cycle (prime)
 * Returns { isLongPressed, handlers }
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

export default function useLongPress(onLongPress, delay = 377) {
  const [isLongPressed, setIsLongPressed] = useState(false);
  const prefersReduced = useReducedMotion();
  const timerRef = useRef(null);

  const start = useCallback((e) => {
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true);
      onLongPress?.(e);
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressed(false);
  }, []);

  return {
    isLongPressed,
    handlers: {
      onPointerDown: start,
      onPointerUp: clear,
      onPointerLeave: clear,
    },
  };
}
