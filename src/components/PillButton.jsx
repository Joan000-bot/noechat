// Glass pill nav button.
export function PillButton({ children, dark = false, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: 36,
        borderRadius: 18,
        padding: '0 14px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 18,
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 18,
          pointerEvents: 'none',
          border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
          boxShadow: dark ? 'none' : 'inset 0 0.5px 0 rgba(255,255,255,0.6)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
}
