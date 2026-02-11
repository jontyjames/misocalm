/**
 * Tool Player Page
 * Individual tool/practice view — thin orchestrator
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import DurationSelector, { DURATION_OPTIONS_BY_TYPE } from '@/components/composed/tools/DurationSelector';
import BreathingPlayer from '@/components/composed/tools/BreathingPlayer';
import ComingSoon from '@/components/composed/tools/ComingSoon';
import { ROUTES } from '@/lib/constants';

// Tool data (would come from database)
const toolsData = {
  '1': { id: '1', title: '4-7-8 Breathing', description: 'The 4-7-8 breathing technique is a powerful tool for reducing anxiety and promoting calm. Developed by Dr. Andrew Weil, it acts as a natural tranquilizer for the nervous system.', category: 'breathwork', level: 'basic', type: 'practice', breathType: '478' },
  '2': { id: '2', title: 'Body Scan', description: 'A body scan meditation helps you release physical tension that often accompanies misophonia reactions. By systematically focusing on each part of your body, you can identify and release stored stress.', category: 'somatic', level: 'basic', duration_minutes: 10, type: 'guided' },
  '3': { id: '3', title: 'Box Breathing', description: 'Box breathing is a simple yet powerful technique used by Navy SEALs to stay calm under pressure. The equal 4-4-4-4 rhythm creates a meditative focus that helps redirect attention away from trigger sounds.', category: 'breathwork', level: 'basic', type: 'practice', breathType: 'box' },
  '4': { id: '4', title: 'Physiological Sigh', description: 'Discovered by Stanford neuroscientists, the physiological sigh is the fastest known way to calm your nervous system in real-time. Perfect for acute trigger moments when you need immediate relief.', category: 'breathwork', level: 'basic', type: 'practice', breathType: 'sigh' },
};

export default function ToolPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, profile, upsertProfile, refreshProfile, loading } = useAuth();
  const [tool, setTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const favoriteTools = profile?.favorite_tools || [];
  const isFavorite = tool && favoriteTools.includes(tool.id);

  const toggleFavorite = async () => {
    if (!tool) return;
    const current = profile?.favorite_tools || [];
    const updated = current.includes(tool.id)
      ? current.filter((id) => id !== tool.id)
      : [...current, tool.id];
    await upsertProfile({ favorite_tools: updated });
    await refreshProfile();
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const id = params.id;
    if (toolsData[id]) {
      setTool(toolsData[id]);
      const durationParam = searchParams.get('duration');
      if (durationParam && toolsData[id].breathType) {
        const options = DURATION_OPTIONS_BY_TYPE[toolsData[id].breathType];
        const match = options?.find(o => o.id === durationParam);
        if (match) setSelectedDuration(match);
      }
    }
  }, [params.id, searchParams]);

  if (loading || !tool) {
    return <AppLayout><div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div></AppLayout>;
  }

  // Duration selection
  if (tool.type === 'practice' && !selectedDuration) {
    return (
      <AppLayout>
        <DurationSelector
          tool={tool}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSelect={setSelectedDuration}
          onBack={() => router.push(ROUTES.TOOLS)}
        />
      </AppLayout>
    );
  }

  // Active practice
  if (tool.type === 'practice' && selectedDuration) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <button onClick={() => setSelectedDuration(null)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-light">{tool.title}</span>
            <button onClick={toggleFavorite} className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}>
              <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          <BreathingPlayer
            tool={tool}
            selectedDuration={selectedDuration}
            onChangeDuration={() => setSelectedDuration(null)}
            onJournal={() => router.push(ROUTES.LOG)}
            onReturnHome={() => router.push(ROUTES.DASHBOARD)}
          />
        </div>
      </AppLayout>
    );
  }

  // Non-practice tools (coming soon)
  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <button onClick={() => router.push(ROUTES.TOOLS)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-light">{tool.title}</span>
          <button onClick={toggleFavorite} className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}>
            <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <ComingSoon onBack={() => router.push(ROUTES.TOOLS)} />
      </div>
    </AppLayout>
  );
}
