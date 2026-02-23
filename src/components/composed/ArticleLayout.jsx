/**
 * ArticleLayout - Shared chrome for /learn article pages.
 * Provides back-to-learn link, article wrapper, related articles, and gentle CTA.
 * Server component (no interactivity needed).
 */

import Link from 'next/link';
import { getRelatedArticles } from '@/lib/articleData';

export default function ArticleLayout({ children, slug }) {
  const related = slug ? getRelatedArticles(slug) : [];

  return (
    <div
      className="flex flex-col items-center px-6 py-16 sm:py-24"
      style={{ animation: 'fadeIn 987ms ease-out' }}
    >
      <article className="w-full max-w-2xl">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors duration-[233ms] mb-10"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="opacity-60"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Learn
        </Link>

        {children}

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-white/[0.06]">
            <h3
              className="text-lg text-white mb-6"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              Keep reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="block group"
                >
                  <div
                    className="relative rounded-xl p-5 overflow-hidden border border-white/[0.12] hover:border-white/[0.22] transition-all duration-[233ms] h-full"
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
                      <h4
                        className="text-sm text-white mb-1 group-hover:text-indigo-200 transition-colors duration-[233ms]"
                        style={{
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontWeight: 200,
                        }}
                      >
                        {article.title}
                      </h4>
                      <span className="text-xs text-slate-400 font-light">
                        {article.readingTime} read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Gentle CTA */}
        <footer className="mt-10 pt-8 border-t border-white/[0.06]">
          <div
            className="relative rounded-xl p-6 overflow-hidden border border-white/[0.12]"
            style={{
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.04) 100%)',
            }}
          >
            <p className="text-slate-200 font-light leading-relaxed text-sm mb-4">
              MisoCalm is a free app built for people with sound sensitivity.
              Guided breathing, journaling, and tools to help your nervous system
              find calm.
            </p>
            <Link
              href="/"
              className="text-indigo-300 hover:text-indigo-200 transition-colors duration-[233ms] text-sm font-light"
            >
              Try MisoCalm
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/learn"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-[233ms] font-light"
            >
              More articles
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
