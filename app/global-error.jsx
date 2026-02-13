/**
 * Global Error Page
 * Handles errors in root layout and wraps the entire app
 */

'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen flex justify-center">
        <div className="w-full max-w-md min-h-screen relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-2xl flex items-center justify-center p-6">
          <div role="alert" aria-live="assertive" className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-rose-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-thin text-white mb-3">
              Critical Error
            </h1>

            <p className="text-slate-400 font-light mb-6">
              Something went seriously wrong. Please refresh the page or try again later.
            </p>

            {error?.message && (
              <p className="text-sm text-slate-500 font-light mb-6 p-3 bg-slate-800/50 rounded-lg">
                {error.message}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-light transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 px-4 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-light transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
