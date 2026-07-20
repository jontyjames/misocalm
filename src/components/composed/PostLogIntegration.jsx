/**
 * PostLogIntegration - Beautiful post-log page
 * Affirmation + paths forward, following the torus journey model
 *
 * Context-aware via search params:
 *   ?type=check_in        - after a check-in (vs trigger log)
 *   ?from={practiceSource} - check-in was post-practice (cycle complete, return to centre)
 *   ?entry={id}            - links deeper processing to original entry
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layers, Wind, Home, Compass } from 'lucide-react';
import { CHECK_IN_ORIGIN, normalizeCheckInOrigin, normalizeCheckInSource } from '@/lib/checkInContext';
import { ROUTES, FIBONACCI_TIMING } from '@/lib/constants';
import { REGULATION_MODES, getRecommendedPractice } from '@/lib/regulationToolkitData';
import { ROUTE_CONTEXT, withRouteContext } from '@/lib/routeContext';
import { getDayOfYear } from '@/lib/dateUtils';
import { useReducedMotion } from '@/hooks';
import StarDissolve from './StarDissolve';
import { SACRED_GLASS_CLASSES, sacredGlassStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle } from '@/lib/sacredGlass';

const TRIGGER_AFFIRMATIONS = [
  'Noticing is not judging',
  'You deserve the same compassion you give others',
  'Awareness is a quiet kind of strength',
  "There's no wrong way to feel",
  "You're learning, not failing",
  'This takes courage, and you showed up',
  'What you feel is valid',
];

const CHECK_IN_AFFIRMATIONS = [
  'You showed up for yourself',
  'Stillness is its own kind of strength',
  'Awareness without pressure',
  'Breathing is always a good answer',
  'The calm you feel is yours to keep',
  'You gave yourself space, that matters',
  'A moment of peace, well earned',
];

export default function PostLogIntegration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();
  const entryId = searchParams.get('entry');
  const isCheckIn = searchParams.get('type') === 'check_in';
  const from = searchParams.get('from');
  const origin = normalizeCheckInOrigin(searchParams.get('origin'));
  const intensityParam = Number(searchParams.get('intensity') || 0);
  const intensity = Number.isFinite(intensityParam) ? intensityParam : 0;
  const bodyParam = searchParams.get('body') || '';
  const practiceSource = normalizeCheckInSource(from);
  const fromPractice = Boolean(practiceSource);

  const affirmations = isCheckIn ? CHECK_IN_AFFIRMATIONS : TRIGGER_AFFIRMATIONS;

  const affirmation = useMemo(() => {
    return affirmations[getDayOfYear() % affirmations.length];
  }, [affirmations]);

  const recommendedPractice = useMemo(() => {
    return getRecommendedPractice({
      mode: isCheckIn ? REGULATION_MODES.BUILD_CAPACITY : REGULATION_MODES.TRIGGERED_NOW,
      intensity,
      bodyResponses: bodyParam.split('|').filter(Boolean).slice(0, 5),
    });
  }, [bodyParam, intensity, isCheckIn]);

  // Letter-by-letter animation state
  const [visibleChars, setVisibleChars] = useState(0);
  const [showPaths, setShowPaths] = useState(false);
  const [showStarDissolve, setShowStarDissolve] = useState(true);

  useEffect(() => {
    if (visibleChars < affirmation.length) {
      const timer = setTimeout(() => setVisibleChars(v => v + 1), FIBONACCI_TIMING.micro);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowPaths(true), FIBONACCI_TIMING.breathe);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, affirmation.length]);

  // Build paths based on context (torus journey model)
  // Forward all context params so DeeperProcessing knows the origin
  const deeperParams = new URLSearchParams();
  if (entryId) deeperParams.set('entry', entryId);
  if (isCheckIn) deeperParams.set('type', 'check_in');
  if (fromPractice) deeperParams.set('from', practiceSource);
  if (origin) deeperParams.set('origin', origin);
  const deeperRoute = `${ROUTES.JOURNAL_DEEPER}?${deeperParams.toString()}`;
  const recommendedPracticeRoute = withRouteContext(recommendedPractice.route, ROUTE_CONTEXT.POST_LOG);
  const returnToPracticesRoute = origin === CHECK_IN_ORIGIN.REGULATION || practiceSource === CHECK_IN_ORIGIN.REGULATION
    ? ROUTES.REGULATION_TOOLKIT
    : ROUTES.TOOLS;

  let paths;

  if (isCheckIn && fromPractice) {
    // Post-practice check-in: cycle is complete, return to centre
    // 3 paths (prime): home, deeper, or practices
    paths = [
      {
        title: 'Return to sanctuary',
        description: 'Head back when you are ready',
        icon: Home,
        accent: 'indigo',
        onClick: () => router.push(ROUTES.DASHBOARD),
      },
      {
        title: 'Go a little deeper',
        description: 'Explore what this moment meant to you',
        icon: Layers,
        accent: 'violet',
        onClick: () => router.push(deeperRoute),
      },
      {
        title: 'Return to practices',
        description: 'Find another practice when you are ready',
        icon: Compass,
        accent: 'cyan',
        onClick: () => router.push(returnToPracticesRoute),
      },
    ];
  } else if (isCheckIn) {
    // Standalone check-in (from journal hub): offer depth, breathe, or home
    paths = [
      {
        title: 'Go a little deeper',
        description: 'Explore what this moment meant to you',
        icon: Layers,
        accent: 'violet',
        onClick: () => router.push(deeperRoute),
      },
      {
        title: recommendedPractice.title,
        description: recommendedPractice.summary,
        icon: Wind,
        accent: 'cyan',
        onClick: () => router.push(recommendedPracticeRoute),
      },
      {
        title: 'Return to sanctuary',
        description: 'Head back when you are ready',
        icon: Home,
        accent: 'indigo',
        onClick: () => router.push(ROUTES.DASHBOARD),
      },
    ];
  } else {
    // Trigger log: offer depth, breathe, or home
    paths = [
      {
        title: 'Go a little deeper',
        description: 'Explore what this moment meant to you. Guided prompts help you understand the emotions and patterns beneath the surface.',
        icon: Layers,
        accent: 'violet',
        onClick: () => router.push(deeperRoute),
      },
      {
        title: recommendedPractice.title,
        description: recommendedPractice.summary,
        icon: Wind,
        accent: 'cyan',
        onClick: () => router.push(recommendedPracticeRoute),
      },
      {
        title: 'Return to sanctuary',
        description: 'Head back when you are ready',
        icon: Home,
        accent: 'indigo',
        onClick: () => router.push(ROUTES.DASHBOARD),
      },
    ];
  }

  // colorMap removed â€” using sacredGlass utilities instead

  const iconStyles = {
    violet: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
    cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <div className="max-w-sm w-full text-center relative">
        {/* Star dissolution celebration */}
        <StarDissolve active={showStarDissolve} color={isCheckIn ? 'cyan' : 'violet'} />

        {/* Affirmation - letter by letter */}
        <h1
          className="text-2xl leading-relaxed mb-16"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            textShadow: isCheckIn
              ? '0 0 20px rgba(34,211,238,0.4), 0 0 40px rgba(34,211,238,0.15)'
              : '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
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
                        transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out',
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

        {/* Paths forward */}
        {showPaths && (
          <div
            className="space-y-4"
            style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.377s ease-out' }}
          >
            {paths.map((path) => {
              const Icon = path.icon;
              return (
                <button
                  key={path.title}
                  onClick={path.onClick}
                  className={`relative w-full p-5 rounded-2xl overflow-hidden ${SACRED_GLASS_CLASSES} text-left`}
                  style={sacredGlassStyle(path.accent)}
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={GLASS_HIGHLIGHT_STYLE} />
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={PHI_LAYERS_STYLE} />
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={torusFlowStyle(path.accent)} />
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
