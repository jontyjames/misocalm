/**
 * SectionDivider — Gradient separator between homepage sections.
 * Subtle indigo-to-transparent line with sacred spacing.
 */

export default function SectionDivider({ className = '' }) {
  return (
    <div className={`flex justify-center py-10 ${className}`}>
      <div
        className="w-full max-w-xs h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.2) 30%, rgba(139,92,246,0.15) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}
