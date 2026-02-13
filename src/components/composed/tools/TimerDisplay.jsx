/**
 * TimerDisplay - Timer circle with phase-responsive gradient ring,
 * SVG progress arc, and text glow.
 *
 * ARC_STROKE = 3 (Tesla's 3 - the fundamental creative number).
 * Progress arc transitions at fib-move (233ms) for smooth interpolation.
 * Phase colour shifts at fib-ease (610ms) for conscious, settled transitions.
 * No phase label rendered inside - shown above in TimerPlayer.
 */

'use client';

import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';
import { PHASE_COLOURS } from '@/lib/timerConstants';

// SVG progress arc geometry
const ARC_SIZE = 188;
const ARC_CX = ARC_SIZE / 2;
const ARC_STROKE = 3; // Tesla's 3: the creative prime
const ARC_R = ARC_CX - ARC_STROKE;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_R;

// Ring opacity: active phases are brighter (0.8/0.6/0.4), resting dimmer (0.7/0.5/0.4)
const ACTIVE_RING = { from: 0.8, via: 0.6, to: 0.4 };
const RESTING_RING = { from: 0.7, via: 0.5, to: 0.4 };

export default function TimerDisplay({ formattedTime, countdownNumber, phase, progress = 0 }) {
  const isCountdown = phase === 'countdown';
  const isActive = phase !== 'idle' && phase !== 'complete';
  const color = PHASE_COLOURS[phase] || PHASE_COLOURS.idle;
  const ring = isActive ? ACTIVE_RING : RESTING_RING;
  const t = `${FIBONACCI_TIMING.ease}ms`;

  const dashOffset = ARC_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative w-56 h-56 rounded-full flex items-center justify-center">
      {/* Phi outermost ring - phase-tinted boundary */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: `-${PHI_SCALE[1]}px`,
          border: `1px solid rgba(${color},0.06)`,
          background: `radial-gradient(circle, transparent 65%, rgba(${color},0.04) 100%)`,
          transition: `all ${t} ease-in-out`,
        }}
      />

      {/* Outer glow - phase-coloured wash */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${color},${isActive ? 0.3 : 0.2}) 0%, rgba(${color},0.12) 50%, transparent 70%)`,
          transition: `background ${t} ease-in-out`,
        }}
      />

      {/* Gradient ring - shifts with phase at phi-layered opacities */}
      <div
        className="absolute rounded-full"
        style={{
          inset: `${PHI_SCALE[1]}px`,
          background: `linear-gradient(135deg, rgba(${color},${ring.from}), rgba(${color},${ring.via}) 50%, rgba(${color},${ring.to}))`,
          transition: `background ${t} ease-in-out`,
        }}
      />

      {/* SVG progress arc - clockwise from 12 o'clock */}
      {isActive && (
        <svg
          className="absolute pointer-events-none"
          width={ARC_SIZE}
          height={ARC_SIZE}
          viewBox={`0 0 ${ARC_SIZE} ${ARC_SIZE}`}
          style={{
            transform: 'rotate(-90deg)',
            filter: `drop-shadow(0 0 ${PHI_SCALE[0]}px rgba(${color},0.5))`,
          }}
        >
          {/* Background track */}
          <circle
            cx={ARC_CX}
            cy={ARC_CX}
            r={ARC_R}
            fill="none"
            stroke={`rgba(${color},0.08)`}
            strokeWidth={ARC_STROKE}
          />
          {/* Progress fill */}
          <circle
            cx={ARC_CX}
            cy={ARC_CX}
            r={ARC_R}
            fill="none"
            stroke={`rgba(${color},0.7)`}
            strokeWidth={ARC_STROKE}
            strokeLinecap="round"
            strokeDasharray={ARC_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transition: `stroke-dashoffset ${FIBONACCI_TIMING.move}ms linear, stroke ${t} ease-in-out`,
            }}
          />
        </svg>
      )}

      {/* Dark centre with subtle phase wash */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          inset: `${PHI_SCALE[3]}px`,
          background: `radial-gradient(circle, rgba(${color},${isActive ? 0.06 : 0.02}) 0%, rgba(15,23,42,0.98) 60%, rgb(15,23,42) 100%)`,
          transition: `background ${t} ease-in-out`,
        }}
      >
        {isCountdown ? (
          <span
            className="text-6xl text-white leading-none"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              animation: `fadeIn ${FIBONACCI_TIMING.flow}ms ease-out`,
              paddingBottom: '0.05em',
            }}
          >
            {countdownNumber}
          </span>
        ) : (
          <span
            className="text-4xl text-white leading-none"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              textShadow: isActive
                ? `0 0 ${PHI_SCALE[2]}px rgba(${color},0.4), 0 0 ${PHI_SCALE[4]}px rgba(${color},0.15)`
                : 'none',
              transition: `text-shadow ${t} ease-in-out`,
              paddingBottom: '0.05em',
            }}
          >
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
}
