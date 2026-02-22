/**
 * TimerPlayer - Active timer orchestrator.
 * Composes TimerDisplay + TimerPulse + useIntervalTimer.
 * Nervous system guardian compliant: proper escape paths, no pressure framing,
 * warm completion language, Button components for all controls.
 */

'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { ExpansionBloom } from '@/components/composed';
import useIntervalTimer from '@/hooks/useIntervalTimer';
import useWakeLock from '@/hooks/useWakeLock';
import { FIBONACCI_TIMING } from '@/lib/constants';
import { computeProgress } from '@/lib/timerConstants';
import TimerDisplay from './TimerDisplay';
import TimerPulse from './TimerPulse';

export default function TimerPlayer({
  tool,
  config,
  onBack,
  onJournal,
  onReturnHome,
  onPracticeAgain,
  onComplete,
}) {
  const {
    phase, currentRound, totalRounds, timeRemaining,
    countdownNumber, isRunning, isPaused, formattedTime,
    phaseLabel, start, pause, resume, stop,
  } = useIntervalTimer({
    durationMin: config.duration,
    reminderMin: config.reminder,
    totalRounds: config.rounds,
    skipCountdown: config.skipCountdown || false,
  });

  const durationSec = config.duration * 60;
  const reminderSec = config.reminder * 60;

  const [showBloom, setShowBloom] = useState(false);
  const [bloomDone, setBloomDone] = useState(false);

  useWakeLock(phase !== 'idle' && phase !== 'complete');

  useEffect(() => { start(); }, [start]);

  useEffect(() => {
    if (phase === 'complete' && !bloomDone) setShowBloom(true);
  }, [phase, bloomDone]);

  const handleBloomComplete = () => { setShowBloom(false); setBloomDone(true); onComplete?.(); };

  const isComplete = phase === 'complete' && bloomDone;
  const progress = computeProgress(phase, timeRemaining, durationSec, reminderSec);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <ExpansionBloom active={showBloom} solfeggio="violet" onComplete={handleBloomComplete} />

      {/* Phase label above circle - "Round X" without obligation framing */}
      {!isComplete && (
        <div className="text-center mb-8 mt-4">
          <p className="text-lg font-light text-white">
            {totalRounds > 1 && <><span className="text-cyan-400">Round {currentRound}</span> &middot; </>}
            {phaseLabel}
          </p>
        </div>
      )}

      {/* Timer visualisation */}
      <div className="flex-1 flex items-center justify-center">
        <TimerPulse phase={phase}>
          <TimerDisplay
            formattedTime={formattedTime}
            countdownNumber={countdownNumber}
            phase={phase}
            progress={progress}
          />
        </TimerPulse>
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center" style={{ minHeight: '12rem' }}>
        {/* Completion */}
        {isComplete && (
          <div className="mb-6 text-center" style={{ animation: `fadeIn ${FIBONACCI_TIMING.ease}ms ease-out` }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-400/15 border border-violet-400/30 flex items-center justify-center">
              <Check className="w-6 h-6 text-violet-400" />
            </div>
            <p
              className="text-violet-300 font-light mb-1"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              You showed up for yourself
            </p>
            <p className="text-slate-300 text-sm font-light">
              {config.duration} minutes of stillness{totalRounds > 1 ? `, ${totalRounds} rounds` : ''}
            </p>
          </div>
        )}

        {/* Completion controls */}
        {isComplete && (
          <div className="w-full max-w-xs space-y-3 mb-4">
            <Button onClick={onJournal} className="w-full" size="lg">Journal how you feel</Button>
            <Button variant="secondary" onClick={onReturnHome} className="w-full" size="lg">Return to sanctuary</Button>
            <Button variant="ghost" onClick={onPracticeAgain} className="w-full" size="md">Practice again</Button>
          </div>
        )}

        {/* Pause overlay */}
        {isPaused && (
          <div className="w-full max-w-xs space-y-3 mb-4" style={{ animation: `fadeIn ${FIBONACCI_TIMING.flow}ms ease-out` }}>
            <Button onClick={resume} className="w-full" size="lg">Resume</Button>
            <Button variant="secondary" onClick={() => { stop(); onReturnHome(); }} className="w-full" size="lg">Finish here</Button>
            <Button variant="ghost" onClick={onReturnHome} className="w-full" size="md">Return to sanctuary</Button>
          </div>
        )}
      </div>

      {/* Active controls - proper Button components with 44x44px touch targets */}
      {isRunning && !isPaused && (
        <div className="fixed bottom-0 left-0 right-0 pb-10 pt-4 flex justify-center gap-6 z-20">
          <Button variant="ghost" size="md" onClick={pause}>Pause</Button>
          <Button variant="ghost" size="md" onClick={onReturnHome}>Return to sanctuary</Button>
        </div>
      )}
    </div>
  );
}
