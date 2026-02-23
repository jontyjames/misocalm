/**
 * JourneySection — 4-stage healing arc: Understand, Regulate, Integrate, Thrive.
 * Follows the torus flow model from sacred geometry.
 * Fibonacci stagger, phi spacing.
 */

'use client';

import ScrollReveal from './ScrollReveal';
import { FIBONACCI_TIMING } from '@/lib/constants';

const STAGES = [
  {
    number: '01',
    title: 'Understand',
    description: 'Learn what misophonia is and why your body responds the way it does.',
    accent: 'text-slate-300',
  },
  {
    number: '02',
    title: 'Regulate',
    description: 'Use breathwork and somatic tools to calm your nervous system in the moment.',
    accent: 'text-indigo-300',
  },
  {
    number: '03',
    title: 'Integrate',
    description: 'Journal, reflect, and notice patterns. Build awareness without judgment.',
    accent: 'text-violet-300',
  },
  {
    number: '04',
    title: 'Thrive',
    description: 'Move from surviving to living well. Connect with others who understand.',
    accent: 'text-cyan-300',
  },
];

export default function JourneySection() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2
            className="text-2xl sm:text-3xl text-white mb-3"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            A path, not a prescription
          </h2>
          <p className="text-slate-300 font-light max-w-md mx-auto">
            There is no right pace. Only yours.
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          {STAGES.map((stage, i) => (
            <ScrollReveal key={stage.number} delay={i * FIBONACCI_TIMING.shift}>
              <div className="flex gap-6 items-start">
                <span
                  className={`text-2xl font-light shrink-0 w-10 ${stage.accent}`}
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  {stage.number}
                </span>
                <div>
                  <h3
                    className="text-lg text-white mb-1"
                    style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                  >
                    {stage.title}
                  </h3>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
