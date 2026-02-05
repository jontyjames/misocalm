/**
 * MisoMind Logo Component
 * Animated gradient ring with heart icon
 */

import { Heart } from 'lucide-react';

export default function Logo({ size = 'md', animate = true, showText = false }) {
  const sizes = {
    sm: { ring: 'w-10 h-10', inner: 'inset-1', icon: 'w-4 h-4', text: 'text-lg' },
    md: { ring: 'w-14 h-14', inner: 'inset-1.5', icon: 'w-6 h-6', text: 'text-2xl' },
    lg: { ring: 'w-20 h-20', inner: 'inset-2', icon: 'w-8 h-8', text: 'text-3xl' },
    xl: { ring: 'w-28 h-28', inner: 'inset-2.5', icon: 'w-10 h-10', text: 'text-4xl' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${s.ring} rounded-full relative`}>
        {/* Animated gradient ring */}
        <div
          className={`
            absolute inset-0 rounded-full bg-logo-ring
            ${animate ? 'animate-spin-slow' : ''}
          `}
        />
        {/* Inner circle with icon */}
        <div
          className={`
            absolute ${s.inner} rounded-full bg-slate-950
            flex items-center justify-center
          `}
        >
          <Heart className={`${s.icon} text-cyan-300`} fill="currentColor" />
        </div>
      </div>

      {showText && (
        <span className={`${s.text} font-thin text-white`}>
          MisoMind
        </span>
      )}
    </div>
  );
}
