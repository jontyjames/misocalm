/**
 * Onboarding - First Practice
 * Guided 4-7-8 breathing exercise
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Starfield, BreathingCircle } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

export default function FirstPracticePage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles, setTargetCycles] = useState(3);
  const [completed, setCompleted] = useState(false);

  const handleStart = () => {
    setIsActive(true);
    if (completed) {
      setCycleCount(0);
      setCompleted(false);
    }
  };

  const handleCycleComplete = () => {
    const newCount = cycleCount + 1;
    setCycleCount(newCount);

    // After 3 cycles, mark as completed
    if (newCount >= targetCycles) {
      setIsActive(false);
      setCompleted(true);
    }
  };

  const handleDoMoreRounds = () => {
    setCycleCount(0);
    setTargetCycles(4);
    setCompleted(false);
    setIsActive(true);
  };

  const handleContinue = () => {
    router.push(ROUTES.ONBOARDING_PROFILE);
  };

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 0.8s ease-out' }}>
        {/* Skip button at top */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleContinue}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-center max-w-md w-full pt-4">
            {/* Title */}
            <h1 className="text-3xl font-thin text-white mb-2">
              {completed ? 'Well done' : "Let's take a moment"}
            </h1>
            <p className="text-slate-300 font-light mb-6">
              {completed
                ? "You just did something good for yourself"
                : "This simple breathing technique can calm your nervous system in moments"}
            </p>

            {/* Round Counter - only show once started */}
            {isActive && !completed && (
              <div className="mb-8">
                <p className="text-lg font-light text-white">
                  Round <span className="text-cyan-400">{cycleCount + 1}</span> of {targetCycles}
                </p>
              </div>
            )}
          </div>

          {/* Breathing Circle - centered with flex grow */}
          <div className="flex-1 flex items-center justify-center w-full">
            <BreathingCircle
              isActive={isActive}
              onCycleComplete={handleCycleComplete}
              onStart={handleStart}
            />
          </div>

          <div className="text-center max-w-md w-full pb-4">

            {/* Progress dots */}
            {!completed && (
              <div className="mb-6">
                <div className="flex justify-center gap-3 mb-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`
                        w-3 h-3 rounded-full transition-all duration-300
                        ${cycleCount >= n
                          ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                          : cycleCount + 1 === n
                            ? 'bg-cyan-400/50 animate-pulse'
                            : 'bg-slate-700'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed message */}
            {completed && (
              <div className="mb-8">
                <p className="text-cyan-300 font-light">
                  {cycleCount} rounds completed
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-3">
              {completed ? (
                <>
                  <Button onClick={handleContinue} className="w-full" size="lg">
                    Continue
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDoMoreRounds}
                    className="w-full"
                    size="lg"
                  >
                    A few more rounds
                  </Button>
                </>
              ) : !isActive && (
                <Button onClick={handleStart} className="w-full" size="lg">
                  Begin
                </Button>
              )}
            </div>

            {/* Instructions - always visible when not completed */}
            {!completed && (
              <div className="mt-8 text-left p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <p className="text-sm text-slate-300 font-light mb-2">
                  <strong className="text-white">4-7-8 Breathing:</strong>
                </p>
                <ul className="text-sm text-slate-300 font-light space-y-1">
                  <li>• Breathe in through your nose for <span className="text-cyan-400">4 seconds</span></li>
                  <li>• Hold your breath for <span className="text-cyan-400">7 seconds</span></li>
                  <li>• Breathe out through your mouth for <span className="text-cyan-400">8 seconds</span></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
