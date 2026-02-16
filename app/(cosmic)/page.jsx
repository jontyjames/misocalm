/**
 * Welcome Page (/)
 * Landing page with emotional validation, animated logo, and CTA
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Spinner } from '@/components/ui';
import { Logo } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const INTRO_TEXT = 'Welcome';
const SUBTITLE_TEXT = 'This is a space for you';
const SUBTITLE_DELAY = INTRO_TEXT.length * 0.034 + 0.377;

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, loading, sendOtp, verifyOtp } = useAuth();
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
    if (error) {
      setSignInError('That code didn\'t work. Check your email and try again.');
      setSignInVerifying(false);
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
      const startTimer = setTimeout(() => setIntroStarted(true), 377);
      // Welcome + subtitle animate, hold, then fade to reveal MisoCalm
      const doneTimer = setTimeout(() => setIntroDone(true), 4181);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
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
          absolute z-20 left-0 right-0 flex items-center justify-center transition-opacity duration-[610ms] ease-in-out
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
              animation: `fadeIn 0.377s ease-out ${i * 0.034}s forwards`,
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
            absolute z-20 left-0 right-0 flex items-center justify-center flex-wrap transition-opacity duration-[610ms] ease-in-out
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
                animation: `fadeIn 0.377s ease-out ${SUBTITLE_DELAY + i * 0.034}s forwards`,
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
          className={`text-[2.25rem] sm:text-[3rem] text-white transition-all duration-[987ms] ease-in-out ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, letterSpacing: '0.12em' }}
        >
          MisoCalm
        </h1>

        {/* Tagline — fades in after intro */}
        <p className={`text-base font-light text-slate-300 leading-relaxed transition-all duration-[987ms] ease-in-out delay-[377ms] ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}>
          A space to understand misophonia, regulate<br />your system, and find steadier ground.
        </p>

        {/* CTA Button — fades in after intro */}
        <div className={`mt-4 transition-all duration-[987ms] ease-in-out delay-[610ms] ${introDone && !transitioning ? 'opacity-100 translate-y-0' : ''} ${!introDone ? 'opacity-0 translate-y-2' : ''} ${transitioning ? 'opacity-0' : ''}`}>
          <button
            onClick={() => setTransitioning(true)}
            className="relative overflow-hidden w-full max-w-[16rem] py-4 px-8 rounded-full border border-white/[0.18] backdrop-blur-2xl active:scale-[0.98] hover:border-white/30 transition-all duration-[233ms] cursor-pointer"
            style={{
              background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)`,
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.3)`,
              animation: 'solfeggio-breathe-528 5.28s ease-in-out infinite',
            }}
          >
            {/* Hero top highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 50%, transparent 90%)' }} />
            {/* Phi opacity layers */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
            {/* Torus flow - indigo 528Hz */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
            <span className="relative z-10 font-light text-white text-base" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
              Begin Your Journey
            </span>
          </button>

          {/* Sign back in */}
          {!showSignIn && !signInSent && (
            <button
              onClick={() => setShowSignIn(true)}
              className="block mx-auto mt-5 text-sm text-slate-300 font-light hover:text-white transition-colors"
            >
              Already with us? Sign back in
            </button>
          )}

          {showSignIn && !signInSent && (
            <div className="mt-5 w-64 mx-auto" style={{ animation: 'fadeIn 233ms ease-out' }}>
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
            <div className="mt-5 w-64 mx-auto" style={{ animation: 'fadeIn 0.377s ease-out' }}>
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
      </div>

      {/* Sanctuary words - letter by letter */}
      {transitioning && (
        <div className="absolute z-20 flex items-center justify-center" style={{ top: 'calc(50% + 2rem)' }}>
          {'Your sanctuary awaits'.split('').map((char, i) => (
            <span
              key={i}
              className="text-2xl font-thin text-white opacity-0"
              style={{
                animation: `fadeIn 0.377s ease-out ${0.377 + i * 0.034}s forwards`,
                width: char === ' ' ? '0.5em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      )}

      {/* Subtle footer */}
      <div className={`absolute bottom-8 text-center transition-opacity duration-[610ms] ${introDone && !transitioning ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-xs text-slate-300 font-light">
          A Thriving With Misophonia App
        </p>
      </div>
    </div>
  );
}
