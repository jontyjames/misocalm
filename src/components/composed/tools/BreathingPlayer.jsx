/**
 * Breathing Player
 * Active breathing session with progress and controls
 */

'use client';

import { useState } from 'react';
import { Check, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { BreathingCircle, BreathingBox } from '@/components/composed';
import { BREATH_INSTRUCTIONS } from './DurationSelector';

export default function BreathingPlayer({
  tool,
  selectedDuration,
  onComplete,
  onChangeDuration,
  onJournal,
  onReturnHome,
}) {
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const handleCycleComplete = () => {
    const newCount = cycleCount + 1;
    setCycleCount(newCount);

    if (newCount >= selectedDuration.rounds) {
      setIsActive(false);
      setCompleted(true);
      onComplete?.();
    }
  };

  const handleStartAnother = () => {
    setCycleCount(0);
    setCompleted(false);
    onChangeDuration();
  };

  const instructions = tool.breathType && BREATH_INSTRUCTIONS[tool.breathType];

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      {/* Round Counter */}
      {!completed && (
        <div className="text-center mb-8 mt-4">
          <p className="text-lg font-light text-white">
            Round <span className="text-cyan-400">{cycleCount + 1}</span> of {selectedDuration.rounds}
          </p>
          <p className="text-sm text-slate-300">{selectedDuration.name}</p>
        </div>
      )}

      {/* Breathing visualization */}
      <div className="flex-1 flex items-center justify-center">
        <div className="mb-8">
          {tool.breathType === 'box' ? (
            <BreathingBox
              isActive={isActive}
              onCycleComplete={handleCycleComplete}
              onStart={() => setIsActive(true)}
              size={220}
            />
          ) : (
            <BreathingCircle
              isActive={isActive}
              onCycleComplete={handleCycleComplete}
              onStart={() => setIsActive(true)}
              breathType={tool.breathType || '478'}
            />
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center" style={{ minHeight: '12rem' }}>
        {/* Progress dots for short sessions */}
        {!completed && selectedDuration.rounds <= 8 && (
          <div className="mb-4">
            <div className="flex justify-center gap-2 flex-wrap max-w-xs">
              {Array.from({ length: selectedDuration.rounds }, (_, i) => i + 1).map((n) => (
                <div
                  key={n}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-[233ms]
                    ${cycleCount >= n
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
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

        {/* Progress bar for longer sessions */}
        {!completed && selectedDuration.rounds > 8 && (
          <div className="mb-4 w-full max-w-xs">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-[610ms]"
                style={{ width: `${(cycleCount / selectedDuration.rounds) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-300 text-center mt-2">
              {cycleCount} of {selectedDuration.rounds} rounds
            </p>
          </div>
        )}

        {/* Completed state */}
        {completed && (
          <div className="mb-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
              <Check className="w-6 h-6 text-cyan-400" />
            </div>
            <p
              className="text-cyan-300 font-light mb-1"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              Practice Complete
            </p>
            <p className="text-slate-300 text-sm font-light">{selectedDuration.rounds} rounds completed</p>
          </div>
        )}

        {/* Controls */}
        {!isActive && (
          <div className="w-full max-w-xs space-y-3 mb-4">
            {completed ? (
              <>
                <Button onClick={onJournal} className="w-full" size="lg">Journal how you feel</Button>
                <Button variant="secondary" onClick={onReturnHome} className="w-full" size="lg">Return to sanctuary</Button>
                <button onClick={handleStartAnother} className="w-full text-sm text-slate-400 hover:text-white transition-colors font-light">Practice again</button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsActive(true)} className="w-full" size="lg">
                  {cycleCount > 0 ? 'Start Again' : 'Start Practice'}
                </Button>
                {cycleCount > 0 && (
                  <button onClick={onChangeDuration} className="w-full text-sm text-slate-300 hover:text-white transition-colors">Change duration</button>
                )}
              </>
            )}
          </div>
        )}

        {/* How-to accordion */}
        {!isActive && instructions && (
          <div className="w-full max-w-xs relative">
            <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
              <button
                onClick={() => setShowHowTo(!showHowTo)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-sm text-white font-light">How does this work?</span>
                <span className="flex items-center gap-2 text-xs text-indigo-400">
                  How to do it
                  {showHowTo ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </span>
              </button>
            </div>

            {showHowTo && (
              <div
                className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-slate-800/95 border border-slate-700/50 backdrop-blur-xl"
                style={{ animation: 'fadeIn 377ms ease-out' }}
              >
                <div className="px-4 py-4">
                  <ul className="text-sm text-slate-300 font-light space-y-2">
                    {instructions.steps.map((step, i) => (
                      <li key={i}>{step.text} <span className="text-cyan-400">{step.time}</span></li>
                    ))}
                    <li><span className="text-cyan-400">Repeat</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stop button during active breathing */}
      {isActive && (
        <div className="fixed bottom-0 left-0 right-0 pb-10 pt-4 flex justify-center z-20">
          <button
            onClick={() => { setIsActive(false); setCycleCount(0); }}
            className="text-sm text-slate-400 hover:text-white transition-colors font-light"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
