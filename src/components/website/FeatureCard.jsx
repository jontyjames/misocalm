/**
 * FeatureCard — Sacred Glass card for feature showcase.
 * Renders an icon, title, and description with solfeggio-colored accent.
 */

const ACCENT_COLORS = {
  indigo: 'text-indigo-400',
  cyan: 'text-cyan-400',
  violet: 'text-purple-400',
};

const ACCENT_DOTS = {
  indigo: 'bg-indigo-400',
  cyan: 'bg-cyan-400',
  violet: 'bg-purple-400',
};

export default function FeatureCard({ icon: Icon, title, description, accent = 'indigo' }) {
  return (
    <div
      className="relative rounded-xl p-6 overflow-hidden border border-white/[0.18] backdrop-blur-2xl h-full"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
        boxShadow:
          'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      {/* Glass top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)',
        }}
      />
      <div className="relative">
        <div className="flex items-start gap-3">
          {Icon ? (
            <Icon className={`w-5 h-5 mt-[2px] shrink-0 ${ACCENT_COLORS[accent]}`} />
          ) : (
            <span className={`mt-[7px] w-[6px] h-[6px] rounded-full shrink-0 ${ACCENT_DOTS[accent]}`} />
          )}
          <div>
            <h3
              className="text-lg text-white mb-1"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              {title}
            </h3>
            <p className="text-sm font-light text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
