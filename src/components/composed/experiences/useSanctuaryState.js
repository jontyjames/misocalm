/**
 * useSanctuaryState — slide-driven state machine for the Sanctuary experience
 *
 * Detects breath cycles via vertical slide gesture (up = inhale, down = exhale).
 * 13 guided breath cycles across 3 phases: Foundation (3), Rising (5), Canopy (5).
 * All counts are prime. Promise-based async sequence.
 *
 * Slide detection: user slides finger/pointer UP past 0.382 threshold (phi complement),
 * then DOWN past 0.618 threshold (phi) to complete one breath cycle.
 * No microphone, no permissions, full user control.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, SANCTUARY_TEACHINGS } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';
import { lerpColor } from './ColourRibbon';

// 5 random solfeggio-arc positions → sorted → interpolated colours
function generateTreePalette() {
  const positions = Array.from({ length: 5 }, () => Math.random());
  positions.sort((a, b) => a - b);
  return positions.map(t => lerpColor(t));
}

// Slide detection thresholds (normalised Y: 0 = top, 1 = bottom)
const SLIDE_UP_THRESHOLD = 0.382;   // phi complement — finger must cross above this
const SLIDE_DOWN_THRESHOLD = 0.618; // phi — finger must cross below this to complete cycle
const SLIDE_TIMEOUT = 29000;        // prime — timeout so sequence never hangs

// Phases
const PHASES = {
  PROMPT: 'PROMPT',
  INTRO: 'INTRO',
  FOUNDATION: 'FOUNDATION',
  RISING: 'RISING',
  CANOPY: 'CANOPY',
  TEACHING: 'TEACHING',
  COMPLETE: 'COMPLETE',
};

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < SANCTUARY_TEACHINGS.length) {
    return { teaching: SANCTUARY_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = SANCTUARY_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

export default function useSanctuaryState() {
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [phase, setPhase] = useState(PHASES.PROMPT);
  const [complete, setComplete] = useState(false);
  const [freePlay, setFreePlay] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathPosition, setBreathPosition] = useState(0.5); // 0=top, 1=bottom
  const [treePalette, setTreePalette] = useState(null);
  const [isTouching, setIsTouching] = useState(false);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.SANCTUARY_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.SANCTUARY_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const analyticsStartRef = useRef(null);

  // Slide detection refs
  const waitingForSlideRef = useRef(false);
  const hasSlideUpRef = useRef(false);   // finger crossed above SLIDE_UP_THRESHOLD
  const peakYRef = useRef(1);            // minimum Y reached during inhale (for amplitude)
  const resolveBreathRef = useRef(null);

  const seqTimerRef = useRef(null);
  const guideTimerRef = useRef(null);
  const interactionTimerRef = useRef(null);

  const clearSeqTimer = useCallback(() => {
    [seqTimerRef, guideTimerRef, interactionTimerRef].forEach(ref => {
      if (ref.current) { clearTimeout(ref.current); ref.current = null; }
    });
    resolveBreathRef.current = null;
  }, []);

  useEffect(() => () => clearSeqTimer(), [clearSeqTimer]);

  const setGuide = useCallback((text, bright = false) => {
    if (guideTimerRef.current) { clearTimeout(guideTimerRef.current); guideTimerRef.current = null; }
    setGuideText('');
    setGuideBright(false);
    if (text) {
      guideTimerRef.current = setTimeout(() => {
        setGuideText(text);
        setGuideBright(bright);
        guideTimerRef.current = null;
      }, 377); // fib-flow
    }
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      seqTimerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  // Process slide input — called on pointer/touch move with normalised Y (0=top, 1=bottom)
  const processSlide = useCallback((normalizedY) => {
    setBreathPosition(normalizedY);

    if (!waitingForSlideRef.current) return;

    // Detect slide up (inhale) — finger crosses above threshold
    if (normalizedY < SLIDE_UP_THRESHOLD && !hasSlideUpRef.current) {
      hasSlideUpRef.current = true;
      peakYRef.current = normalizedY;
    }

    // Track peak (minimum Y) during inhale for amplitude
    if (hasSlideUpRef.current && normalizedY < peakYRef.current) {
      peakYRef.current = normalizedY;
    }

    // Detect slide down (exhale) — finger crosses below threshold after inhale
    if (hasSlideUpRef.current && normalizedY > SLIDE_DOWN_THRESHOLD) {
      // Amplitude: deeper slide = stronger geometry (0-1 based on how high they went)
      const amplitude = Math.min(1, Math.max(0.3, 1 - peakYRef.current / SLIDE_UP_THRESHOLD));
      waitingForSlideRef.current = false;
      hasSlideUpRef.current = false;
      peakYRef.current = 1;

      // Haptic feedback (13ms, prime — matches Mandala)
      if (navigator.vibrate) navigator.vibrate(13);

      if (resolveBreathRef.current) {
        resolveBreathRef.current(amplitude);
        resolveBreathRef.current = null;
      }
    }
  }, []);

  // Wait for one full slide cycle. Returns a promise.
  const listenForSlide = useCallback(() => {
    return new Promise((resolve) => {
      waitingForSlideRef.current = true;
      hasSlideUpRef.current = false;
      peakYRef.current = 1;

      interactionTimerRef.current = setTimeout(() => {
        if (waitingForSlideRef.current) {
          waitingForSlideRef.current = false;
          hasSlideUpRef.current = false;
          peakYRef.current = 1;
          resolveBreathRef.current = null;
          interactionTimerRef.current = null;
          resolve({ amplitude: 0.5 }); // default amplitude on timeout
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

  // One breath cycle that updates count and returns amplitude
  const doBreath = useCallback(async () => {
    const result = await listenForSlide();
    setBreathCount(c => c + 1);
    return result;
  }, [listenForSlide]);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // === BREATH THRESHOLD (universal) ===
    await delay(610);
    setGuide('your body is already here');
    await delay(2584);
    setGuide('breathe out');
    await delay(1597); // fib-ceremony — time to read and start exhaling
    setGuideText('breathe out\n3');
    await delay(987);
    setGuideText('breathe out\n2');
    await delay(987);
    setGuideText('breathe out\n1');
    await delay(987);
    setGuideText('breathe out\n0');
    await delay(610);
    setGuide('breathe in');
    await delay(4181); // fib — calm, unhurried inhale
    setGuide('now just breathe normally');
    await delay(2584);
    setGuide('slide up to breathe in\nslide down to breathe out');
    await delay(2584);
    setGuide('');
    await delay(987);

    // INTRO — centred, letter-by-letter
    setPhase(PHASES.INTRO);
    setIntroActive(true);
    await delay(610);
    setGuide('let your shoulders drop', false);
    await delay(2584);
    setGuide('breathe', false);
    await delay(2584);
    setGuide('and watch what you build', false);
    await delay(2584);
    setIntroActive(false);

    // FOUNDATION — 3 breath cycles (prime), ground-level arcs
    setPhase(PHASES.FOUNDATION);
    setGuide('lay the foundation', false);
    await delay(1597);
    setGuide('');
    await delay(610);

    for (let i = 0; i < 3; i++) {
      await doBreath();
      await delay(377);
    }

    await delay(610);
    setGuide('the ground holds', true);
    await delay(2584);

    // RISING — 5 breath cycles (prime), vertical pillars
    setPhase(PHASES.RISING);
    setGuide('let it rise', false);
    await delay(1597);
    setGuide('');
    await delay(610);

    for (let i = 0; i < 5; i++) {
      await doBreath();
      await delay(377);
    }

    await delay(610);
    setGuide('something is taking shape', true);
    await delay(2584);

    // CANOPY — 5 breath cycles (prime), overhead dome
    setPhase(PHASES.CANOPY);
    setGuide('close the sky', false);
    await delay(1597);
    setGuide('');
    await delay(610);

    for (let i = 0; i < 5; i++) {
      await doBreath();
      await delay(377);
    }

    await delay(987);
    setGuide('');
    await delay(1597);

    // TEACHING
    setPhase(PHASES.TEACHING);
    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(2584);
    }
    setGuide('');
    await delay(2584);

    // COMPLETE
    setPhase(PHASES.COMPLETE);
    setLastTeaching(teachingIndex);
    setGuide('your sanctuary stands', true);
    await delay(2584);
    track(EVENTS.EXPERIENCE_COMPLETED, { experience_id: 'sanctuary', experience_name: 'Sanctuary', duration_ms: Date.now() - (analyticsStartRef.current || Date.now()) });
    setComplete(true);
    await delay(1597);
    setGuide('');
    setFreePlay(true);
    // Free play: keep detecting slides to add geometry
    const freeLoop = async () => {
      while (true) {
        await doBreath();
        await delay(377);
      }
    };
    freeLoop();
  }, [visits, lastTeaching, setLastTeaching, delay, doBreath, setGuide]);

  const enter = useCallback(() => {
    analyticsStartRef.current = Date.now();
    track(EVENTS.EXPERIENCE_STARTED, { experience_id: 'sanctuary', experience_name: 'Sanctuary' });
    setTreePalette(generateTreePalette());
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    phase,
    guideText,
    guideBright,
    complete,
    freePlay,
    introActive,
    breathCount,
    breathPosition,
    isTouching,
    isFirstVisit,
    visits,
    treePalette,
    enter,
    processSlide,
    startTouch,
    endTouch,
    clearSeqTimer,
  };
}
