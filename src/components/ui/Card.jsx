/**
 * MisoCalm Card Component
 * Sacred Glass treatment with touch response for interactive cards
 */

'use client';

import { useState, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import { SOLFEGGIO_RGBA, SACRED_GLASS_CLASSES, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle } from '@/lib/sacredGlass';

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  padding = 'p-4',
  solfeggio = 'indigo',
}) {
  const Component = onClick ? 'button' : 'div';
  const isInteractive = !!onClick;
  const prefersReduced = useReducedMotion();
  const [springStyle, setSpringStyle] = useState({});
  const [glowPos, setGlowPos] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = useCallback((e) => {
    if (!isInteractive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsPressed(true);
    if (!prefersReduced) {
      setSpringStyle({
        transform: 'scale(0.98)',
        transition: 'transform 89ms cubic-bezier(0.2, 0, 0.4, 1)',
      });
    }
  }, [isInteractive, prefersReduced]);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
    setTimeout(() => setGlowPos(null), 377);
    if (!prefersReduced) {
      setSpringStyle({
        transform: 'scale(1)',
        transition: 'transform 233ms cubic-bezier(0.34, 1.4, 0.64, 1)',
      });
    }
  }, [prefersReduced]);

  const GLOW_COLORS = {
    indigo: 'rgba(99,102,241,0.2)',
    violet: 'rgba(139,92,246,0.2)',
    cyan: 'rgba(34,211,238,0.2)',
  };

  if (isInteractive) {
    return (
      <Component
        onClick={onClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`
          relative rounded-xl ${padding} text-left w-full overflow-hidden
          ${SACRED_GLASS_CLASSES}
          focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:outline-none
          cursor-pointer
          ${className}
        `}
        style={{
          background: `linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, ${SOLFEGGIO_RGBA[solfeggio] || SOLFEGGIO_RGBA.indigo}0.05) 100%)`,
          boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px ${SOLFEGGIO_RGBA[solfeggio] || SOLFEGGIO_RGBA.indigo}0.08), 0 4px 20px rgba(0,0,0,0.25)`,
          ...springStyle,
        }}
      >
        {/* Glass top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={GLASS_HIGHLIGHT_STYLE}
        />
        {/* Phi opacity layers */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={PHI_LAYERS_STYLE}
        />
        {/* Torus flow — solfeggio colour enters from top, returns from bottom */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={torusFlowStyle(solfeggio)}
        />
        {/* Touch glow overlay */}
        {glowPos && (
          <span
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `radial-gradient(circle 100px at ${glowPos.x}px ${glowPos.y}px, ${GLOW_COLORS[solfeggio] || GLOW_COLORS.indigo}, transparent)`,
              opacity: isPressed ? 1 : 0,
              transition: isPressed ? 'none' : 'opacity 377ms ease-out',
            }}
          />
        )}
        <div className="relative">
          {children}
        </div>
      </Component>
    );
  }

  const variants = {
    default: 'bg-slate-800/50 border border-slate-700',
    highlighted: 'bg-card-highlight border border-indigo-500/30',
    elevated: 'bg-slate-800/70 border border-slate-600 shadow-lg shadow-black/30',
  };

  return (
    <Component
      className={`
        rounded-xl ${padding} text-left w-full
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

// Card subcomponents for composition
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-light text-white ${className}`}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm font-light text-slate-300 ${className}`}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-800 ${className}`}>
      {children}
    </div>
  );
};
