'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function ExperienceError({ error, reset }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="text-center max-w-sm">
        <h1
          className="text-2xl text-white mb-3"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Something went still
        </h1>
        <p className="text-slate-300 font-light text-sm leading-relaxed mb-6">
          This experience had a moment. You can try again or head back to your tools.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full text-sm text-white bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.push(ROUTES.TOOLS)}
            className="px-6 py-3 rounded-full text-sm text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            Back to tools
          </button>
        </div>
      </div>
    </div>
  );
}
