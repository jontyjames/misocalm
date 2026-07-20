/**
 * ToolsClient
 * Orchestrator for the practices page: hero + tools row + experience row + coming soon.
 * Thin component — composes sections and handles auth guard.
 */

'use client';

import { useAuthGuard } from '@/hooks';
import { AppLayout } from '@/components/composed';
import { ToolsSkeleton } from '@/components/composed/skeletons';
import HeroExperience from './HeroExperience';
import RegulationToolkitEntry from './RegulationToolkitEntry';
import QuickToolsRow from './QuickToolsRow';
import ExperienceRow from './ExperienceRow';
import EducationSection from './EducationSection';
import ComingSoonSection from './ComingSoonSection';

export default function ToolsClient() {
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading || !isAuthenticated) {
    return <AppLayout><ToolsSkeleton /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="px-6 py-8 pb-32 space-y-8 overflow-x-clip" style={{ animation: 'fadeIn 0.377s ease-out' }}>
        <h1
          className="text-2xl text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Practices
        </h1>
        <div className="relative">
          <div
            className="absolute pointer-events-none rounded-3xl"
            style={{
              top: '-2rem',
              bottom: '-2rem',
              left: '-1.5rem',
              right: '-1.5rem',
              background: 'radial-gradient(ellipse 90% 140% at center, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.04) 45%, transparent 70%)',
              filter: 'blur(24px)',
              animation: 'glow-breathe 7.1s ease-in-out infinite',
            }}
          />
          <HeroExperience />
        </div>
        <RegulationToolkitEntry />
        <QuickToolsRow />
        <ExperienceRow />
        <EducationSection />
        <ComingSoonSection />
      </div>
    </AppLayout>
  );
}
