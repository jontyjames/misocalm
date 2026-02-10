/**
 * App Layout Component
 * Wraps authenticated pages with navigation and background
 */

'use client';

import Starfield from './Starfield';
import Navigation from './Navigation';

export default function AppLayout({ children, showNav = true }) {
  return (
    <div className="min-h-screen bg-void-black relative">
      {/* Nebula glow effects — behind everything */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      {/* Main content — starfield inside same stacking context so backdrop-blur can see it */}
      <main className={`relative ${showNav ? 'pb-24' : ''}`}>
        <Starfield />
        {children}
      </main>

      {/* Bottom navigation */}
      {showNav && <Navigation />}
    </div>
  );
}
