// ChatGPT-style glass input bar (design-system primitive). The chat screen uses
// an inline variant with model selector + send/stop states; this compact bar is
// kept as part of the component library.
export function ChatInputBar({
  dark = false,
  value = '',
  onChange,
  onSend,
  placeholder = 'Reply to Noé...',
}) {
  const text = dark ? '#e8e6e3' : '#1a1a1a';
  const muted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.32)';
  const hasText = value.trim().length > 0;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          pointerEvents: 'none',
          boxShadow: dark
            ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)'
            : 'inset 0 0.5px 0 rgba(255,255,255,0.7)',
          border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 6px 4px 16px',
          minHeight: 48,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: 0.5,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={text} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend && onSend()}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: '-apple-system, system-ui',
            fontSize: 16,
            color: text,
            padding: '8px 0',
            letterSpacing: -0.2,
            lineHeight: '22px',
          }}
        />
        <div
          onClick={() => hasText && onSend && onSend()}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: hasText ? 'pointer' : 'default',
            background: hasText ? (dark ? 'rgba(255,255,255,0.85)' : '#1a1a1a') : 'transparent',
            transition: 'background 0.2s ease',
          }}
        >
          {hasText ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke={dark ? '#1a1a1a' : '#fff'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
                stroke={muted}
                strokeWidth="1.8"
              />
              <path
                d="M19 10v2a7 7 0 01-14 0v-2"
                stroke={muted}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path d="M12 19v4M8 23h8" stroke={muted} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
