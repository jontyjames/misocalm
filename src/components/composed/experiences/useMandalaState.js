/**
 * useMandalaState — sequence-driven state machine for Mandala experience
 *
 * Touch-based progression through 7 phases (prime).
 * Promise-based async sequence matching useImpermanenceState pattern.
 * Visit tracking + teaching rotation in localStorage.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, MANDALA_TEACHINGS } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

// Symmetry progressions by visit (all primes)
const SYMMETRY_BY_VISIT = [
  [5, 7, 11, 13],   // Visit 1: guided up
  [7, 11, 13],      // Visit 2: faster
  [11, 13],         // Visit 3+: experienced
];

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < MANDALA_TEACHINGS.length) {
    return { teaching: MANDALA_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = MANDALA_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

function getSymmetryProgression(visitCount) {
  if (visitCount <= 1) return SYMMETRY_BY_VISIT[0];
  if (visitCount === 2) return SYMMETRY_BY_VISIT[1];
  return SYMMETRY_BY_VISIT[2];
}

export default function useMandalaState() {
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [showYouDot, setShowYouDot] = useState(false);
  const [freePlay, setFreePlay] = useState(false);
  const [symmetry, setSymmetry] = useState(5);
  const [phase, setPhase] = useState('PROMPT');
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.MANDALA_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.MANDALA_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const analyticsStartRef = useRef(null);
  const touchCountRef = useRef(0);
  const waitingForTouchRef = useRef(false);
  const resolveTouchRef = useRef(null);
  const seqTimerRef = useRef(null);
  const interactionTimerRef = useRef(null);

  const clearSeqTimer = useCallback(() => {
    if (seqTimerRef.current) {
      clearTimeout(seqTimerRef.current);
      seqTimerRef.current = null;
    }
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearSeqTimer(), [clearSeqTimer]);

  const setGuide = useCallback((text, bright = false) => {
    setGuideText('');
    setGuideBright(false);
    if (text) {
      setTimeout(() => {
        setGuideText(text);
        setGuideBright(bright);
      }, 377); // fib-flow
    }
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      seqTimerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  // Wait for N touches. Times out after 30s so sequence never hangs.
  const waitForTouches = useCallback((n) => {
    return new Promise((resolve) => {
      touchCountRef.current = 0;
      waitingForTouchRef.current = n;

      interactionTimerRef.current = setTimeout(() => {
        if (waitingForTouchRef.current) {
          waitingForTouchRef.current = false;
          resolveTouchRef.current = null;
          interactionTimerRef.current = null;
          resolve();
        }
      }, 30000);

      resolveTouchRef.current = () => {
        if (interactionTimerRef.current) {
          clearTimeout(interactionTimerRef.current);
          interactionTimerRef.current = null;
        }
        resolve();
      };
    });
  }, []);

  // Called from guide component on each touch event
  const processTouchEvent = useCallback((touchData) => {
    if (!waitingForTouchRef.current) return;
    touchCountRef.current++;
    if (touchCountRef.current >= waitingForTouchRef.current) {
      waitingForTouchRef.current = false;
      if (resolveTouchRef.current) {
        resolveTouchRef.current();
        resolveTouchRef.current = null;
      }
    }
  }, []);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);
    const progression = getSymmetryProgression(visits + 1);

    // Phase: FIRST_TOUCH
    setPhase('FIRST_TOUCH');
    setShowYouDot(true);
    await delay(987);
    setGuide('touch anywhere');
    await waitForTouches(1);
    await delay(610);

    // Phase: DISCOVERY — 3 touches (prime)
    setPhase('DISCOVERY');
    setSymmetry(progression[0]);
    setGuide('');
    await delay(377);
    setGuide('look what you made');
    await waitForTouches(3);
    await delay(987);

    // Phase: GROWTH — 5 more touches (prime)
    setPhase('GROWTH');
    if (progression.length > 1) setSymmetry(progression[1]);
    setGuide('the pattern is listening');
    await waitForTouches(5);
    await delay(610);
    if (progression.length > 2) setSymmetry(progression[2]);
    setGuide('');
    await delay(987);

    // Phase: TEACHING
    setPhase('TEACHING');
    if (progression.length > 3) setSymmetry(progression[3]);
    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(2584); // fib-sacred
    }
    setGuide('');
    await delay(1597);

    // Phase: INTEGRATION
    setPhase('INTEGRATION');
    setGuide('you are whole', true);
    await delay(2584);
    setGuide('');
    await delay(987);

    // Phase: FREE_PLAY
    setPhase('FREE_PLAY');
    setLastTeaching(teachingIndex);
    setSymmetry(progression[progression.length - 1]);
    setGuide('play as long as you like');
    await delay(2584);
    track(EVENTS.EXPERIENCE_COMPLETED, { experience_id: 'mandala', experience_name: 'Mandala', duration_ms: Date.now() - (analyticsStartRef.current || Date.now()) });
    setFreePlay(true);
  }, [visits, lastTeaching, setLastTeaching, delay, waitForTouches, setGuide]);

  const enter = useCallback(() => {
    analyticsStartRef.current = Date.now();
    track(EVENTS.EXPERIENCE_STARTED, { experience_id: 'mandala', experience_name: 'Mandala' });
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    guideText,
    guideBright,
    showYouDot,
    freePlay,
    symmetry,
    phase,
    isFirstVisit,
    visits,
    enter,
    processTouchEvent,
    clearSeqTimer,
  };
}
