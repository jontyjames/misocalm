/**
 * useGroundingState — sequence-driven state machine for 5-4-3-2-1 grounding
 *
 * Walks the user through five senses, counting down from 5 to 1.
 * Promise-based async sequence matching usePulseState pattern.
 *
 * Timing tiers: SLOW (contemplative), STANDARD, QUICK (snappy), FLASH (subliminal)
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

// Timing tiers — each controls how text appears and lingers
export const TIERS = {
  SLOW:     'SLOW',
  STANDARD: 'STANDARD',
  QUICK:    'QUICK',
  FLASH:    'FLASH',
};

// Gap before next text appears (0 = immediate for flash sequences)
const TIER_GAP = {
  SLOW: 377,
  STANDARD: 377,
  QUICK: 233,
  FLASH: 0,
};

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
  const [guideTier, setGuideTier] = useState(TIERS.STANDARD);
  const [phase, setPhase] = useState('PROMPT');
  const [currentSense, setCurrentSense] = useState(null);
  const [tapsRemaining, setTapsRemaining] = useState(0);
  const [tapsCompleted, setTapsCompleted] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.GROUNDING_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.GROUNDING_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;
  const waitingForTapsRef = useRef(false);
  const tapCountRef = useRef(0);
  const resolveTapsRef = useRef(null);
  const seqTimerRef = useRef(null);
  const interactionTimerRef = useRef(null);
  const onTapCallbackRef = useRef(null);

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

  // setGuide now accepts tier and immediate flag
  const setGuide = useCallback((text, bright = false, tier = TIERS.STANDARD, immediate = false) => {
    const gap = immediate ? 0 : TIER_GAP[tier] || 377;
    setGuideText('');
    setGuideBright(false);
    setGuideTier(tier);
    if (text) {
      if (gap === 0) {
        setGuideText(text);
        setGuideBright(bright);
      } else {
        setTimeout(() => {
          setGuideText(text);
          setGuideBright(bright);
        }, gap);
      }
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

    // Fire onTap callback for shape spawning
    onTapCallbackRef.current?.();

    if (completed >= total) {
      waitingForTapsRef.current = false;
      if (resolveTapsRef.current) {
        resolveTapsRef.current();
        resolveTapsRef.current = null;
      }
    }

    return true;
  }, []);

  // Allow parent to register tap callback
  const setOnTap = useCallback((fn) => {
    onTapCallbackRef.current = fn;
  }, []);

  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // INTRO — centred, larger, letter-by-letter
    setPhase('INTRO');
    setIntroActive(true);
    await delay(610);
    setGuide('you are here', false, TIERS.SLOW);
    await delay(2584);
    setGuide('your senses know the way', false, TIERS.SLOW);
    await delay(2584);
    setGuide('let them guide you', false, TIERS.SLOW);
    await delay(2584);
    setIntroActive(false);

    // SEE (indigo glow)
    setPhase('SEE');
    setCurrentSense(SENSES[0]);
    setGuide('we begin with sight', false, TIERS.SLOW);
    await delay(2584);
    setGuide('five things you can see\nlook around you\ntap for each one', false, TIERS.STANDARD);
    await waitForTaps(5);
    await delay(987);
    setGuide('five anchors, just through your eyes', true, TIERS.SLOW);
    await delay(2584);

    // TOUCH (cyan glow)
    setPhase('TOUCH');
    setCurrentSense(SENSES[1]);
    setGuide('now touch', false, TIERS.SLOW);
    await delay(2584);
    setGuide('four things you can feel\nreach out\ntap for each one', false, TIERS.STANDARD);
    await waitForTaps(4);
    await delay(987);
    setGuide('your hands already know where you are', true, TIERS.SLOW);
    await delay(2584);

    // HEAR (violet glow)
    setPhase('HEAR');
    setCurrentSense(SENSES[2]);
    setGuide('now listen', false, TIERS.SLOW);
    await delay(2584);
    setGuide('three things you can hear\nlet the sounds find you\ntap for each one', false, TIERS.STANDARD);
    await waitForTaps(3);
    await delay(987);
    setGuide('the world is still here, holding you', true, TIERS.SLOW);
    await delay(2584);

    // SMELL (slate-warm glow)
    setPhase('SMELL');
    setCurrentSense(SENSES[3]);
    setGuide('breathe in', false, TIERS.SLOW);
    await delay(2584);
    setGuide('two things you can smell\ntap for each one', false, TIERS.STANDARD);
    await waitForTaps(2);
    await delay(987);
    setGuide('closer now', true, TIERS.FLASH, true);
    await delay(987);

    // TASTE (white glow)
    setPhase('TASTE');
    setCurrentSense(SENSES[4]);
    setGuide('one last sense', false, TIERS.SLOW);
    await delay(2584);
    setGuide('one thing you can taste\ntap when you find it', false, TIERS.STANDARD);
    await waitForTaps(1);
    await delay(987);
    setGuide('');
    await delay(1597);

    // TEACHING
    setPhase('TEACHING');
    setCurrentSense(null);
    for (const line of teaching.lines) {
      setGuide(line, true, TIERS.SLOW);
      await delay(2584);
    }
    setGuide('');
    await delay(2584);

    // COMPLETE
    setPhase('COMPLETE');
    setLastTeaching(teachingIndex);
    setGuide('you brought yourself back', true, TIERS.SLOW);
    await delay(2584);
    setComplete(true);
  }, [visits, lastTeaching, setLastTeaching, delay, waitForTaps, setGuide, setIntroActive]);

  const enter = useCallback(() => {
    setVisits((v) => v + 1);
    setStarted(true);
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    guideText,
    guideBright,
    guideTier,
    phase,
    currentSense,
    tapsRemaining,
    tapsCompleted,
    totalProgress,
    complete,
    isFirstVisit,
    introActive,
    visits,
    enter,
    processTap,
    setOnTap,
    clearSeqTimer,
  };
}
