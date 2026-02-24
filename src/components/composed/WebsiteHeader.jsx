/**
 * WebsiteHeader — sticky header for public (website) pages.
 * Logo + nav links + CTA button + mobile hamburger.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/hooks';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/learn', label: 'Learn' },
  { href: '/quiz', label: 'Quiz' },
];

export default function WebsiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <header
      className="sticky top-0 z-40 bg-void-black/60 backdrop-blur-xl border-b border-white/[0.06]"
      style={{ animation: prefersReduced ? 'none' : 'fadeIn 610ms ease-out' }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[68px]">
        {/* Brand */}
        <Link href="/about" className="flex items-center gap-3">
          <Logo size="sm" />
          <span
            className="text-lg tracking-wide text-white hidden sm:block"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
          >
            MisoCalm
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-sm transition-colors duration-[233ms] ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-slate-200'
                }`}
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                )}
              </Link>
            );
          })}

          {/* CTA */}
          <Link
            href="/"
            className="text-sm text-white py-2 px-5 rounded-full border border-white/[0.18] hover:border-white/30 transition-all duration-[233ms]"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(99,102,241,0.06) 100%)',
            }}
          >
            Try MisoCalm
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-[1.5px] bg-slate-300 ${prefersReduced ? '' : 'transition-all duration-[233ms]'} ${
              menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-slate-300 ${prefersReduced ? '' : 'transition-all duration-[233ms]'} ${
              menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="sm:hidden border-t border-white/[0.06] bg-void-black/90 backdrop-blur-xl"
          style={{ animation: prefersReduced ? 'none' : 'fadeIn 233ms ease-out' }}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm py-1 ${isActive ? 'text-white' : 'text-slate-300'}`}
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white py-2 px-5 rounded-full border border-white/[0.18] text-center mt-2"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                background:
                  'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(99,102,241,0.06) 100%)',
              }}
            >
              Try MisoCalm
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
