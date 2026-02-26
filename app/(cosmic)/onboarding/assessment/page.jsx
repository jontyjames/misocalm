/**
 * Onboarding - Assessment
 * Simple self-assessment — one question, no clinical scale
 * Also handles retake from profile (?from=profile)
 */

'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import AssessmentContent from './AssessmentContent';

export default function AssessmentPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push(ROUTES.HOME);
    return null;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <AssessmentContent />
    </Suspense>
  );
}
