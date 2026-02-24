/**
 * PremiumContext — provides premium status to all components
 * Fetches once on auth, caches until refresh
 */

'use client';

import { createContext, useContext } from 'react';
import { usePremium } from '@/hooks';

const PremiumContext = createContext(null);

export function PremiumProvider({ children }) {
  const premium = usePremium();

  return (
    <PremiumContext.Provider value={premium}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremiumContext() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremiumContext must be used within a PremiumProvider');
  }
  return context;
}
