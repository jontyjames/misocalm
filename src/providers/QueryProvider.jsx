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
    // Retry failed requests once (10s timeout per attempt — 2 retries = 20s+ wait)
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch stale data on mount (shows cached data instantly, refreshes in background)
    refetchOnMount: true,
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
