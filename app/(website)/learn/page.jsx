/**
 * /learn - Hub page for educational content.
 * Public SEO page with desktop grid layout.
 */

import Link from 'next/link';
import { articles } from '@/lib/articleData';

export const metadata = {
  title: 'Learn About Misophonia',
  description:
    'Articles, guides, and research-backed resources for understanding misophonia and sound sensitivity. Written with care by someone who lives with it.',
  keywords: [
    'misophonia',
    'misophonia help',
    'misophonia information',
    'sound sensitivity',
    'misophonia resources',
    'misophonia guide',
    'misophonia parents',
    'misophonia breathing',
    'misophonia at work',
    'misophonia facts',
    'what is misophonia',
  ],
  openGraph: {
    title: 'Learn About Misophonia | MisoCalm',
    description:
      'Articles, guides, and research-backed resources for understanding and living with sound sensitivity.',
    type: 'website',
    url: 'https://misocalm.app/learn',
  },
};

const standardArticles = articles.filter((a) => !a.featured);
const featuredArticle = articles.find((a) => a.featured);

function ArticleCard({ slug, title, description, readingTime, delay }) {
  return (
    <Link
      href={`/learn/${slug}`}
      className="block group"
      style={{
        opacity: 0,
        animation: `fadeInUp 610ms ease-out ${delay}ms forwards`,
      }}
    >
      <div
        className="relative rounded-xl p-6 overflow-hidden border border-white/[0.12] hover:border-white/[0.22] transition-all duration-[233ms] h-full"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.04) 100%)',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)',
          }}
        />
        <div className="relative">
          <h2
            className="text-lg text-white mb-2 group-hover:text-indigo-200 transition-colors duration-[233ms]"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            {title}
          </h2>
          <p className="text-sm text-slate-300 font-light leading-relaxed mb-3">
            {description}
          </p>
          <span className="text-xs text-slate-400 font-light">
            {readingTime} read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  return (
    <div className="flex flex-col items-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-4xl">
        {/* Hero */}
        <section
          className="text-center mb-16"
          style={{ animation: 'fadeIn 987ms ease-out' }}
        >
          <h1
            className="text-3xl sm:text-4xl text-white mb-4 leading-tight"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              letterSpacing: '0.06em',
            }}
          >
            Learn
          </h1>
          <p
            className="text-lg text-slate-300 font-light leading-relaxed max-w-md mx-auto"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            Understanding misophonia is the first step toward living well with
            it.
          </p>
        </section>

        {/* Article grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {standardArticles.map((article, i) => (
            <ArticleCard
              key={article.slug}
              {...article}
              delay={144 + i * 89}
            />
          ))}
        </section>

        {/* Featured article (Parent's Guide) */}
        {featuredArticle && (
          <section
            className="mb-8"
            style={{
              opacity: 0,
              animation: 'fadeInUp 610ms ease-out 700ms forwards',
            }}
          >
            <Link href={`/learn/${featuredArticle.slug}`} className="block group">
              <div
                className="relative rounded-xl p-8 overflow-hidden border border-white/[0.12] hover:border-white/[0.22] transition-all duration-[233ms]"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(139,92,246,0.06) 100%)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)',
                  }}
                />
                <div className="relative">
                  <span className="text-xs text-violet-300 font-light tracking-wide uppercase mb-2 block">
                    Featured · {featuredArticle.readingTime} read
                  </span>
                  <h2
                    className="text-xl text-white mb-2 group-hover:text-indigo-200 transition-colors duration-[233ms]"
                    style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 200,
                    }}
                  >
                    {featuredArticle.title}
                  </h2>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {featuredArticle.description}
                  </p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Quiz CTA */}
        <section
          className="mb-8"
          style={{
            opacity: 0,
            animation: 'fadeInUp 610ms ease-out 800ms forwards',
          }}
        >
          <div
            className="relative rounded-xl p-8 overflow-hidden border border-white/[0.12] text-center"
            style={{
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.06) 100%)',
            }}
          >
            <p
              className="text-lg text-slate-200 font-light mb-3"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              Not sure if you have misophonia?
            </p>
            <Link
              href="/quiz"
              className="text-indigo-300 hover:text-indigo-200 transition-colors duration-[233ms] text-sm font-light"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              Take our free 2-minute quiz &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
