/**
 * Onboarding - First Practice
 * Guided 4-7-8 breathing exercise with check-in after completion
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useReducedMotion } from '@/hooks';
import { Button, ProgressDots } from '@/components/ui';
import { BreathingCircle, BreathingAura } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 1;

export default function FirstPracticePage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles] = useState(3);
  const [completed, setCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [breathPhase, setBreathPhase] = useState('GET_READY');
  const [breathScale, setBreathScale] = useState(1);

  const handlePhaseChange = (phase, scale) => {
    setBreathPhase(phase);
    setBreathScale(scale);
  };

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

    if (newCount >= targetCycles) {
      setIsActive(false);
      setCompleted(true);
    }
  };

  const handleContinue = () => {
    router.push(ROUTES.ONBOARDING_TRIGGERS);
  };

  const handleFeedback = (feedback) => {
    if (feedback === 'try-again') {
      setCycleCount(0);
      setCompleted(false);
    } else if (feedback === 'same') {
      setFeedbackMessage("That's okay. It gets easier with practice.");
      setTimeout(() => handleContinue(), 1597);
    } else if (feedback === 'calmer') {
      setFeedbackMessage('This is the power of breathwork.');
      setTimeout(() => handleContinue(), 1597);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: prefersReduced ? 'none' : 'fadeIn 1.597s ease-out' }}>
        {/* Top bar: progress dots + skip */}
        <div className="flex items-center justify-between mb-6">
          <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
          {!completed && (
            <button
              onClick={handleContinue}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Not now
            </button>
          )}
        </div>

        {completed ? (
          /* ─── Completion + Check-in ─── */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {feedbackMessage ? (
              /* ─── Letter-by-letter feedback message ─── */
              <div className="flex items-center justify-center flex-wrap">
                {feedbackMessage.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`text-2xl text-white ${prefersReduced ? '' : 'opacity-0'}`}
                    style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 200,
                      animation: prefersReduced ? 'none' : `fadeIn 0.377s ease-out ${i * 0.034}s forwards`,
                      width: char === ' ' ? '0.4em' : undefined,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            ) : (
              /* ─── Check-in UI ─── */
              <>
                <h1
                  className="text-3xl text-white mb-3"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  Well done
                </h1>
                <p className="text-slate-300 font-light mb-2">
                  You just did something good for yourself.
                </p>
                <p className="text-cyan-300/70 font-light text-sm mb-10">
                  {cycleCount} rounds completed
                </p>

                <p
                  className="text-xl text-slate-200 mb-8"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  How do you feel?
                </p>

                <div className="space-y-3 w-full max-w-xs">
                  <Button
                    onClick={() => handleFeedback('calmer')}
                    className="w-full"
                    size="lg"
                  >
                    A little calmer
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleFeedback('same')}
                    className="w-full"
                    size="lg"
                  >
                    About the same
                  </Button>
                  <button
                    onClick={() => handleFeedback('try-again')}
                    className="w-full text-sm text-slate-300 hover:text-white transition-colors py-3"
                  >
                    I'd like to try again
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* ─── Practice Screen ─── */
          <div className="flex-1 flex flex-col items-center">
            {/* Header text — fades back when breathing is active */}
            <div className={`text-center max-w-md w-full transition-opacity duration-[610ms] ${isActive ? 'opacity-40' : 'opacity-100'}`}>
              <p
                className="text-xl text-white leading-relaxed mb-2"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, textWrap: 'balance' }}
              >
                Controlled breathing helps you find calm when sounds feel too much
              </p>
              <p className="text-sm text-indigo-300 font-light mb-4">
                So let's try a practice now
              </p>
              <p
                className="text-lg text-slate-200"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                Introducing the 4-7-8 breathing practice
              </p>
            </div>

            {/* Breathing Circle — centred in available space */}
            <div className="flex-1 flex items-center justify-center w-full pb-64">
              <BreathingAura phase={breathPhase} isActive={isActive} breathScale={breathScale} shape="circle">
                <BreathingCircle
                  isActive={isActive}
                  onCycleComplete={handleCycleComplete}
                  onPhaseChange={handlePhaseChange}
                  onStart={handleStart}
                />
              </BreathingAura>
            </div>

            {/* Bottom section — fixed to bottom of screen */}
            <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center px-6 pb-6 pt-16 text-center"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(2,6,23,0.6) 35%, rgb(2,6,23) 65%)' }}
            >
            <div className="max-w-md w-full">
              {/* Round progress dots — always takes space to prevent layout shift */}
              <div className="mb-6" style={{ minHeight: '2.5rem' }}>
                {isActive && (
                  <>
                    <p className="text-sm font-light text-slate-300 mb-3">
                      Round <span className="text-cyan-400">{cycleCount + 1}</span> of {targetCycles}
                    </p>
                    <div className="flex justify-center gap-3">
                      {Array.from({ length: targetCycles }, (_, n) => (
                        <div
                          key={n}
                          className={`
                            w-2.5 h-2.5 rounded-full transition-all duration-[233ms]
                            ${cycleCount > n
                              ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                              : cycleCount === n
                                ? 'bg-cyan-400/50 animate-pulse'
                                : 'bg-slate-700'
                            }
                          `}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Begin / Stop button */}
              <div className="mb-6">
                {isActive ? (
                  <Button onClick={() => { setIsActive(false); setCycleCount(0); }} variant="secondary" className="w-full" size="lg">
                    Stop
                  </Button>
                ) : (
                  <Button onClick={handleStart} className="w-full" size="lg">
                    Begin
                  </Button>
                )}
              </div>

              {/* 4-7-8 Breathing info with collapsible instructions — hidden during breathwork */}
              <div className={`relative transition-opacity duration-[610ms] ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="text-sm text-white font-light">What is 4-7-8 breathing?</span>
                    <span className="flex items-center gap-2 text-xs text-indigo-400">
                      How to do it
                      {showInstructions
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                      }
                    </span>
                  </button>
                </div>

                {showInstructions && (
                  <div
                    className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-slate-800/95 border border-slate-700/50 backdrop-blur-sm"
                    style={{ animation: 'fadeIn 0.377s ease-out' }}
                  >
                    <div className="px-4 py-4">
                      <ul className="text-sm text-slate-300 font-light space-y-2">
                        <li>Breathe in through your nose for <span className="text-cyan-400">4 seconds</span></li>
                        <li>Hold your breath for <span className="text-cyan-400">7 seconds</span></li>
                        <li>Breathe out through your mouth for <span className="text-cyan-400">8 seconds</span></li>
                        <li><span className="text-cyan-400">Repeat</span></li>
                      </ul>
                      <p className="text-sm text-slate-300 font-light mt-4 pt-3 border-t border-slate-700/50">
                        Used by therapists worldwide, 4-7-8 is a foundation practice for calm and relaxation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        )}
    </div>
  );
}
