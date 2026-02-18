/**
 * App Layout Component
 * Thin wrapper that controls nav visibility via NavContext.
 * Starfield, Navigation, and background are handled by app/(app)/layout.jsx.
 *
 * No cleanup — each page sets its own showNav on mount, avoiding race
 * conditions between cleanup and mount effects during navigation.
 */

'use client';

import { useEffect } from 'react';
import { useNav } from '@/context/NavContext';

export default function AppLayout({ children, showNav = true }) {
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(showNav);
  }, [showNav, setShowNav]);

  return children;
}
