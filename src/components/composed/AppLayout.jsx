/**
 * App Layout Component
 * Wraps authenticated pages with navigation and background
 */

'use client';

import Starfield from './Starfield';
import Navigation from './Navigation';

export default function AppLayout({ children, showNav = true }) {
  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      {/* Main content */}
      <main className={`relative z-10 ${showNav ? 'pb-24' : ''}`}>
        {children}
      </main>

      {/* Bottom navigation */}
      {showNav && <Navigation />}
    </div>
  );
}
