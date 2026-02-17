/**
 * /quiz/guide/[category] — Personalized misophonia guide
 * Public page, no auth. One per result category.
 */

import { notFound } from 'next/navigation';
import { Starfield } from '@/components/composed';
import { GUIDE_CONTENT, GUIDE_CATEGORIES } from '@/lib/guideData';
import GuideContent from './GuideContent';

export function generateStaticParams() {
  return GUIDE_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const guide = GUIDE_CONTENT[category];
  if (!guide) return {};

  return {
    title: `${guide.title} | MisoCalm`,
    description: `Your personalized misophonia guide with 3 techniques that help. Based on your quiz results.`,
    robots: { index: false, follow: false },
  };
}

export default async function GuidePage({ params }) {
  const { category } = await params;
  const guide = GUIDE_CONTENT[category];
  if (!guide) notFound();

  return (
    <>
      <Starfield />
      <GuideContent guide={guide} />
    </>
  );
}
