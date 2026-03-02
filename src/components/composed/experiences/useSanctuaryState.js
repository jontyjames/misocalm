/**
 * useSanctuaryState — breath-driven state machine for the Sanctuary experience
 *
 * Detects breath cycles via microphone (low-frequency band).
 * 13 guided breath cycles across 3 phases: Foundation (3), Rising (5), Canopy (5).
 * All counts are prime. Promise-based async sequence.
 *
 * Breath detection: uses bands.low from useMicrophone. Inhale raises level,
 * exhale drops it. A full cycle = rise above threshold then fall below.
 * Only low frequencies register — trigger sounds (high-freq clicks, chewing)
 * pass through without affecting the canvas.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, SANCTUARY_TEACHINGS } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

// Breath detection thresholds (tuned for low-frequency breath)
const BREATH_IN_THRESHOLD = 0.08;
const BREATH_OUT_THRESHOLD = 0.03;
const MIN_BREATH_FRAMES = 23; // prime — minimum frames for a valid breath

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
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.SANCTUARY_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.SANCTUARY_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const analyticsStartRef = useRef(null);

  // Breath detection refs
  const waitingForBreathRef = useRef(false);
  const hasInhaledRef = useRef(false);
  const breathFramesRef = useRef(0);
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

  // Wait for one full breath cycle. Returns a promise.
  // Times out after 29s (prime) so sequence never hangs.
  const listenForBreath = useCallback(() => {
    return new Promise((resolve) => {
      waitingForBreathRef.current = true;
      hasInhaledRef.current = false;
      breathFramesRef.current = 0;

      interactionTimerRef.current = setTimeout(() => {
        if (waitingForBreathRef.current) {
          waitingForBreathRef.current = false;
          hasInhaledRef.current = false;
          breathFramesRef.current = 0;
          resolveBreathRef.current = null;
          interactionTimerRef.current = null;
          resolve({ amplitude: 0.5 }); // default amplitude on timeout
        }
      }, 34000);

      resolveBreathRef.current = (amplitude) => {
        if (interactionTimerRef.current) {
          clearTimeout(interactionTimerRef.current);
          interactionTimerRef.current = null;
        }
        resolve({ amplitude });
      };
    });
  }, []);

  // Called every frame from the guide component (fed low-freq band)
  const processBreathFrame = useCallback((lowBand) => {
    if (!waitingForBreathRef.current) return;

    // Detect inhale (breath in raises low-freq energy)
    if (lowBand > BREATH_IN_THRESHOLD && !hasInhaledRef.current) {
      hasInhaledRef.current = true;
      breathFramesRef.current = 0;
    }

    // Count frames during breath
    if (hasInhaledRef.current) {
      breathFramesRef.current++;
    }

    // Detect exhale completion (energy drops back down)
    if (hasInhaledRef.current && lowBand < BREATH_OUT_THRESHOLD && breathFramesRef.current > MIN_BREATH_FRAMES) {
      const amplitude = Math.min(1, lowBand * 5 + breathFramesRef.current / 144);
      waitingForBreathRef.current = false;
      hasInhaledRef.current = false;
      breathFramesRef.current = 0;
      if (resolveBreathRef.current) {
        resolveBreathRef.current(amplitude);
        resolveBreathRef.current = null;
      }
    }
  }, []);

  // One breath cycle that updates count and returns amplitude
  const doBreath = useCallback(async () => {
    const result = await listenForBreath();
    setBreathCount(c => c + 1);
    return result;
  }, [listenForBreath]);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // INTRO — centred, letter-by-letter
    setPhase(PHASES.INTRO);
    setIntroActive(true);
    await delay(610);
    setGuide('breathe', false);
    await delay(2584);
    setGuide('just breathe', false);
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
    // Free play: keep detecting breaths to add geometry
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
    isFirstVisit,
    visits,
    enter,
    processBreathFrame,
    clearSeqTimer,
  };
}
