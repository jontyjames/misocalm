'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Pause, Play, RotateCcw } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';

export default function GuidedSequencePanel({ practice, onComplete }) {
  const phases = useMemo(() => {
    if (practice.voiceGuide?.phases?.length > 0) return practice.voiceGuide.phases;
    return practice.steps.map((step, index) => ({
      id: `step-${index + 1}`,
      title: `Step ${index + 1}`,
      cue: step,
      durationSec: 34,
    }));
  }, [practice.steps, practice.voiceGuide]);

  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const totalMs = phases.reduce((sum, phase) => sum + phase.durationSec, 0) * 1000;
  const completed = elapsedMs >= totalMs;
  const activeIndex = phases.findIndex((phase, index) => {
    const phaseEnd = phases
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.durationSec, 0) * 1000;
    return elapsedMs < phaseEnd;
  });
  const safeActiveIndex = activeIndex === -1 ? phases.length - 1 : activeIndex;
  const activePhase = phases[safeActiveIndex];
  const progress = totalMs > 0 ? Math.min(100, Math.round((elapsedMs / totalMs) * 100)) : 0;
  const remainingSec = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setElapsedMs((current) => {
        const next = Math.min(current + FIBONACCI_TIMING.breathe, totalMs);
        if (next >= totalMs) setRunning(false);
        return next;
      });
    }, FIBONACCI_TIMING.breathe);
    return () => clearInterval(timer);
  }, [running, totalMs]);

  const restart = () => {
    setElapsedMs(0);
    setRunning(true);
  };

  return (
    <Card solfeggio={practice.solfeggio} padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[3] }}>
        <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-cyan-200">
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between" style={{ gap: PHI_SCALE[1] }}>
              <p className="text-sm text-white">{completed ? 'Guided sequence complete.' : activePhase.cue}</p>
              <span className="shrink-0 text-xs font-light text-slate-400">{remainingSec}s</span>
            </div>
            <p className="mt-1 text-xs font-light text-slate-400">
              {activePhase.title} / phase {safeActiveIndex + 1} of {phases.length}
            </p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all duration-[610ms]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2" style={{ gap: PHI_SCALE[1] }}>
          <Button
            onClick={() => setRunning((current) => !current)}
            solfeggio={practice.solfeggio}
            disabled={completed}
          >
            <span className="inline-flex items-center gap-2">
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? 'Pause' : 'Begin'}
            </span>
          </Button>
          <Button onClick={restart} variant="secondary">
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Restart
            </span>
          </Button>
        </div>

        {completed && (
          <Button onClick={onComplete} solfeggio={practice.solfeggio}>
            Complete practice
          </Button>
        )}
      </div>
    </Card>
  );
}
