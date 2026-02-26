/**
 * Onboarding - Assessment
 * Simple self-assessment — one question, no clinical scale
 * Also handles retake from profile (?from=profile)
 */

'use client';

import { Suspense } from 'react';
import { useAuthGuard } from '@/hooks';
import { Spinner } from '@/components/ui';
import AssessmentContent from './AssessmentContent';

export default function AssessmentPage() {
  const { loading: authLoading } = useAuthGuard();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <AssessmentContent />
    </Suspense>
  );
}
