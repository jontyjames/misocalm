/**
 * GroundingIntro — letter-by-letter intro text for grounding experience
 *
 * Centred on screen, larger text. Each character fades in one at a time
 * (34ms per char, 0.377s opacity transition). Violet glow text shadow.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks';
import { FIBONACCI_TIMING } from '@/lib/constants';

export default function GroundingIntro({ text }) {
  const prefersReduced = useReducedMotion();
  const [charCount, setCharCount] = useState(0);
  const prevTextRef = useRef('');

  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      setCharCount(0);
    }
    if (!text || charCount >= text.length) return;
    const timer = setTimeout(() => setCharCount((c) => c + 1), FIBONACCI_TIMING.micro);
    return () => clearTimeout(timer);
  }, [text, charCount]);

  if (!text) return null;

  const words = text.split(' ');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          lineHeight: 1.8,
          maxWidth: 440,
          padding: '0 26px',
          fontFamily: "'Josefin Sans', sans-serif",
          textShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
          minHeight: '3rem',
        }}
        className="font-extralight text-slate-200"
      >
        {words.map((word, wi) => {
          const startIdx = words.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0);
          return (
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.split('').map((char, ci) => (
                <span
                  key={ci}
                  style={{
                    opacity: startIdx + ci < charCount ? 1 : 0,
                    transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out',
                  }}
                >
                  {char}
                </span>
              ))}
              {wi < words.length - 1 && (
                <span style={{ opacity: startIdx + word.length < charCount ? 1 : 0, transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out' }}>&nbsp;</span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}
