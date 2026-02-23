/**
 * ArticleLayout - Shared chrome for /learn article pages.
 * Provides back-to-learn link, article wrapper, and gentle CTA.
 * Server component (no interactivity needed).
 */

import Link from 'next/link';

export default function ArticleLayout({ children }) {
  return (
    <main
      className="min-h-screen flex flex-col items-center px-6 py-16 sm:py-24"
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

        {/* Gentle CTA */}
        <footer className="mt-16 pt-8 border-t border-white/[0.06]">
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
    </main>
  );
}
