/**
 * GroundingGuide — orchestrates the 5-4-3-2-1 grounding experience
 *
 * Text-driven sensory grounding. No canvas, no sounds.
 * The user looks at their real environment, not the screen.
 * Same architectural pattern as PulseGuide.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { ROUTES } from '@/lib/constants';
import useGroundingState from './useGroundingState';
import SenseProgress from './SenseProgress';
import GroundingComplete from './GroundingComplete';

let rippleId = 0;

export default function GroundingGuide() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const state = useGroundingState();
  const [ripples, setRipples] = useState([]);
  const rippleTimers = useRef([]);

  const handleTap = useCallback((e) => {
    if (!state.processTap()) return;

    // Spawn ripple at touch point
    if (!prefersReduced && state.currentSense) {
      const x = e.clientX;
      const y = e.clientY;
      const id = ++rippleId;
      const color = state.currentSense.color;

      setRipples((prev) => [...prev, { id, x, y, color }]);

      const timer = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 610); // fib-ease — ripple expands then fades
      rippleTimers.current.push(timer);
    }
  }, [state.processTap, state.currentSense, prefersReduced]);

  const handleLeave = useCallback(() => {
    rippleTimers.current.forEach(clearTimeout);
    state.clearSeqTimer();
    router.push(ROUTES.TOOLS);
  }, [state.clearSeqTimer, router]);

  const handleReturn = useCallback(() => {
    rippleTimers.current.forEach(clearTimeout);
    state.clearSeqTimer();
    router.push(ROUTES.DASHBOARD);
  }, [state.clearSeqTimer, router]);

  const handleJournal = useCallback(() => {
    rippleTimers.current.forEach(clearTimeout);
    state.clearSeqTimer();
    router.push(`${ROUTES.CHECK_IN}?from=breathwork`);
  }, [state.clearSeqTimer, router]);

  const senseColor = state.currentSense?.color || 'rgba(148,163,184,0.3)';

  return (
    <div style={{ background: '#030712', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Sense glow — subtle radial background that shifts per sense */}
      {state.started && !state.complete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            background: `radial-gradient(circle at 50% 60%, ${senseColor}08 0%, transparent 60%)`,
            transition: 'background 0.987s ease',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tap ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            left: r.x - 42,
            top: r.y - 42,
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${r.color}25 0%, transparent 70%)`,
            zIndex: 1,
            pointerEvents: 'none',
            animation: 'groundingRipple 0.610s ease-out forwards',
          }}
        />
      ))}

      {/* Full-screen tap target */}
      {state.started && !state.complete && (
        <div
          onClick={handleTap}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2,
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          aria-label="Tap to acknowledge"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              handleTap({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
            }
          }}
        />
      )}

      {/* Prompt screen */}
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
          ...(state.started ? { opacity: 0, visibility: 'hidden', pointerEvents: 'none' } : {}),
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
            animation: 'fadeInUp 1.597s ease-out 0.5s forwards',
          }}
        >
          {state.isFirstVisit ? 'A small practice' : 'Grounding'}
        </p>

        <div
          style={{
            fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
            letterSpacing: '0.06em',
            marginBottom: 42,
            opacity: 0,
            animation: 'fadeInUp 1.597s ease-out 1s forwards',
            textAlign: 'center',
            lineHeight: 1.8,
            maxWidth: 340,
            padding: '0 26px',
          }}
          className="font-extralight text-slate-400"
        >
          {state.isFirstVisit ? (
            <span className="block">about finding where you are</span>
          ) : (
            <>
              <span className="block">Welcome back.</span>
              <span className="block mt-2">Your senses remember.</span>
            </>
          )}
        </div>

        <button
          onClick={state.enter}
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
            animation: 'fadeInUp 1.597s ease-out 1.5s forwards',
            transition: 'all 0.377s ease',
            color: '#e2e8f0',
          }}
          className="font-extralight hover:bg-indigo-300/10 hover:border-indigo-300/40"
        >
          {state.isFirstVisit ? 'Begin' : 'Enter'}
        </button>
      </div>

      {/* Exit button */}
      {state.started && !state.complete && (
        <button
          onClick={handleLeave}
          aria-label="Leave experience"
          style={{
            position: 'fixed',
            top: 'clamp(16px, 3vh, 26px)',
            left: 16,
            zIndex: 8,
            opacity: 0,
            animation: 'fadeIn 0.987s ease-out 2s forwards',
          }}
          className="flex items-center gap-1 text-slate-500/50 text-xs font-light tracking-wider hover:text-slate-400/70 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          leave
        </button>
      )}

      {/* Guide text */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 'clamp(68px, 12vh, 110px)',
          paddingBottom: 42,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.4) 70%, transparent 100%)',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
            letterSpacing: '0.08em',
            textAlign: 'center',
            opacity: state.guideText ? 1 : 0,
            transform: state.guideText ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.987s ease, transform 0.987s ease, color 0.987s ease',
            lineHeight: 1.8,
            maxWidth: 440,
            padding: '0 26px',
            whiteSpace: 'pre-line',
            fontFamily: "'Josefin Sans', sans-serif",
          }}
          className={`font-extralight ${state.guideBright ? 'text-slate-200' : 'text-slate-300'}`}
        >
          {state.guideText}
        </p>
      </div>

      {/* Sense progress dots */}
      {state.started && state.currentSense && !state.complete && (
        <div
          style={{
            position: 'fixed',
            bottom: 'clamp(68px, 12vh, 110px)',
            left: 0,
            right: 0,
            zIndex: 3,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 0,
            animation: 'fadeIn 0.987s ease-out forwards',
          }}
        >
          <SenseProgress
            sense={state.currentSense}
            tapsCompleted={state.tapsCompleted}
          />
        </div>
      )}

      {/* Completion options */}
      {state.complete && (
        <GroundingComplete onJournal={handleJournal} onReturn={handleReturn} />
      )}

      {/* Reduced motion fallback */}
      {prefersReduced && state.started && !state.complete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <p className="text-slate-400 text-xs font-light tracking-widest mb-2">
              {state.currentSense ? state.currentSense.label : 'grounding'}
            </p>
            <p className="text-slate-300 text-sm font-light tracking-wider">{state.guideText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
