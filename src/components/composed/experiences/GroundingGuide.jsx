/**
 * GroundingGuide Ã¢â‚¬â€ orchestrates the 5-4-3-2-1 grounding experience
 *
 * Text-driven sensory grounding with sacred geometry generative art.
 * Each tap spawns a sacred shape on the canvas. By the end of 15 taps,
 * the user has painted a unique piece of art through their grounding.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useReducedMotion } from '@/hooks';
import { ROUTES, VOID_BLACK, VOID_BLACK_RGB } from '@/lib/constants';
import { generateComposition, generatePlayLayer } from '@/lib/groundingCompositions';
import { CHECK_IN_SOURCE, buildCheckInRoute, getCheckInOriginFromRouteContext } from '@/lib/checkInContext';
import { getContextualBackRoute } from '@/lib/routeContext';
import useGroundingState, { TIERS } from './useGroundingState';
import SenseProgress from './SenseProgress';
import GroundingComplete from './GroundingComplete';
import GroundingCanvas from './GroundingCanvas';
import GroundingPrompt from './GroundingPrompt';
import GroundingIntro from './GroundingIntro';
import ExitThreshold from './ExitThreshold';
import GroundingRipples from './GroundingRipples';

let rippleId = 0;

// Transition durations per timing tier
const TIER_TRANSITIONS = {
  SLOW:     { in: '0.987s', out: '0.610s' },
  STANDARD: { in: '0.987s', out: '0.987s' },
  QUICK:    { in: '0.377s', out: '0.233s' },
  FLASH:    { in: '0.089s', out: '0.144s' },
};

const TEXT_SHADOW = `0 0 16px rgba(${VOID_BLACK_RGB},0.8), 0 0 42px rgba(${VOID_BLACK_RGB},0.5)`;

export default function GroundingGuide() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();
  const state = useGroundingState();
  const [ripples, setRipples] = useState([]);
  const [composition, setComposition] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exitTransition, setExitTransition] = useState(null);
  const rippleTimers = useRef([]);
  const backRoute = getContextualBackRoute(searchParams, ROUTES.TOOLS);
  const checkInOrigin = getCheckInOriginFromRouteContext(searchParams);

  // Generate composition on enter, register tap callback to reveal next shape
  useEffect(() => {
    if (state.started && !composition) {
      setComposition(generateComposition(window.innerWidth, window.innerHeight));
    }
  }, [state.started, composition]);
  useEffect(() => {
    state.setOnTap(() => {
      setRevealedCount((c) => c + 1);
    });
  }, [state.setOnTap]);

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
      }, 610);
      rippleTimers.current.push(timer);
    }
  }, [state.processTap, state.currentSense, prefersReduced]);

  const handleLeave = useCallback(() => {
    rippleTimers.current.forEach(clearTimeout);
    state.clearSeqTimer();
    router.push(backRoute);
  }, [backRoute, state.clearSeqTimer, router]);

  const handleReturn = useCallback(() => {
    rippleTimers.current.forEach(clearTimeout);
    state.clearSeqTimer();
    setExitTransition({ destination: ROUTES.DASHBOARD, solfeggio: 'cyan' });
  }, [state.clearSeqTimer]);

  const handleJournal = useCallback(() => {
    rippleTimers.current.forEach(clearTimeout);
    state.clearSeqTimer();
    setExitTransition({ destination: buildCheckInRoute(CHECK_IN_SOURCE.GROUNDING, checkInOrigin), solfeggio: 'cyan' });
  }, [checkInOrigin, state.clearSeqTimer]);

  const handlePlay = useCallback(() => setPlaying(true), []);
  const handlePlayTap = useCallback((e) => {
    if (!composition) return;
    const layer = generatePlayLayer();
    setComposition(prev => ({ ...prev, layers: [...prev.layers, layer] }));
    setRevealedCount(c => c + 1);
    if (!prefersReduced) {
      const id = ++rippleId;
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY, color: 'rgb(226,232,240)' }]);
      const timer = setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 610);
      rippleTimers.current.push(timer);
    }
  }, [composition, prefersReduced]);

  const handlePlayUndo = useCallback(() => {
    if (!composition || revealedCount <= 15) return; // can't undo the original 15
    setComposition(prev => ({ ...prev, layers: prev.layers.slice(0, -1) }));
    setRevealedCount(c => c - 1);
  }, [composition, revealedCount]);
  const senseColor = state.currentSense?.color || 'rgba(148,163,184,0.3)';
  const tier = state.guideTier || TIERS.STANDARD;
  const transitions = TIER_TRANSITIONS[tier] || TIER_TRANSITIONS.STANDARD;

  return (
    <div style={{ background: VOID_BLACK, minHeight: '100dvh' }}>
      {state.started && composition && (
        <GroundingCanvas composition={composition} revealedCount={revealedCount} />
      )}

      {/* Sense glow Ã¢â‚¬â€ subtle radial background that shifts per sense */}
      {state.started && !state.complete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            background: `radial-gradient(circle at 50% 60%, ${senseColor}12 0%, transparent 60%)`,
            transition: 'background 0.987s ease',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tap ripples Ã¢â‚¬â€ 110px phi scale, 610ms fib fade */}
      <GroundingRipples ripples={ripples} />
      {/* Full-screen tap target Ã¢â‚¬â€ active during grounding and play mode */}
      {state.started && (!state.complete || playing) && (
        <div
          onClick={playing ? handlePlayTap : handleTap}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: playing ? 6 : 2,
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          aria-label={playing ? 'Tap to add to your creation' : 'Tap to acknowledge'}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              const synth = { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 };
              playing ? handlePlayTap(synth) : handleTap(synth);
            }
          }}
        />
      )}

      {/* Prompt screen (extracted component) */}
      <GroundingPrompt
        isFirstVisit={state.isFirstVisit}
        visits={state.visits}
        onEnter={state.enter}
        visible={!state.started}
      />

      {/* Exit button */}
      {state.started && !state.complete && (
        <button
          onClick={handleLeave}
          aria-label="Leave experience"
          style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top, 0px) + clamp(16px, 3vh, 26px))',
            left: 16,
            zIndex: 8,
            opacity: 0,
            animation: 'fadeIn 0.610s ease-out 0.377s forwards',
          }}
          className="flex items-center gap-1 text-slate-400/40 text-xs font-light tracking-wider hover:text-slate-300/60 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          leave
        </button>
      )}

      {/* Intro text Ã¢â‚¬â€ centred, larger, letter-by-letter reveal */}
      {state.introActive && <GroundingIntro text={state.guideText} />}

      {/* Body text zone Ã¢â‚¬â€ top of screen, shown during active grounding */}
      {!state.introActive && (
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
            background: `linear-gradient(to bottom, rgba(${VOID_BLACK_RGB},0.92) 0%, rgba(${VOID_BLACK_RGB},0.7) 50%, rgba(${VOID_BLACK_RGB},0.3) 80%, transparent 100%)`,
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              letterSpacing: '0.08em',
              textAlign: 'center',
              opacity: state.guideText ? 1 : 0,
              transform: state.guideText ? 'translateY(0)' : 'translateY(-6px)',
              transition: `opacity ${state.guideText ? transitions.in : transitions.out} ease, transform ${state.guideText ? transitions.in : transitions.out} ease, color 0.987s ease`,
              lineHeight: 1.8,
              maxWidth: 440,
              padding: '0 26px',
              whiteSpace: 'pre-line',
              fontFamily: "'Josefin Sans', sans-serif",
              textShadow: TEXT_SHADOW,
            }}
            className={`font-extralight ${state.guideBright ? 'text-slate-200' : 'text-slate-300'}`}
          >
            {state.guideText}
          </p>
        </div>
      )}

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

      {state.complete && !playing && (
        <GroundingComplete onJournal={handleJournal} onReturn={handleReturn} onPlay={handlePlay} />
      )}

      {/* Play mode controls */}
      {playing && (
        <div style={{ position: 'fixed', bottom: 'clamp(26px, 5vh, 42px)', left: 0, right: 0, zIndex: 8, display: 'flex', justifyContent: 'center', gap: 26 }}>
          {revealedCount > 15 && (
            <button onClick={handlePlayUndo} className="text-slate-300/50 text-xs font-light tracking-widest hover:text-slate-200/80 transition-colors">undo</button>
          )}
          <button onClick={() => setPlaying(false)} className="text-slate-300/60 text-xs font-light tracking-widest hover:text-slate-200/90 transition-colors">done</button>
        </div>
      )}

      {exitTransition && (
        <ExitThreshold destination={exitTransition.destination} solfeggio={exitTransition.solfeggio} onNavigate={(route) => router.push(route)} />
      )}

      {/* Reduced motion fallback */}
      {prefersReduced && state.started && !state.complete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-slate-400 text-xs font-light tracking-widest">{state.currentSense?.label || 'grounding'}</p>
          <p className="text-slate-300 text-sm font-light tracking-wider ml-3">{state.guideText}</p>
        </div>
      )}
    </div>
  );
}
