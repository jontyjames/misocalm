/**
 * AnimatedCounter — Counts up from 0 to `value` on scroll reveal.
 * Uses Fibonacci timing for animation duration.
 * Respects reduced motion (shows final value immediately).
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '@/hooks';
import { FIBONACCI_TIMING } from '@/lib/constants';

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = FIBONACCI_TIMING.ceremony,
  className = '',
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
  const [displayValue, setDisplayValue] = useState(0);

  const animate = useCallback(() => {
    const start = performance.now();
    const numericValue = parseInt(value, 10);

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * numericValue));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [value, duration]);

  useEffect(() => {
    if (isVisible) animate();
  }, [isVisible, animate]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
