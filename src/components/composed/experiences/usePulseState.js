/**
 * usePulseState — sequence-driven state machine + rhythm detection
 *
 * Tap-based heartbeat experience. Detects rhythm from tap intervals,
 * schedules haptic sync, and drives between-beat text display.
 * Promise-based async sequence matching useImpermanenceState pattern.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, PULSE_TEACHINGS } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

const TAP_BUFFER_SIZE = 13; // prime
const LOCK_THRESHOLD = 0.7;
const MIN_INTERVALS = 5;
const MAX_TAP_DURATION = 233; // fib-move — max pointerDown→pointerUp for valid tap
const MAX_TAP_MOVEMENT = 10; // px

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < PULSE_TEACHINGS.length) {
    return { teaching: PULSE_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = PULSE_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

function analyzeRhythm(timestamps) {
  if (timestamps.length < 2) return { avg: 0, consistency: 0, isLocked: false };

  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1]);
  }
  if (intervals.length < MIN_INTERVALS) return { avg: 0, consistency: 0, isLocked: false };

  // Drop highest + lowest (outlier smoothing)
  const sorted = [...intervals].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);

  const avg = trimmed.reduce((s, v) => s + v, 0) / trimmed.length;
  const variance = trimmed.reduce((s, v) => s + (v - avg) ** 2, 0) / trimmed.length;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 1 - stdDev / avg);
  const isLocked = consistency > LOCK_THRESHOLD && intervals.length >= MIN_INTERVALS;

  return { avg, consistency, isLocked };
}

export default function usePulseState() {
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [freePlay, setFreePlay] = useState(false);
  const [phase, setPhase] = useState('PROMPT');
  const [rhythmData, setRhythmData] = useState({ avg: 0, consistency: 0, isLocked: false });
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.PULSE_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.PULSE_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const analyticsStartRef = useRef(null);
  const tapTimestamps = useRef([]);
  const tapCountRef = useRef(0);
  const waitingForTapsRef = useRef(false);
  const resolveTapsRef = useRef(null);
  const seqTimerRef = useRef(null);
  const hapticIntervalRef = useRef(null);
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

  const clearHaptic = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  useEffect(() => () => { clearSeqTimer(); clearHaptic(); }, [clearSeqTimer, clearHaptic]);

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

  // Wait for N taps. Times out after 30s so sequence never hangs.
  const waitForTaps = useCallback((n) => {
    return new Promise((resolve) => {
      tapCountRef.current = 0;
      waitingForTapsRef.current = n;

      interactionTimerRef.current = setTimeout(() => {
        if (waitingForTapsRef.current) {
          waitingForTapsRef.current = false;
          const analysis = analyzeRhythm(tapTimestamps.current);
          resolveTapsRef.current = null;
          interactionTimerRef.current = null;
          resolve(analysis);
        }
      }, 30000);

      resolveTapsRef.current = (analysis) => {
        if (interactionTimerRef.current) {
          clearTimeout(interactionTimerRef.current);
          interactionTimerRef.current = null;
        }
        resolve(analysis);
      };
    });
  }, []);

  const lastTapTimeRef = useRef(0);

  // Start haptic sync — pulses between beats
  const startHapticSync = useCallback((avgInterval) => {
    clearHaptic();
    if (!navigator.vibrate) return;

    lastTapTimeRef.current = Date.now();
    hapticIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTapTimeRef.current;
      // Pulse at midpoint between beats
      if (elapsed >= avgInterval * 0.45 && elapsed <= avgInterval * 0.55) {
        navigator.vibrate(34);
      }
    }, 34); // check every fib-micro
  }, [clearHaptic]);

  // Called from guide component on valid tap
  const processTap = useCallback(() => {
    const now = Date.now();
    lastTapTimeRef.current = now;
    tapTimestamps.current.push(now);
    if (tapTimestamps.current.length > TAP_BUFFER_SIZE) {
      tapTimestamps.current.shift();
    }

    const analysis = analyzeRhythm(tapTimestamps.current);
    setRhythmData(analysis);

    if (waitingForTapsRef.current) {
      tapCountRef.current++;
      if (tapCountRef.current >= waitingForTapsRef.current) {
        waitingForTapsRef.current = false;
        if (resolveTapsRef.current) {
          resolveTapsRef.current(analysis);
          resolveTapsRef.current = null;
        }
      }
    }

    return analysis;
  }, []);

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
    setGuide('');
    await delay(987);

    // Phase: FIND_PULSE
    setPhase('FIND_PULSE');
    await delay(987);
    if (isFirstVisit) {
      setGuide('find your pulse\nyour wrist, your neck, your chest');
      await delay(2584); // fib-sacred
      setGuide('when you feel it');
      await delay(1597); // fib-ceremony — let them find it
      setGuide('tap with each beat');
    } else {
      setGuide('find your pulse\ntap with each beat');
    }
    await delay(2584);

    // Phase: FIRST_TAPS — 5 taps (prime)
    setPhase('FIRST_TAPS');
    setGuide('');
    const firstAnalysis = await waitForTaps(5);
    await delay(610);

    // Phase: RHYTHM_LOCK — 7 more taps (prime)
    setPhase('RHYTHM_LOCK');
    setGuide('keep tapping');
    const lockAnalysis = await waitForTaps(7);
    await delay(377);

    if (lockAnalysis.isLocked) {
      setGuide('there you are', true);
      startHapticSync(lockAnalysis.avg);
    } else {
      setGuide('there you are', true);
    }
    await delay(2584);

    // Phase: TEACHING — text between heartbeats
    setPhase('TEACHING');
    const interval = lockAnalysis.avg || 987; // fib-breathe fallback
    const useBeatSkip = interval < 500; // fast heart, show every other beat

    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(useBeatSkip ? interval * 2 : interval);
    }
    setGuide('');
    await delay(1597);

    // Phase: PORTRAIT
    setPhase('PORTRAIT');
    setGuide('look at what your heart drew', true);
    await delay(2584);
    setGuide('');
    await delay(987);

    // Phase: FREE_PLAY
    setPhase('FREE_PLAY');
    setLastTeaching(teachingIndex);
    clearHaptic();
    setGuide('play as long as you like');
    await delay(2584);
    track(EVENTS.EXPERIENCE_COMPLETED, { experience_id: 'pulse', experience_name: 'Pulse', duration_ms: Date.now() - (analyticsStartRef.current || Date.now()) });
    setFreePlay(true);
  }, [visits, lastTeaching, isFirstVisit, setLastTeaching, delay, waitForTaps, setGuide, startHapticSync, clearHaptic]);

  const enter = useCallback(() => {
    analyticsStartRef.current = Date.now();
    track(EVENTS.EXPERIENCE_STARTED, { experience_id: 'pulse', experience_name: 'Pulse' });
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    guideText,
    guideBright,
    freePlay,
    phase,
    rhythmData,
    isFirstVisit,
    visits,
    enter,
    processTap,
    clearSeqTimer,
  };
}
