/**
 * Onboarding - Assessment
 * Simple self-assessment — one question, no clinical scale
 * Also handles retake from profile (?from=profile)
 */

'use client';

import { Suspense } from 'react';
import { useAuthGuard } from '@/hooks';
import { OnboardingSkeleton } from '@/components/composed/skeletons';
import AssessmentContent from './AssessmentContent';

export default function AssessmentPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard();

  if (authLoading || !isAuthenticated) {
    return <OnboardingSkeleton />;
  }

  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <AssessmentContent />
    </Suspense>
  );
}
