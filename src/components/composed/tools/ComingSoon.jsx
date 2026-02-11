/**
 * Coming Soon
 * Placeholder for tools not yet available
 */

import { Sparkles } from 'lucide-react';

export default function ComingSoon({ onBack }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div
        className="w-20 h-20 rounded-full border-2 border-violet-500/30 flex items-center justify-center mb-8"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          boxShadow: '0 0 30px rgba(139,92,246,0.15)',
        }}
      >
        <Sparkles className="w-8 h-8 text-violet-400" />
      </div>
      <h2
        className="text-xl text-white mb-3"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          textShadow: '0 0 20px rgba(139,92,246,0.3)',
        }}
      >
        Coming soon to MisoCalm
      </h2>
      <p className="text-sm text-slate-300 font-light max-w-xs mb-8">
        This tool is being carefully crafted. When it arrives, it will be here waiting for you.
      </p>
      <button
        onClick={onBack}
        className="px-6 py-2.5 rounded-full text-sm font-light border-2 border-white/[0.33] hover:border-white/40 text-white transition-all duration-[144ms]"
        style={{ background: 'rgba(139,92,246,0.08)', boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
      >
        Back to tools
      </button>
    </div>
  );
}
