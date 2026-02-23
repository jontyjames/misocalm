/**
 * FeatureShowcase — 5 features in responsive grid with Lucide icons.
 * Uses FeatureCard + ScrollReveal for staggered reveal.
 * 5 features (prime count), Fibonacci stagger delays.
 */

'use client';

import { Wind, Palette, BookOpen, MessageCircle, ShieldCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import FeatureCard from './FeatureCard';
import { FIBONACCI_TIMING } from '@/lib/constants';

const FEATURES = [
  {
    icon: Wind,
    title: 'Breathwork tools',
    description:
      '4-7-8, Box Breathing, and Physiological Sigh. Techniques backed by research to calm your nervous system in the moment.',
    accent: 'cyan',
  },
  {
    icon: Palette,
    title: 'Guided experiences',
    description:
      'Mandala drawing, Pulse awareness, and Impermanence meditation. Gentle practices that help you return to yourself.',
    accent: 'violet',
  },
  {
    icon: BookOpen,
    title: 'Journal and check-ins',
    description:
      'Track triggers, log how you feel, and notice patterns over time. Not to score yourself, just to understand.',
    accent: 'indigo',
  },
  {
    icon: MessageCircle,
    title: 'AI companion',
    description:
      'A warm, patient space to talk through difficult moments. Not a chatbot with scripts. A companion that listens.',
    accent: 'cyan',
  },
  {
    icon: ShieldCheck,
    title: 'Built for safety',
    description:
      'No streaks, no leaderboards, no guilt. Your data stays private. Your pace is yours. The app is free.',
    accent: 'violet',
  },
];

export default function FeatureShowcase() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl text-white mb-3"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            What MisoCalm offers
          </h2>
          <p className="text-slate-300 font-light max-w-md mx-auto">
            Tools designed for your nervous system, not against it.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <ScrollReveal
              key={feature.title}
              delay={i * FIBONACCI_TIMING.snap}
              threshold={0.1}
            >
              <FeatureCard {...feature} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
