/**
 * Offline Page
 * Shown when user loses connection
 */

'use client';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-slate-400" />
        </div>
        <h1
          className="text-2xl text-white mb-3"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          You're offline
        </h1>
        <p className="text-slate-300 font-light text-sm leading-relaxed">
          Your sanctuary is waiting. Try again when you have a connection.
        </p>
      </div>
    </div>
  );
}
