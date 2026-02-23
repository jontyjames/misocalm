/**
 * WebsiteFooter — footer for public (website) pages.
 * Brand, CTAs, article links, legal links, attribution.
 * Server component (no interactivity).
 */

import Link from 'next/link';
import { articles } from '@/lib/articleData';

export default function WebsiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-white/[0.02]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
          {/* Left — brand + CTAs */}
          <div>
            <p
              className="text-xl text-white mb-2"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              MisoCalm
            </p>
            <p
              className="text-sm text-slate-400 font-light mb-6"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              A space for living with misophonia
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="
                  inline-flex items-center justify-center
                  py-3 px-6 rounded-full text-sm text-white
                  border border-white/[0.18] backdrop-blur-2xl
                  hover:border-white/30 transition-all duration-[233ms]
                "
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 200,
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
                  width: 'fit-content',
                }}
              >
                Try MisoCalm
              </Link>
              <Link
                href="/quiz"
                className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors duration-[233ms] font-light"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                Take the Quiz
              </Link>
            </div>
          </div>

          {/* Right — article links + legal */}
          <div>
            <p
              className="text-sm text-slate-300 font-light mb-4 tracking-wide uppercase"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              Learn
            </p>
            <ul className="space-y-2 mb-8">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/learn/${article.slug}`}
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-[233ms] font-light"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors duration-[233ms] font-light"
              >
                Privacy
              </Link>
              <span className="text-slate-600 text-xs">·</span>
              <Link
                href="/terms"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors duration-[233ms] font-light"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom — attribution */}
        <div className="text-center pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-slate-400 font-light mb-1">
            Built with care by someone who lives with it.
          </p>
          <p className="text-xs text-slate-500 font-light">
            &copy; 2026 MisoCalm
          </p>
        </div>
      </div>
    </footer>
  );
}
