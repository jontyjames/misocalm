/**
 * CTASection — Final emotional CTA at bottom of homepage.
 * Warm, validating language. No pressure.
 */

'use client';

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { FIBONACCI_TIMING } from '@/lib/constants';

export default function CTASection() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal duration={FIBONACCI_TIMING.breathe}>
          <p
            className="text-xl sm:text-2xl text-slate-200 leading-relaxed mb-8"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            If you have been looking for something that understands,
            <br className="hidden sm:block" /> this is it.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={FIBONACCI_TIMING.shift}>
          <Link
            href="/"
            className="inline-block relative overflow-hidden py-4 px-10 rounded-full border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 transition-all duration-[233ms] text-white text-base"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            Enter MisoCalm
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={FIBONACCI_TIMING.move}>
          <p className="mt-10 text-xs text-slate-300 font-light">
            A Thriving With Misophonia App
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
