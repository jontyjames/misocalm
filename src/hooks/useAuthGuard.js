/**
 * Auth Guard Hook
 * Redirects unauthenticated users to the home page.
 * Use in any page that requires authentication.
 *
 * Callers should gate rendering on both loading AND isAuthenticated
 * to prevent a single-frame render of protected content before redirect:
 *   if (loading || !isAuthenticated) return <Spinner />;
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function useAuthGuard() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthState();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}
