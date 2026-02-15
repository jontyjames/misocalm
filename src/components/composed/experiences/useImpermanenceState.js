/**
 * useImpermanenceState — sequence-driven state machine
 *
 * Ported from the standalone HTML experience. Uses a step array
 * instead of phase/subStep complexity. Handles sound detection
 * via frame-counted silence (matching the original's proven timing).
 *
 * Visit tracking + teaching rotation stored in localStorage.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS, IMPERMANENCE_TEACHINGS } from '@/lib/constants';

const LOUD_THRESHOLD = 0.06;
const SILENCE_THRESHOLD = 0.025;
const SILENCE_FRAMES = 90;

function pickTeaching(visitIndex, lastIndex) {
  if (visitIndex < IMPERMANENCE_TEACHINGS.length) {
    return { teaching: IMPERMANENCE_TEACHINGS[visitIndex], index: visitIndex };
  }
  const pool = IMPERMANENCE_TEACHINGS.map((t, i) => ({ t, i })).filter(({ i }) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { teaching: pick.t, index: pick.i };
}

export default function useImpermanenceState() {
  const [started, setStarted] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [guideBright, setGuideBright] = useState(false);
  const [showYouLabel, setShowYouLabel] = useState(false);
  const [freePlay, setFreePlay] = useState(false);
  const [visits, setVisits] = useLocalStorage(STORAGE_KEYS.IMPERMANENCE_VISITS, 0);
  const [lastTeaching, setLastTeaching] = useLocalStorage(STORAGE_KEYS.IMPERMANENCE_LAST_TEACHING, -1);

  const isFirstVisit = visits === 0;

  // Sound detection state (frame-based, matching original)
  const waitingForSoundRef = useRef(false);
  const hasBeenLoudRef = useRef(false);
  const silenceCounterRef = useRef(0);
  const resolveSound = useRef(null);

  const seqTimerRef = useRef(null);

  const clearSeqTimer = useCallback(() => {
    if (seqTimerRef.current) {
      clearTimeout(seqTimerRef.current);
      seqTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearSeqTimer(), [clearSeqTimer]);

  const setGuide = useCallback((text, bright = false) => {
    // Brief blank before new text for transition
    setGuideText('');
    setGuideBright(false);
    if (text) {
      setTimeout(() => {
        setGuideText(text);
        setGuideBright(bright);
      }, 400);
    }
  }, []);

  // Wait for a sound + silence cycle. Returns a promise.
  const listenForSound = useCallback(() => {
    return new Promise((resolve) => {
      waitingForSoundRef.current = true;
      hasBeenLoudRef.current = false;
      silenceCounterRef.current = 0;
      resolveSound.current = resolve;
    });
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      seqTimerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  // Called every frame from the guide component
  const processSoundFrame = useCallback((audioLevel) => {
    if (!waitingForSoundRef.current) return;
    const smoothed = audioLevel; // already smoothed in useMicrophone

    if (smoothed > LOUD_THRESHOLD && !hasBeenLoudRef.current) {
      hasBeenLoudRef.current = true;
      setGuide(''); // clear prompt while sound plays
    }

    if (hasBeenLoudRef.current && smoothed < SILENCE_THRESHOLD) {
      silenceCounterRef.current++;
      if (silenceCounterRef.current > SILENCE_FRAMES) {
        waitingForSoundRef.current = false;
        hasBeenLoudRef.current = false;
        silenceCounterRef.current = 0;
        if (resolveSound.current) {
          resolveSound.current();
          resolveSound.current = null;
        }
      }
    } else if (hasBeenLoudRef.current) {
      silenceCounterRef.current = 0;
    }
  }, [setGuide]);

  // The guided sequence (async, matching original flow)
  const runSequence = useCallback(async () => {
    const { teaching, index: teachingIndex } = pickTeaching(visits, lastTeaching);

    // Show "you" label
    setShowYouLabel(true);
    await delay(1500);

    // Round 1
    setGuide('make any sound');
    await delay(2000);
    await listenForSound();
    await delay(1200);
    setGuide('all sounds go', true);
    await delay(2000);
    setGuide('but you still remain', true);
    await delay(3000);
    setGuide('');
    await delay(2500);

    // Round 2
    setGuide('again\na little louder');
    await delay(2000);
    await listenForSound();
    await delay(1200);
    setGuide('that one filled the whole space');
    await delay(2000);
    setGuide('and it still went', true);
    await delay(3000);
    setGuide('');
    await delay(2500);

    // Round 3
    setGuide('one more');
    await delay(2000);
    await listenForSound();
    setGuide('');
    await delay(2000);

    // Teaching
    for (const line of teaching.lines) {
      setGuide(line, true);
      await delay(3500);
    }
    setGuide('');
    await delay(3000);

    // Free play
    setLastTeaching(teachingIndex);
    setGuide('play as long as you like');
    await delay(3000);
    setFreePlay(true);
    waitingForSoundRef.current = true; // enable continuous sound detection
  }, [visits, lastTeaching, setLastTeaching, delay, listenForSound, setGuide]);

  const enter = useCallback(() => {
    setVisits((v) => v + 1);
    setStarted(true);
    // Start sequence after prompt screen fades
    seqTimerRef.current = setTimeout(runSequence, 1597);
  }, [setVisits, runSequence]);

  return {
    started,
    guideText,
    guideBright,
    showYouLabel,
    freePlay,
    isFirstVisit,
    visits,
    enter,
    processSoundFrame,
    clearSeqTimer,
  };
}
