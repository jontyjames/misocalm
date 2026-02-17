'use client';

/**
 * 13-dot progress indicator for quiz
 * Current = cyan glow, done = cyan/50, future = slate-700
 */
export default function QuizProgress({ current, total = 13 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const isDone = i < current;
        const isCurrent = i === current;

        return (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-[233ms]
              ${isCurrent ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : ''}
              ${isDone ? 'bg-cyan-400/50' : ''}
              ${!isDone && !isCurrent ? 'bg-slate-700' : ''}
            `}
          />
        );
      })}
    </div>
  );
}
