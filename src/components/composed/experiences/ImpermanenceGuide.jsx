/**
 * ImpermanenceGuide — orchestrates the full Impermanence experience
 *
 * Ported from the standalone HTML version. Key differences from v1:
 * - Guide text at bottom of screen (not centre) with CSS transitions
 * - Prompt screen overlays canvas with fade-out transition
 * - Sound detection drives sequence via processSoundFrame
 * - Canvas handles all visuals (blooms, you dot, fade trails)
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useMicrophone, useReducedMotion } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import SoundCanvas from './SoundCanvas';
import ColourRibbon from './ColourRibbon';
import useImpermanenceState from './useImpermanenceState';
import ImpermanencePrompt from './ImpermanencePrompt';
import ExitThreshold from './ExitThreshold';

export default function ImpermanenceGuide() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const mic = useMicrophone();
  const state = useImpermanenceState();
  const [customColor, setCustomColor] = useState(null);
  const [exitTransition, setExitTransition] = useState(null);
  const rafRef = useRef(null);

  // Feed audio level to the state machine every frame
  useEffect(() => {
    if (!mic.isListening || !state.started) return;

    const tick = () => {
      state.processSoundFrame(mic.audioLevel);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mic.isListening, mic.audioLevel, state.started, state.processSoundFrame]);

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
    setExitTransition({ destination: ROUTES.DASHBOARD, solfeggio: 'violet' });
  }, [mic, state.clearSeqTimer]);

  const handleJournal = useCallback(() => {
    mic.stopListening();
    state.clearSeqTimer();
    setExitTransition({ destination: ROUTES.CHECK_IN + '?from=impermanence', solfeggio: 'violet' });
  }, [mic, state.clearSeqTimer]);

  return (
    <div style={{ background: '#030712', minHeight: '100dvh' }}>
      {/* Canvas always renders (starts with just void) */}
      <SoundCanvas
        audioLevel={mic.audioLevel}
        pitch={mic.pitch}
        customColor={state.freePlay ? customColor : null}
        showYouDot={state.started}
        showYouLabel={state.showYouLabel}
      />

      {/* Prompt screen */}
      <ImpermanencePrompt
        isFirstVisit={state.isFirstVisit}
        visits={state.visits}
        onEnter={handleEnter}
        denied={mic.denied}
        visible={!state.started}
      />

      {/* Exit button — always available once started */}
      {state.started && (
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
          className="flex items-center gap-1 text-slate-500/50 text-xs font-light tracking-wider hover:text-slate-400/70 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          leave
        </button>
      )}

      {/* Guide text (upper third of screen — words first, visual supports) */}
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
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
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
            textShadow: '0 0 16px rgba(3,7,18,0.8), 0 0 42px rgba(3,7,18,0.5)',
          }}
          className={`font-extralight ${state.guideBright ? 'text-slate-200' : 'text-slate-300'}`}
        >
          {state.guideText}
        </p>
      </div>

      {/* Free play: colour ribbon + return link */}
      {state.freePlay && (
        <>
          <ColourRibbon
            onChange={setCustomColor}
            showHint={state.visits === 2}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 26,
              left: 0,
              right: 0,
              zIndex: 5,
              display: 'flex',
              justifyContent: 'center',
              gap: 26,
            }}
          >
            <button
              onClick={handleJournal}
              className="text-slate-300/60 text-xs font-light tracking-widest
                         hover:text-slate-200/90 transition-colors"
              style={{ transition: 'color 0.377s ease' }}
            >
              reflect in your journal
            </button>
            <button
              onClick={handleReturn}
              className="text-slate-300/60 text-xs font-light tracking-widest
                         hover:text-slate-200/90 transition-colors"
              style={{ transition: 'color 0.377s ease' }}
            >
              done
            </button>
          </div>
        </>
      )}

      {/* Exit threshold — soft transition out */}
      {exitTransition && (
        <ExitThreshold
          destination={exitTransition.destination}
          solfeggio={exitTransition.solfeggio}
          onNavigate={(route) => router.push(route)}
        />
      )}

      {/* Reduced motion fallback */}
      {prefersReduced && state.started && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div className="text-center">
            <div
              className="rounded-full mx-auto mb-4"
              style={{
                width: 10, height: 10,
                background: 'rgba(226, 232, 240, 0.6)',
                boxShadow: '0 0 20px rgba(226, 232, 240, 0.2)',
              }}
            />
            {state.showYouLabel && (
              <p className="text-slate-400 text-xs font-light tracking-widest">you</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
