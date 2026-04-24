/**
 * Soundscapes Page
 * Calming background sounds
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { usePremiumContext } from '@/context/PremiumContext';
import { useAuthGuard } from '@/hooks';
import { Card, Spinner, PremiumGate, PageHeader } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ROUTES, SOUNDSCAPES } from '@/lib/constants';

// Icon mapping
const iconMap = {
  CloudRain: '🌧️',
  Waves: '🌊',
  TreePine: '🌲',
  Radio: '📻',
  Moon: '🌙',
  Flame: '🔥',
  Droplets: '💧',
};

export default function SoundscapesPage() {
  const router = useRouter();
  const { loading } = useAuthGuard();
  const [playing, setPlaying] = useState(null);

  const handlePlay = (soundscape) => {
    if (playing?.id === soundscape.id) {
      setPlaying(null);
    } else {
      setPlaying(soundscape);
    }
  };

  const handleClose = () => {
    setPlaying(null);
  };

  const { isPremium, isLoading: premiumLoading } = usePremiumContext();

  if (loading || premiumLoading) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!isPremium) {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Sound Sanctuary" backHref={ROUTES.DASHBOARD} className="px-6 py-8" />
        <PremiumGate feature="Sound Sanctuary" />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8">
        <PageHeader title="Sound Sanctuary" backHref={ROUTES.DASHBOARD} className="mb-8" />

        {/* Coming soon note */}
        <p className="text-sm text-slate-400 font-light text-center mb-6 leading-relaxed">
          Sound journeys are being crafted. While they're on their way, the breathing tools and experiences are here for you.
        </p>

        {/* Soundscape Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SOUNDSCAPES.map((sound, index) => (
            <Card
              key={sound.id}
              onClick={() => handlePlay(sound)}
              className={`
                flex flex-col items-center justify-center py-8
                animate-fade-in-up stagger-${index + 1}
                opacity-70
              `}
            >
              <span className="text-4xl mb-3">{iconMap[sound.icon]}</span>
              <span className="text-white font-light">{sound.name}</span>
              <span className="text-xs text-slate-500 mt-1">Coming soon</span>
            </Card>
          ))}
        </div>

        {/* Preview Overlay */}
        {playing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in-up">
            <div className="w-full max-w-sm text-center animate-scale-in">
              {/* Close button */}
              <button
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <div className="text-8xl mb-6">{iconMap[playing.icon]}</div>

              {/* Name */}
              <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>{playing.name}</h2>

              <p className="text-sm text-slate-300 font-light mb-2">
                {playing.duration}
              </p>

              <p className="text-sm text-indigo-300/70 font-light">
                Sound Sanctuary is being crafted. Audio playback is coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
