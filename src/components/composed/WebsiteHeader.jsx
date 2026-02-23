/**
 * WebsiteHeader — sticky header for public (website) pages.
 * Logo + nav links with active state detection.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/learn', label: 'Learn' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/about', label: 'About' },
];

export default function WebsiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 bg-void-black/60 backdrop-blur-xl border-b border-white/[0.06]"
      style={{ animation: 'fadeIn 610ms ease-out' }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[68px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Logo size="sm" />
          <span
            className="text-lg tracking-wide text-white hidden sm:block"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
          >
            MisoCalm
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-sm transition-colors duration-[233ms] ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-slate-200'
                }`}
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 200,
                }}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
