/**
 * useCanvasVisibility
 * Combines IntersectionObserver (pause when off-screen) with frame-skip rendering.
 * Renders every 5th requestAnimationFrame frame (~11fps at 60hz).
 * Used by all mini canvas previews.
 */

import { useRef, useEffect, useCallback } from 'react';
import useReducedMotion from './useReducedMotion';

export default function useCanvasVisibility() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const renderCallbackRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const setRenderCallback = useCallback((cb) => {
    renderCallbackRef.current = cb;
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    let running = true;
    let rafId = null;
    let frameCount = 0;
    let isVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.1 },
    );
    observer.observe(container);

    function loop() {
      if (!running) return;
      rafId = requestAnimationFrame(loop);
      frameCount++;
      if (frameCount % 5 !== 0) return;
      if (!isVisible) return;
      if (renderCallbackRef.current) {
        renderCallbackRef.current();
      }
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      // Cleanup order: stop loop -> cancel rAF -> null callback -> disconnect IO
      running = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      renderCallbackRef.current = null;
      observer.disconnect();
    };
  }, [prefersReduced]);

  return { containerRef, canvasRef, setRenderCallback, prefersReduced };
}
