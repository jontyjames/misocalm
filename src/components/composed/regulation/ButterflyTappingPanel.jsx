'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';

const TAP_SIDES = ['left', 'right'];

export default function ButterflyTappingPanel({ onComplete }) {
  const [running, setRunning] = useState(false);
  const [side, setSide] = useState('left');

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setSide((current) => (current === 'left' ? 'right' : 'left'));
    }, FIBONACCI_TIMING.breathe);
    return () => clearInterval(timer);
  }, [running]);

  return (
    <Card solfeggio="violet" padding="p-4">
      <div className="text-center">
        <div
          className="mx-auto grid max-w-[233px] grid-cols-2"
          style={{ gap: PHI_SCALE[3] }}
          aria-label="Butterfly tapping rhythm"
        >
          {TAP_SIDES.map((item) => (
            <div
              key={item}
              aria-current={side === item && running ? 'true' : undefined}
              className={`aspect-square rounded-full border transition-all duration-[377ms] ${
                side === item && running
                  ? 'scale-105 border-violet-200 bg-violet-300/20 shadow-[0_0_34px_rgba(139,92,246,0.35)]'
                  : 'border-white/[0.12] bg-white/[0.04]'
              }`}
            />
          ))}
        </div>
        <p className="mt-4 text-sm font-light leading-relaxed text-slate-300">
          Tap left, then right. Slow enough that your body can follow.
        </p>
        <p role="status" aria-live="polite" className="mt-2 text-xs font-light capitalize text-violet-200">
          {running ? `${side} tap` : 'Rhythm paused'}
        </p>
        <Button
          onClick={() => setRunning((current) => !current)}
          variant={running ? 'secondary' : 'primary'}
          className="mt-4 w-full"
          solfeggio="violet"
        >
          <span className="inline-flex items-center gap-2">
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause rhythm' : 'Start rhythm'}
          </span>
        </Button>
        <Button onClick={onComplete} variant="secondary" className="mt-3 w-full">
          Complete tapping
        </Button>
      </div>
    </Card>
  );
}
