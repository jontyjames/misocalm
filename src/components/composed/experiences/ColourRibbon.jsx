/**
 * ColourRibbon — solfeggio colour picker for free play
 *
 * A thin gradient strip at the bottom of the screen. Drag to choose
 * a bloom colour. Feels like dipping your finger in ink.
 *
 * Palette: slate → indigo → violet → cyan → soft white
 * (5 anchor points, prime, solfeggio arc)
 *
 * Height: 3px (Tesla's 3). Touch target: 44px (a11y minimum).
 * Fade-in: 2584ms (fib-sacred).
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS } from '@/lib/constants';

// Solfeggio arc: 5 colour stops (prime)
const STOPS = [
  { pos: 0, r: 148, g: 163, b: 184 },    // slate-400  (396Hz)
  { pos: 0.25, r: 165, g: 180, b: 252 },  // indigo-300 (528Hz)
  { pos: 0.5, r: 196, g: 181, b: 253 },   // violet-300 (852Hz)
  { pos: 0.75, r: 103, g: 232, b: 249 },  // cyan-300   (741Hz)
  { pos: 1, r: 226, g: 232, b: 240 },     // slate-200  (963Hz)
];

function lerpColor(t) {
  const clamped = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < STOPS.length - 1 && STOPS[i + 1].pos < clamped) i++;
  const a = STOPS[i];
  const b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  const range = b.pos - a.pos || 1;
  const f = (clamped - a.pos) / range;
  return {
    r: Math.round(a.r + (b.r - a.r) * f),
    g: Math.round(a.g + (b.g - a.g) * f),
    b: Math.round(a.b + (b.b - a.b) * f),
  };
}

const GRADIENT = `linear-gradient(to right, ${STOPS.map(
  (s) => `rgb(${s.r},${s.g},${s.b}) ${s.pos * 100}%`
).join(', ')})`;

export default function ColourRibbon({ onChange, showHint = false, storageKey = STORAGE_KEYS.IMPERMANENCE_HUE }) {
  const [savedHue, setSavedHue] = useLocalStorage(storageKey, 0.5);
  const [position, setPosition] = useState(savedHue);
  const [visible, setVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  // Fade in after sacred delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2584);
    return () => clearTimeout(t);
  }, []);

  // Show hint briefly on second visit
  useEffect(() => {
    if (!showHint || !visible) return;
    const t1 = setTimeout(() => setHintVisible(true), 987);
    const t2 = setTimeout(() => setHintVisible(false), 987 + 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showHint, visible]);

  // Emit initial colour on mount
  useEffect(() => {
    onChange?.(lerpColor(savedHue));
  }, []);

  const getPosition = useCallback((clientX) => {
    const track = trackRef.current;
    if (!track) return 0.5;
    const rect = track.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const update = useCallback((clientX) => {
    const pos = getPosition(clientX);
    setPosition(pos);
    onChange?.(lerpColor(pos));
  }, [getPosition, onChange]);

  const handlePointerDown = useCallback((e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX);
  }, [update]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    update(e.clientX);
  }, [update]);

  const handlePointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    const pos = getPosition(e.clientX);
    setSavedHue(pos);
  }, [getPosition, setSavedHue]);

  const dotColor = lerpColor(position);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(68px, 12vh)',
        left: 0,
        right: 0,
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 2.584s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Hint text */}
      <p
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          marginBottom: 10,
          opacity: hintVisible ? 0.4 : 0,
          transition: 'opacity 0.987s ease',
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
        className="text-slate-400"
      >
        try the colours
      </p>

      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: 'calc(100% - 68px)',
          maxWidth: 'calc(100vw - 4rem)',
          height: 44,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        {/* Gradient line */}
        <div
          style={{
            width: '100%',
            height: 3,
            borderRadius: 3,
            background: GRADIENT,
            position: 'relative',
            opacity: 0.5,
          }}
        >
          {/* Position dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${position * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: `rgb(${dotColor.r},${dotColor.g},${dotColor.b})`,
              boxShadow: `0 0 10px rgba(${dotColor.r},${dotColor.g},${dotColor.b},0.4)`,
              transition: dragging.current ? 'none' : 'left 0.144s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export { lerpColor };
