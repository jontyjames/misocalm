/**
 * VoiceSelector
 * Terminal-typed intro + 3 voice cards.
 * After intro types, cards fade in staggered 55ms (Fibonacci).
 * Shows completion: x/3 read per module.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { ROUTES } from '@/lib/constants';
import { VOICE_KEYS } from '@/lib/educationData';

const INTRO_LINES = [
  'you have three ways to learn this.',
  'choose the one that calls to you.',
  'or read all three.',
];

const CHAR_INTERVAL = 34;
const LINE_PAUSE = 377;
const DRAMATIC_PAUSE = 610;

export default function VoiceSelector({ module, visits, onSelect }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const timerRef = useRef(null);

  // Reduced motion: skip intro
  useEffect(() => {
    if (prefersReduced) {
      setIntroComplete(true);
      setCardsVisible(true);
    }
  }, [prefersReduced]);

  // Typing engine for intro
  useEffect(() => {
    if (prefersReduced || introComplete) return;

    if (lineIndex >= INTRO_LINES.length) {
      setIntroComplete(true);
      return;
    }

    const text = INTRO_LINES[lineIndex];

    if (charIndex < text.length) {
      timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), CHAR_INTERVAL);
      return () => clearTimeout(timerRef.current);
    }

    // Line complete — pause then next
    const pause = lineIndex === 1 ? DRAMATIC_PAUSE : LINE_PAUSE;
    timerRef.current = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, pause);
    return () => clearTimeout(timerRef.current);
  }, [prefersReduced, introComplete, lineIndex, charIndex]);

  // Cards fade in after intro
  useEffect(() => {
    if (!introComplete) return;
    const t = setTimeout(() => setCardsVisible(true), 89);
    return () => clearTimeout(t);
  }, [introComplete]);

  // Skip intro on tap
  const skipIntro = useCallback(() => {
    if (!introComplete) {
      clearTimeout(timerRef.current);
      setLineIndex(INTRO_LINES.length);
      setIntroComplete(true);
    }
  }, [introComplete]);

  // Count voices read
  const moduleVisits = visits?.[module.slug] || {};
  const voicesRead = VOICE_KEYS.filter((k) => (moduleVisits[k] || 0) > 0).length;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center safe-area-top safe-area-bottom"
      style={{ zIndex: 2 }}
      onClick={skipIntro}
    >
      {/* Back button */}
      <button
        onClick={(e) => { e.stopPropagation(); router.push(ROUTES.TOOLS); }}
        className="fixed top-0 left-0 flex items-center safe-area-top"
        style={{
          padding: 16,
          gap: 6,
          fontSize: 13,
          fontFamily: 'var(--font-mono), monospace',
          fontWeight: 300,
          color: 'rgba(148,163,184,0.6)',
          opacity: 0.4,
          zIndex: 51,
          background: 'rgba(3,7,18,0.4)',
          borderRadius: '0 0 10px 0',
        }}
      >
        <ChevronLeft className="w-4 h-4" />
        back
      </button>

      {/* Intro text */}
      <div
        className="mx-auto"
        style={{
          width: 'calc(100vw - 84px)',
          maxWidth: 540,
          marginBottom: 42,
        }}
      >
        {INTRO_LINES.map((line, i) => {
          if (i > lineIndex) return null;
          const text = i < lineIndex ? line : line.slice(0, charIndex);
          return (
            <div
              key={i}
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontWeight: 300,
                fontSize: 13,
                lineHeight: 1.7,
                color: '#00ff41',
                textShadow: '0 0 6px rgba(0,255,65,0.4)',
                opacity: 0.9,
                minHeight: '1.6em',
              }}
            >
              {text}
            </div>
          );
        })}
      </div>

      {/* Voice cards */}
      <div
        className="mx-auto flex flex-col"
        style={{
          width: 'calc(100vw - 84px)',
          maxWidth: 540,
          gap: 10,
        }}
      >
        {VOICE_KEYS.map((key, i) => {
          const voice = module.voices[key];
          const read = (moduleVisits[key] || 0) > 0;

          return (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                if (cardsVisible) onSelect(key);
              }}
              className="w-full text-left rounded-xl p-4 relative"
              style={{
                background: 'rgba(0,255,65,0.04)',
                border: '1px solid rgba(0,255,65,0.1)',
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 377ms ease ${i * 55}ms, transform 377ms ease ${i * 55}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 16,
                    color: '#00ff41',
                  }}
                >
                  {voice.name}
                </span>
                {read && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontWeight: 300,
                      fontSize: 11,
                      color: 'rgba(0,255,65,0.3)',
                    }}
                  >
                    read
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontWeight: 300,
                    fontSize: 12,
                    color: 'rgba(0,255,65,0.5)',
                  }}
                >
                  {voice.description}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontWeight: 300,
                    fontSize: 11,
                    color: 'rgba(0,255,65,0.2)',
                  }}
                >
                  {voice.duration}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion counter */}
      {voicesRead > 0 && (
        <div
          style={{
            marginTop: 26,
            fontFamily: 'var(--font-mono), monospace',
            fontWeight: 300,
            fontSize: 12,
            color: voicesRead === 3 ? '#00ff41' : 'rgba(0,255,65,0.4)',
            textShadow: voicesRead === 3 ? '0 0 6px rgba(0,255,65,0.5)' : 'none',
            opacity: cardsVisible ? 1 : 0,
            transition: 'opacity 377ms ease 144ms',
          }}
        >
          {voicesRead === 3 ? 'all explored' : `${voicesRead} of 3 explored`}
        </div>
      )}
    </div>
  );
}
