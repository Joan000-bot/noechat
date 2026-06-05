// Small status dot.
export function Dot({ color = '#22c55e', size = 7 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}
