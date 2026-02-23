/**
 * LearnGrid — Client component for learn page article grid with scroll reveals.
 * Separated to keep page.jsx as a server component for SEO.
 */

'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/website';
import { FIBONACCI_TIMING } from '@/lib/constants';

function ArticleCard({ slug, title, description, readingTime }) {
  return (
    <Link href={`/learn/${slug}`} className="block group">
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
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
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

export default function LearnGrid({ articles, featuredArticle }) {
  return (
    <>
      {/* Article grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {articles.map((article, i) => (
          <ScrollReveal key={article.slug} delay={i * FIBONACCI_TIMING.snap} threshold={0.1}>
            <ArticleCard {...article} />
          </ScrollReveal>
        ))}
      </section>

      {/* Featured article */}
      {featuredArticle && (
        <ScrollReveal className="mb-8" threshold={0.1}>
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
                  Featured &middot; {featuredArticle.readingTime} read
                </span>
                <h2
                  className="text-xl text-white mb-2 group-hover:text-indigo-200 transition-colors duration-[233ms]"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  {featuredArticle.description}
                </p>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      )}

      {/* Quiz CTA */}
      <ScrollReveal className="mb-8" threshold={0.1}>
        <div
          className="relative rounded-xl p-8 overflow-hidden border border-white/[0.12] text-center"
          style={{
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.06) 100%)',
          }}
        >
          <p
            className="text-lg text-slate-200 font-light mb-3"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Not sure if you have misophonia?
          </p>
          <Link
            href="/quiz"
            className="text-indigo-300 hover:text-indigo-200 transition-colors duration-[233ms] text-sm font-light"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Take our free 2-minute quiz &rarr;
          </Link>
        </div>
      </ScrollReveal>
    </>
  );
}
