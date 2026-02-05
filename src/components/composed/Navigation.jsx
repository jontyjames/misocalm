/**
 * Bottom Navigation Bar
 * 5 tabs: Home, Tools, Log (+), AI, Profile
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Plus, MessageCircle, User } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { href: ROUTES.DASHBOARD, icon: Home, label: 'Home' },
  { href: ROUTES.TOOLS, icon: BookOpen, label: 'Tools' },
  { href: ROUTES.LOG, icon: Plus, label: 'Log', isCenter: true },
  { href: ROUTES.CHAT, icon: MessageCircle, label: 'AI' },
  { href: ROUTES.PROFILE, icon: User, label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
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
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  flex items-center justify-center
                  w-14 h-14 -mt-6
                  rounded-full bg-primary-cta border border-indigo-500/30
                  text-indigo-300 hover:text-white
                  transition-all duration-150
                  shadow-lg shadow-indigo-500/20
                "
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-4 py-2
                transition-colors duration-150
                ${isActive
                  ? 'text-cyan-400'
                  : 'text-slate-600 hover:text-slate-400'
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
  );
}
