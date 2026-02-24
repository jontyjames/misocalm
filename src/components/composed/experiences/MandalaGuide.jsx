/**
 * MandalaGuide — orchestrates the full Mandala experience
 *
 * Touch-based generative sacred geometry. Every touch creates
 * radially symmetric forms. You cannot make it ugly.
 * Same architectural pattern as ImpermanenceGuide.
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useReducedMotion } from '@/hooks';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';
import MandalaCanvas from './MandalaCanvas';
import ColourRibbon from './ColourRibbon';
import SymmetrySelector from './SymmetrySelector';
import useMandalaState from './useMandalaState';

export default function MandalaGuide() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const state = useMandalaState();
  const [customColor, setCustomColor] = useState(null);
  const [freeSymmetry, setFreeSymmetry] = useState(11);

  const handleTouch = useCallback((touchData) => {
    state.processTouchEvent(touchData);
  }, [state.processTouchEvent]);

  const handleReturn = useCallback(() => {
    state.clearSeqTimer();
    router.push(ROUTES.TOOLS);
  }, [state.clearSeqTimer, router]);

  const activeSymmetry = state.freePlay ? freeSymmetry : state.symmetry;

  return (
    <div style={{ background: '#030712', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Canvas always renders */}
      <MandalaCanvas
        symmetry={activeSymmetry}
        showYouDot={state.showYouDot}
        customColor={state.freePlay ? customColor : null}
        onTouch={handleTouch}
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
            animation: 'fadeInUp 1.597s ease-out 0.610s forwards',
          }}
        >
          {state.isFirstVisit ? 'A small creation' : 'Mandala'}
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
          {state.isFirstVisit ? (
            <span className="block">about touch, and what is already whole</span>
          ) : (
            <>
              <span className="block">Welcome back.</span>
              <span className="block mt-2">Same centre, new patterns.</span>
              {state.visits > 0 && (
                <span className="block mt-4 text-slate-500/40 text-xs">
                  visit {state.visits + 1}
                </span>
              )}
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
            animation: 'fadeInUp 1.597s ease-out 1.597s forwards',
            transition: 'all 0.377s ease',
            color: '#e2e8f0',
          }}
          className="font-extralight hover:bg-indigo-300/10 hover:border-indigo-300/40"
        >
          {state.isFirstVisit ? 'Begin' : 'Enter'}
        </button>
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
            animation: 'fadeIn 0.987s ease-out 1.597s forwards',
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

      {/* Free play controls */}
      {state.freePlay && (
        <>
          <SymmetrySelector value={freeSymmetry} onChange={setFreeSymmetry} />
          <ColourRibbon
            onChange={setCustomColor}
            showHint={state.visits === 2}
            storageKey={STORAGE_KEYS.MANDALA_HUE}
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
            <p className="text-slate-400 text-xs font-light tracking-widest">you</p>
          </div>
        </div>
      )}
    </div>
  );
}
