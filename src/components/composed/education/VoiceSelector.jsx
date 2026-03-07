/**
 * VoiceSelector
 * Terminal-typed intro + 3 voice cards.
 * After intro types, cards fade in staggered 55ms (Fibonacci).
 * Shows module title + completion: x/3 read per module.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PHI_SCALE, MONO, JOSEFIN, ROUTES } from '@/lib/constants';
import { VOICE_KEYS } from '@/lib/educationData';
import useTypingIntro from './useTypingIntro';
import TerminalBackButton from './TerminalBackButton';

const INTRO_LINES = [
  'you have three ways to learn this.',
  'choose the one that calls to you.',
  'or read all three.',
];

const RETURN_INTRO_LINES = [
  'same module. different lens.',
  'choose another.',
];

export default function VoiceSelector({ module, visits, onSelect, moduleTitle, returning }) {
  const router = useRouter();
  const [cardsVisible, setCardsVisible] = useState(false);

  const lines = returning ? RETURN_INTRO_LINES : INTRO_LINES;
  const { lineIndex, charIndex, introComplete, skipIntro } = useTypingIntro(lines);

  // Cards fade in after intro
  useEffect(() => {
    if (!introComplete) return;
    const t = setTimeout(() => setCardsVisible(true), 89);
    return () => clearTimeout(t);
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
      <TerminalBackButton onClick={() => router.push(ROUTES.TOOLS)} />

      {/* Module title */}
      {moduleTitle && (
        <div
          className="mx-auto"
          style={{
            width: 'calc(100vw - 84px)',
            maxWidth: 540,
            marginBottom: PHI_SCALE[2],
            fontFamily: JOSEFIN.fontFamily,
            fontWeight: 200,
            fontSize: 18,
            color: '#00ff41',
            textShadow: '0 0 12px rgba(0,255,65,0.3)',
            opacity: 0.7,
          }}
        >
          {moduleTitle}
        </div>
      )}

      {/* Intro text */}
      <div
        className="mx-auto"
        style={{
          width: 'calc(100vw - 84px)',
          maxWidth: 540,
          marginBottom: PHI_SCALE[4],
        }}
      >
        {lines.map((line, i) => {
          if (i > lineIndex) return null;
          const text = i < lineIndex ? line : line.slice(0, charIndex);
          return (
            <div
              key={i}
              style={{
                ...MONO,
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
          gap: PHI_SCALE[1],
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
                border: '1px solid rgba(0,255,65,0.25)',
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 377ms ease ${i * 55}ms, transform 377ms ease ${i * 55}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    ...JOSEFIN,
                    fontSize: PHI_SCALE[2],
                    color: '#00ff41',
                  }}
                >
                  {voice.name}
                </span>
                {read && (
                  <span
                    style={{
                      ...MONO,
                      fontSize: 11,
                      color: 'rgba(0,255,65,0.3)',
                    }}
                  >
                    read
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: PHI_SCALE[0] }}>
                <span
                  style={{
                    ...MONO,
                    fontSize: 12,
                    color: 'rgba(0,255,65,0.5)',
                  }}
                >
                  {voice.description}
                </span>
                <span
                  style={{
                    ...MONO,
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
            marginTop: PHI_SCALE[3],
            ...MONO,
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
