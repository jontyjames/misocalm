/**
 * Soundscapes Page
 * Honest holding space until audio journeys are built.
 */

'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Waves, Wind, Sparkles } from 'lucide-react';
import { useAuthGuard } from '@/hooks';
import { Button, Card, PageHeader } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';
import { ROUTES } from '@/lib/constants';

const AVAILABLE_PATHS = [
  {
    icon: Wind,
    title: 'Calm your system',
    body: 'Start with a breathing practice that works now.',
    href: ROUTES.CALM,
  },
  {
    icon: Sparkles,
    title: 'Open the practice suite',
    body: 'Use one of the six guided visual experiences.',
    href: ROUTES.TOOLS,
  },
  {
    icon: BookOpen,
    title: 'Find support resources',
    body: 'Use the support links and grounding options that are ready now.',
    href: ROUTES.RESOURCES,
  },
];

export default function SoundscapesPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading || !isAuthenticated) {
    return (
      <AppLayout showNav={false}>
        <RouteSkeleton titleWidth={160} introLines={2} cardCount={3} />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8">
        <PageHeader title="Sound Sanctuary" backHref={ROUTES.DASHBOARD} className="mb-8" />

        <section className="text-center mb-[42px]">
          <div className="w-[68px] h-[68px] mx-auto mb-[26px] rounded-full border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
            <Waves className="w-8 h-8 text-cyan-300" />
          </div>
          <h1
            className="text-3xl text-white mb-4"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Sound journeys are being crafted
          </h1>
          <p className="text-sm text-slate-300 font-light leading-relaxed max-w-sm mx-auto">
            This space is not ready yet. No fake previews, no pretend playback.
            While it is being built, these working spaces are here for you.
          </p>
        </section>

        <div className="space-y-3 mb-[42px]">
          {AVAILABLE_PATHS.map(({ icon: Icon, title, body, href }) => (
            <Card key={href} onClick={() => router.push(href)} className="text-left">
              <div className="flex items-start gap-4">
                <div className="w-[42px] h-[42px] rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-white font-light mb-1">{title}</h2>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="secondary" className="w-full" onClick={() => router.push(ROUTES.DASHBOARD)}>
          Return to sanctuary
        </Button>
      </div>
    </AppLayout>
  );
}
