/**
 * useGroundingState — sequence-driven state machine for 5-4-3-2-1 grounding
 *
 * Walks the user through five senses, counting down from 5 to 1.
 * Promise-based async sequence matching usePulseState pattern.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, GROUNDING_TEACHINGS } from '@/lib/constants';

const SENSES = [
  { id: 'see',   label: 'sight', count: 5, color: 'rgb(129,140,248)' },  // indigo-400
  { id: 'touch', label: 'touch', count: 4, color: 'rgb(34,211,238)' },   // cyan-400
  { id: 'hear',  label: 'hearing', count: 3, color: 'rgb(167,139,250)' }, // violet-400
  { id: 'smell', label: 'smell', count: 2, color: 'rgb(203,213,225)' },   // slate-300
  { id: 'taste', label: 'taste', count: 1, color: 'rgb(241,245,249)' },   // slate-100
];

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < GROUNDING_TEACHINGS.length) {
    return { teaching: GROUNDING_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = GROUNDING_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

export default function useGroundingState() {
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [phase, setPhase] = useState('PROMPT');
  const [currentSense, setCurrentSense] = useState(null);
  const [tapsRemaining, setTapsRemaining] = useState(0);
  const [tapsCompleted, setTapsCompleted] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.GROUNDING_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.GROUNDING_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const waitingForTapsRef = useRef(false);
  const tapCountRef = useRef(0);
  const resolveTapsRef = useRef(null);
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
      }, 377);
    }
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      seqTimerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  const waitForTaps = useCallback((n) => {
    return new Promise((resolve) => {
      tapCountRef.current = 0;
      waitingForTapsRef.current = n;
      setTapsRemaining(n);
      setTapsCompleted(0);

      interactionTimerRef.current = setTimeout(() => {
        if (waitingForTapsRef.current) {
          waitingForTapsRef.current = false;
          resolveTapsRef.current = null;
          interactionTimerRef.current = null;
          resolve();
        }
      }, 60000);

      resolveTapsRef.current = () => {
        if (interactionTimerRef.current) {
          clearTimeout(interactionTimerRef.current);
          interactionTimerRef.current = null;
        }
        resolve();
      };
    });
  }, []);

  const processTap = useCallback(() => {
    if (!waitingForTapsRef.current) return false;

    tapCountRef.current++;
    const completed = tapCountRef.current;
    const total = waitingForTapsRef.current;

    setTapsCompleted(completed);
    setTapsRemaining(total - completed);
    setTotalProgress((p) => p + 1);

    if (completed >= total) {
      waitingForTapsRef.current = false;
      if (resolveTapsRef.current) {
        resolveTapsRef.current();
        resolveTapsRef.current = null;
      }
    }

    return true;
  }, []);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // INTRO
    setPhase('INTRO');
    await delay(987);
    setGuide('you are here');
    await delay(2584);
    setGuide('let your senses bring you back');
    await delay(2584);

    // SEE
    setPhase('SEE');
    setCurrentSense(SENSES[0]);
    setGuide('look around you');
    await delay(1597);
    setGuide('find five things you can see');
    await delay(987);
    setGuide('tap once for each one');
    await waitForTaps(5);
    await delay(610);
    setGuide('five anchors, just through your eyes', true);
    await delay(1597);

    // TOUCH
    setPhase('TOUCH');
    setCurrentSense(SENSES[1]);
    setGuide('now reach out');
    await delay(1597);
    setGuide('four things you can touch');
    await delay(987);
    setGuide('tap for each one');
    await waitForTaps(4);
    await delay(610);
    setGuide('your hands already know where you are', true);
    await delay(1597);

    // HEAR
    setPhase('HEAR');
    setCurrentSense(SENSES[2]);
    setGuide('listen');
    await delay(1597);
    setGuide('three things you can hear');
    await delay(987);
    await waitForTaps(3);
    await delay(610);
    setGuide('the world is still here, holding you', true);
    await delay(1597);

    // SMELL
    setPhase('SMELL');
    setCurrentSense(SENSES[3]);
    setGuide('breathe in');
    await delay(1597);
    setGuide('two things you can smell');
    await delay(987);
    await waitForTaps(2);
    await delay(610);
    setGuide('closer now', true);
    await delay(1597);

    // TASTE
    setPhase('TASTE');
    setCurrentSense(SENSES[4]);
    setGuide('one last anchor');
    await delay(1597);
    setGuide('one thing you can taste');
    await delay(987);
    await waitForTaps(1);
    await delay(610);
    setGuide('');
    await delay(987);

    // TEACHING
    setPhase('TEACHING');
    setCurrentSense(null);
    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(1597);
    }
    setGuide('');
    await delay(2584);

    // COMPLETE
    setPhase('COMPLETE');
    setLastTeaching(teachingIndex);
    setGuide('you brought yourself back', true);
    await delay(2584);
    setComplete(true);
  }, [visits, lastTeaching, setLastTeaching, delay, waitForTaps, setGuide]);

  const enter = useCallback(() => {
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    guideText,
    guideBright,
    phase,
    currentSense,
    tapsRemaining,
    tapsCompleted,
    totalProgress,
    complete,
    isFirstVisit,
    visits,
    enter,
    processTap,
    clearSeqTimer,
  };
}
