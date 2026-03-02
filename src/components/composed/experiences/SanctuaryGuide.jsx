/**
 * SanctuaryGuide — orchestrates the full Sanctuary experience
 *
 * Breath-reactive generative sacred geometry. Hands-free: just breathe.
 * Microphone detects breath (low-frequency band), each cycle adds
 * sacred geometry to build a sanctuary landscape.
 * Solfeggio: slate (396Hz — Liberation from Fear).
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useMicrophone, useReducedMotion } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import SanctuaryCanvas from './SanctuaryCanvas';
import SanctuaryComplete from './SanctuaryComplete';
import SanctuaryPrompt from './SanctuaryPrompt';
import GroundingIntro from './GroundingIntro';
import ExitThreshold from './ExitThreshold';
import useSanctuaryState from './useSanctuaryState';

const TEXT_SHADOW = '0 0 16px rgba(3,7,18,0.8), 0 0 42px rgba(3,7,18,0.5)';
const GUIDE_TRANSITION = { in: '0.987s', out: '0.610s' };

export default function SanctuaryGuide() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const mic = useMicrophone();
  const state = useSanctuaryState();
  const [playing, setPlaying] = useState(false);
  const [exitTransition, setExitTransition] = useState(null);
  const rafRef = useRef(null);
  const bandsRef = useRef(mic.bands);
  bandsRef.current = mic.bands;

  // Feed low-frequency band to breath detector every frame (ref avoids RAF teardown)
  useEffect(() => {
    if (!mic.isListening || !state.started) return;
    const tick = () => {
      state.processBreathFrame(bandsRef.current.low);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mic.isListening, state.started, state.processBreathFrame]);

  const handleEnter = useCallback(async () => {
    const success = await mic.startListening();
    if (success) state.enter();
  }, [mic, state]);

  const handleLeave = useCallback(() => {
    mic.stopListening();
    state.clearSeqTimer();
    router.push(ROUTES.TOOLS);
  }, [mic, state.clearSeqTimer, router]);

  const handleReturn = useCallback(() => {
    mic.stopListening();
    state.clearSeqTimer();
    setExitTransition({ destination: ROUTES.DASHBOARD, solfeggio: 'slate' });
  }, [mic, state.clearSeqTimer]);

  const handleJournal = useCallback(() => {
    mic.stopListening();
    state.clearSeqTimer();
    setExitTransition({ destination: `${ROUTES.CHECK_IN}?from=sanctuary`, solfeggio: 'slate' });
  }, [mic, state.clearSeqTimer]);

  const handleKeepBreathing = useCallback(() => setPlaying(true), []);

  return (
    <div style={{ background: '#030712', minHeight: '100dvh' }}>
      {state.started && (
        <SanctuaryCanvas breathCount={state.breathCount} breathPhase={state.phase} audioLevel={bandsRef.current.low} />
      )}

      <SanctuaryPrompt
        isFirstVisit={state.isFirstVisit}
        visits={state.visits}
        onEnter={handleEnter}
        denied={mic.denied}
        visible={!state.started}
      />

      {/* Exit button — visible quickly for trauma safety */}
      {state.started && !state.complete && (
        <button
          onClick={handleLeave}
          aria-label="Leave experience"
          style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top, 0px) + clamp(16px, 3vh, 26px))',
            left: 16,
            zIndex: 8,
            padding: '16px 16px',
            opacity: 0,
            animation: 'fadeIn 0.610s ease-out 0.377s forwards',
          }}
          className="flex items-center gap-1 text-slate-500/50 text-xs font-light tracking-wider hover:text-slate-400/70 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          leave
        </button>
      )}

      {/* Intro text — centred, letter-by-letter */}
      {state.introActive && <GroundingIntro text={state.guideText} />}

      {/* Guide text — upper portion */}
      {!state.introActive && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 'clamp(68px, 12vh, 110px)', paddingBottom: 42,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.4) 70%, transparent 100%)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              letterSpacing: '0.08em',
              textAlign: 'center',
              opacity: state.guideText ? 1 : 0,
              transform: state.guideText ? 'translateY(0)' : 'translateY(-6px)',
              transition: `opacity ${state.guideText ? GUIDE_TRANSITION.in : GUIDE_TRANSITION.out} ease, transform ${state.guideText ? GUIDE_TRANSITION.in : GUIDE_TRANSITION.out} ease`,
              lineHeight: 1.8, maxWidth: 440, padding: '0 26px',
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

      {/* Breath count */}
      {state.started && state.breathCount > 0 && !state.complete && (
        <div style={{ position: 'fixed', bottom: 'clamp(68px, 12vh, 110px)', left: 0, right: 0, zIndex: 3, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <p className="text-slate-300/30 text-xs font-light tracking-widest" style={{ transition: 'opacity 0.377s ease' }}>
            {state.breathCount} breath{state.breathCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {state.complete && !playing && (
        <SanctuaryComplete onKeepBreathing={handleKeepBreathing} onJournal={handleJournal} onReturn={handleReturn} />
      )}

      {/* Free play — done button */}
      {playing && (
        <div style={{ position: 'fixed', bottom: 'clamp(26px, 5vh, 42px)', left: 0, right: 0, zIndex: 8, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setPlaying(false)} className="text-slate-300/60 text-xs font-light tracking-widest hover:text-slate-200/90 transition-colors" style={{ padding: '16px 26px' }}>done</button>
        </div>
      )}

      {exitTransition && (
        <ExitThreshold destination={exitTransition.destination} solfeggio={exitTransition.solfeggio} onNavigate={(route) => router.push(route)} />
      )}

      {/* Reduced motion fallback */}
      {prefersReduced && state.started && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <div className="rounded-full mx-auto mb-4" style={{ width: 10, height: 10, background: 'rgba(148, 163, 184, 0.6)', boxShadow: '0 0 16px rgba(148, 163, 184, 0.2)' }} />
            <p className="text-slate-400 text-xs font-light tracking-widest">{state.breathCount} breaths</p>
          </div>
        </div>
      )}
    </div>
  );
}
