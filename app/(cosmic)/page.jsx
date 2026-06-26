/**
 * Welcome Page (/)
 * Landing page with emotional validation, animated logo, and CTA
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useReducedMotion } from '@/hooks';
import { Button, Input } from '@/components/ui';
import { Logo } from '@/components/composed';
import { WelcomeSkeleton } from '@/components/composed/skeletons';
import { ROUTES } from '@/lib/constants';
import { SACRED_GLASS_PILL_CLASSES, sacredGlassPillStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle } from '@/lib/sacredGlass';

const INTRO_TEXT = 'Welcome';
const SUBTITLE_TEXT = 'This is a space for you';
const SUBTITLE_DELAY = INTRO_TEXT.length * 0.089 + 0.610;

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, loading, sendOtp, verifyOtp } = useAuth();
  const prefersReduced = useReducedMotion();
  const [introStarted, setIntroStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInSending, setSignInSending] = useState(false);
  const [signInSent, setSignInSent] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [signInCode, setSignInCode] = useState('');
  const [signInVerifying, setSignInVerifying] = useState(false);

  const handleSignIn = async () => {
    if (!signInEmail.trim() || signInSending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInEmail)) {
      setSignInError('Please enter a valid email');
      return;
    }
    setSignInSending(true);
    setSignInError(null);
    const { error } = await sendOtp(signInEmail);
    if (error) {
      setSignInError(error);
      setSignInSending(false);
    } else {
      setSignInSent(true);
      setSignInSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (signInCode.length !== 6 || signInVerifying) return;
    setSignInVerifying(true);
    setSignInError(null);
    const { error } = await verifyOtp(signInEmail, signInCode);
    setSignInVerifying(false);
    if (error) {
      setSignInError('That code didn\'t work. Check your email and try again.');
      setSignInCode('');
    }
    // On success, onAuthStateChange fires and redirect happens
  };

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
      const startTimer = setTimeout(() => setIntroStarted(true), 987);
      // Welcome + subtitle animate, hold, then fade to reveal MisoCalm
      const doneTimer = setTimeout(() => setIntroDone(true), 6765);
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
      }, 2584);
      return () => clearTimeout(timer);
    }
  }, [transitioning, router]);

  if (loading) {
    return <WelcomeSkeleton />;
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
          absolute z-20 left-0 right-0 flex items-center justify-center transition-opacity duration-[610ms] ease-in-out
          ${introDone ? 'opacity-0' : 'opacity-100'}
        `}
        style={{ top: '20%' }}
      >
        {introStarted && INTRO_TEXT.split('').map((char, i) => (
          <span
            key={i}
            className={`text-3xl text-slate-200 ${prefersReduced ? '' : 'opacity-0'}`}
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              letterSpacing: '0.05em',
              animation: prefersReduced ? 'none' : `fadeIn 0.610s ease-out ${i * 0.089}s forwards`,
              width: char === ' ' ? '0.4em' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* "This is a space for you" — letter by letter */}
      {introStarted && (
        <div
          className={`
            absolute z-20 left-0 right-0 flex items-center justify-center flex-wrap transition-opacity duration-[610ms] ease-in-out
            ${introDone ? 'opacity-0' : 'opacity-100'}
          `}
          style={{ top: 'calc(28% + 13rem)' }}
        >
          {SUBTITLE_TEXT.split('').map((char, i) => (
            <span
              key={i}
              className={`text-3xl text-white/90 ${prefersReduced ? '' : 'opacity-0'}`}
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                letterSpacing: '0.04em',
                animation: prefersReduced ? 'none' : `fadeIn 0.377s ease-out ${SUBTITLE_DELAY + i * 0.034}s forwards`,
                width: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      )}

      <div className="absolute z-10 left-0 right-0 text-center flex flex-col items-center gap-3 transition-all duration-[377ms] ease-in-out" style={{ top: showSignIn || signInSent ? 'calc(28% + 7rem)' : 'calc(28% + 12.5rem)' }}>

        {/* App name — fades in after intro */}
        <h1
          className={`text-[2.25rem] sm:text-[3rem] text-white transition-all duration-[987ms] ease-in-out ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, letterSpacing: '0.12em' }}
        >
          MisoCalm
        </h1>

        {/* Tagline — fades in after intro */}
        <p className={`text-base font-light text-slate-300 leading-relaxed transition-all duration-[377ms] ease-in-out delay-[377ms] ${introDone && !transitioning && !showSignIn && !signInSent ? 'opacity-100 translate-y-0' : ''} ${!introDone || showSignIn || signInSent ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}>
          A space to understand misophonia, regulate<br />your system, and find steadier ground.
        </p>

        {/* CTA Button — fades in after intro, hidden during sign-in */}
        {!showSignIn && !signInSent && (
          <div className={`mt-4 transition-all duration-[377ms] ease-in-out delay-[610ms] ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}>
            <button
              onClick={() => setTransitioning(true)}
              className={`relative overflow-hidden w-full max-w-[16rem] py-4 px-8 ${SACRED_GLASS_PILL_CLASSES} active:scale-[0.98] cursor-pointer`}
              style={{
                ...sacredGlassPillStyle('indigo'),
                animation: 'solfeggio-breathe-528 5.28s ease-in-out infinite',
              }}
            >
              {/* Hero top highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 50%, transparent 90%)' }} />
              {/* Phi opacity layers */}
              <div className="absolute inset-0 pointer-events-none" style={PHI_LAYERS_STYLE} />
              {/* Torus flow - indigo 528Hz */}
              <div className="absolute inset-0 pointer-events-none" style={torusFlowStyle('indigo')} />
              <span className="relative z-10 font-light text-white text-base" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
                Begin Your Journey
              </span>
            </button>

            <button
              onClick={() => setShowSignIn(true)}
              className="block mx-auto mt-5 text-sm text-slate-300 font-light hover:text-white transition-colors"
            >
              Already with us? Sign back in
            </button>
          </div>
        )}

        {showSignIn && !signInSent && (
          <div className="mt-4 w-full max-w-[16rem] mx-auto" style={{ animation: 'fadeIn 233ms ease-out' }}>
            <Input
              type="email"
              placeholder="Your email address"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              error={signInError}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
            <Button
              onClick={handleSignIn}
              loading={signInSending}
              disabled={!signInEmail.trim()}
              className="w-full mt-3"
              size="md"
              variant="secondary"
            >
              Send code
            </Button>
          </div>
        )}

        {signInSent && (
          <div className="mt-4 w-full max-w-[16rem] mx-auto" style={{ animation: 'fadeIn 0.377s ease-out' }}>
            <p className="text-sm text-slate-200 font-light text-center mb-3">
              Enter the code we sent to your email
            </p>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={signInCode}
              onChange={(e) => setSignInCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              error={signInError}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
            />
            <Button
              onClick={handleVerifyCode}
              loading={signInVerifying}
              disabled={signInCode.length !== 6}
              className="w-full mt-3"
              size="md"
              variant="secondary"
            >
              Sign in
            </Button>
          </div>
        )}
      </div>

      {/* Sanctuary words - letter by letter */}
      {transitioning && (
        <div className="absolute z-20 flex items-center justify-center" style={{ top: 'calc(50% + 2rem)' }}>
          {'Your sanctuary awaits'.split('').map((char, i) => (
            <span
              key={i}
              className={`text-2xl text-white ${prefersReduced ? '' : 'opacity-0'}`}
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                animation: prefersReduced ? 'none' : `fadeIn 0.377s ease-out ${0.377 + i * 0.034}s forwards`,
                width: char === ' ' ? '0.5em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      )}

      {/* Subtle footer */}
      <div className={`absolute bottom-8 text-center transition-opacity duration-[610ms] ${introDone && !transitioning && !showSignIn && !signInSent ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-xs text-slate-300 font-light">
          A Thriving With Misophonia App
        </p>
      </div>
    </div>
  );
}
