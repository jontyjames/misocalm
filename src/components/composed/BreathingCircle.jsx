/**
 * Breathing Circle Animation
 * Supports multiple breathing techniques: 4-7-8, Box, Physiological Sigh
 */

'use client';

import { useState, useEffect, useRef } from 'react';

// Breathing patterns configuration
const BREATH_PATTERNS = {
  '478': {
    name: '4-7-8 Breathing',
    phases: {
      GET_READY: { name: 'Empty your lungs', duration: 3, scale: 0.8, transitionMs: 3000, countdown: true },
      INHALE: { name: 'Breathe In', duration: 4, scale: 1.4, transitionMs: 4000, countdown: false },
      HOLD: { name: 'Hold', duration: 7, scale: 1.4, transitionMs: 200, countdown: false },
      EXHALE: { name: 'Breathe Out', duration: 8, scale: 0.8, transitionMs: 8000, countdown: false },
    },
    sequence: ['GET_READY', 'INHALE', 'HOLD', 'EXHALE'],
    cycleStart: 'INHALE',
  },
  'box': {
    name: 'Box Breathing',
    phases: {
      GET_READY: { name: 'Get ready', duration: 3, scale: 0.8, transitionMs: 3000, countdown: true },
      INHALE: { name: 'Breathe In', duration: 4, scale: 1.4, transitionMs: 4000, countdown: false },
      HOLD_IN: { name: 'Hold', duration: 4, scale: 1.4, transitionMs: 200, countdown: false },
      EXHALE: { name: 'Breathe Out', duration: 4, scale: 0.8, transitionMs: 4000, countdown: false },
      HOLD_OUT: { name: 'Hold', duration: 4, scale: 0.8, transitionMs: 200, countdown: false },
    },
    sequence: ['GET_READY', 'INHALE', 'HOLD_IN', 'EXHALE', 'HOLD_OUT'],
    cycleStart: 'INHALE',
  },
  'sigh': {
    name: 'Physiological Sigh',
    phases: {
      GET_READY: { name: 'Get ready', duration: 3, scale: 0.8, transitionMs: 3000, countdown: true },
      INHALE_1: { name: 'Breathe In', duration: 2, scale: 1.2, transitionMs: 2000, countdown: false },
      INHALE_2: { name: 'Sip More Air', duration: 1, scale: 1.4, transitionMs: 1000, countdown: false },
      EXHALE: { name: 'Long Exhale', duration: 6, scale: 0.8, transitionMs: 6000, countdown: false },
    },
    sequence: ['GET_READY', 'INHALE_1', 'INHALE_2', 'EXHALE'],
    cycleStart: 'INHALE_1',
  },
};

// Default to 4-7-8 for backwards compatibility
const DEFAULT_PHASES = BREATH_PATTERNS['478'].phases;

export default function BreathingCircle({
  isActive = false,
  onCycleComplete,
  onStart,
  size = 'lg',
  breathType = '478',
}) {
  const pattern = BREATH_PATTERNS[breathType] || BREATH_PATTERNS['478'];
  const PHASES = pattern.phases;
  const sequence = pattern.sequence;
  const cycleStart = pattern.cycleStart;

  const [phase, setPhase] = useState('GET_READY');
  const [secondCount, setSecondCount] = useState(3);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef(null);

  const sizes = {
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72',
  };

  // Move to next phase
  const goToNextPhase = () => {
    const currentIndex = sequence.indexOf(phase);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= sequence.length) {
      // Completed one full round - callback then start new cycle
      onCycleComplete?.();
      setPhase(cycleStart);
      setSecondCount(1);
    } else {
      setPhase(sequence[nextIndex]);
      setSecondCount(sequence[nextIndex] === 'GET_READY' ? PHASES['GET_READY'].duration : 1);
    }
  };

  // Handle the second-by-second counting
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Mark that we've started
    if (!hasStarted) {
      setHasStarted(true);
    }

    intervalRef.current = setInterval(() => {
      const currentPhaseData = PHASES[phase];

      if (currentPhaseData.countdown) {
        // Countdown (3, 2, 1) for GET_READY
        setSecondCount((current) => {
          if (current <= 1) {
            goToNextPhase();
            return 1;
          }
          return current - 1;
        });
      } else {
        // Count up (1, 2, 3...) for breathing phases
        setSecondCount((current) => {
          if (current >= currentPhaseData.duration) {
            goToNextPhase();
            return 1;
          }
          return current + 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, phase, hasStarted, PHASES]);

  // Reset when becoming inactive or breath type changes
  useEffect(() => {
    if (!isActive) {
      setPhase('GET_READY');
      setSecondCount(PHASES['GET_READY']?.duration || 3);
      setHasStarted(false);
    }
  }, [isActive, breathType, PHASES]);

  const currentPhase = PHASES[phase];

  return (
    <div className="flex flex-col items-center">
      {/* Circle */}
      <div
        className={`
          ${sizes[size]} rounded-full relative
          flex items-center justify-center
        `}
        style={{
          transform: isActive ? `scale(${currentPhase.scale})` : 'scale(1)',
          transition: `transform ${currentPhase.transitionMs}ms ease-in-out`,
        }}
      >
        {/* Phi outermost ring — third ring for torus cross-section */}
        <div
          className="absolute -inset-2 rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(139,92,246,0.04)',
            background: 'radial-gradient(circle, transparent 65%, rgba(99,102,241,0.03) 100%)',
          }}
        />

        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.25) 50%, transparent 70%)',
          }}
        />

        {/* Seed of Life — sacred geometry overlay, counter-rotating for torus hint */}
        <svg
          className="absolute inset-0 pointer-events-none seed-of-life"
          viewBox="0 0 100 100"
          style={{
            opacity: 0.05,
            animation: 'counter-rotate 89s linear infinite',
          }}
        >
          <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
          <circle cx="68" cy="50" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
          <circle cx="59" cy="65.6" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
          <circle cx="41" cy="65.6" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
          <circle cx="32" cy="50" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
          <circle cx="41" cy="34.4" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
          <circle cx="59" cy="34.4" r="18" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="0.4" />
        </svg>

        {/* Inner gradient ring */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 opacity-70" />

        {/* Center content */}
        <div
          className={`
            absolute inset-6 rounded-full bg-slate-900 flex flex-col items-center justify-center
            ${!isActive && onStart ? 'cursor-pointer hover:bg-slate-800 transition-colors' : ''}
          `}
          onClick={!isActive && onStart ? onStart : undefined}
        >
          {isActive ? (
            <>
              <span className="text-5xl font-thin text-white mb-1">
                {secondCount}
              </span>
              <span className={`text-sm font-light text-center px-2 ${phase === 'GET_READY' ? 'text-amber-300' : 'text-cyan-300'}`}>
                {currentPhase.name}
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-thin text-white mb-1">
                Ready
              </span>
              <span className="text-xs font-light text-slate-400">
                Tap to Start
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
