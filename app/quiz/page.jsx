/**
 * /quiz — Misophonia Self-Assessment
 * Public lead generation page. No auth required.
 */

import { Suspense } from 'react';
import { Starfield } from '@/components/composed';
import QuizClient from './QuizClient';

export const metadata = {
  title: 'Do I Have Misophonia? Take the Free Quiz',
  description:
    'A 2-minute self-assessment to understand your sound sensitivity. Discover if you have misophonia and learn what helps.',
  keywords: [
    'misophonia quiz',
    'misophonia test',
    'do I have misophonia',
    'sound sensitivity',
    'misophonia self-assessment',
    'misophonia symptoms',
    'sound sensitivity test',
  ],
  openGraph: {
    title: 'Do I Have Misophonia? Take the Free Quiz | MisoCalm',
    description:
      'A 2-minute self-assessment to understand your sound sensitivity. Discover if you have misophonia and learn what helps.',
    type: 'website',
    url: 'https://misocalm.app/quiz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do I Have Misophonia? Take the Free Quiz',
    description:
      'A 2-minute self-assessment to understand your sound sensitivity.',
  },
};

export default function QuizPage() {
  return (
    <>
      <Starfield />
      <Suspense>
        <QuizClient />
      </Suspense>
    </>
  );
}
