/**
 * About / Homepage — SEO landing page.
 * Thin orchestrator composing website sections.
 */

import {
  HeroSection, RecognitionSection, SectionDivider,
  FeatureShowcase, JourneySection, SocialProofSection,
  EcosystemBridge, CTASection,
} from '@/components/website';

export const metadata = {
  title: 'MisoCalm - A Space for Living with Misophonia',
  description: 'MisoCalm is a free companion app for living with misophonia. Breathwork, journaling, guided experiences, and AI support.',
  keywords: ['misophonia', 'misophonia app', 'misophonia help', 'misophonia coping', 'misophonia tools', 'misophonia breathing', 'misophonia support', 'sound sensitivity'],
  openGraph: {
    title: 'MisoCalm - A Space for Living with Misophonia',
    description: 'Free breathwork, journaling, guided experiences, and AI support for people living with misophonia.',
    type: 'website',
    url: 'https://misocalm.app/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <RecognitionSection />
      <SectionDivider />
      <FeatureShowcase />
      <SectionDivider />
      <JourneySection />
      <SectionDivider />
      <SocialProofSection />
      <SectionDivider />
      <EcosystemBridge />
      <SectionDivider />
      <CTASection />
    </>
  );
}
