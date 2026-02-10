/**
 * PostLogIntegration - Beautiful post-log page
 * Affirmation + three paths forward (deeper, breathe, sanctuary)
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layers, Wind, Home } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const AFFIRMATIONS = [
  'Noticing is not judging',
  'You deserve the same compassion you give others',
  'Awareness is a quiet kind of strength',
  "There's no wrong way to feel",
  "You're learning, not failing",
  'This takes courage, and you showed up',
  'What you feel is valid',
];

// Daily practices for the "Breathe" path (same as dashboard)
const PRACTICES = [
  { id: '1', duration: 'quick',  time: '~1.5 min' },
  { id: '1', duration: 'deep',   time: '~2.5 min' },
  { id: '1', duration: 'full',   time: '~5 min' },
  { id: '3', duration: 'quick',  time: '~1.5 min' },
  { id: '3', duration: 'deep',   time: '~3 min' },
  { id: '3', duration: 'full',   time: '~4 min' },
  { id: '4', duration: 'quick',  time: '~30 sec' },
  { id: '4', duration: 'medium', time: '~1 min' },
  { id: '4', duration: 'full',   time: '~1.5 min' },
];

function getRandomPractice() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return PRACTICES[day % PRACTICES.length];
}

export default function PostLogIntegration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get('entry');

  const affirmation = useMemo(() => {
    const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return AFFIRMATIONS[day % AFFIRMATIONS.length];
  }, []);

  const practice = useMemo(() => getRandomPractice(), []);

  // Letter-by-letter animation state
  const [visibleChars, setVisibleChars] = useState(0);
  const [showPaths, setShowPaths] = useState(false);

  useEffect(() => {
    if (visibleChars < affirmation.length) {
      const timer = setTimeout(() => setVisibleChars(v => v + 1), 34);
      return () => clearTimeout(timer);
    } else {
      // After affirmation completes, show paths
      const timer = setTimeout(() => setShowPaths(true), 987);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, affirmation.length]);

  const paths = [
    {
      title: 'Go a little deeper',
      description: 'Explore what this moment meant to you. Guided prompts help you understand the emotions and patterns beneath the surface.',
      icon: Layers,
      accent: 'violet',
      onClick: () => router.push(`${ROUTES.JOURNAL_DEEPER}${entryId ? `?entry=${entryId}` : ''}`),
    },
    {
      title: 'Breathe',
      description: 'Go straight into a calming practice',
      icon: Wind,
      accent: 'cyan',
      onClick: () => router.push(`/tools/${practice.id}?duration=${practice.duration}`),
    },
    {
      title: 'Return to sanctuary',
      description: 'Head back when you are ready',
      icon: Home,
      accent: 'indigo',
      onClick: () => router.push(ROUTES.DASHBOARD),
    },
  ];

  const colorMap = {
    violet: 'rgba(139,92,246,',
    cyan: 'rgba(34,211,238,',
    indigo: 'rgba(99,102,241,',
  };

  const iconStyles = {
    violet: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
    cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <div className="max-w-sm w-full text-center">
        {/* Affirmation - letter by letter */}
        <h1
          className="text-2xl leading-relaxed mb-16"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            textShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
            minHeight: '4rem',
          }}
        >
          {(() => {
            const words = affirmation.split(' ');
            let charIndex = 0;
            return words.map((word, wi) => {
              const startIdx = charIndex;
              charIndex += word.length + 1;
              return (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {word.split('').map((char, ci) => (
                    <span
                      key={ci}
                      style={{
                        opacity: startIdx + ci < visibleChars ? 1 : 0,
                        transition: 'opacity 0.377s ease-out',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {wi < words.length - 1 && (
                    <span style={{ opacity: startIdx + word.length < visibleChars ? 1 : 0, transition: 'opacity 0.377s ease-out' }}>&nbsp;</span>
                  )}
                </span>
              );
            });
          })()}
        </h1>

        {/* Three paths forward */}
        {showPaths && (
          <div
            className="space-y-4"
            style={{ animation: 'fadeIn 0.377s ease-out' }}
          >
            {paths.map((path) => {
              const Icon = path.icon;
              const colorRgba = colorMap[path.accent];
              return (
                <button
                  key={path.title}
                  onClick={path.onClick}
                  className="relative w-full p-5 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 text-left transition-all duration-[233ms]"
                  style={{
                    background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${colorRgba}0.08) 100%)`,
                    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px ${colorRgba}0.12), 0 4px 20px rgba(0,0,0,0.25)`,
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${colorRgba}0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, ${colorRgba}0.06) 0%, transparent 60%)` }} />
                  <div className="relative flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconStyles[path.accent]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-white mb-1"
                        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                      >
                        {path.title}
                      </h3>
                      <p className="text-sm text-slate-300 font-light">
                        {path.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
