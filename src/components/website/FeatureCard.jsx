/**
 * FeatureCard — Sacred Glass card for feature showcase.
 * Renders an icon, title, and description with solfeggio-colored accent.
 */

import { SACRED_GLASS_STATIC_CLASSES, sacredGlassStaticStyle, GLASS_HIGHLIGHT_STYLE } from '@/lib/sacredGlass';

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
      className={`relative rounded-xl p-6 overflow-hidden ${SACRED_GLASS_STATIC_CLASSES} h-full`}
      style={sacredGlassStaticStyle()}
    >
      {/* Glass top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={GLASS_HIGHLIGHT_STYLE}
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
