/**
 * CTASection — Final emotional CTA at bottom of homepage.
 * Warm, validating language. No pressure.
 */

'use client';

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { FIBONACCI_TIMING } from '@/lib/constants';
import { SACRED_GLASS_PILL_CLASSES, sacredGlassPillStyle } from '@/lib/sacredGlass';

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
            className={`inline-block relative overflow-hidden py-4 px-10 ${SACRED_GLASS_PILL_CLASSES} text-white text-base`}
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              ...sacredGlassPillStyle('indigo'),
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
