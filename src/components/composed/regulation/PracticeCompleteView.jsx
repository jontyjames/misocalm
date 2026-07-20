import { BookOpen, Check, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { FIBONACCI_TIMING, PHI_SCALE } from '@/lib/constants';

export default function PracticeCompleteView({ practice, onJournal, onHome, onRestart }) {
  return (
    <div
      className="text-center"
      style={{ animation: `fadeIn ${FIBONACCI_TIMING.sacred}ms ease-out` }}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
        <Check className="h-7 w-7" />
      </div>
      <h2
        className="text-xl text-white"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        Practice complete
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm font-light leading-relaxed text-slate-300">
        Notice what shifted. Even a small shift counts.
      </p>
      <div className="mt-6 flex flex-col" style={{ gap: PHI_SCALE[1] }}>
        <Button onClick={onJournal} className="w-full" size="lg">
          <span className="inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Journal how you feel
          </span>
        </Button>
        <Button onClick={onHome} variant="secondary" className="w-full">
          <span className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return to sanctuary
          </span>
        </Button>
        <Button onClick={onRestart} variant="ghost" className="w-full">
          <span className="inline-flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Repeat {practice.title}
          </span>
        </Button>
      </div>
    </div>
  );
}
