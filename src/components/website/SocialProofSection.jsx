/**
 * SocialProofSection — 3 testimonials + 3 stats with animated counters.
 * Prime counts: 3 testimonials, 3 stats.
 */

'use client';

import ScrollReveal from './ScrollReveal';
import TestimonialCard from './TestimonialCard';
import AnimatedCounter from './AnimatedCounter';
import { FIBONACCI_TIMING } from '@/lib/constants';

const TESTIMONIALS = [
  {
    quote: 'I finally feel like someone gets it. The breathing tools are the first thing that actually helps in the moment.',
    attribution: 'Living with misophonia for 12 years',
  },
  {
    quote: 'No guilt, no pressure, no streaks. Just a calm space when I need it. This is what I have been looking for.',
    attribution: 'Found MisoCalm through r/misophonia',
  },
  {
    quote: 'The journal helped me notice patterns I had missed for years. I understand my triggers so much better now.',
    attribution: 'Using MisoCalm daily for 3 months',
  },
];

const STATS = [
  { value: 87000, suffix: '+', label: 'People in misophonia communities' },
  { value: 15, suffix: '%', label: 'Of the population may have misophonia' },
  { value: 100, suffix: '%', label: 'Free to use, always' },
];

export default function SocialProofSection() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * FIBONACCI_TIMING.snap} className="text-center">
              <div
                className="text-3xl sm:text-4xl text-white mb-2"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-slate-300 font-light">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* Testimonials */}
        <ScrollReveal className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            What people are saying
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((testimonial, i) => (
            <ScrollReveal key={i} delay={i * FIBONACCI_TIMING.snap}>
              <TestimonialCard {...testimonial} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
