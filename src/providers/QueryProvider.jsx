/**
 * React Query Provider
 * Provides caching, background refetching, and request deduplication
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Default query client options
const defaultOptions = {
  queries: {
    // Data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep unused data in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    // Retry failed requests 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
    // Don't refetch on mount if data is fresh
    refetchOnMount: false,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
  },
};

export function QueryProvider({ children }) {
  // Create a new QueryClient for each session to prevent data sharing between users
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions,
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
