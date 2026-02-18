/**
 * App Group Client Wrapper
 * Renders the persistent Starfield and Navigation for all authenticated pages.
 * NavProvider lives in the root layout — do not add one here.
 */

'use client';

import Starfield from '@/components/composed/Starfield';
import Navigation from '@/components/composed/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useNav } from '@/context/NavContext';

export default function AppGroupClient({ children }) {
  const { showNav } = useNav();

  return (
    <div className="min-h-screen bg-void-black relative">
      {/* Starfield persists across all pages in this group (includes nebula glows) */}
      <Starfield />

      {/* Page content */}
      <main id="main-content" className={`relative ${showNav ? 'pb-20' : ''}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Navigation persists across all pages in this group */}
      {showNav && <Navigation />}
    </div>
  );
}
