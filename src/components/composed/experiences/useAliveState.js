/**
 * useAliveState — guided-to-solo breath state machine for Alive
 *
 * 11 breaths (prime). 3 guided + 8 solo. Same flow every visit.
 * No tiers. Everyone gets the full gentle landing every time.
 * Slide detection extracted to useSlideDetection.
 *
 * Opening: welcome → "you are here" → "let's take a breath" →
 * exhale countdown 3-2-1-0 → deep inhale → screen intro → 3 guided → 8 solo.
 *
 * Sacred numbers: 11 breaths (prime), 3 guided (prime), timing Fibonacci,
 * thresholds phi pair (0.382/0.618).
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, ALIVE_TEACHINGS, FIBONACCI_TIMING } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';
import { lerpColor } from './ColourRibbon';
import useSlideDetection from './useSlideDetection';

const TOTAL_BREATHS = 11;
const GUIDED_COUNT = 3;
const SOLO_COUNT = TOTAL_BREATHS - GUIDED_COUNT;

function generateTreePalette() {
  const base = Math.random();
  const PHI = 0.618033988749895;
  return Array.from({ length: 5 }, (_, i) => lerpColor((base + i * PHI) % 1));
}

const PHASES = {
  PROMPT: 'PROMPT',
  OPENING: 'OPENING',
  GUIDED: 'GUIDED',
  SOLO: 'SOLO',
  TEACHING: 'TEACHING',
  COMPLETE: 'COMPLETE',
  FREE_PLAY: 'FREE_PLAY',
};

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < ALIVE_TEACHINGS.length) {
    return { teaching: ALIVE_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = ALIVE_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

export default function useAliveState() {
  const slide = useSlideDetection();
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [phase, setPhase] = useState(PHASES.PROMPT);
  const [complete, setComplete] = useState(false);
  const [freePlay, setFreePlay] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [treePalette, setTreePalette] = useState(null);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.ALIVE_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.ALIVE_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const analyticsStartRef = useRef(null);
  const seqTimerRef = useRef(null);
  const guideTimerRef = useRef(null);

  const clearSeqTimer = useCallback(() => {
    [seqTimerRef, guideTimerRef].forEach(ref => {
      if (ref.current) { clearTimeout(ref.current); ref.current = null; }
    });
    slide.cleanup();
  }, [slide.cleanup]);

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
      }, FIBONACCI_TIMING.flow);
    }
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      seqTimerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  const doBreath = useCallback(async (cues) => {
    const result = await slide.listenForSlide(cues);
    setBreathCount(c => c + 1);
    return result;
  }, [slide.listenForSlide]);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // === OPENING ===
    setPhase(PHASES.OPENING);

    setGuide('welcome');
    await delay(FIBONACCI_TIMING.sacred);
    setGuide('you are here');
    await delay(FIBONACCI_TIMING.ceremony);
    setGuide("let's take a breath");
    await delay(FIBONACCI_TIMING.sacred);

    // Guided exhale countdown
    setGuide('start by breathing out');
    await delay(FIBONACCI_TIMING.sacred);
    setGuide('3');
    await delay(FIBONACCI_TIMING.breathe);
    setGuide('2');
    await delay(FIBONACCI_TIMING.breathe);
    setGuide('1');
    await delay(FIBONACCI_TIMING.breathe);
    setGuide('0');
    await delay(FIBONACCI_TIMING.breathe);

    // Deep inhale hold (~4s)
    setGuide('now breathe in');
    await delay(FIBONACCI_TIMING.long);

    setGuide('');
    await delay(FIBONACCI_TIMING.shift);

    // === GUIDED ===
    setPhase(PHASES.GUIDED);

    // Introduce screen interaction
    setGuide('now we will interact with the screen\nwhile we breathe');
    await delay(FIBONACCI_TIMING.long);
    setGuide('the bar on the right\nwill follow your breath');
    await delay(FIBONACCI_TIMING.long);
    setGuide('');
    await delay(FIBONACCI_TIMING.shift);

    // Breath 1 — timed demo (no touch required)
    setGuide('swipe down to breathe out');
    await delay(FIBONACCI_TIMING.sacred);
    setGuide('swipe up to breathe in');
    await delay(FIBONACCI_TIMING.sacred);
    setBreathCount(c => c + 1);
    await delay(FIBONACCI_TIMING.flow);
    setGuide('');
    await delay(FIBONACCI_TIMING.shift);

    // Breath 2 — real touch
    setGuide('another one');
    await doBreath();
    await delay(FIBONACCI_TIMING.flow);
    setGuide('');
    await delay(FIBONACCI_TIMING.shift);

    // Breath 3 — real touch
    setGuide('one more together');
    await doBreath();
    await delay(FIBONACCI_TIMING.flow);
    setGuide('');
    await delay(FIBONACCI_TIMING.shift);

    // Bridge
    setGuide('now 8 on your own');
    await delay(FIBONACCI_TIMING.sacred);
    setGuide('');
    await delay(FIBONACCI_TIMING.ease);

    // === SOLO (8 breaths) ===
    setPhase(PHASES.SOLO);
    for (let i = 0; i < SOLO_COUNT; i++) {
      await doBreath();
      await delay(FIBONACCI_TIMING.flow);
    }

    await delay(FIBONACCI_TIMING.breathe);
    setGuide('');
    await delay(FIBONACCI_TIMING.ceremony);

    // === TEACHING ===
    setPhase(PHASES.TEACHING);
    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(FIBONACCI_TIMING.sacred);
    }
    setGuide('');
    await delay(FIBONACCI_TIMING.sacred);

    // === COMPLETE ===
    setPhase(PHASES.COMPLETE);
    setLastTeaching(teachingIndex);
    setGuide('you are alive', true);
    await delay(FIBONACCI_TIMING.sacred);
    track(EVENTS.EXPERIENCE_COMPLETED, {
      experience_id: 'alive', experience_name: 'Alive',
      duration_ms: Date.now() - (analyticsStartRef.current || Date.now()),
    });
    setComplete(true);
    await delay(FIBONACCI_TIMING.ceremony);
    setGuide('');
    setFreePlay(true);
    setPhase(PHASES.FREE_PLAY);

    const freeLoop = async () => {
      while (true) {
        await doBreath();
        await delay(FIBONACCI_TIMING.flow);
      }
    };
    freeLoop();
  }, [visits, lastTeaching, setLastTeaching, delay, doBreath, setGuide]);

  const enter = useCallback(() => {
    analyticsStartRef.current = Date.now();
    track(EVENTS.EXPERIENCE_STARTED, { experience_id: 'alive', experience_name: 'Alive' });
    setTreePalette(generateTreePalette());
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, FIBONACCI_TIMING.ceremony);
  }, [setVisits, runSequence]);

  return {
    started,
    phase,
    guideText,
    guideBright,
    complete,
    freePlay,
    breathCount,
    breathPosition: slide.breathPosition,
    isTouching: slide.isTouching,
    isFirstVisit,
    visits,
    treePalette,
    totalBreaths: TOTAL_BREATHS,
    enter,
    processSlide: slide.processSlide,
    startTouch: slide.startTouch,
    endTouch: slide.endTouch,
    clearSeqTimer,
  };
}
