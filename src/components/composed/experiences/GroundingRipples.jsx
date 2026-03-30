/**
 * GroundingRipples — tap ripple effects for grounding experience
 *
 * 110px diameter (phi scale). Radial gradient fades out over 610ms (fib).
 */

export default function GroundingRipples({ ripples }) {
  return ripples.map((r) => (
    <div
      key={r.id}
      style={{
        position: 'fixed',
        left: r.x - 55,
        top: r.y - 55,
        width: 110,
        height: 110,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${r.color}30 0%, transparent 70%)`,
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'groundingRipple 0.610s ease-out forwards',
      }}
    />
  ));
}
