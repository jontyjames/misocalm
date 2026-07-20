'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Pause, Play, RotateCcw } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';
import { MOVEMENT_RESET_FLOWS } from './practicePanelData';

export default function MovementResetPanel({ onComplete }) {
  const [selectedId, setSelectedId] = useState(MOVEMENT_RESET_FLOWS[0].id);
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const selectedFlow = MOVEMENT_RESET_FLOWS.find((flow) => flow.id === selectedId) || MOVEMENT_RESET_FLOWS[0];
  const totalMs = selectedFlow.durationSec * 1000;
  const progress = totalMs > 0 ? elapsedMs / totalMs : 0;
  const activeStepIndex = Math.min(
    selectedFlow.steps.length - 1,
    Math.floor(progress * selectedFlow.steps.length),
  );
  const remainingSec = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));
  const completed = elapsedMs >= totalMs;
  const ActiveIcon = selectedFlow.icon;

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

  const selectFlow = (id) => {
    setSelectedId(id);
    setRunning(false);
    setElapsedMs(0);
  };

  const restart = () => {
    setElapsedMs(0);
    setRunning(true);
  };

  return (
    <Card solfeggio="cyan" padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[3] }}>
        <div className="grid gap-2 sm:grid-cols-3">
          {MOVEMENT_RESET_FLOWS.map((flow) => {
            const Icon = flow.icon;
            const selected = flow.id === selectedId;

            return (
              <button
                key={flow.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectFlow(flow.id)}
                className={`min-h-[110px] rounded-xl border p-3 text-left transition-all duration-[233ms] ${
                  selected
                    ? 'border-cyan-300/50 bg-cyan-300/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-cyan-200" />
                  <span className="text-xs font-light text-slate-400">{flow.durationSec} sec</span>
                </div>
                <p className="mt-3 text-sm">{flow.title}</p>
                <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">{flow.description}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-cyan-200">
              {completed ? <CheckCircle2 className="h-5 w-5" /> : <ActiveIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between" style={{ gap: PHI_SCALE[1] }}>
                <p className="text-sm text-white">
                  {completed ? 'Movement complete. Let your body settle.' : selectedFlow.steps[activeStepIndex]}
                </p>
                <span className="shrink-0 text-xs font-light text-slate-400">{remainingSec}s</span>
              </div>
              <p className="mt-1 text-xs font-light text-slate-400">
                Step {activeStepIndex + 1} of {selectedFlow.steps.length}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-300 transition-all duration-[610ms]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: PHI_SCALE[1] }}>
          <Button
            onClick={() => setRunning((current) => !current)}
            solfeggio="cyan"
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
          <Button onClick={onComplete} solfeggio="cyan">
            Complete movement
          </Button>
        )}
      </div>
    </Card>
  );
}
