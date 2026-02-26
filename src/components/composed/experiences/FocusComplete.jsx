/**
 * FocusComplete — post-completion torus flow paths
 *
 * Offers journal integration and return to sanctuary.
 * No "practice again" — torus flow returns to centre.
 */

'use client';

export default function FocusComplete({ onJournal, onReturn }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 'clamp(26px, 5vh, 42px)',
        opacity: 0,
        animation: 'fadeIn 1.597s ease-out 0.610s forwards',
        background: 'linear-gradient(to top, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.5) 60%, transparent 100%)',
      }}
    >
      {/* Torus flow paths */}
      <button
        onClick={onJournal}
        className="text-slate-300/80 text-xs font-light tracking-widest hover:text-slate-200 transition-colors"
        style={{ transition: 'color 0.377s ease', marginBottom: 10, padding: '16px 26px' }}
      >
        reflect in your journal
      </button>
      <button
        onClick={onReturn}
        className="text-slate-300/60 text-xs font-light tracking-widest hover:text-slate-200/90 transition-colors"
        style={{ transition: 'color 0.377s ease', padding: '16px 26px' }}
      >
        return to sanctuary
      </button>
    </div>
  );
}
