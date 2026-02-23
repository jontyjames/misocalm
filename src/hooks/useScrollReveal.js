/**
 * useScrollReveal — IntersectionObserver hook for scroll-triggered reveals.
 * Returns a ref to attach to the target element and an `isVisible` boolean.
 * Respects prefers-reduced-motion: instantly shows content if enabled.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

export default function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, reducedMotion]);

  return { ref, isVisible };
}
