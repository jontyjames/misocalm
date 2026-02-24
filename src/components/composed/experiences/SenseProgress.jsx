/**
 * SenseProgress — tap progress dots for the grounding experience
 *
 * Shows a row of dots matching the current sense count.
 * Filled dots = taps completed, unfilled = remaining.
 * Colour matches the current sense's solfeggio mapping.
 */

'use client';

export default function SenseProgress({ sense, tapsCompleted }) {
  if (!sense) return null;

  const { label, count, color } = sense;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const filled = i < tapsCompleted;
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: filled ? color : 'rgba(148,163,184,0.2)',
                boxShadow: filled ? `0 0 10px ${color}40` : 'none',
                transition: 'background 0.377s ease, box-shadow 0.377s ease, transform 0.377s ease',
                transform: filled ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
      <span
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          color: 'rgb(148,163,184)',
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        {label}
      </span>
    </div>
  );
}
