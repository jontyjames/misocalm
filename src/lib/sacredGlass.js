/**
 * Sacred Glass — shared style utilities for the MisoCalm glass material
 *
 * The Sacred Glass is the app's signature visual treatment: frosted glass with
 * gradient borders, phi-opacity layers, torus-flow colour, and glass highlights.
 * This file consolidates the pattern so every glass surface is pixel-identical.
 *
 * Solfeggio colour map (rgba prefix strings for template interpolation):
 *   indigo = rgba(99,102,241,   — 528Hz, Transformation & Love
 *   violet = rgba(139,92,246,   — 852Hz, Returning to Spiritual Order
 *   cyan   = rgba(34,211,238,   — 741Hz, Awakening & Expression
 */

// ─── Solfeggio RGBA prefix (used in template strings) ─────────────
export const SOLFEGGIO_RGBA = {
  indigo: 'rgba(99,102,241,',
  violet: 'rgba(139,92,246,',
  cyan: 'rgba(34,211,238,',
};

// ─── Tailwind class strings ───────────────────────────────────────

/** Base interactive glass card classes (use with sacredGlassStyle) */
export const SACRED_GLASS_CLASSES =
  'border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 transition-all duration-[233ms]';

/** Static display glass (no hover, no glow — for info cards, containers) */
export const SACRED_GLASS_STATIC_CLASSES =
  'border border-white/[0.18] backdrop-blur-2xl';

/** Subtle glass (lighter border — for secondary/compact cards) */
export const SACRED_GLASS_SUBTLE_CLASSES =
  'border border-white/[0.12] backdrop-blur-xl hover:border-white/25 transition-all duration-[233ms]';

/** Pill button glass (rounded-full variant) */
export const SACRED_GLASS_PILL_CLASSES =
  'rounded-full border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 transition-all duration-[233ms]';

// ─── Inline style generators ──────────────────────────────────────

/**
 * Full interactive Sacred Glass inline styles.
 * Used on buttons, action cards, path cards — anywhere with solfeggio glow.
 *
 * @param {string} accent - solfeggio key: 'indigo' | 'violet' | 'cyan'
 * @returns {{ background: string, boxShadow: string }}
 */
export function sacredGlassStyle(accent = 'indigo') {
  const c = SOLFEGGIO_RGBA[accent] || SOLFEGGIO_RGBA.indigo;
  return {
    background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${c}0.08) 100%)`,
    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px ${c}0.12), 0 4px 20px rgba(0,0,0,0.25)`,
  };
}

/**
 * Static display glass styles (no outer glow, neutral accent).
 * Used on feature cards, content containers, info panels.
 *
 * @param {string} [accent] - optional solfeggio key for tint
 * @returns {{ background: string, boxShadow: string }}
 */
export function sacredGlassStaticStyle(accent) {
  const c = SOLFEGGIO_RGBA[accent] || SOLFEGGIO_RGBA.indigo;
  return {
    background: `linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, ${c}0.05) 100%)`,
    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
  };
}

/**
 * Pill button glass styles (stronger glow for CTA prominence).
 *
 * @param {string} accent - solfeggio key
 * @returns {{ background: string, boxShadow: string }}
 */
export function sacredGlassPillStyle(accent = 'indigo') {
  const c = SOLFEGGIO_RGBA[accent] || SOLFEGGIO_RGBA.indigo;
  return {
    background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${c}0.08) 100%)`,
    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px ${c}0.15), 0 8px 32px rgba(0,0,0,0.3)`,
  };
}

/**
 * Subtle glass styles (for compact/secondary cards).
 *
 * @returns {{ background: string, boxShadow: string }}
 */
export function sacredGlassSubtleStyle() {
  return {
    background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.2)',
  };
}

// ─── Overlay layer styles (positioned absolute inside glass container) ─

/** Glass top highlight — 1px gradient line at top of card */
export const GLASS_HIGHLIGHT_STYLE = {
  background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)',
};

/** Phi opacity layers — Fibonacci-sequence opacity cascade */
export const PHI_LAYERS_STYLE = {
  background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
};

/**
 * Torus flow layer — solfeggio colour enters from top, returns from bottom.
 *
 * @param {string} accent - solfeggio key
 * @returns {{ background: string }}
 */
export function torusFlowStyle(accent = 'indigo') {
  const c = SOLFEGGIO_RGBA[accent] || SOLFEGGIO_RGBA.indigo;
  return {
    background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${c}0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, ${c}0.06) 0%, transparent 60%)`,
  };
}

/**
 * Solfeggio breathing layer — animated radial glow.
 *
 * @param {string} accent - solfeggio key
 * @param {string} animation - CSS animation string (e.g. 'solfeggio-breathe-528 5.28s ease-in-out infinite')
 * @returns {{ background: string, backgroundSize: string, animation: string }}
 */
export function solfeggioBreathStyle(accent = 'indigo', animation) {
  const c = SOLFEGGIO_RGBA[accent] || SOLFEGGIO_RGBA.indigo;
  return {
    background: `radial-gradient(ellipse 120% 80% at 50% 50%, ${c}0.08) 0%, transparent 70%)`,
    backgroundSize: '100% 200%',
    animation: animation || undefined,
  };
}
