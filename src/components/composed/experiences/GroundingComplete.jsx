/**
 * GroundingComplete — post-completion paths for the grounding experience
 *
 * Torus flow: integration (journal) or return to centre (sanctuary).
 */

'use client';

export default function GroundingComplete({ onJournal, onReturn }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 26,
        left: 0,
        right: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        opacity: 0,
        animation: 'fadeIn 1.597s ease-out 0.610s forwards',
      }}
    >
      <button
        onClick={onJournal}
        className="text-slate-300/60 text-xs font-light tracking-widest hover:text-slate-300/90 transition-colors"
        style={{ transition: 'color 0.377s ease' }}
      >
        reflect in your journal
      </button>
      <button
        onClick={onReturn}
        className="text-slate-500/40 text-xs font-light tracking-widest hover:text-slate-400/60 transition-colors"
        style={{ transition: 'color 0.377s ease' }}
      >
        return to sanctuary
      </button>
    </div>
  );
}
