/**
 * useFocusState — sequence-driven state machine for attentional training
 *
 * Expanding tunnel with peripheral flashes. User notices flashes by tapping.
 * Promise-based async sequence matching useGroundingState pattern.
 *
 * Phases: PROMPT → INTRO → FIRST_BLOOM → DEEPENING → FLOW → TEACHING → COMPLETE
 * Flash counts: 5 + 5 + 7 = 17 (prime)
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, FOCUS_TEACHINGS } from '@/lib/constants';

// Flash capture window by visit tier (ms, all Fibonacci)
const CAPTURE_WINDOWS = {
  easy: 2584,     // visits 1-2: sacred, very generous
  moderate: 1597, // visits 3-5: ceremony
  focused: 987,   // visits 6+: breathe
};

function getWindowMs(visits) {
  if (visits <= 2) return CAPTURE_WINDOWS.easy;
  if (visits <= 5) return CAPTURE_WINDOWS.moderate;
  return CAPTURE_WINDOWS.focused;
}

// Guide text gap before appearing (fib-flow)
const GUIDE_GAP = 377;

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < FOCUS_TEACHINGS.length) {
    return { teaching: FOCUS_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = FOCUS_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

function randomAngle() {
  return Math.random() * Math.PI * 2;
}

export default function useFocusState() {
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [phase, setPhase] = useState('PROMPT');
  const [flashVisible, setFlashVisible] = useState(false);
  const [flashAngle, setFlashAngle] = useState(0);
  const [flashCaptured, setFlashCaptured] = useState(false);
  const [totalCaptured, setTotalCaptured] = useState(0);
  const [totalFlashes, setTotalFlashes] = useState(0);
  const [complete, setComplete] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.FOCUS_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.FOCUS_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const seqTimerRef = useRef(null);
  const guideTimerRef = useRef(null);
  const flashTimerRef = useRef(null);
  const captureDelayRef = useRef(null);
  const resolveFlashRef = useRef(null);

  const clearSeqTimer = useCallback(() => {
    [seqTimerRef, guideTimerRef, flashTimerRef, captureDelayRef].forEach(ref => {
      if (ref.current) { clearTimeout(ref.current); ref.current = null; }
    });
    resolveFlashRef.current = null;
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
      }, GUIDE_GAP);
    }
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      seqTimerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  // Show a flash and wait for capture or timeout
  const showFlash = useCallback((windowMs) => {
    return new Promise((resolve) => {
      const angle = randomAngle();
      setFlashAngle(angle);
      setFlashVisible(true);
      setFlashCaptured(false);
      setTotalFlashes(f => f + 1);

      // Timeout — flash fades naturally
      flashTimerRef.current = setTimeout(() => {
        setFlashVisible(false);
        resolveFlashRef.current = null;
        flashTimerRef.current = null;
        resolve(false);
      }, windowMs);

      // Store resolve for tap capture
      resolveFlashRef.current = () => {
        if (flashTimerRef.current) {
          clearTimeout(flashTimerRef.current);
          flashTimerRef.current = null;
        }
        setFlashCaptured(true);
        setTotalCaptured(c => c + 1);
        resolveFlashRef.current = null;
        // Brief pause to show capture effect before hiding
        captureDelayRef.current = setTimeout(() => {
          setFlashVisible(false);
          captureDelayRef.current = null;
        }, 233);
        resolve(true);
      };
    });
  }, []);

  const processTap = useCallback(() => {
    if (resolveFlashRef.current) {
      resolveFlashRef.current();
      return true;
    }
    return false;
  }, []);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);
    const windowMs = getWindowMs(visits + 1);

    // INTRO — centred, letter-by-letter
    setPhase('INTRO');
    setIntroActive(true);
    await delay(610);
    setGuide('be still', false);
    await delay(2584);
    setGuide('the tunnel opens from within', false);
    await delay(2584);
    setGuide('notice the light when it comes', false);
    await delay(2584);
    setIntroActive(false);

    // FIRST_BLOOM — 5 flashes (prime), gentle introduction
    setPhase('FIRST_BLOOM');
    setGuide('the light will come to you', false);
    await delay(1597);
    setGuide('');
    await delay(987);

    for (let i = 0; i < 5; i++) {
      await showFlash(windowMs);
      await delay(987);
    }

    await delay(610);
    setGuide('you are learning to see', true);
    await delay(2584);

    // DEEPENING — 5 flashes (prime), shorter gaps
    setPhase('DEEPENING');
    setGuide('it moves closer now', false);
    await delay(1597);
    setGuide('');
    await delay(610);

    for (let i = 0; i < 5; i++) {
      await showFlash(windowMs);
      await delay(610);
    }

    await delay(610);
    setGuide('something is settling', true);
    await delay(2584);

    // FLOW — 7 flashes (prime), the deepest phase, silence
    setPhase('FLOW');
    setGuide('');
    await delay(987);

    for (let i = 0; i < 7; i++) {
      await showFlash(windowMs);
      await delay(377);
    }

    await delay(987);
    setGuide('');
    await delay(1597);

    // TEACHING
    setPhase('TEACHING');
    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(2584);
    }
    setGuide('');
    await delay(2584);

    // COMPLETE
    setPhase('COMPLETE');
    setLastTeaching(teachingIndex);
    setGuide('the centre held you', true);
    await delay(2584);
    setComplete(true);
  }, [visits, lastTeaching, setLastTeaching, delay, showFlash, setGuide, setIntroActive]);

  const enter = useCallback(() => {
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    phase,
    guideText,
    guideBright,
    flashVisible,
    flashAngle,
    flashCaptured,
    totalCaptured,
    totalFlashes,
    complete,
    introActive,
    isFirstVisit,
    visits,
    enter,
    processTap,
    clearSeqTimer,
  };
}
