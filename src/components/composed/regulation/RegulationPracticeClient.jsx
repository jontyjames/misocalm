'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { AppLayout } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';
import { Button, Card } from '@/components/ui';
import { useAuthGuard, useRegulationToolkitFavorites } from '@/hooks';
import { getPracticeAudioPlan } from '@/lib/audioCatalog';
import { buildCheckInRoute, CHECK_IN_SOURCE } from '@/lib/checkInContext';
import { PHI_SCALE, ROUTES } from '@/lib/constants';
import { isPanelCompletedPractice } from '@/lib/regulationPracticeCompletion';
import { getRegulationPractice } from '@/lib/regulationToolkitData';
import { ROUTE_CONTEXT, getContextualBackLabel, getContextualBackRoute, withRouteContext } from '@/lib/routeContext';
import PracticeAudioPanel from './PracticeAudioPanel';
import PracticeCompleteView from './PracticeCompleteView';
import PracticeHero from './PracticeHero';
import PracticeStepList from './PracticeStepList';
import PracticeSupportPanel from './PracticeSupportPanel';

export default function RegulationPracticeClient({ practiceId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuthGuard();
  const practice = useMemo(() => getRegulationPractice(practiceId), [practiceId]);
  const { isFavorite, toggleFavorite } = useRegulationToolkitFavorites();
  const [activeIndex, setActiveIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const panelCompletesPractice = practice ? isPanelCompletedPractice(practice.id) : false;
  const hasAudioPlan = practice ? Boolean(getPracticeAudioPlan(practice)) : false;
  const backRoute = getContextualBackRoute(searchParams, ROUTES.REGULATION_TOOLKIT);
  const backLabel = getContextualBackLabel(searchParams, 'Toolkit');
  const sourceContext = searchParams?.get('from') || ROUTE_CONTEXT.REGULATION;

  if (loading || !isAuthenticated) {
    return (
      <AppLayout>
        <RouteSkeleton titleWidth={170} introLines={2} cardCount={3} />
      </AppLayout>
    );
  }

  if (!practice) {
    return (
      <AppLayout>
        <div className="flex min-h-screen flex-col px-6 py-8">
          <Button onClick={() => router.push(backRoute)} variant="secondary">
            Back to {backLabel.toLowerCase()}
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleNext = () => {
    if (activeIndex >= practice.steps.length - 1) {
      setComplete(true);
      return;
    }
    setActiveIndex((current) => current + 1);
  };

  const handleRestart = () => {
    setActiveIndex(0);
    setComplete(false);
  };

  const openSupportRoute = (route) => {
    const nextRoute = route === ROUTES.REGULATION_TOOLKIT
      ? route
      : withRouteContext(route, sourceContext);
    router.push(nextRoute);
  };

  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen px-6 py-6" style={{ animation: 'fadeIn 0.377s ease-out' }}>
        <button
          onClick={() => router.push(backRoute)}
          className="mb-6 flex items-center text-sm font-light text-slate-400 transition-colors duration-[144ms] hover:text-white"
          style={{ gap: PHI_SCALE[1] }}
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>

        <div
          className="mx-auto flex min-h-[calc(100dvh-96px)] max-w-md flex-col justify-center"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {complete ? (
            <PracticeCompleteView
              practice={practice}
              onJournal={() => router.push(buildCheckInRoute(CHECK_IN_SOURCE.REGULATION))}
              onRestart={handleRestart}
              onHome={() => router.push(ROUTES.DASHBOARD)}
            />
          ) : (
            <div>
              <PracticeHero practice={practice} />

              {hasAudioPlan && (
                <div style={{ marginBottom: PHI_SCALE[3] }}>
                  <PracticeAudioPanel practice={practice} />
                </div>
              )}

              <div style={{ marginBottom: PHI_SCALE[3] }}>
                <PracticeSupportPanel
                  practice={practice}
                  onOpen={openSupportRoute}
                  onComplete={() => setComplete(true)}
                />
              </div>

              {!panelCompletesPractice && (
                <Card solfeggio={practice.solfeggio} padding="p-4">
                  <PracticeStepList steps={practice.steps} activeIndex={activeIndex} />
                </Card>
              )}

              <div className="mt-5 rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="text-xs font-light leading-relaxed text-slate-400">
                  {practice.safetyNotes[0]}
                </p>
              </div>

              <div className="mt-6 flex flex-col" style={{ gap: PHI_SCALE[1] }}>
                {!panelCompletesPractice && (
                  <Button onClick={handleNext} className="w-full" size="lg" solfeggio={practice.solfeggio}>
                    <span className="inline-flex items-center gap-2">
                      {activeIndex >= practice.steps.length - 1 ? 'Complete' : 'Next'}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                )}
                <Button
                  onClick={() => toggleFavorite(practice.id)}
                  variant="secondary"
                  className="w-full"
                >
                  <span className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {isFavorite(practice.id) ? 'Saved in my toolkit' : 'Save to my toolkit'}
                  </span>
                </Button>
                <Button onClick={() => router.push(ROUTES.DASHBOARD)} variant="ghost" className="w-full">
                  Return home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
