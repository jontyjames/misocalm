/**
 * Timer Setup — Galactic Cockpit
 * Orchestrates CockpitOrb + CockpitControls + CockpitInitiate
 */

'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, Star, ChevronDown } from 'lucide-react';
import CockpitOrb from './CockpitOrb';
import CockpitControls from './CockpitControls';
import CockpitInitiate from './CockpitInitiate';

export default function TimerSetup({
  tool,
  isFavorite,
  onToggleFavorite,
  onBack,
  onStart,
}) {
  const [duration, setDuration] = useState(20);
  const [reminder, setReminder] = useState(5);
  const [rounds, setRounds] = useState(1);
  const [showGuide, setShowGuide] = useState(false);

  // Pulse state for orb reaction
  const [reactColor, setReactColor] = useState(null);
  const [reactPulse, setReactPulse] = useState(false);

  const handleSelectionChange = useCallback((colorName) => {
    setReactColor(colorName);
    setReactPulse(true);
    setTimeout(() => setReactPulse(false), 610);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-light">{tool.title}</span>
        <button onClick={onToggleFavorite} className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}>
          <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-4 py-6">
        {/* Orb — upper portion */}
        <div className="flex justify-center mb-8">
          <CockpitOrb
            duration={duration}
            reactColor={reactColor}
            reactPulse={reactPulse}
          />
        </div>

        {/* Controls */}
        <CockpitControls
          duration={duration}
          setDuration={setDuration}
          reminder={reminder}
          setReminder={setReminder}
          rounds={rounds}
          setRounds={setRounds}
          onSelectionChange={handleSelectionChange}
        />

        {/* How to use */}
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1.5 text-sm font-light text-slate-400 hover:text-slate-200 transition-colors mt-6 mb-2"
        >
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform duration-[144ms]"
            style={{ transform: showGuide ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
          How to use this timer
        </button>
        {showGuide && (
          <div
            className="text-sm font-light text-slate-300 space-y-2 mb-4 pl-5"
            style={{ animation: 'fadeIn 233ms ease-out' }}
          >
            <p>Find a comfortable position and close your eyes. Place your phone face-down nearby.</p>
            <p>A gentle bell marks the end of each practice interval. The grace period gives you space to return slowly, with no rush.</p>
            <p>Multiple rounds let you build longer sessions with natural pauses between each sit.</p>
            <p className="text-slate-400">Your screen stays on during practice so the timer keeps running.</p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Initiate */}
        <CockpitInitiate
          duration={duration}
          reminder={reminder}
          rounds={rounds}
          onInitiate={() => onStart({ duration, reminder, rounds })}
        />
      </div>
    </div>
  );
}
