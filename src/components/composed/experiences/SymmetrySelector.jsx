/**
 * SymmetrySelector — free play control for Mandala experience
 *
 * Lets users choose symmetry fold count. All values prime.
 * Appears during FREE_PLAY phase alongside ColourRibbon.
 */

'use client';

import { useState, useEffect } from 'react';

const SYMMETRY_OPTIONS = [5, 7, 11, 13]; // all prime

export default function SymmetrySelector({ value = 11, onChange }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2584);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 26,
        right: 26,
        zIndex: 5,
        display: 'flex',
        gap: 10,
        opacity: visible ? 1 : 0,
        transition: 'opacity 2.584s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {SYMMETRY_OPTIONS.map((n) => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: `1px solid ${n === value ? 'rgba(165, 180, 252, 0.4)' : 'rgba(148, 163, 184, 0.15)'}`,
            background: n === value ? 'rgba(165, 180, 252, 0.08)' : 'transparent',
            color: n === value ? '#a5b4fc' : '#64748b',
            fontSize: '0.7rem',
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            cursor: 'pointer',
            transition: 'all 0.377s ease',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
