/**
 * ToolsClient
 * Orchestrator for the practices page: hero + tools row + experience grid + coming soon.
 * Thin component — composes sections and handles auth guard + favorites.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/composed';
import { ToolsSkeleton } from '@/components/composed/skeletons';
import { ROUTES } from '@/lib/constants';
import HeroExperience from './HeroExperience';
import QuickToolsRow from './QuickToolsRow';
import ExperienceGrid from './ExperienceGrid';
import ComingSoonSection from './ComingSoonSection';

export default function ToolsClient() {
  const router = useRouter();
  const { isAuthenticated, profile, upsertProfile, refreshProfile, loading } = useAuth();
  const favoriteTools = profile?.favorite_tools || [];

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  const toggleFavorite = async (toolId) => {
    const current = profile?.favorite_tools || [];
    const updated = current.includes(toolId)
      ? current.filter((id) => id !== toolId)
      : [...current, toolId];
    await upsertProfile({ favorite_tools: updated });
    await refreshProfile();
  };

  if (loading) {
    return <AppLayout><ToolsSkeleton /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="px-6 py-8 pb-32 space-y-8" style={{ animation: 'fadeIn 0.377s ease-out' }}>
        <h1
          className="text-2xl text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Practices
        </h1>
        <HeroExperience />
        <QuickToolsRow favoriteTools={favoriteTools} onToggleFavorite={toggleFavorite} />
        <ExperienceGrid />
        <ComingSoonSection />
      </div>
    </AppLayout>
  );
}
