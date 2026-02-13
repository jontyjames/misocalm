/**
 * Interval Timer Hook
 * State machine for meditation timer with Date.now() accuracy
 * Survives screen sleep — recalculates on wake
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  resumeAudio,
  disposeAudio,
  playIntervalBell,
  playReminderTone,
  playCompletionChime,
  playCountdownTone,
} from '@/lib/timerSounds';

/**
 * Phases: idle -> countdown -> practice -> bell -> reminder -> between -> complete
 * bell/between are transient (auto-advance)
 */

export default function useIntervalTimer({ durationMin, reminderMin, totalRounds, skipCountdown }) {
  const [phase, setPhase] = useState('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [countdownNumber, setCountdownNumber] = useState(3);

  const [paused, setPaused] = useState(false);

  const phaseStartRef = useRef(null);
  const phaseDurationRef = useRef(0);
  const pausedRemainingRef = useRef(0);
  const tickRef = useRef(null);
  const roundRef = useRef(1);

  const durationSec = durationMin * 60;
  const reminderSec = reminderMin * 60;
  const hasReminder = reminderMin > 0;

  const formatTime = (seconds) => {
    const s = Math.max(0, Math.ceil(seconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startPhase = useCallback((newPhase, duration) => {
    phaseStartRef.current = Date.now();
    phaseDurationRef.current = duration;
    setPhase(newPhase);
    setTimeRemaining(duration);
  }, []);

  // Advance to next phase when current one ends
  const advancePhase = useCallback(() => {
    const round = roundRef.current;

    // Which phase just ended?
    // We read the current phase from a ref-like approach, but since this
    // is called in the tick, we use a callback pattern
    setPhase((currentPhase) => {
      if (currentPhase === 'countdown') {
        // Countdown finished -> start practice
        startPhase('practice', durationSec);
        return 'practice';
      }
      if (currentPhase === 'practice') {
        playIntervalBell();
        if (hasReminder) {
          startPhase('reminder', reminderSec);
          return 'reminder';
        }
        // No reminder — go to between or complete
        if (round < totalRounds) {
          startPhase('between', 3);
          return 'between';
        }
        playCompletionChime();
        clearTick();
        return 'complete';
      }
      if (currentPhase === 'reminder') {
        playReminderTone();
        if (round < totalRounds) {
          startPhase('between', 3);
          return 'between';
        }
        playCompletionChime();
        clearTick();
        return 'complete';
      }
      if (currentPhase === 'between') {
        const nextRound = round + 1;
        roundRef.current = nextRound;
        setCurrentRound(nextRound);
        if (skipCountdown) {
          startPhase('practice', durationSec);
          return 'practice';
        }
        setCountdownNumber(3);
        startPhase('countdown', 3);
        return 'countdown';
      }
      return currentPhase;
    });
  }, [durationSec, reminderSec, hasReminder, totalRounds, skipCountdown, startPhase, clearTick]);

  // The tick — runs every 200ms for smooth display, uses Date.now() for accuracy
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete' || paused) {
      clearTick();
      return;
    }

    tickRef.current = setInterval(() => {
      const elapsed = (Date.now() - phaseStartRef.current) / 1000;
      const remaining = phaseDurationRef.current - elapsed;

      if (remaining <= 0) {
        advancePhase();
      } else {
        setTimeRemaining(remaining);

        // Countdown tones
        if (phase === 'countdown') {
          const newNum = Math.ceil(remaining);
          setCountdownNumber((prev) => {
            if (newNum < prev && newNum >= 1) {
              playCountdownTone(newNum);
            }
            return newNum;
          });
        }
      }
    }, 200);

    return clearTick;
  }, [phase, paused, advancePhase, clearTick]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      clearTick();
      disposeAudio();
    };
  }, [clearTick]);

  const start = useCallback(() => {
    resumeAudio();
    roundRef.current = 1;
    setCurrentRound(1);
    if (skipCountdown) {
      startPhase('practice', durationSec);
    } else {
      setCountdownNumber(3);
      startPhase('countdown', 3);
      playCountdownTone(3);
    }
  }, [startPhase, skipCountdown, durationSec]);

  const pause = useCallback(() => {
    const elapsed = (Date.now() - phaseStartRef.current) / 1000;
    pausedRemainingRef.current = Math.max(0, phaseDurationRef.current - elapsed);
    clearTick();
    setPaused(true);
  }, [clearTick]);

  const resume = useCallback(() => {
    // Reset phase start so remaining time is correct
    phaseStartRef.current = Date.now();
    phaseDurationRef.current = pausedRemainingRef.current;
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    clearTick();
    setPaused(false);
    setPhase('idle');
    setTimeRemaining(0);
    roundRef.current = 1;
    setCurrentRound(1);
  }, [clearTick]);

  const phaseLabel = {
    idle: '',
    countdown: '',
    practice: 'Practice',
    reminder: 'Grace period',
    between: 'Next round',
    complete: 'Complete',
  }[phase] || '';

  return {
    phase,
    currentRound,
    totalRounds,
    timeRemaining,
    countdownNumber,
    isRunning: phase !== 'idle' && phase !== 'complete',
    isPaused: paused,
    formattedTime: formatTime(timeRemaining),
    phaseLabel,
    start,
    pause,
    resume,
    stop,
  };
}
