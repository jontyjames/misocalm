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
import useMicrophone from '@/hooks/useMicrophone';
import useReducedMotion from '@/hooks/useReducedMotion';
import { ROUTES } from '@/lib/constants';
import SoundCanvas from './SoundCanvas';
import ColourRibbon from './ColourRibbon';
import useImpermanenceState from './useImpermanenceState';

export default function ImpermanenceGuide() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const mic = useMicrophone();
  const state = useImpermanenceState();
  const [customColor, setCustomColor] = useState(null);
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

  const handleReturn = useCallback(() => {
    mic.stopListening();
    state.clearSeqTimer();
    router.push(ROUTES.TOOLS);
  }, [mic, state, router]);

  return (
    <div style={{ background: '#030712', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Canvas always renders (starts with just void) */}
      <SoundCanvas
        audioLevel={mic.audioLevel}
        pitch={mic.pitch}
        customColor={state.freePlay ? customColor : null}
        showYouDot={state.started}
        showYouLabel={state.showYouLabel}
      />

      {/* Prompt screen (overlays everything, fades out on enter) */}
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
          {state.isFirstVisit ? 'A small experiment' : 'Impermanence'}
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
            <>
              <span className="block">about sound, and what remains</span>
            </>
          ) : (
            <>
              <span className="block">Welcome back.</span>
              <span className="block mt-2">Same space, same stillness.</span>
              <span className="block">See what you notice this time.</span>
              {state.visits > 0 && (
                <span className="block mt-4 text-slate-500/40 text-xs">
                  visit {state.visits + 1}
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
            animation: 'fadeInUp 1.597s ease-out 1.2s forwards',
            textAlign: 'center',
            maxWidth: 280,
            padding: '0 26px',
          }}
          className="font-extralight text-slate-500"
        >
          Works best in a quiet space without much background noise
        </p>

        <button
          onClick={handleEnter}
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
            animation: 'fadeInUp 1.597s ease-out 1.7s forwards',
            transition: 'all 0.377s ease',
            color: '#e2e8f0',
          }}
          className="font-extralight hover:bg-indigo-300/10 hover:border-indigo-300/40"
        >
          {state.isFirstVisit ? 'Begin' : 'Enter'}
        </button>

        {mic.denied && (
          <p className="text-rose-400/60 text-xs font-light mt-4">
            Microphone access is needed for this experience.
          </p>
        )}
      </div>

      {/* Exit button — always available once started */}
      {state.started && (
        <button
          onClick={handleReturn}
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
            }}
          >
            <button
              onClick={handleReturn}
              className="text-slate-500/40 text-xs font-light tracking-widest
                         hover:text-slate-400/60 transition-colors"
              style={{ transition: 'color 0.377s ease' }}
            >
              return to sanctuary
            </button>
          </div>
        </>
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
