'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';
import { Card, SectionHeading } from '@/components/ui';
import { useAuthGuard, useRegulationToolkitFavorites } from '@/hooks';
import { PHI_SCALE, ROUTES } from '@/lib/constants';
import { REGULATION_FAMILIES, getToolkitPreview } from '@/lib/regulationToolkitData';
import { ROUTE_CONTEXT, withRouteContext } from '@/lib/routeContext';
import RegulationBetaNotice from './RegulationBetaNotice';
import ToolkitFamilySection from './ToolkitFamilySection';
import ToolkitPathCard from './ToolkitPathCard';
import ToolkitPracticePill from './ToolkitPracticePill';

export default function RegulationToolkitClient() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthGuard();
  const { favorites } = useRegulationToolkitFavorites();
  const paths = getToolkitPreview();
  const openPractice = (route) => router.push(withRouteContext(route, ROUTE_CONTEXT.REGULATION));

  if (loading || !isAuthenticated) {
    return (
      <AppLayout>
        <RouteSkeleton titleWidth={190} introLines={2} cardCount={3} showHero />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <RegulationBetaNotice />
      <div
        className="min-h-screen px-6 py-8 pb-32"
        style={{ animation: 'fadeIn 0.377s ease-out' }}
      >
        <button
          onClick={() => router.push(ROUTES.TOOLS)}
          className="mb-6 flex items-center text-sm font-light text-slate-400 transition-colors duration-[144ms] hover:text-white"
          style={{ gap: PHI_SCALE[1] }}
        >
          <ArrowLeft className="h-4 w-4" />
          Practices
        </button>

        <div style={{ marginBottom: PHI_SCALE[4] }}>
          <h1
            className="text-2xl text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Regulation Toolkit
          </h1>
          <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-slate-300">
            Choose the kind of support your body needs right now.
          </p>
        </div>

        <section className="flex flex-col" style={{ gap: PHI_SCALE[3] }}>
          {favorites.length > 0 && (
            <>
              <SectionHeading glowColor="rgba(139,92,246,0.28)">My Toolkit</SectionHeading>
              <Card solfeggio="violet" padding="p-4">
                <div className="grid gap-2">
                  {favorites.map((practice) => (
                    <ToolkitPracticePill key={practice.id} practice={practice} onOpen={openPractice} />
                  ))}
                </div>
              </Card>
            </>
          )}
          <SectionHeading glowColor="rgba(34,211,238,0.28)">Start Here</SectionHeading>
          {paths.map((path) => (
            <ToolkitPathCard key={path.id} path={path} onOpen={openPractice} />
          ))}

          <SectionHeading glowColor="rgba(139,92,246,0.28)">Browse by Body System</SectionHeading>
          {REGULATION_FAMILIES.map((family) => (
            <ToolkitFamilySection key={family.id} family={family} onOpen={openPractice} />
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
