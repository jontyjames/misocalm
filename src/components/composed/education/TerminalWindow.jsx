/**
 * TerminalWindow
 * Green monospace terminal with typing animation.
 * Matrix green (#00ff41) — 396Hz emerald, liberation from fear.
 */

'use client';

const MATRIX_GREEN = '#00ff41';
const MATRIX_GREEN_DIM = 'rgba(0,255,65,0.5)';

export default function TerminalWindow({ visibleLines, typingComplete, transitioning }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: 'calc(100vw - 42px)', // phi-5 margin
        maxWidth: 540,
        borderRadius: 16, // phi-scale
        border: '1px solid rgba(0,255,65,0.15)',
        boxShadow: '0 0 16px rgba(0,255,65,0.08)',
        background: 'rgba(3,7,18,0.95)',
        opacity: transitioning ? 0 : 1,
        transition: `opacity 233ms ease`,
      }}
    >
      {/* Terminal header bar */}
      <div
        className="flex items-center px-4"
        style={{
          height: 26, // phi-4
          borderBottom: '1px solid rgba(0,255,65,0.1)',
          gap: 6, // phi-1
        }}
      >
        <span className="rounded-full" style={{ width: 5, height: 5, background: 'rgba(0,255,65,0.4)' }} />
        <span className="rounded-full" style={{ width: 5, height: 5, background: 'rgba(0,255,65,0.25)' }} />
        <span className="rounded-full" style={{ width: 5, height: 5, background: 'rgba(0,255,65,0.15)' }} />
      </div>

      {/* Terminal body */}
      <div style={{ padding: 26 }}> {/* phi-4 */}
        {visibleLines.map((line, i) => (
          <div
            key={`${i}-${line.text}`}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 300,
              fontSize: line.dramatic ? 15 : 13,
              lineHeight: 1.7,
              color: line.text === '' ? 'transparent' : MATRIX_GREEN,
              textShadow: line.text ? `0 0 6px rgba(0,255,65,0.4)` : 'none',
              minHeight: line.text === '' ? '0.85em' : 'auto',
              opacity: line.dramatic ? 1 : 0.9,
            }}
          >
            {line.text}
            {/* Blinking cursor on the last, actively typing line */}
            {line.typing && (
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: '1em',
                  marginLeft: 2,
                  background: MATRIX_GREEN,
                  verticalAlign: 'text-bottom',
                  animation: 'terminalBlink 1.597s step-end infinite',
                }}
              />
            )}
          </div>
        ))}

        {/* Resting cursor after typing complete */}
        {typingComplete && (
          <div style={{ marginTop: 4 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 13,
                background: MATRIX_GREEN,
                animation: 'terminalBlink 1.597s step-end infinite',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
