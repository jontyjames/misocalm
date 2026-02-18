/**
 * Breathing Player -- active breathing session with progress and controls.
 *
 * Layout contract: the breathing visual sits at true vertical centre of the
 * viewport. It never moves. Everything else is absolutely positioned around it.
 *
 * States:
 *   1. Pre-practice  (isActive=false, completed=false)
 *   2. Active         (isActive=true,  completed=false)
 *   3. Bloom          (showBloom=true)
 *   4. Completed      (completed=true)
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { BreathingCircle, BreathingBox, BreathingAura, ExpansionBloom } from '@/components/composed';
import useWakeLock from '@/hooks/useWakeLock';
import { BREATH_INSTRUCTIONS } from './DurationSelector';
import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';

export default function BreathingPlayer({
  tool, selectedDuration, onComplete, onChangeDuration, onJournal, onReturnHome,
}) {
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showBloom, setShowBloom] = useState(false);
  const completionTimer = useRef(null);

  useWakeLock(isActive);
  const [breathPhase, setBreathPhase] = useState('GET_READY');
  const [breathScale, setBreathScale] = useState(1);

  const handlePhaseChange = (phase, scale) => {
    setBreathPhase(phase);
    setBreathScale(scale);
  };

  const handleStart = () => {
    setCycleCount(0);
    setCompleted(false);
    setShowCompletion(false);
    setShowBloom(false);
    if (completionTimer.current) clearTimeout(completionTimer.current);
    setIsActive(true);
  };

  const handleCycleComplete = () => {
    if (completed) return;
    const newCount = cycleCount + 1;
    setCycleCount(newCount);
    if (newCount >= selectedDuration.rounds) {
      setIsActive(false);
      setShowBloom(true);
    }
  };

  const handleBloomComplete = () => {
    setShowBloom(false);
    setCompleted(true);
    completionTimer.current = setTimeout(() => {
      setShowCompletion(true);
      onComplete?.();
    }, FIBONACCI_TIMING.breathe);
  };

  useEffect(() => {
    return () => { if (completionTimer.current) clearTimeout(completionTimer.current); };
  }, []);

  const instructions = tool.breathType && BREATH_INSTRUCTIONS[tool.breathType];
  const showPrePractice = !isActive && !completed;

  return (
    <div className="flex-1 relative overflow-hidden">
      <ExpansionBloom active={showBloom} solfeggio="cyan" onComplete={handleBloomComplete} />

      {/* Breathing visual -- slightly above vertical centre, never moves */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0" style={{ paddingBottom: PHI_SCALE[4] }}>
        <div className="pointer-events-auto">
          <BreathingAura
            phase={breathPhase} isActive={isActive}
            breathScale={breathScale}
            shape={tool.breathType === 'box' ? 'box' : 'circle'}
          >
            {tool.breathType === 'box' ? (
              <BreathingBox
                isActive={isActive} onCycleComplete={handleCycleComplete}
                onPhaseChange={handlePhaseChange} onStart={handleStart} size={PHI_SCALE[6] * 2}
              />
            ) : (
              <BreathingCircle
                isActive={isActive} onCycleComplete={handleCycleComplete}
                onPhaseChange={handlePhaseChange} onStart={handleStart}
                breathType={tool.breathType || '478'}
              />
            )}
          </BreathingAura>
        </div>
      </div>

      {/* How-to accordion -- pinned to top, pre-practice only */}
      {showPrePractice && instructions && (
        <div
          className="absolute left-0 right-0 z-20 flex flex-col items-center"
          style={{ top: PHI_SCALE[1], paddingLeft: PHI_SCALE[3], paddingRight: PHI_SCALE[3] }}
        >
          <button
            onClick={() => setShowHowTo(!showHowTo)}
            className="flex items-center text-sm font-light"
            style={{
              color: 'rgba(203,213,225,0.6)',
              textShadow: '0 0 10px rgba(99,102,241,0.15)',
              gap: PHI_SCALE[0],
              transition: `color ${FIBONACCI_TIMING.shift}ms ease`,
            }}
          >
            <span>How does this work?</span>
            <ChevronDown
              className="text-slate-300"
              style={{
                width: PHI_SCALE[1], height: PHI_SCALE[1],
                transition: `transform ${FIBONACCI_TIMING.flow}ms ease`,
                transform: showHowTo ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
          {showHowTo && (
            <div
              className="w-full max-w-xs rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-xl"
              style={{
                marginTop: PHI_SCALE[1],
                padding: PHI_SCALE[2],
                animation: `fadeIn ${FIBONACCI_TIMING.flow}ms ease-out`,
              }}
            >
              <ul className="text-sm text-slate-300 font-light flex flex-col" style={{ gap: PHI_SCALE[1] }}>
                {instructions.steps.map((step, i) => (
                  <li key={i}>{step.text} <span className="text-cyan-400">{step.time}</span></li>
                ))}
                <li><span className="text-cyan-400">Repeat</span></li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Bottom zone -- pinned to bottom, same position for all states */}
      <div
        className="absolute left-0 right-0 bottom-0 z-10 flex flex-col items-center"
        style={{ paddingBottom: PHI_SCALE[4], paddingLeft: PHI_SCALE[3], paddingRight: PHI_SCALE[3] }}
      >
        {/* Rounds + dots -- visible pre-practice and active, hidden on complete */}
        {!completed && (
          <div className="text-center" style={{ marginBottom: PHI_SCALE[2] }}>
            {!isActive && (
              <>
                <p className="text-lg font-light text-white">
                  Round <span className="text-cyan-400">{cycleCount + 1}</span> of {selectedDuration.rounds}
                </p>
                <p className="text-sm text-slate-300" style={{ marginBottom: PHI_SCALE[1] }}>
                  {selectedDuration.name}
                </p>
              </>
            )}
            {selectedDuration.rounds <= 8 && (
              <div className="flex justify-center flex-wrap max-w-xs" style={{ gap: PHI_SCALE[1] }}>
                {Array.from({ length: selectedDuration.rounds }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className={`rounded-full ${
                      cycleCount >= n
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                        : cycleCount + 1 === n ? 'bg-cyan-400/50 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{
                      width: PHI_SCALE[1], height: PHI_SCALE[1],
                      transition: `all ${FIBONACCI_TIMING.move}ms ease`,
                    }}
                  />
                ))}
              </div>
            )}
            {selectedDuration.rounds > 8 && (
              <div className="w-full max-w-xs">
                <div className="bg-slate-800 rounded-full overflow-hidden" style={{ height: PHI_SCALE[0] }}>
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                    style={{
                      width: `${(cycleCount / selectedDuration.rounds) * 100}%`,
                      transition: `all ${FIBONACCI_TIMING.ease}ms ease`,
                    }}
                  />
                </div>
                {!isActive && (
                  <p className="text-xs text-slate-300 text-center" style={{ marginTop: PHI_SCALE[1] }}>
                    {cycleCount} of {selectedDuration.rounds} rounds
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pre-practice: Start Practice button */}
        {showPrePractice && (
          <div className="w-full max-w-xs flex flex-col" style={{ gap: PHI_SCALE[1] }}>
            <Button onClick={() => setIsActive(true)} className="w-full" size="lg">
              {cycleCount > 0 ? 'Start Again' : 'Start Practice'}
            </Button>
            {cycleCount > 0 && (
              <button
                onClick={onChangeDuration}
                className="w-full text-sm text-slate-300 hover:text-white font-light"
                style={{ transition: `color ${FIBONACCI_TIMING.shift}ms ease` }}
              >
                Change duration
              </button>
            )}
          </div>
        )}

        {/* Active: Stop button -- same container, below rounds, no overlap */}
        {isActive && (
          <button
            onClick={() => { setIsActive(false); setCycleCount(0); }}
            className="text-sm text-slate-400 hover:text-white font-light"
            style={{ transition: `color ${FIBONACCI_TIMING.shift}ms ease` }}
          >
            Stop
          </button>
        )}

        {/* Completed: results + actions */}
        {completed && (
          <div
            className="text-center w-full max-w-xs"
            style={{
              opacity: showCompletion ? 1 : 0,
              transition: `opacity ${FIBONACCI_TIMING.sacred}ms ease-out`,
            }}
          >
            <p
              className="text-cyan-300 text-lg"
              style={{
                marginBottom: PHI_SCALE[0],
                fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200,
                textShadow: '0 0 16px rgba(34,211,238,0.5), 0 0 4px rgba(34,211,238,0.8)',
              }}
            >
              Practice Complete
            </p>
            <p className="text-slate-300 text-sm font-light" style={{ marginBottom: PHI_SCALE[3] }}>
              {selectedDuration.rounds} rounds
            </p>
            <div className="flex flex-col" style={{ gap: PHI_SCALE[1] }}>
              <Button onClick={onJournal} className="w-full" size="lg">
                Journal how you feel
              </Button>
              <Button variant="secondary" onClick={onReturnHome} className="w-full" size="lg">
                Return to sanctuary
              </Button>
              <button
                onClick={handleStart}
                className="w-full text-sm text-slate-400 hover:text-white font-light"
                style={{ transition: `color ${FIBONACCI_TIMING.shift}ms ease` }}
              >
                Practice again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
