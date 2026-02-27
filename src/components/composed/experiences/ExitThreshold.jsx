/**
 * ExitThreshold — soft transition between experience and app
 *
 * Overlays the experience canvas with a darkening veil, solfeggio glow pulse,
 * and letter-by-letter text before navigating to the destination.
 * Total duration: 2584ms (fib-sacred). Text pools: 13 lines (prime).
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks';
import { THRESHOLD_TEXT, FIBONACCI_TIMING } from '@/lib/constants';

const SOLFEGGIO_RGBA = {
  cyan: '34,211,238',
  indigo: '99,102,241',
  violet: '139,92,246',
  slate: '148,163,184',
};

function pickText(pool) {
  return pool[Math.floor(Date.now() / 60000) % pool.length];
}

function getDestinationType(destination) {
  if (destination.includes('check-in') || destination.includes('journal')) return 'journal';
  if (destination.includes('dashboard')) return 'dashboard';
  return 'tools';
}

export default function ExitThreshold({ destination, solfeggio = 'cyan', onNavigate }) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState('veil'); // veil → breath → text → navigate
  const [charCount, setCharCount] = useState(0);
  const timerRef = useRef(null);
  const rgb = SOLFEGGIO_RGBA[solfeggio] || SOLFEGGIO_RGBA.cyan;

  const type = getDestinationType(destination);
  const text = pickText(THRESHOLD_TEXT[type]);

  // Sequence: veil(377) → breath(610) → text(1597) → navigate
  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setPhase('breath'), 377));
    timers.push(setTimeout(() => setPhase('text'), 987));
    timers.push(setTimeout(() => setPhase('navigate'), 2584));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Navigate at the end
  useEffect(() => {
    if (phase === 'navigate') onNavigate(destination);
  }, [phase, onNavigate, destination]);

  // Letter-by-letter text reveal
  useEffect(() => {
    if (phase !== 'text' || !text || prefersReduced) return;
    if (charCount >= text.length) return;
    timerRef.current = setTimeout(() => setCharCount(c => c + 1), FIBONACCI_TIMING.micro);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, charCount, text, prefersReduced]);

  // For reduced motion, show all chars immediately
  const visibleChars = prefersReduced && phase === 'text' ? text.length : charCount;

  const showGlow = phase === 'breath' || phase === 'text' || phase === 'navigate';
  const showText = phase === 'text' || phase === 'navigate';
  const veilOpacity = phase === 'veil' ? 0 : phase === 'navigate' ? 1 : 0.92;

  const words = text.split(' ');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `rgba(3,7,18,${veilOpacity})`,
        transition: prefersReduced
          ? 'background 0.089s ease'
          : `background ${phase === 'navigate' ? '0.233s' : '0.377s'} ease`,
      }}
    >
      {/* Solfeggio glow */}
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 110,
            height: 110,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(${rgb},0.08) 0%, transparent 70%)`,
            animation: prefersReduced ? 'none' : 'thresholdPulse 0.610s ease-in-out',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Letter-by-letter text */}
      {showText && (
        <p
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
            letterSpacing: '0.08em',
            textAlign: 'center',
            lineHeight: 1.8,
            maxWidth: 440,
            padding: '0 26px',
            fontFamily: "'Josefin Sans', sans-serif",
            textShadow: `0 0 16px rgba(${rgb},0.3), 0 0 42px rgba(${rgb},0.1)`,
            position: 'relative',
            zIndex: 1,
          }}
          className="font-extralight text-slate-200"
        >
          {words.map((word, wi) => {
            const startIdx = words.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0);
            return (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split('').map((char, ci) => (
                  <span
                    key={ci}
                    style={{
                      opacity: startIdx + ci < visibleChars ? 1 : 0,
                      transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out',
                    }}
                  >
                    {char}
                  </span>
                ))}
                {wi < words.length - 1 && (
                  <span style={{ opacity: startIdx + word.length < visibleChars ? 1 : 0, transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out' }}>&nbsp;</span>
                )}
              </span>
            );
          })}
        </p>
      )}
    </div>
  );
}
