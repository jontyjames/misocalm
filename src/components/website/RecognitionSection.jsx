/**
 * RecognitionSection — Empathetic "you already know" text.
 * Validates the visitor's experience before pitching anything.
 * UX Philosophy: value before commitment.
 */

'use client';

import ScrollReveal from './ScrollReveal';
import { FIBONACCI_TIMING } from '@/lib/constants';

export default function RecognitionSection() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal duration={FIBONACCI_TIMING.breathe}>
          <h2
            className="text-2xl sm:text-3xl text-white mb-6 leading-relaxed"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            You already know how it feels
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={FIBONACCI_TIMING.shift} duration={FIBONACCI_TIMING.breathe}>
          <div className="space-y-4 text-slate-200 font-light leading-relaxed">
            <p>
              The rush of anger when someone chews. The panic when a sound
              you cannot control fills the space. The guilt when people
              say you are overreacting.
            </p>
            <p>
              Misophonia is a neurological condition where specific sounds
              trigger intense emotional and physical responses. It is not
              about being too sensitive. Your nervous system is responding
              to something real.
            </p>
            <p className="text-indigo-300">
              And there are ways to work with it, gently.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
