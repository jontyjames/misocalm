/**
 * Welcome Page (/)
 * Landing page with animated logo and CTA
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Starfield, Logo } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuth();
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

  // Navigate after transition completes
  useEffect(() => {
    if (transitioning) {
      // Navigate after letters have appeared + pause to let it settle
      const timer = setTimeout(() => {
        router.push(ROUTES.ONBOARDING_FIRST_PRACTICE);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [transitioning, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <Logo size="lg" animate />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-black relative flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield count={40} />

      <div className="relative z-10 text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo size="xl" animate />
        </div>

        {/* App name */}
        <h1 className={`text-4xl font-thin text-white tracking-tight transition-opacity duration-[400ms] ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          MisoMind
        </h1>

        {/* Tagline */}
        <p className={`text-lg font-light text-slate-300 transition-opacity duration-[400ms] ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          Tools and support to help you manage misophonia
        </p>

        {/* CTA Button */}
        <div className={`pt-8 transition-opacity duration-[400ms] ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
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
      <div className={`absolute bottom-8 text-center transition-opacity duration-[400ms] ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-xs text-slate-400 font-light">
          A Thriving With Misophonia App
        </p>
      </div>
    </div>
  );
}
