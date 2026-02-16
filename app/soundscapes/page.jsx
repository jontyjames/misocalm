/**
 * Soundscapes Page
 * Calming background sounds
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Volume2, Repeat, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremiumContext } from '@/context/PremiumContext';
import { Button, Card, Slider, Spinner, PremiumGate } from '@/components/ui';
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
  const { isAuthenticated, loading } = useAuth();
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(80);
  const [looping, setLooping] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

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
        <div className="flex items-center gap-4 px-6 py-8 mb-0">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-thin text-white">Sound Sanctuary</h1>
        </div>
        <PremiumGate feature="Sound Sanctuary" />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-thin text-white">Sound Sanctuary</h1>
        </div>

        {/* Soundscape Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SOUNDSCAPES.map((sound, index) => (
            <Card
              key={sound.id}
              onClick={() => handlePlay(sound)}
              className={`
                flex flex-col items-center justify-center py-8
                animate-fade-in-up stagger-${index + 1}
                ${playing?.id === sound.id ? 'border-cyan-500/50 bg-cyan-500/10' : ''}
              `}
            >
              <span className="text-4xl mb-3">{iconMap[sound.icon]}</span>
              <span className="text-white font-light">{sound.name}</span>
              <span className="text-xs text-slate-400">{sound.duration}</span>
            </Card>
          ))}
        </div>

        {/* Player Overlay */}
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
              <h2 className="text-2xl font-thin text-white mb-8">{playing.name}</h2>

              {/* Play/Pause */}
              <button
                onClick={() => setPlaying(playing.isPlaying ? { ...playing, isPlaying: false } : { ...playing, isPlaying: true })}
                className="w-20 h-20 rounded-full bg-primary-cta border border-indigo-500/30 flex items-center justify-center mx-auto mb-8"
              >
                {playing.isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-4 mb-6">
                <Volume2 className="w-5 h-5 text-slate-400" />
                <Slider
                  value={volume}
                  onChange={setVolume}
                  min={0}
                  max={100}
                  showValue={false}
                  className="flex-1"
                />
              </div>

              {/* Loop Toggle */}
              <button
                onClick={() => setLooping(!looping)}
                className={`
                  flex items-center gap-2 mx-auto px-4 py-2 rounded-full
                  ${looping ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}
                `}
              >
                <Repeat className="w-4 h-4" />
                <span className="text-sm">Loop</span>
              </button>

              {/* Note */}
              <p className="text-sm text-slate-400 mt-8">
                Sound Sanctuary is coming soon. Audio playback is not yet connected.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
