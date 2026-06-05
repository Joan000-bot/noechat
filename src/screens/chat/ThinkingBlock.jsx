import React from 'react';

// Collapsible "Thinking" chain. Folded by default; auto-expands while the model
// is actively streaming its reasoning, then collapses once the duration lands.
export function ThinkingBlock({ msg, dark }) {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (msg.thinkingStreaming) setExpanded(true);
    if (!msg.thinkingStreaming && msg.thinkingDuration) setExpanded(false);
  }, [msg.thinkingStreaming, msg.thinkingDuration]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '0',
        marginBottom: 4,
      }}
    >
      <div style={{ maxWidth: '82%' }}>
        {/* Toggle header */}
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0,
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontStyle: 'italic',
              color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
            }}
          >
            Thinking
          </span>
          {msg.thinkingStreaming && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                fontStyle: 'italic',
                color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                animation: 'cursorBlink 1.2s step-end infinite',
              }}
            >
              ...
            </span>
          )}
          {msg.thinkingDuration && !msg.thinkingStreaming && (
            <span
              style={{
                fontSize: 11,
                color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                fontFamily: '-apple-system, system-ui',
                marginLeft: 6,
              }}
            >
              {msg.thinkingDuration}
            </span>
          )}
        </div>
        {/* Expanded content */}
        {expanded && (
          <div style={{ padding: '4px 0 6px', marginTop: 0 }}>
            <div
              style={{
                fontFamily: '-apple-system, system-ui',
                fontSize: 13,
                lineHeight: 1.55,
                letterSpacing: -0.1,
                fontWeight: 300,
                color: dark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.28)',
              }}
            >
              {msg.thinking}
              {msg.thinkingStreaming && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 1.5,
                    height: 13,
                    marginLeft: 1,
                    background: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
                    animation: 'cursorBlink 0.8s step-end infinite',
                    verticalAlign: 'text-bottom',
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
