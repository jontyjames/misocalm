'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Droplets, Pause, Play, RotateCcw } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';
import ColdWaterMethodPicker from './ColdWaterMethodPicker';
import ColdWaterSafetyChecks from './ColdWaterSafetyChecks';
import {
  COLD_WATER_DURATION_SEC,
  COLD_WATER_METHODS,
  COLD_WATER_SAFETY_CHECKS,
} from './practicePanelData';

export default function ColdWaterResetPanel({ onComplete }) {
  const [checked, setChecked] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(COLD_WATER_METHODS[0].id);
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const ready = checked.length === COLD_WATER_SAFETY_CHECKS.length;
  const totalMs = COLD_WATER_DURATION_SEC * 1000;
  const progress = elapsedMs / totalMs;
  const remainingSec = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));
  const completed = elapsedMs >= totalMs;
  const selectedMethod = COLD_WATER_METHODS.find((method) => method.id === selectedMethodId) || COLD_WATER_METHODS[0];
  const MethodIcon = selectedMethod.icon;

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

  const toggleCheck = (item) => {
    setChecked((current) => (
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    ));
    setRunning(false);
  };

  const selectMethod = (id) => {
    setSelectedMethodId(id);
    setRunning(false);
    setElapsedMs(0);
  };

  const restart = () => {
    setElapsedMs(0);
    setRunning(true);
  };

  return (
    <Card solfeggio="slate" padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[3] }}>
        <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
          <Droplets className="mt-1 h-5 w-5 shrink-0 text-slate-200" />
          <div>
            <p className="text-sm text-white">This is a tiny reset, not a toughness test.</p>
            <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">
              Skip it during high stress, exhaustion, health concerns, or if your body says no.
            </p>
          </div>
        </div>

        <ColdWaterSafetyChecks checked={checked} onToggle={toggleCheck} />
        <ColdWaterMethodPicker selectedMethodId={selectedMethodId} onSelect={selectMethod} />

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-slate-200">
              {completed ? <CheckCircle2 className="h-5 w-5" /> : <MethodIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between" style={{ gap: PHI_SCALE[1] }}>
                <p className="text-sm text-white">
                  {completed ? 'Warm yourself now and let the reset finish gently.' : selectedMethod.description}
                </p>
                <span className="shrink-0 text-xs font-light text-slate-400">{remainingSec}s</span>
              </div>
              <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">
                {ready ? 'Ready for a small cool-water reset.' : 'Complete the safety checks before beginning.'}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-200 transition-all duration-[610ms]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: PHI_SCALE[1] }}>
          <Button
            onClick={() => setRunning((current) => !current)}
            variant={ready ? 'primary' : 'disabled'}
            solfeggio="slate"
            disabled={!ready || completed}
          >
            <span className="inline-flex items-center gap-2">
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? 'Pause' : 'Begin'}
            </span>
          </Button>
          <Button onClick={restart} variant="secondary" disabled={!ready}>
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Restart
            </span>
          </Button>
        </div>

        {completed && (
          <Button onClick={onComplete} solfeggio="slate">
            Complete reset
          </Button>
        )}
      </div>
    </Card>
  );
}
