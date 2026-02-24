/**
 * ScrollReveal — Reusable wrapper that fades/slides children into view on scroll.
 * Presets: fadeUp (default), fadeIn, scaleIn.
 * Uses Fibonacci timing from sacred geometry constants.
 */

'use client';

import { useScrollReveal } from '@/hooks';
import { FIBONACCI_TIMING } from '@/lib/constants';

const PRESETS = {
  fadeUp: {
    hidden: { opacity: 0, transform: 'translateY(16px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, transform: 'scale(0.95)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
};

export default function ScrollReveal({
  children,
  preset = 'fadeUp',
  delay = 0,
  duration = FIBONACCI_TIMING.ease,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
}) {
  const { ref, isVisible } = useScrollReveal({ threshold });
  const styles = PRESETS[preset] || PRESETS.fadeUp;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? styles.visible : styles.hidden),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
