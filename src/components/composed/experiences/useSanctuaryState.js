/**
 * useSanctuaryState — guided-to-solo breath state machine for Sanctuary
 *
 * 11 breaths (prime). 3 guided with mid-breath cues, 8 solo.
 * 3-tier return visits: FULL (1-2), FAMILIAR (3-6), MINIMAL (7+).
 * Slide detection extracted to useSlideDetection.
 *
 * Sacred numbers: 11 breaths (prime), 3 guided (prime), timing Fibonacci,
 * thresholds phi pair (0.382/0.618).
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, SANCTUARY_TEACHINGS, FIBONACCI_TIMING } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';
import { lerpColor } from './ColourRibbon';
import useSlideDetection from './useSlideDetection';

const TOTAL_BREATHS = 11;

function generateTreePalette() {
  const positions = Array.from({ length: 5 }, () => Math.random());
  positions.sort((a, b) => a - b);
  return positions.map(t => lerpColor(t));
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

const GUIDED_CUES = [
  { inhale: 'breathe in', exhale: 'let it go' },
  { inhale: 'breathe in', exhale: 'softer' },
  { inhale: 'breathe in', exhale: 'good' },
];

function getVisitTier(visits) {
  if (visits <= 1) return 'FULL';
  if (visits <= 5) return 'FAMILIAR';
  return 'MINIMAL';
}

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < SANCTUARY_TEACHINGS.length) {
    return { teaching: SANCTUARY_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = SANCTUARY_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

export default function useSanctuaryState() {
  const slide = useSlideDetection();
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [phase, setPhase] = useState(PHASES.PROMPT);
  const [complete, setComplete] = useState(false);
  const [freePlay, setFreePlay] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [treePalette, setTreePalette] = useState(null);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.SANCTUARY_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.SANCTUARY_LAST_TEACHING, -1);

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
    const tier = getVisitTier(visits);
    const guidedCount = tier === 'FULL' ? 3 : tier === 'FAMILIAR' ? 2 : 1;
    const soloCount = TOTAL_BREATHS - guidedCount;
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // === OPENING ===
    setPhase(PHASES.OPENING);
    await delay(FIBONACCI_TIMING.ease);

    if (tier === 'FULL') {
      setGuide('your body is already here');
      await delay(FIBONACCI_TIMING.sacred);
      setGuide('breathe out');
      await delay(FIBONACCI_TIMING.sacred);
      setGuide('breathe in');
      await delay(FIBONACCI_TIMING.sacred);
      setGuide(TOTAL_BREATHS + ' breaths together');
      await delay(FIBONACCI_TIMING.sacred);
      setGuide('touch anywhere and slide up to breathe in\nslide down to breathe out\nthe bar on the right follows your breath');
      await delay(FIBONACCI_TIMING.long);
    } else if (tier === 'FAMILIAR') {
      setGuide('welcome back');
      await delay(FIBONACCI_TIMING.ceremony);
      setGuide(TOTAL_BREATHS + ' breaths');
      await delay(FIBONACCI_TIMING.ceremony);
    } else {
      setGuide('welcome back');
      await delay(FIBONACCI_TIMING.sacred);
    }

    setGuide('');
    await delay(FIBONACCI_TIMING.ease);

    // === GUIDED ===
    setPhase(PHASES.GUIDED);
    for (let i = 0; i < guidedCount; i++) {
      const cue = GUIDED_CUES[i] || GUIDED_CUES[0];
      await doBreath({
        onInhale: () => setGuide(cue.inhale),
        onExhale: () => setGuide(cue.exhale, true),
      });
      await delay(FIBONACCI_TIMING.flow);
      setGuide('');
      await delay(FIBONACCI_TIMING.shift);
    }

    setGuide('there you go', true);
    await delay(FIBONACCI_TIMING.ceremony);
    setGuide('');
    await delay(FIBONACCI_TIMING.ease);

    // === SOLO ===
    setPhase(PHASES.SOLO);
    for (let i = 0; i < soloCount; i++) {
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
    setGuide('your sanctuary stands', true);
    await delay(FIBONACCI_TIMING.sacred);
    track(EVENTS.EXPERIENCE_COMPLETED, {
      experience_id: 'sanctuary', experience_name: 'Sanctuary',
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
    track(EVENTS.EXPERIENCE_STARTED, { experience_id: 'sanctuary', experience_name: 'Sanctuary' });
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
