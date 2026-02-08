/**
 * Bottom Navigation Bar
 * 5 tabs: Home, Journal, Logo (mantra), Tools, Chat
 */

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Wrench, MessageCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { href: ROUTES.DASHBOARD, icon: Home, label: 'Home' },
  { href: ROUTES.JOURNAL, icon: BookOpen, label: 'Journal' },
  { isLogo: true },
  { href: ROUTES.TOOLS, icon: Wrench, label: 'Tools' },
  { href: ROUTES.CHAT, icon: MessageCircle, label: 'Chat' },
];

const MANTRAS = [
  'You are not your triggers.',
  'Every breath is a choice you made for yourself.',
  'You showed up today. That matters.',
  'You have already come so far.',
  'You carry more than most people see.',
  'One breath at a time.',
  'You are safe here.',
  'Everything you feel makes sense.',
  'You already have everything you need.',
  'You are doing better than you think.',
  'Be gentle with yourself today.',
  'This feeling is temporary. You are not.',
  'You have survived every hard day so far.',
  "Calm is a skill. You're building it.",
  'You deserve the peace you give to others.',
  'Right now, in this moment, you are okay.',
  'You are learning to hold space for yourself.',
  "Healing isn't linear. Every step counts.",
  "You chose to be here. That's strength.",
  'We trust you. Completely.',
  'Your nervous system is learning something new.',
  'Stillness is not the absence of sound. It lives inside you.',
  'What you are building here, no one can take from you.',
];

export default function Navigation() {
  const pathname = usePathname();
  const [showMantra, setShowMantra] = useState(false);
  const lastIndex = useRef(-1);

  const openMantra = () => {
    let idx;
    do {
      idx = Math.floor(Math.random() * MANTRAS.length);
    } while (idx === lastIndex.current && MANTRAS.length > 1);
    lastIndex.current = idx;
    setShowMantra(true);
  };

  return (
    <>
      {/* Mantra overlay */}
      {showMantra && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-8"
          onClick={() => setShowMantra(false)}
          style={{
            background: 'rgba(3,7,18,0.85)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.4s ease-out',
          }}
        >
          <p
            className="text-xl text-white/90 text-center leading-relaxed"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              textShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
            }}
          >
            {MANTRAS[lastIndex.current]}
          </p>
        </div>
      )}

      {/* Navigation bar */}
      <nav
        className="
          fixed bottom-0 left-1/2 -translate-x-1/2 z-50
          w-full max-w-md
          border-t border-slate-800
          safe-area-bottom
        "
        style={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,1) 100%)',
        }}
      >
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map((item, i) => {
            if (item.isLogo) {
              return (
                <button
                  key="logo"
                  onClick={openMantra}
                  className="
                    flex flex-col items-center justify-center
                    px-4 py-2
                    transition-all duration-200
                  "
                >
                  <img
                    src="/icons/MisoMind-logo-v1.png"
                    alt="MisoMind"
                    className="w-14 h-14"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.4)) drop-shadow(0 0 24px rgba(139,92,246,0.15))' }}
                  />
                </button>
              );
            }

            const isActive = pathname === item.href ||
              (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2
                  transition-colors duration-150
                  ${isActive
                    ? 'text-cyan-400'
                    : 'text-slate-300 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-light">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
