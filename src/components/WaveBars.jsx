// Animated audio bars used by the music mini-bar / player.
export function WaveBars({ dark = false, playing = true, count = 5, height = 20, color }) {
  const c = color || (dark ? 'rgba(167,139,250,0.7)' : 'rgba(124,58,237,0.5)');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 2.5,
            borderRadius: 1.5,
            background: c,
            height: playing ? undefined : 3,
            animation: playing ? `waveBar 1.2s ease-in-out ${i * 0.15}s infinite` : 'none',
          }}
        />
      ))}
    </div>
  );
}
