// Simple chat bubble (design-system primitive). The chat screen uses the richer
// RichBubble; this is kept as part of the component library.
export function Bubble({ text, isUser = false, dark = false, time }) {
  const bgUser = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.85)';
  const bgOther = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        padding: '0 16px',
        marginBottom: 6,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            background: isUser ? bgUser : bgOther,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            boxShadow: isUser
              ? 'inset 0 0.5px 0 rgba(255,255,255,0.12)'
              : dark
                ? 'inset 0 0.5px 0 rgba(255,255,255,0.05)'
                : 'inset 0 0.5px 0 rgba(255,255,255,0.6)',
            border: isUser
              ? '0.5px solid rgba(255,255,255,0.1)'
              : dark
                ? '0.5px solid rgba(255,255,255,0.04)'
                : '0.5px solid rgba(0,0,0,0.03)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontFamily: '-apple-system, system-ui',
              fontSize: 15,
              lineHeight: 1.5,
              letterSpacing: -0.2,
              color: isUser ? '#fff' : dark ? '#e8e6e3' : '#1a1a1a',
            }}
          >
            {text}
          </div>
          {time && (
            <div
              style={{
                fontSize: 11,
                marginTop: 3,
                textAlign: 'right',
                color: isUser
                  ? 'rgba(255,255,255,0.5)'
                  : dark
                    ? 'rgba(255,255,255,0.25)'
                    : 'rgba(0,0,0,0.22)',
              }}
            >
              {time}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
