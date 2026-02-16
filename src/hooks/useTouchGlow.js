/**
 * useTouchGlow — radial glow from touch/click point
 * Glow origin at touch point, dissipates over 377ms (fib-flow)
 * Uses solfeggio colour based on context prop
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import useReducedMotion from './useReducedMotion';

const SOLFEGGIO_COLORS = {
  indigo: 'rgba(99,102,241,0.35)',
  violet: 'rgba(139,92,246,0.35)',
  cyan: 'rgba(34,211,238,0.35)',
  slate: 'rgba(148,163,184,0.25)',
};

export default function useTouchGlow(solfeggio = 'indigo') {
  const [glowPosition, setGlowPosition] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const prefersReduced = useReducedMotion();
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onPointerDown = useCallback((e) => {
    if (prefersReduced) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlowPosition({ x, y });
    setIsPressed(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [prefersReduced]);

  const onPointerUp = useCallback(() => {
    setIsPressed(false);
    timeoutRef.current = setTimeout(() => {
      setGlowPosition(null);
    }, 377); // fib-flow dissipation
  }, []);

  const glowStyle = glowPosition ? {
    background: `radial-gradient(circle 80px at ${glowPosition.x}px ${glowPosition.y}px, ${SOLFEGGIO_COLORS[solfeggio] || SOLFEGGIO_COLORS.indigo}, transparent)`,
    transition: isPressed ? 'none' : 'opacity 377ms ease-out',
    opacity: isPressed ? 1 : 0,
  } : null;

  return {
    glowPosition,
    isPressed,
    glowStyle,
    handlers: { onPointerDown, onPointerUp, onPointerLeave: onPointerUp },
  };
}
