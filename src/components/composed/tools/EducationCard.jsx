/**
 * EducationCard
 * Single education module card with Glass Artisan treatment.
 * Touch glow, spring scale, cursor blink, stagger animation.
 * Terminal aesthetic: emerald (#00ff41), not standard Sacred Glass.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useTouchGlow } from '@/hooks';
import useReducedMotion from '@/hooks/useReducedMotion';
import { PHI_SCALE } from '@/lib/constants';

export default function EducationCard({ mod, voicesRead, isComplete, index }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const springTimer = useRef(null);

  // Touch glow — emerald variant (custom, not in SOLFEGGIO_COLORS)
  const { glowPosition, isPressed, handlers } = useTouchGlow('slate');
  // We override the glow style with emerald
  const emeraldGlowStyle = glowPosition ? {
    background: `radial-gradient(circle 100px at ${glowPosition.x}px ${glowPosition.y}px, rgba(0,255,65,0.15), transparent)`,
    transition: isPressed ? 'none' : 'opacity 377ms ease-out',
    opacity: isPressed ? 1 : 0,
  } : null;

  // Stagger mount animation
  useEffect(() => {
    if (prefersReduced) {
      setMounted(true);
      return;
    }
    const t = setTimeout(() => setMounted(true), index * 55);
    return () => clearTimeout(t);
  }, [index, prefersReduced]);

  // Spring scale on press/release
  const handlePointerDown = useCallback((e) => {
    handlers.onPointerDown(e);
    if (prefersReduced) return;
    clearTimeout(springTimer.current);
    setScale(0.97);
  }, [handlers, prefersReduced]);

  const handlePointerUp = useCallback((e) => {
    handlers.onPointerUp(e);
    if (prefersReduced) {
      setScale(1);
      return;
    }
    setScale(1.02);
    springTimer.current = setTimeout(() => setScale(1), 233);
  }, [handlers, prefersReduced]);

  const handlePointerLeave = useCallback((e) => {
    handlers.onPointerLeave(e);
    clearTimeout(springTimer.current);
    setScale(1);
  }, [handlers]);

  return (
    <div
      className="shrink-0"
      style={{
        width: 157,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(6px)',
        transition: prefersReduced ? 'none' : 'opacity 377ms ease, transform 377ms ease',
      }}
    >
      <button
        onClick={() => router.push(`/tools/education/${mod.slug}`)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full text-left rounded-xl p-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(0,255,65,0.04) 0%, rgba(3,7,18,0.9) 100%)',
          border: `1px solid ${isComplete ? 'rgba(0,255,65,0.25)' : 'rgba(0,255,65,0.1)'}`,
          boxShadow: isComplete
            ? '0 0 16px rgba(0,255,65,0.12), inset 0 -1px 0 0 rgba(0,255,65,0.04), 0 4px 20px rgba(0,0,0,0.3)'
            : '0 0 12px rgba(0,255,65,0.04), inset 0 -1px 0 0 rgba(0,255,65,0.04), 0 4px 20px rgba(0,0,0,0.3)',
          transform: `scale(${scale})`,
          transition: 'transform 89ms ease-out, border-color 377ms ease, box-shadow 377ms ease',
        }}
      >
        {/* Glass highlight — top edge */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent 10%, rgba(0,255,65,0.06) 50%, transparent 90%)',
          }}
        />

        {/* Touch glow overlay */}
        {emeraldGlowStyle && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={emeraldGlowStyle}
          />
        )}

        {/* Ambient border breathe */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: '1px solid rgba(0,255,65,0.06)',
            animation: prefersReduced ? 'none' : 'glowBreathe 7.1s ease-in-out infinite',
          }}
        />

        {/* Terminal cursor hint */}
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontWeight: 300,
            fontSize: 20,
            color: 'rgba(0,255,65,0.4)',
            lineHeight: 1,
            marginBottom: PHI_SCALE[0],
            animation: prefersReduced || isComplete ? 'none' : 'terminalBlink 1.597s step-end infinite',
          }}
        >
          &gt;_
        </div>

        <h3
          className="text-white text-sm truncate w-full"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 300,
            marginBottom: PHI_SCALE[0],
          }}
        >
          {mod.title}
        </h3>
        <p
          className="text-xs font-light line-clamp-2"
          style={{
            color: 'rgba(0,255,65,0.5)',
            marginBottom: PHI_SCALE[0],
          }}
        >
          {mod.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-xs flex items-center"
            style={{
              color: 'rgba(0,255,65,0.35)',
              gap: PHI_SCALE[0],
            }}
          >
            <Clock className="w-3 h-3" />
            {mod.duration}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 300,
              fontSize: 10,
              color: isComplete ? '#00ff41' : 'rgba(0,255,65,0.3)',
              textShadow: isComplete ? '0 0 10px rgba(0,255,65,0.4)' : 'none',
            }}
          >
            {voicesRead}/3
          </span>
        </div>
      </button>
    </div>
  );
}
