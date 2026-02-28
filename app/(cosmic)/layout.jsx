/**
 * Cosmic Layout
 * Persistent starfield + nebula background shared across
 * welcome page and onboarding flow. Stays stable during navigation.
 */

'use client';

import { Starfield } from '@/components/composed';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function CosmicErrorFallback({ error, reset }) {
  return (
    <div role="alert" aria-live="assertive" className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <p className="text-xl text-white mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>Something went wrong</p>
        <p className="text-sm text-slate-400 font-light mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-light transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function CosmicLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      <div className="relative z-10 min-h-screen flex justify-center safe-area-top">
        <div className="w-full sm:max-w-md min-h-screen relative">
          <ErrorBoundary fallback={(props) => <CosmicErrorFallback {...props} />}>
            {children}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
