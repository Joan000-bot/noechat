// Uppercase section header label.
export function SectionLabel({ children, dark = false, style = {} }) {
  return (
    <div
      style={{
        fontFamily: '-apple-system, system-ui',
        fontSize: 12,
        fontWeight: 600,
        color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        padding: '0 4px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
