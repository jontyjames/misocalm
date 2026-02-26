/**
 * Skeleton — shimmer placeholder for loading states
 * Uses existing shimmer keyframe from globals.css with 7.1s cycle (prime)
 */

const baseClasses = 'rounded-xl relative overflow-hidden';

const shimmerStyle = {
  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 70%)',
  backgroundSize: '250% 100%',
  animation: 'shimmer 7.1s ease-in-out infinite',
};

export function Skeleton({ width, height, className = '', circle = false, rounded = 'rounded-xl' }) {
  return (
    <div
      className={`${circle ? 'rounded-full' : rounded} bg-slate-800/50 ${className}`}
      style={{ width, height, ...shimmerStyle }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  const widths = ['100%', '85%', '65%', '90%', '70%'];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-slate-800/50"
          style={{ width: widths[i % widths.length], ...shimmerStyle }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ height = '5rem', className = '' }) {
  return (
    <div
      className={`${baseClasses} border border-white/[0.08] bg-slate-800/30 ${className}`}
      style={{ height, ...shimmerStyle }}
    />
  );
}

export default Skeleton;
