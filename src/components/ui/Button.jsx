/**
 * MisoCalm Button Component
 * Cosmic Serenity theme with touch glow + spring physics
 */

'use client';

import { useState, useCallback } from 'react';
import { useTouchGlow, useHaptic, useReducedMotion } from '@/hooks';

const variants = {
  primary: `
    bg-primary-cta border border-indigo-500/30 text-white
    hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
  `,
  secondary: `
    bg-slate-900/50 border border-slate-700 text-slate-300
    hover:border-slate-600 hover:text-white
  `,
  ghost: `
    bg-transparent border border-transparent text-slate-400
    hover:text-white hover:bg-slate-800/50
  `,
  danger: `
    bg-rose-500/20 border border-rose-500/30 text-rose-300
    hover:bg-rose-500/30 hover:border-rose-400/50
  `,
  disabled: `
    bg-slate-900/30 border border-slate-800 text-slate-600 cursor-not-allowed
  `,
};

const sizes = {
  sm: 'py-2 px-4 text-xs min-h-[44px]',
  md: 'py-3 px-6 text-sm min-h-[44px]',
  lg: 'py-4 px-8 text-base min-h-[48px]',
  icon: 'w-12 h-12 p-0 flex items-center justify-center',
  'icon-sm': 'w-11 h-11 p-0 flex items-center justify-center',
};

const shapes = {
  default: 'rounded-xl',
  pill: 'rounded-full',
  square: 'rounded-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'default',
  solfeggio = 'indigo',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;
  const prefersReduced = useReducedMotion();
  const { glowStyle, handlers: glowHandlers } = useTouchGlow(solfeggio);
  const { vibrate } = useHaptic();
  const [springStyle, setSpringStyle] = useState({});

  const handlePointerDown = useCallback((e) => {
    if (isDisabled) return;
    glowHandlers.onPointerDown(e);
    vibrate('light');
    if (!prefersReduced) {
      setSpringStyle({
        transform: 'scale(0.97)',
        transition: 'transform 89ms cubic-bezier(0.2, 0, 0.4, 1)',
      });
    }
  }, [isDisabled, glowHandlers, vibrate, prefersReduced]);

  const handlePointerUp = useCallback(() => {
    glowHandlers.onPointerUp();
    if (!prefersReduced) {
      setSpringStyle({
        transform: 'scale(1)',
        transition: 'transform 233ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      });
    }
  }, [glowHandlers, prefersReduced]);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`
        relative overflow-hidden
        font-light transition-all duration-[144ms] focus-ring
        ${shapes[shape]}
        ${sizes[size]}
        ${isDisabled ? variants.disabled : variants[variant]}
        ${className}
      `}
      style={isDisabled ? undefined : springStyle}
      {...props}
    >
      {/* Touch glow overlay */}
      {glowStyle && !isDisabled && (
        <span
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={glowStyle}
        />
      )}

      <span className="relative">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
