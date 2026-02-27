/**
 * SanctuaryPrompt — entry screen for the Sanctuary experience
 *
 * Frozen ref pattern prevents content flash during fade-out.
 * Slate solfeggio accent (396Hz — liberation from fear).
 */

'use client';

import { useRef } from 'react';

export default function SanctuaryPrompt({ isFirstVisit, visits, onEnter, denied, visible }) {
  const frozenRef = useRef({ isFirstVisit, visits });
  if (visible) frozenRef.current = { isFirstVisit, visits };
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
        {show.isFirstVisit ? 'A quiet shelter' : 'Sanctuary'}
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
          <span className="block">about breath, and what it builds</span>
        ) : (
          <>
            <span className="block">Welcome back.</span>
            <span className="block mt-2">Same breath, new walls.</span>
            {show.visits > 0 && (
              <span className="block mt-4 text-slate-300/50 text-xs">
                visit {show.visits + 1}
              </span>
            )}
          </>
        )}
      </div>

      <p
        style={{
          fontSize: 'clamp(0.7rem, 1.5vw, 0.78rem)',
          letterSpacing: '0.04em',
          marginBottom: 26,
          opacity: 0,
          animation: 'fadeInUp 1.597s ease-out 0.987s forwards',
          textAlign: 'center',
          maxWidth: 280,
          padding: '0 26px',
        }}
        className="font-extralight text-slate-400"
      >
        Works best in a quiet space without much background noise
      </p>

      <button
        onClick={onEnter}
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: '0.9rem',
          letterSpacing: '0.12em',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          background: 'rgba(148, 163, 184, 0.04)',
          padding: '16px 42px',
          borderRadius: 999,
          cursor: 'pointer',
          opacity: 0,
          animation: 'fadeInUp 1.597s ease-out 1.597s forwards',
          transition: 'all 0.377s ease',
          color: '#e2e8f0',
        }}
        className="font-extralight hover:bg-slate-400/10 hover:border-slate-400/40"
      >
        {show.isFirstVisit ? 'Begin' : 'Enter'}
      </button>

      {denied && (
        <p className="text-slate-400/60 text-xs font-light mt-4 text-center" style={{ maxWidth: 280, padding: '0 26px' }}>
          Microphone access is needed for this experience
        </p>
      )}
    </div>
  );
}
