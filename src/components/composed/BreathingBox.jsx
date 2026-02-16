/**
 * Breathing Box Animation
 * Box breathing with animated border fills and soft ambient glow
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

const PHASES = {
  GET_READY: { name: 'Get Ready', duration: 3, countdown: true },
  INHALE: { name: 'Breathe In', duration: 4, countdown: false },
  HOLD_IN: { name: 'Hold', duration: 4, countdown: false },
  EXHALE: { name: 'Breathe Out', duration: 4, countdown: false },
  HOLD_OUT: { name: 'Hold', duration: 4, countdown: false },
};

const SEQUENCE = ['GET_READY', 'INHALE', 'HOLD_IN', 'EXHALE', 'HOLD_OUT'];

export default function BreathingBox({
  isActive = false,
  onCycleComplete,
  onPhaseChange,
  onStart,
  size: sizeProp,
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 375
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const size = useMemo(() => {
    if (sizeProp != null) return sizeProp;
    return Math.min(220, windowWidth - 120);
  }, [sizeProp, windowWidth]);

  const [phase, setPhase] = useState('GET_READY');
  const [secondCount, setSecondCount] = useState(3);
  const [progress, setProgress] = useState(1);

  const animationRef = useRef(null);
  const phaseStartTimeRef = useRef(null);
  const onCycleCompleteRef = useRef(onCycleComplete);

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  }, [onCycleComplete]);

  // Notify parent of phase changes to drive ambient effects
  useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(phase, 1.0);
    }
  }, [phase, isActive, onPhaseChange]);

  const strokeWidth = 12;
  const padding = 2;
  const innerSize = size - padding * 2;
  const sideLen = innerSize - strokeWidth;
  const fillColor = '#00ff9d';

  // Reset when becoming inactive
  useEffect(() => {
    if (!isActive) {
      setPhase('GET_READY');
      setSecondCount(3);
      setProgress(1);
      phaseStartTimeRef.current = null;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isActive]);

  // Main animation loop
  useEffect(() => {
    if (!isActive) return;

    const currentPhaseData = PHASES[phase];
    const phaseDurationMs = currentPhaseData.duration * 1000;
    phaseStartTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - phaseStartTimeRef.current;
      const rawProgress = Math.min(elapsed / phaseDurationMs, 1);
      // GET_READY fills the perimeter in reverse; breathing phases always fill forward
      const newProgress = (phase === 'GET_READY') ? (1 - rawProgress) : rawProgress;
      setProgress(newProgress);

      const currentSecond = currentPhaseData.countdown
        ? Math.ceil(currentPhaseData.duration - (elapsed / 1000))
        : Math.floor(elapsed / 1000) + 1;
      setSecondCount(Math.max(1, Math.min(currentSecond, currentPhaseData.duration)));

      if (rawProgress >= 1) {
        const currentIndex = SEQUENCE.indexOf(phase);
        const nextIndex = currentIndex + 1;
        if (nextIndex >= SEQUENCE.length) {
          onCycleCompleteRef.current?.();
          setPhase('INHALE');
          setProgress(0);
        } else {
          const nextPhase = SEQUENCE[nextIndex];
          setPhase(nextPhase);
          setProgress(nextPhase === 'GET_READY' ? 1 : 0);
        }
      } else {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, phase]);

  const currentPhase = PHASES[phase];

  // Calculate fill lengths for each side
  const getFills = () => {
    if (phase === 'GET_READY') {
      const totalFilled = progress * 4;
      return {
        bottom: Math.min(1, Math.max(0, totalFilled)) * sideLen,
        right: Math.min(1, Math.max(0, totalFilled - 1)) * sideLen,
        top: Math.min(1, Math.max(0, totalFilled - 2)) * sideLen,
        left: Math.min(1, Math.max(0, totalFilled - 3)) * sideLen,
      };
    }
    const phaseIndex = SEQUENCE.indexOf(phase);
    const fills = { left: 0, top: 0, right: 0, bottom: 0 };
    if (phaseIndex > 1) fills.left = sideLen;
    if (phaseIndex > 2) fills.top = sideLen;
    if (phaseIndex > 3) fills.right = sideLen;
    if (phase === 'INHALE') fills.left = progress * sideLen;
    else if (phase === 'HOLD_IN') fills.top = progress * sideLen;
    else if (phase === 'EXHALE') fills.right = progress * sideLen;
    else if (phase === 'HOLD_OUT') fills.bottom = progress * sideLen;
    return fills;
  };

  const fills = getFills();
  const x1 = padding + strokeWidth / 2;
  const y1 = padding + strokeWidth / 2;
  const x2 = x1 + sideLen;
  const y2 = y1 + sideLen;

  // Helper to render a fill line for a given side
  const renderFill = (side) => {
    if (fills[side] <= 0) return null;
    const isReady = phase === 'GET_READY';
    const coords = {
      bottom: isReady
        ? { x1: x1, y1: y2, x2: x1 + fills.bottom, y2: y2 }
        : { x1: x2, y1: y2, x2: x2 - fills.bottom, y2: y2 },
      right: isReady
        ? { x1: x2, y1: y2, x2: x2, y2: y2 - fills.right }
        : { x1: x2, y1: y1, x2: x2, y2: y1 + fills.right },
      top: isReady
        ? { x1: x2, y1: y1, x2: x2 - fills.top, y2: y1 }
        : { x1: x1, y1: y1, x2: x1 + fills.top, y2: y1 },
      left: isReady
        ? { x1: x1, y1: y1, x2: x1, y2: y1 + fills.left }
        : { x1: x1, y1: y2, x2: x1, y2: y2 - fills.left },
    };
    return (
      <line
        {...coords[side]}
        stroke={fillColor}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: size, height: size }}
        onClick={!isActive && onStart ? onStart : undefined}
      >
        {/* Soft ambient glow behind the box */}
        <div
          className="absolute -inset-[16px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
            animation: 'solfeggio-breathe-741 5.3s ease-in-out infinite',
          }}
        />

        {/* SVG breathing animation layer */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 z-10"
        >
          {/* Box outline */}
          <rect
            x={x1} y={y1}
            width={sideLen} height={sideLen}
            fill="none"
            stroke="rgba(100, 116, 139, 0.4)"
            strokeWidth={strokeWidth}
          />
          {/* Animated sides - cosmic green fill */}
          {renderFill('bottom')}
          {renderFill('right')}
          {renderFill('top')}
          {renderFill('left')}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer">
          {isActive ? (
            <>
              <span className="text-5xl font-thin text-white mb-2">
                {secondCount}
              </span>
              <span className={`text-base font-light text-center px-4 ${
                phase === 'GET_READY' ? 'text-amber-300' : 'text-cyan-300'
              }`}>
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
