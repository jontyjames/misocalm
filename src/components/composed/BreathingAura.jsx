'use client';

import { useState, useEffect, useRef } from 'react';

const INHALE_PHASES = ['INHALE', 'INHALE_1', 'INHALE_2'];
const HOLD_PHASES = ['HOLD', 'HOLD_IN', 'HOLD_OUT'];
const EXHALE_PHASES = ['EXHALE'];

const VIOLET = { r: 139, g: 92, b: 246 };
const CYAN = { r: 34, g: 211, b: 238 };

const ORBIT_DURATIONS = [7.1, 11.3, 13.7, 17.1, 19.3, 23.1, 29.3];
const PARTICLE_COUNT = 7;
const BASE_ORBIT_RADIUS = 110;

function phaseColor(phase) {
  if (INHALE_PHASES.includes(phase)) return VIOLET;
  if (EXHALE_PHASES.includes(phase)) return CYAN;
  return { r: 86, g: 152, b: 242 }; // blend for hold/ready
}

function phaseOpacity(phase, isActive) {
  if (!isActive) return 0.15;
  if (phase === 'GET_READY') return 0.1;
  if (INHALE_PHASES.includes(phase)) return 0.45;
  if (HOLD_PHASES.includes(phase)) return 0.3;
  return 0.25;
}

export default function BreathingAura({ phase, isActive, breathScale = 1, shape = 'circle', children }) {
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);
  const prevPhase = useRef(phase);

  // Spawn ripple on phase change
  useEffect(() => {
    if (prevPhase.current === phase) return;
    prevPhase.current = phase;

    const id = rippleId.current++;
    setRipples(prev => {
      const next = [...prev, { id, phase }];
      return next.length > 3 ? next.slice(-3) : next;
    });

    const timer = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 2584);

    return () => clearTimeout(timer);
  }, [phase]);

  const color = phaseColor(phase);
  const bloomOpacity = phaseOpacity(phase, isActive);
  const isInhale = INHALE_PHASES.includes(phase);
  const isExhale = EXHALE_PHASES.includes(phase);
  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-none';

  // Particle state derived from phase
  const particleOrbitOffset = isActive ? (isInhale ? 10 : isExhale ? -6 : 0) : 0;
  const particleOpacity = isActive ? (isInhale ? 0.6 : isExhale ? 0.4 : 0.5) : 0.3;
  const particleSpeed = isActive ? (isInhale ? 0.85 : isExhale ? 1.15 : 1) : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ padding: 68 }}>
      <style>{`
        @keyframes ripple-expand {
          0% { transform: scale(1); opacity: 0.12; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
        }
      `}</style>

      {/* Bloom Glow */}
      <div
        className={`absolute ${rounded}`}
        style={{
          inset: -42,
          background: `radial-gradient(ellipse at center, rgba(${color.r},${color.g},${color.b},${bloomOpacity}) 0%, rgba(${color.r},${color.g},${color.b},0) 70%)`,
          transition: 'background 2584ms ease-in-out, opacity 2584ms ease-in-out',
          opacity: bloomOpacity > 0 ? 1 : 0,
          pointerEvents: 'none',
        }}
      />

      {/* Concentric Ripples */}
      {ripples.map(ripple => {
        const rc = phaseColor(ripple.phase);
        return (
          <div
            key={ripple.id}
            className={`absolute ${rounded}`}
            style={{
              inset: 0,
              border: `1px solid rgba(${rc.r},${rc.g},${rc.b},0.12)`,
              animation: 'ripple-expand 2584ms ease-out forwards',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Breathing Shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -16,
          left: '10%',
          right: '10%',
          height: 26,
          background: 'radial-gradient(ellipse 60% 30% at 50% 50%, rgba(0,0,0,0.3) 0%, transparent 100%)',
          transform: `scaleX(${breathScale})`,
          transition: 'transform 2584ms ease-in-out',
          opacity: 0.35,
        }}
      />

      {/* Particle Drift */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const isViolet = i % 2 === 0;
        const pc = isViolet ? VIOLET : CYAN;
        const radius = BASE_ORBIT_RADIUS + (i * 3) + particleOrbitOffset;
        const duration = ORBIT_DURATIONS[i] * particleSpeed;
        const startAngle = i * (360 / PARTICLE_COUNT);

        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              width: 2,
              height: 2,
              top: '50%',
              left: '50%',
              marginTop: -1,
              marginLeft: -1,
              '--orbit-radius': `${radius}px`,
              animation: `orbit ${duration}s linear infinite`,
              animationDelay: `${-(duration * startAngle) / 360}s`,
              opacity: particleOpacity,
              transition: 'opacity 2584ms ease-in-out',
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 2,
                height: 2,
                background: `rgba(${pc.r},${pc.g},${pc.b},${isViolet ? 0.6 : 0.5})`,
                boxShadow: `0 0 6px rgba(${pc.r},${pc.g},${pc.b},0.4)`,
              }}
            />
          </div>
        );
      })}

      {/* Children (BreathingCircle or BreathingBox) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
