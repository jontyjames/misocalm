/**
 * useSlideDetection — slide gesture detection for breath-reactive experiences
 *
 * Detects breath cycles via vertical slide gesture (up = inhale, down = exhale).
 * Slide up past 0.382 (phi complement), down past 0.618 (phi) = one cycle.
 * Supports mid-breath callbacks (onInhale/onExhale) for guided breathing.
 * No microphone, no permissions, full user control.
 *
 * Sacred numbers: thresholds 0.382/0.618 (phi pair), timeout 29000 (prime),
 * haptic 13ms (prime), amplitude floor 0.3.
 */

'use client';

import { useState, useCallback, useRef } from 'react';

const SLIDE_UP_THRESHOLD = 0.382;   // phi complement — finger must cross above this
const SLIDE_DOWN_THRESHOLD = 0.618; // phi — finger must cross below this to complete cycle
const SLIDE_TIMEOUT = 29000;        // prime — timeout so sequence never hangs

export default function useSlideDetection() {
  const [breathPosition, setBreathPosition] = useState(0.5);
  const [isTouching, setIsTouching] = useState(false);

  const waitingForSlideRef = useRef(false);
  const hasSlideUpRef = useRef(false);
  const peakYRef = useRef(1);
  const resolveBreathRef = useRef(null);
  const interactionTimerRef = useRef(null);
  const onInhaleRef = useRef(null);
  const onExhaleRef = useRef(null);

  const processSlide = useCallback((normalizedY) => {
    setBreathPosition(normalizedY);
    if (!waitingForSlideRef.current) return;

    if (normalizedY < SLIDE_UP_THRESHOLD && !hasSlideUpRef.current) {
      hasSlideUpRef.current = true;
      peakYRef.current = normalizedY;
      if (onInhaleRef.current) onInhaleRef.current();
    }

    if (hasSlideUpRef.current && normalizedY < peakYRef.current) {
      peakYRef.current = normalizedY;
    }

    if (hasSlideUpRef.current && normalizedY > SLIDE_DOWN_THRESHOLD) {
      const amplitude = Math.min(1, Math.max(0.382, 1 - peakYRef.current / SLIDE_UP_THRESHOLD));
      waitingForSlideRef.current = false;
      hasSlideUpRef.current = false;
      peakYRef.current = 1;

      if (navigator.vibrate) navigator.vibrate(13);
      if (onExhaleRef.current) onExhaleRef.current();

      if (resolveBreathRef.current) {
        resolveBreathRef.current(amplitude);
        resolveBreathRef.current = null;
      }
    }
  }, []);

  const listenForSlide = useCallback(({ onInhale, onExhale } = {}) => {
    return new Promise((resolve) => {
      waitingForSlideRef.current = true;
      hasSlideUpRef.current = false;
      peakYRef.current = 1;
      onInhaleRef.current = onInhale || null;
      onExhaleRef.current = onExhale || null;

      interactionTimerRef.current = setTimeout(() => {
        if (waitingForSlideRef.current) {
          waitingForSlideRef.current = false;
          hasSlideUpRef.current = false;
          peakYRef.current = 1;
          resolveBreathRef.current = null;
          onInhaleRef.current = null;
          onExhaleRef.current = null;
          interactionTimerRef.current = null;
          resolve({ amplitude: 0.5 });
        }
      }, SLIDE_TIMEOUT);

      resolveBreathRef.current = (amplitude) => {
        if (interactionTimerRef.current) {
          clearTimeout(interactionTimerRef.current);
          interactionTimerRef.current = null;
        }
        resolve({ amplitude });
      };
    });
  }, []);

  const startTouch = useCallback(() => setIsTouching(true), []);
  const endTouch = useCallback(() => setIsTouching(false), []);

  const cleanup = useCallback(() => {
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
    waitingForSlideRef.current = false;
    resolveBreathRef.current = null;
    onInhaleRef.current = null;
    onExhaleRef.current = null;
  }, []);

  return {
    breathPosition,
    isTouching,
    processSlide,
    listenForSlide,
    startTouch,
    endTouch,
    cleanup,
  };
}
