/**
 * Find My Calm — Support Level Selection
 * A gentle question: how much do you need right now?
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

const SUPPORT_LEVELS = [
  {
    id: 'quick',
    name: 'Just a moment',
    time: '1.5 min',
    description: 'A few breaths to bring you back to centre',
  },
  {
    id: 'deep',
    name: 'I need some space',
    time: '3 min',
    description: 'Enough space to let your body fully calm',
  },
  {
    id: 'full',
    name: 'Stay with me',
    time: '4 min',
    description: 'A full session to find steady ground',
  },
];

export default function CalmPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  const handleSelect = (level) => {
    router.push(`/tools/3?duration=${level.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      {/* Back button */}
      <button
        onClick={() => router.push(ROUTES.DASHBOARD)}
        className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors self-start mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1
          className="text-2xl text-white mb-2 text-center"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          How much do you need right now?
        </h1>
        <p className="text-sm text-slate-300 font-light mb-12 text-center">
          There is no wrong answer
        </p>

        {/* Support level options */}
        <div className="space-y-4 w-full max-w-sm">
          {SUPPORT_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => handleSelect(level)}
              className="
                w-full p-5 rounded-2xl text-left
                border border-slate-700/50
                bg-slate-800/30
                transition-all duration-300
                hover:border-indigo-500/40 hover:bg-slate-800/50
              "
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className="text-lg text-white"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  {level.name}
                </span>
                <span className="text-sm text-cyan-400 font-light">{level.time}</span>
              </div>
              <p className="text-sm text-slate-400 font-light">{level.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
