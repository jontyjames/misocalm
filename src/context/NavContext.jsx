'use client';

import { createContext, useContext, useState, useMemo } from 'react';

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [showNav, setShowNav] = useState(true);
  const value = useMemo(() => ({ showNav, setShowNav }), [showNav, setShowNav]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return ctx;
}
