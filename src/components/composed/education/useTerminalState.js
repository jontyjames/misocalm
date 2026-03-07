/**
 * useTerminalState
 * Manages typing animation state for the terminal education experience.
 * Fibonacci timing: 34ms per char, 377ms line pause, 610ms dramatic pause.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from '@/hooks';
import useReducedMotion from '@/hooks/useReducedMotion';
import { STORAGE_KEYS } from '@/lib/constants';

const CHAR_INTERVAL = 34;    // fib-micro
const LINE_PAUSE = 377;      // fib-flow
const DRAMATIC_PAUSE = 610;  // fib-ease
const PAGE_FADE = 233;       // fib-move

export default function useTerminalState(pages, slug, voiceKey) {
  const prefersReduced = useReducedMotion();

  const [currentPage, setCurrentPage] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.EDUCATION_VISITS, {});

  // Reset state when voice changes
  useEffect(() => {
    setCurrentPage(0);
    setLineIndex(0);
    setCharIndex(0);
    setTypingComplete(false);
    setAllComplete(false);
    setTransitioning(false);
    setShowExit(false);
    clearTimeout(timerRef.current);
    clearTimeout(exitTimerRef.current);
  }, [voiceKey]);

  // Get current page data
  const page = pages?.[currentPage];
  const lines = page?.lines || [];

  // Normalize line — can be string or { text, dramatic }
  const getLineText = useCallback((line) => {
    if (!line) return '';
    if (typeof line === 'string') return line;
    return line.text || '';
  }, []);

  const isLineDramatic = useCallback((line) => {
    return typeof line === 'object' && line?.dramatic;
  }, []);

  // If reduced motion, show everything instantly
  useEffect(() => {
    if (prefersReduced && pages) {
      setLineIndex(lines.length);
      setCharIndex(0);
      setTypingComplete(true);
    }
  }, [prefersReduced, currentPage, pages, lines.length]);

  // Typing engine
  useEffect(() => {
    if (prefersReduced || !pages || typingComplete) return;

    const currentLine = lines[lineIndex];
    if (lineIndex >= lines.length) {
      setTypingComplete(true);
      return;
    }

    const text = getLineText(currentLine);

    // Empty line — just pause and advance
    if (text === '') {
      timerRef.current = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, LINE_PAUSE);
      return () => clearTimeout(timerRef.current);
    }

    // Still typing characters
    if (charIndex < text.length) {
      timerRef.current = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, CHAR_INTERVAL);
      return () => clearTimeout(timerRef.current);
    }

    // Line complete — pause then advance
    const pause = isLineDramatic(currentLine) ? DRAMATIC_PAUSE : LINE_PAUSE;
    timerRef.current = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, pause);
    return () => clearTimeout(timerRef.current);
  }, [prefersReduced, pages, lineIndex, charIndex, typingComplete, lines, getLineText, isLineDramatic]);

  // Show exit button on final page after 2584ms (fib-sacred)
  useEffect(() => {
    if (currentPage === (pages?.length || 0) - 1 && typingComplete) {
      exitTimerRef.current = setTimeout(() => setShowExit(true), 2584);
      return () => clearTimeout(exitTimerRef.current);
    }
    setShowExit(false);
  }, [currentPage, typingComplete, pages?.length]);

  // Advance — skip typing or go to next page
  const advance = useCallback(() => {
    if (transitioning) return;

    if (!typingComplete) {
      // Skip to end of current page
      clearTimeout(timerRef.current);
      setLineIndex(lines.length);
      setCharIndex(0);
      setTypingComplete(true);
      return;
    }

    // Last page
    if (currentPage >= (pages?.length || 0) - 1) {
      setAllComplete(true);
      // Mark visited — voice-aware tracking
      setVisits((v) => {
        const modVisits = v[slug] || {};
        return { ...v, [slug]: { ...modVisits, [voiceKey]: (modVisits[voiceKey] || 0) + 1 } };
      });
      return;
    }

    // Transition to next page
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setLineIndex(0);
      setCharIndex(0);
      setTypingComplete(false);
      setTransitioning(false);
    }, PAGE_FADE);
  }, [typingComplete, transitioning, currentPage, pages?.length, lines.length, slug, voiceKey, setVisits]);

  // Build visible lines array for rendering
  const visibleLines = [];
  if (pages) {
    for (let i = 0; i <= Math.min(lineIndex, lines.length - 1); i++) {
      const line = lines[i];
      const text = getLineText(line);
      const dramatic = isLineDramatic(line);

      if (i < lineIndex) {
        // Fully typed line
        visibleLines.push({ text, dramatic, complete: true });
      } else if (i === lineIndex) {
        // Currently typing line
        visibleLines.push({
          text: text.slice(0, charIndex),
          dramatic,
          complete: charIndex >= text.length,
          typing: charIndex < text.length,
        });
      }
    }
  }

  return {
    currentPage,
    totalPages: pages?.length || 0,
    visibleLines,
    typingComplete,
    allComplete,
    transitioning,
    showExit,
    advance,
  };
}
