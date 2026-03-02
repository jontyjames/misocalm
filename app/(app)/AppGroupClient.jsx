/**
 * App Group Client Wrapper
 * Renders the persistent Starfield and Navigation for all authenticated pages.
 * NavProvider lives in the root layout — do not add one here.
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Starfield from '@/components/composed/Starfield';
import Navigation from '@/components/composed/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useNav } from '@/context/NavContext';
import { useReducedMotion } from '@/hooks';

const IMMERSIVE_PREFIXES = ['/tools/experiences/'];

function isImmersiveRoute(pathname) {
  return IMMERSIVE_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

export default function AppGroupClient({ children }) {
  const { showNav, setShowNav } = useNav();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  // Restore nav on bfcache — mobile browsers may restore a cached page
  // without triggering React mount/unmount, leaving nav hidden.
  // Only restore if not on an immersive route (experiences handle their own nav state).
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted && !isImmersiveRoute(pathname)) {
        setShowNav(true);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [pathname, setShowNav]);

  const immersive = isImmersiveRoute(pathname);

  return (
    <div className="min-h-screen bg-void-black relative overflow-x-hidden w-full sm:max-w-md sm:mx-auto">
      {/* Starfield hidden on immersive routes — experiences own their full canvas */}
      {!immersive && <Starfield />}

      {/* Page content — padding transitions with nav to avoid layout snap */}
      <main
        id="main-content"
        className={`relative safe-area-top ${reducedMotion ? '' : 'transition-[padding] duration-[233ms] ease-out'}`}
        style={{ paddingBottom: showNav ? '5rem' : 0 }}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Navigation — always mounted, fades via opacity only.
          No transform on this wrapper — it would create a containing block
          and break Navigation's position:fixed positioning. */}
      <div
        className={reducedMotion ? '' : 'transition-opacity duration-[233ms] ease-out'}
        style={{
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? 'auto' : 'none',
        }}
        aria-hidden={!showNav || undefined}
        inert={!showNav ? '' : undefined}
      >
        <Navigation />
      </div>
    </div>
  );
}
