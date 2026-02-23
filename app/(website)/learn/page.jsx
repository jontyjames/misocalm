/**
 * /learn — Hub page for educational content.
 * Public SEO page. Grid logic delegated to LearnGrid client component.
 */

import { articles } from '@/lib/articleData';
import LearnGrid from './LearnGrid';

export const metadata = {
  title: 'Learn About Misophonia | MisoCalm',
  description: 'Articles, guides, and research-backed resources for understanding misophonia and sound sensitivity.',
  keywords: ['misophonia', 'misophonia help', 'sound sensitivity', 'misophonia resources', 'misophonia guide', 'what is misophonia'],
  openGraph: {
    title: 'Learn About Misophonia | MisoCalm',
    description: 'Articles, guides, and research-backed resources for understanding and living with sound sensitivity.',
    type: 'website',
    url: 'https://misocalm.app/learn',
  },
};

export default function LearnPage() {
  const standard = articles.filter((a) => !a.featured);
  const featured = articles.find((a) => a.featured);

  return (
    <div className="flex flex-col items-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-4xl">
        <section className="text-center mb-16" style={{ animation: 'fadeIn 987ms ease-out' }}>
          <h1
            className="text-3xl sm:text-4xl text-white mb-4 leading-tight"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, letterSpacing: '0.06em' }}
          >
            Learn
          </h1>
          <p
            className="text-lg text-slate-300 font-light leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Understanding misophonia is the first step toward living well with it.
          </p>
        </section>
        <LearnGrid articles={standard} featuredArticle={featured} />
      </div>
    </div>
  );
}
