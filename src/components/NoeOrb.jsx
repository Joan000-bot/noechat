// Noé's signature orb — a soft pulsing gradient sphere with a glossy highlight.
export function NoeOrb({ size = 36, dark = false, active = true, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: dark
          ? 'radial-gradient(circle at 38% 38%, #b8a4f0, #7c5cbf 55%, #5b3d99)'
          : 'radial-gradient(circle at 38% 38%, #d4c7f5, #a78bda 55%, #7c5cbf)',
        boxShadow: dark
          ? `0 0 ${size * 0.3}px rgba(167,139,250,0.2)`
          : `0 0 ${size * 0.3}px rgba(167,139,250,0.12)`,
        position: 'relative',
        animation: active ? 'orbPulse 4s ease-in-out infinite' : 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '18%',
          width: '32%',
          height: '24%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
}
