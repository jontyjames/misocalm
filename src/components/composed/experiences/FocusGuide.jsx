/**
 * FocusGuide — orchestrates the focus/attentional training experience
 *
 * Sacred tunnel with peripheral flash capture and spatial tapping.
 * Reuses GroundingIntro for letter-by-letter intro text.
 * Matches GroundingGuide architectural pattern.
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useReducedMotion } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import useFocusState from './useFocusState';
import FocusCanvas from './FocusCanvas';
import FocusPrompt from './FocusPrompt';
import FocusComplete from './FocusComplete';
import GroundingIntro from './GroundingIntro';
import ExitThreshold from './ExitThreshold';

const GUIDE_TRANSITION = { in: '0.987s', out: '0.610s' };
const TEXT_SHADOW = '0 0 16px rgba(3,7,18,0.8), 0 0 42px rgba(3,7,18,0.5)';

export default function FocusGuide() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const state = useFocusState();
  const [playTouch, setPlayTouch] = useState(null);
  const [exitTransition, setExitTransition] = useState(null);

  const handlePlayTap = useCallback((e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (x != null && y != null) setPlayTouch({ x, y, id: Date.now() });
  }, []);

  const handleTap = useCallback((e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    state.processTap(x, y);
  }, [state.processTap]);

  const handleLeave = useCallback(() => {
    state.clearSeqTimer();
    router.push(ROUTES.TOOLS);
  }, [state.clearSeqTimer, router]);

  const handleReturn = useCallback(() => {
    state.clearSeqTimer();
    setExitTransition({ destination: ROUTES.DASHBOARD, solfeggio: 'cyan' });
  }, [state.clearSeqTimer]);

  const handleJournal = useCallback(() => {
    state.clearSeqTimer();
    setExitTransition({ destination: `${ROUTES.CHECK_IN}?from=focus`, solfeggio: 'cyan' });
  }, [state.clearSeqTimer]);

  return (
    <div style={{ background: '#030712', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Canvas */}
      {state.started && (
        <FocusCanvas
          flashVisible={state.flashVisible}
          flashPosition={state.flashPosition}
          flashCaptured={state.flashCaptured}
          totalCaptured={state.totalCaptured}
          phase={state.phase}
          complete={state.complete}
          playTouch={playTouch}
        />
      )}

      {/* Full-screen tap target */}
      {state.started && !state.complete && (
        <div onClick={handleTap} role="button" tabIndex={0}
          aria-label="Tap where the light appears"
          style={{ position: 'fixed', inset: 0, zIndex: 2, cursor: 'pointer' }}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') state.processTap(); }}
        />
      )}

      {/* Prompt screen */}
      <FocusPrompt
        isFirstVisit={state.isFirstVisit}
        visits={state.visits}
        onEnter={state.enter}
        visible={!state.started}
      />

      {/* Exit button — visible within 377ms (non-negotiable safety) */}
      {state.started && !state.complete && (
        <button
          onClick={handleLeave}
          aria-label="Leave experience"
          style={{
            position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + clamp(16px, 3vh, 26px))', left: 16, zIndex: 8,
            opacity: 0, animation: 'fadeIn 0.610s ease-out 0.377s forwards',
          }}
          className="flex items-center gap-1 py-4 px-4 text-slate-500/50 text-xs font-light tracking-wider hover:text-slate-300/60 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          leave
        </button>
      )}

      {/* Intro text — centred, letter-by-letter */}
      {state.introActive && <GroundingIntro text={state.guideText} />}

      {/* Guide text — upper portion */}
      {!state.introActive && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 'clamp(68px, 12vh, 110px)', paddingBottom: 42,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.4) 70%, transparent 100%)',
        }}>
          <p
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.08em', textAlign: 'center',
              opacity: state.guideText ? 1 : 0,
              transform: state.guideText ? 'translateY(0)' : 'translateY(-6px)',
              transition: `opacity ${state.guideText ? GUIDE_TRANSITION.in : GUIDE_TRANSITION.out} ease, transform ${state.guideText ? GUIDE_TRANSITION.in : GUIDE_TRANSITION.out} ease`,
              lineHeight: 1.8, maxWidth: 440, padding: '0 26px', whiteSpace: 'pre-line',
              fontFamily: "'Josefin Sans', sans-serif", textShadow: TEXT_SHADOW,
            }}
            className={`font-extralight ${state.guideBright ? 'text-slate-200' : 'text-slate-300'}`}
          >
            {state.guideText}
          </p>
        </div>
      )}

      {/* Progress — quiet count */}
      {state.started && state.totalFlashes > 0 && !state.complete && (
        <p className="text-slate-300/30 text-xs font-light tracking-widest" style={{
          position: 'fixed', bottom: 'clamp(68px, 12vh, 110px)', left: 0, right: 0,
          zIndex: 3, textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.377s ease',
        }}>
          {state.totalCaptured} noticed
        </p>
      )}

      {/* Completion */}
      {state.complete && <FocusComplete onJournal={handleJournal} onReturn={handleReturn} />}

      {/* Free play — touch anywhere to create */}
      {state.freePlay && (
        <>
          <div onClick={handlePlayTap} role="button" tabIndex={0}
            aria-label="Touch anywhere to create shapes"
            style={{ position: 'fixed', inset: 0, zIndex: 2, cursor: 'pointer' }}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handlePlayTap({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }); }}
          />
          <p className="text-slate-300/30 text-xs font-light tracking-widest" style={{
            position: 'fixed', top: 'clamp(68px, 12vh, 110px)', left: 0, right: 0,
            textAlign: 'center', zIndex: 3, pointerEvents: 'none', opacity: 0,
            animation: 'fadeIn 1.597s ease-out 0.610s forwards',
          }}>touch anywhere</p>
        </>
      )}

      {/* Exit threshold */}
      {exitTransition && (
        <ExitThreshold
          destination={exitTransition.destination}
          solfeggio={exitTransition.solfeggio}
          onNavigate={(route) => router.push(route)}
        />
      )}

      {/* Reduced motion fallback */}
      {prefersReduced && state.started && !state.complete && (
        <div className="fixed inset-0 z-[1] flex items-center justify-center">
          <p className="text-slate-400 text-xs font-light tracking-widest">{state.phase}</p>
        </div>
      )}
    </div>
  );
}
