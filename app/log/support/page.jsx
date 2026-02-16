/**
 * Support Selection Page
 * After logging a trigger, choose support type
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wind, Heart, Music, MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const supportOptions = [
  {
    icon: Wind,
    title: 'Breathing Technique',
    description: 'Calm your nervous system with guided breathing',
    iconBg: 'bg-indigo-500/20 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    href: '/tools/1',
  },
  {
    icon: Heart,
    title: 'Calming Mantra',
    description: 'Soothing affirmations for difficult moments',
    iconBg: 'bg-pink-500/20 border-pink-500/30',
    iconColor: 'text-pink-400',
    href: null, // Shows inline
  },
  {
    icon: Music,
    title: 'Soothing Soundscape',
    description: 'Block out triggers with calming sounds',
    iconBg: 'bg-cyan-500/20 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    href: ROUTES.SOUNDSCAPES,
  },
  {
    icon: MessageCircle,
    title: 'Talk to AI',
    description: 'Chat with Miso for personalized support',
    iconBg: 'bg-purple-500/20 border-purple-500/30',
    iconColor: 'text-purple-400',
    href: ROUTES.CHAT,
  },
];

const mantras = [
  "This feeling is temporary. I am safe.",
  "I can't control sounds, but I can control my response.",
  "My reaction doesn't define me.",
  "I am learning to cope, and that's enough.",
];

export default function SupportPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [showMantra, setShowMantra] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);
  const [currentMantra, setCurrentMantra] = useState('');

  const handleSelect = (option) => {
    if (option.href) {
      router.push(option.href);
    } else {
      // Show mantra in overlay
      const mantra = mantras[Math.floor(Math.random() * mantras.length)];
      setCurrentMantra(mantra);
      setShowMantra(true);
    }
  };

  const getNewMantra = () => {
    const mantra = mantras[Math.floor(Math.random() * mantras.length)];
    setCurrentMantra(mantra);
  };

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-thin text-white mb-2">
          Choose Your Support
        </h1>
        <p className="text-slate-300 font-light mb-8">
          What would help you right now?
        </p>

        <div className="space-y-3 mb-8">
          {supportOptions.map((option, index) => (
            <button
              key={option.title}
              onClick={() => handleSelect(option)}
              className={`
                w-full text-left p-4 rounded-xl
                bg-slate-800/50 border border-slate-700
                hover:border-indigo-500/40 hover:bg-slate-800/70
                transition-all duration-[144ms]
                animate-fade-in-up stagger-${index + 1}
              `}
            >
              <div className="flex items-center gap-4 h-12">
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                    ${option.iconBg} border
                  `}
                >
                  <option.icon className={`w-6 h-6 ${option.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-light text-base">{option.title}</h3>
                  <p className="text-sm text-slate-300 font-light truncate">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="w-full"
        >
          I'm Good For Now
        </Button>
      </div>

      {/* Mantra Overlay */}
      {showMantra && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in-up">
          <div className="w-full max-w-sm text-center animate-scale-in">
            {/* Close button */}
            <button
              onClick={() => setShowMantra(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Heart icon */}
            <div className="w-20 h-20 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-pink-400" />
            </div>

            {/* Mantra text */}
            <p className="text-xl font-light text-white mb-8 leading-relaxed">
              "{currentMantra}"
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={getNewMantra} variant="secondary" className="w-full">
                Show Another
              </Button>
              <Button onClick={() => setShowMantra(false)} className="w-full">
                I Feel Better
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
