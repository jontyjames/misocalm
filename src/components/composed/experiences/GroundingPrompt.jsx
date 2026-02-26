/**
 * GroundingPrompt — entry screen for the grounding experience
 *
 * Extracted from GroundingGuide to keep under 300-line limit.
 * Shows title, subtitle, and begin/enter button.
 */

'use client';

import { useRef } from 'react';

export default function GroundingPrompt({ isFirstVisit, onEnter, visible }) {
  // Freeze content when fading out so it doesn't flash to return-visit text
  const frozenRef = useRef({ isFirstVisit });
  if (visible) frozenRef.current = { isFirstVisit };
  const show = frozenRef.current;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030712',
        transition: 'opacity 1.597s ease, visibility 1.597s ease',
        ...(!visible ? { opacity: 0, visibility: 'hidden', pointerEvents: 'none' } : {}),
      }}
    >
      <p
        className="tracking-widest text-slate-200"
        style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          marginBottom: 10,
          opacity: 0,
          animation: 'fadeInUp 1.597s ease-out 0.610s forwards',
        }}
      >
        {show.isFirstVisit ? 'A small practice' : 'Grounding'}
      </p>

      <div
        style={{
          fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
          letterSpacing: '0.06em',
          marginBottom: 42,
          opacity: 0,
          animation: 'fadeInUp 1.597s ease-out 0.987s forwards',
          textAlign: 'center',
          lineHeight: 1.8,
          maxWidth: 340,
          padding: '0 26px',
        }}
        className="font-extralight text-slate-400"
      >
        {show.isFirstVisit ? (
          <span className="block">about finding where you are</span>
        ) : (
          <>
            <span className="block">Welcome back.</span>
            <span className="block mt-2">Your senses remember.</span>
          </>
        )}
      </div>

      <button
        onClick={onEnter}
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: '0.9rem',
          letterSpacing: '0.12em',
          border: '1px solid rgba(165, 180, 252, 0.25)',
          background: 'rgba(165, 180, 252, 0.04)',
          padding: '14px 42px',
          borderRadius: 999,
          cursor: 'pointer',
          opacity: 0,
          animation: 'fadeInUp 1.597s ease-out 1.597s forwards',
          transition: 'all 0.377s ease',
          color: '#e2e8f0',
        }}
        className="font-extralight hover:bg-indigo-300/10 hover:border-indigo-300/40"
      >
        {show.isFirstVisit ? 'Begin' : 'Enter'}
      </button>
    </div>
  );
}
