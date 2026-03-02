/**
 * Floating Bottom Navigation - Gem in Ring
 * Pill-shaped nav with logo gem elevated in centre.
 * Sacred glass material, context-aware aura, icons only.
 */

'use client';

import { memo, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Wind, MessageCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import NavLogoGem from './NavLogoGem';
import MantraOverlay from './MantraOverlay';
import { SACRED_GLASS_STATIC_CLASSES } from '@/lib/sacredGlass';

const MANTRAS = [
  'You are not defined by what you hear.',
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

const leftNav = [
  { href: ROUTES.DASHBOARD, icon: Home, label: 'Home' },
  { href: ROUTES.JOURNAL, icon: BookOpen, label: 'Journal' },
];

const rightNav = [
  { href: ROUTES.TOOLS, icon: Wind, label: 'Practices' },
  { href: ROUTES.CHAT, icon: MessageCircle, label: 'Chat' },
];

/** Map pathname prefix to aura colour (solfeggio-mapped) */
function getAuraColour(pathname) {
  if (pathname.startsWith('/journal')) return 'rgba(139,92,246,0.15)';  // violet 852Hz
  if (pathname.startsWith('/tools'))   return 'rgba(34,211,238,0.12)';  // cyan 741Hz
  return 'rgba(99,102,241,0.12)';                                       // indigo 528Hz (home/chat)
}

function NavItem({ href, icon: Icon, label, isActive }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative flex items-center justify-center
        w-11 h-11 rounded-full
        transition-colors duration-[144ms]
        ${isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}
      `}
    >
      <Icon className="w-5 h-5" />
      {isActive && (
        <span
          className="absolute -bottom-1.5 rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: '#22d3ee',
            animation: 'nav-dot-glow 987ms ease-in-out infinite',
          }}
        />
      )}
    </Link>
  );
}

export default memo(function Navigation() {
  const pathname = usePathname();
  const [showMantra, setShowMantra] = useState(false);
  const mantraBag = useRef([]);
  const currentMantra = useRef(0);

  const openMantra = () => {
    /* Shuffle-bag: cycle through all 23 mantras before any repeats */
    if (mantraBag.current.length === 0) {
      const indices = Array.from({ length: MANTRAS.length }, (_, i) => i);
      /* Fisher-Yates shuffle */
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      /* Avoid repeating the last mantra from previous cycle */
      if (indices[0] === currentMantra.current && indices.length > 1) {
        [indices[0], indices[indices.length - 1]] = [indices[indices.length - 1], indices[0]];
      }
      mantraBag.current = indices;
    }
    currentMantra.current = mantraBag.current.shift();
    setShowMantra(true);
  };

  const isActive = (href) => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === href || pathname.startsWith('/calm');
    }
    if (href === ROUTES.JOURNAL) {
      return pathname.startsWith(href) || pathname.startsWith('/log');
    }
    return pathname === href || pathname.startsWith(href);
  };

  const auraColour = getAuraColour(pathname);

  return (
    <>
      {/* Mantra overlay with sacred geometry */}
      <MantraOverlay
        mantra={MANTRAS[currentMantra.current]}
        visible={showMantra}
        onClose={() => setShowMantra(false)}
      />

      {/* Context-aware aura glow beneath nav */}
      <div
        className="fixed z-[49] inset-x-0 mx-auto pointer-events-none"
        style={{
          bottom: 0,
          width: '80%',
          maxWidth: 'calc(100vw - 2rem)',
          height: 42,
          borderRadius: '9999px',
          background: `radial-gradient(ellipse at 50% 80%, ${auraColour} 0%, transparent 70%)`,
          transition: 'background 610ms ease-in-out',
        }}
      />

      {/* Floating pill navigation */}
      <nav
        className="fixed z-50 inset-x-0 flex justify-center safe-area-bottom"
        style={{ bottom: 26 }}
        aria-label="Main navigation"
      >
        <div
          className={`flex items-center justify-center gap-2 rounded-full border overflow-visible backdrop-blur-2xl`}
          style={{
            padding: '6px 10px',
            borderColor: 'rgba(255,255,255,0.18)',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(30,41,59,0.85) 40%, rgba(3,7,18,0.92) 100%)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), 0 0 16px rgba(99,102,241,0.1), 0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Left nav items */}
          {leftNav.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}

          {/* Centre logo gem */}
          <div className="mx-2">
            <NavLogoGem onTap={openMantra} />
          </div>

          {/* Right nav items */}
          {rightNav.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </nav>
    </>
  );
})
