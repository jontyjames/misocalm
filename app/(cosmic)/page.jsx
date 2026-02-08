/**
 * Welcome Page (/)
 * Landing page with emotional validation, animated logo, and CTA
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Logo } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const INTRO_TEXT = 'Welcome';
const SUBTITLE_TEXT = 'This is a space for you';
const SUBTITLE_DELAY = INTRO_TEXT.length * 0.05 + 0.3;

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuth();
  const [introStarted, setIntroStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (hasCompletedOnboarding) {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.ONBOARDING_ASSESSMENT);
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, loading, router]);

  // Start intro letter animation after a brief pause
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const startTimer = setTimeout(() => setIntroStarted(true), 400);
      // Welcome + subtitle animate, hold, then fade to reveal MisoMind
      const doneTimer = setTimeout(() => setIntroDone(true), 4600);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [loading, isAuthenticated]);

  // Navigate after transition completes
  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        router.push(ROUTES.ONBOARDING_FIRST_PRACTICE);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [transitioning, router]);

  if (loading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center px-6">
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '28%' }}>
          <Logo size="xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6">
      {/* Logo — fixed position, always visible */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '28%' }}>
        <Logo size="xl" />
      </div>

      {/* "Welcome" — letter by letter, above the logo */}
      <div
        className={`
          absolute z-20 left-0 right-0 flex items-center justify-center transition-opacity duration-700 ease-in-out
          ${introDone ? 'opacity-0' : 'opacity-100'}
        `}
        style={{ top: '20%' }}
      >
        {introStarted && INTRO_TEXT.split('').map((char, i) => (
          <span
            key={i}
            className="text-3xl text-slate-200 opacity-0"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              letterSpacing: '0.05em',
              animation: `fadeIn 0.3s ease-out ${i * 0.05}s forwards`,
              width: char === ' ' ? '0.4em' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* "This is a space for you" — letter by letter, where MisoMind will appear */}
      {introStarted && (
        <div
          className={`
            absolute z-20 left-0 right-0 flex items-center justify-center flex-wrap transition-opacity duration-500 ease-in-out
            ${introDone ? 'opacity-0' : 'opacity-100'}
          `}
          style={{ top: 'calc(28% + 13rem)' }}
        >
          {SUBTITLE_TEXT.split('').map((char, i) => (
            <span
              key={i}
              className="text-3xl text-white/90 opacity-0"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                letterSpacing: '0.04em',
                animation: `fadeIn 0.3s ease-out ${SUBTITLE_DELAY + i * 0.04}s forwards`,
                width: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      )}

      <div className="absolute z-10 left-0 right-0 text-center flex flex-col items-center gap-3" style={{ top: 'calc(28% + 12.5rem)' }}>

        {/* App name — fades in after intro */}
        <h1
          className={`text-[3rem] text-white transition-all duration-1200 ease-in-out ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, letterSpacing: '0.12em' }}
        >
          MisoMind
        </h1>

        {/* Tagline — fades in after intro */}
        <p className={`text-base font-light text-slate-300 leading-relaxed transition-all duration-1200 ease-in-out delay-300 ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}>
          A space to understand misophonia, regulate<br />your system, and find steadier ground.
        </p>

        {/* CTA Button — fades in after intro */}
        <div className={`mt-4 transition-all duration-1200 ease-in-out delay-500 ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}>
          <Button
            size="lg"
            shape="pill"
            onClick={() => setTransitioning(true)}
            className="w-64"
          >
            Begin Your Journey
          </Button>
        </div>
      </div>

      {/* Sanctuary words - letter by letter */}
      {transitioning && (
        <div className="absolute z-20 flex items-center justify-center" style={{ top: 'calc(50% + 2rem)' }}>
          {'Your sanctuary awaits'.split('').map((char, i) => (
            <span
              key={i}
              className="text-2xl font-thin text-white opacity-0"
              style={{
                animation: `fadeIn 0.3s ease-out ${0.4 + i * 0.04}s forwards`,
                width: char === ' ' ? '0.5em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      )}

      {/* Subtle footer */}
      <div className={`absolute bottom-8 text-center transition-opacity duration-500 ${introDone && !transitioning ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-xs text-slate-400 font-light">
          A Thriving With Misophonia App
        </p>
      </div>
    </div>
  );
}
