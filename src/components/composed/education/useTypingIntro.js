/**
 * useTypingIntro
 * Shared intro-line typing engine for terminal screens.
 * Handles plain strings, { text, dramatic } objects, and empty strings (blank pauses).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { FIBONACCI_TIMING } from '@/lib/constants';

const CHAR_INTERVAL = FIBONACCI_TIMING.micro;   // 34
const LINE_PAUSE = FIBONACCI_TIMING.flow;        // 377
const DRAMATIC_PAUSE = FIBONACCI_TIMING.ease;    // 610

export default function useTypingIntro(lines, { skip = false } = {}) {
  const prefersReduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const timerRef = useRef(null);

  const shouldSkip = skip || prefersReduced;

  // Skip animation entirely
  useEffect(() => {
    if (shouldSkip) setIntroComplete(true);
  }, [shouldSkip]);

  // Typing engine
  useEffect(() => {
    if (shouldSkip || introComplete) return;
    if (lineIndex >= lines.length) { setIntroComplete(true); return; }

    const line = lines[lineIndex];
    const text = typeof line === 'string' ? line : line?.text || '';
    const dramatic = typeof line === 'object' && line?.dramatic;

    // Empty string = blank line pause
    if (text === '') {
      timerRef.current = setTimeout(() => { setLineIndex((i) => i + 1); setCharIndex(0); }, LINE_PAUSE);
      return () => clearTimeout(timerRef.current);
    }

    if (charIndex < text.length) {
      timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), CHAR_INTERVAL);
      return () => clearTimeout(timerRef.current);
    }

    // Line complete
    const pause = dramatic ? DRAMATIC_PAUSE : LINE_PAUSE;
    timerRef.current = setTimeout(() => { setLineIndex((i) => i + 1); setCharIndex(0); }, pause);
    return () => clearTimeout(timerRef.current);
  }, [shouldSkip, introComplete, lineIndex, charIndex, lines]);

  // Skip on tap
  const skipIntro = useCallback(() => {
    if (!introComplete) {
      clearTimeout(timerRef.current);
      setLineIndex(lines.length);
      setIntroComplete(true);
    }
  }, [introComplete, lines.length]);

  return { lineIndex, charIndex, introComplete, skipIntro };
}
