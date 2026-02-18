/**
 * App Layout Component
 * Wraps authenticated pages with navigation and background
 */

'use client';

import { memo } from 'react';
import Starfield from './Starfield';
import Navigation from './Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default memo(function AppLayout({ children, showNav = true }) {
  return (
    <div className="min-h-screen bg-void-black relative">
      {/* Nebula glow effects — behind everything */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-nebula-cyan pointer-events-none" />

      {/* Main content — starfield inside same stacking context so backdrop-blur can see it */}
      <main id="main-content" className={`relative ${showNav ? 'pb-20' : ''}`}>
        <Starfield />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Bottom navigation */}
      {showNav && <Navigation />}
    </div>
  );
})
