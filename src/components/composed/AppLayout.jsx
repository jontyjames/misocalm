/**
 * App Layout Component
 * Thin wrapper that controls nav visibility via NavContext.
 * Starfield, Navigation, and background are handled by AppGroupClient.jsx
 * (rendered via app/(app)/layout.jsx).
 *
 * Cleanup restores showNav to true on unmount. The nav transition animation
 * (233ms fade) absorbs any brief intermediate state during page transitions.
 */

'use client';

import { useEffect } from 'react';
import { useNav } from '@/context/NavContext';

export default function AppLayout({ children, showNav = true }) {
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(showNav);
    return () => setShowNav(true);
  }, [showNav, setShowNav]);

  return children;
}
