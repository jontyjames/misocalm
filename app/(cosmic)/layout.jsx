/**
 * Cosmic Layout
 * Persistent starfield + nebula background shared across
 * welcome page and onboarding flow. Stays stable during navigation.
 */

import { Starfield } from '@/components/composed';

export default function CosmicLayout({ children }) {
  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
