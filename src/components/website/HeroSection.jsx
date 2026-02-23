/**
 * HeroSection — Landing hero with breathing orb, title, subtitle, dual CTA.
 * Fibonacci-timed fade-ins, phi-spaced layout.
 */

import Link from 'next/link';
import BreathingHero from './BreathingHero';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-16 sm:pt-32 sm:pb-24 min-h-[80vh] justify-center">
      {/* Breathing orb — decorative */}
      <BreathingHero className="mb-10 h-48" />

      {/* Title */}
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 leading-tight opacity-0"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          letterSpacing: '0.06em',
          animation: 'fadeIn 987ms ease-out 233ms forwards',
        }}
      >
        MisoCalm
      </h1>

      {/* Subtitle */}
      <p
        className="text-xl sm:text-2xl text-slate-200 leading-relaxed max-w-lg mb-10 opacity-0"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          animation: 'fadeIn 987ms ease-out 610ms forwards',
        }}
      >
        A space for living with misophonia
      </p>

      {/* Dual CTA */}
      <div
        className="flex flex-col sm:flex-row items-center gap-4 opacity-0"
        style={{ animation: 'fadeInUp 610ms ease-out 987ms forwards' }}
      >
        {/* Primary — try the app */}
        <Link
          href="/"
          className="inline-flex items-center justify-center py-4 px-10 rounded-full border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 transition-all duration-[233ms] text-white text-base"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
            boxShadow:
              'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          Try MisoCalm Free
        </Link>

        {/* Secondary — quiz */}
        <Link
          href="/quiz"
          className="text-indigo-300 hover:text-indigo-200 transition-colors duration-[233ms] text-sm font-light"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Take the quiz
        </Link>
      </div>
    </section>
  );
}
