import React from 'react';
import { useColors } from '../../theme/colors';
import { ThinkingBlock } from './ThinkingBlock';

// Chat bubble with sender label, datetime, token stats, a collapsible thinking
// chain, a streaming cursor, and lightweight markdown (code blocks, inline code,
// bold, and [memory:] / [mcp:] / [artifact:] tags).
export function RichBubble({ msg, dark }) {
  const c = useColors(dark);
  const [copied, setCopied] = React.useState(false);

  const formatDate = (time) => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${time}`;
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // Simple markdown-ish rendering
  const renderContent = (text) => {
    const parts = text.split(
      /(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\[memory:.*?\]|\[mcp:.*?\]|\[artifact:.*?\])/g
    );
    return parts.map((part, i) => {
      // Code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3);
        const firstNewline = lines.indexOf('\n');
        const lang = firstNewline > 0 ? lines.slice(0, firstNewline).trim() : '';
        const code = firstNewline > 0 ? lines.slice(firstNewline + 1) : lines;
        return (
          <div
            key={i}
            style={{
              margin: '8px 0',
              borderRadius: 10,
              overflow: 'hidden',
              background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
              border: `0.5px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderBottom: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
              }}
            >
              <span style={{ fontSize: 10, color: c.muted, fontFamily: 'monospace' }}>
                {lang || 'code'}
              </span>
              <div
                onClick={() => copyCode(code)}
                style={{ fontSize: 10, color: c.accent, cursor: 'pointer' }}
              >
                {copied ? '✓ 已复制' : '复制'}
              </div>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '10px 12px',
                fontSize: 12,
                lineHeight: 1.5,
                fontFamily: '"SF Mono", Menlo, monospace',
                color: dark ? '#d4d4d4' : '#333',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {code}
            </pre>
          </div>
        );
      }
      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            style={{
              padding: '1px 5px',
              borderRadius: 4,
              fontSize: 13,
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              fontFamily: '"SF Mono", Menlo, monospace',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Memory tag
      if (part.startsWith('[memory:') && part.endsWith(']')) {
        const content = part.slice(8, -1);
        return (
          <div
            key={i}
            style={{
              margin: '6px 0',
              padding: '8px 10px',
              borderRadius: 10,
              background: dark ? 'rgba(155,138,206,0.1)' : 'rgba(155,138,206,0.06)',
              border: `0.5px solid ${dark ? 'rgba(155,138,206,0.2)' : 'rgba(155,138,206,0.15)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>🧠</span>
            <span style={{ fontSize: 12, color: c.accent }}>已存入记忆: {content}</span>
          </div>
        );
      }
      // MCP tag
      if (part.startsWith('[mcp:') && part.endsWith(']')) {
        const content = part.slice(5, -1);
        return (
          <div
            key={i}
            style={{
              margin: '6px 0',
              padding: '8px 10px',
              borderRadius: 10,
              background: dark ? 'rgba(107,175,178,0.1)' : 'rgba(107,175,178,0.06)',
              border: `0.5px solid ${dark ? 'rgba(107,175,178,0.2)' : 'rgba(107,175,178,0.15)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>🔌</span>
            <span style={{ fontSize: 12, color: '#6BAFB2' }}>MCP: {content}</span>
          </div>
        );
      }
      // Artifact tag
      if (part.startsWith('[artifact:') && part.endsWith(']')) {
        const content = part.slice(10, -1);
        return (
          <div
            key={i}
            style={{
              margin: '6px 0',
              borderRadius: 12,
              overflow: 'hidden',
              border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div
              style={{
                padding: '8px 10px',
                fontSize: 11,
                color: c.muted,
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderBottom: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
              }}
            >
              📎 Artifact
            </div>
            <div
              style={{
                padding: '12px',
                fontSize: 13,
                color: c.sub,
                background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)',
              }}
            >
              {content}
            </div>
          </div>
        );
      }
      // Plain text
      return <span key={i}>{part}</span>;
    });
  };

  const bgUser = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.85)';
  const bgOther = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)';

  return (
    <div style={{ padding: '0 16px', marginBottom: 12 }}>
      {/* Sender label + datetime */}
      <div
        style={{
          display: 'flex',
          justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
          padding: '0 4px',
          marginBottom: 3,
        }}
      >
        <span style={{ fontSize: 11, color: c.muted }}>
          {msg.isUser ? '你' : 'Noé'} · {formatDate(msg.time)}
        </span>
      </div>
      {/* Thinking chain — collapsible, default folded */}
      {msg.thinking && <ThinkingBlock msg={msg} dark={dark} />}
      {/* Bubble */}
      <div style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
        <div
          style={{
            maxWidth: '82%',
            padding: '10px 14px',
            borderRadius: msg.isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
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
              background: msg.isUser ? bgUser : bgOther,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              boxShadow: msg.isUser
                ? 'inset 0 0.5px 0 rgba(255,255,255,0.12)'
                : dark
                  ? 'inset 0 0.5px 0 rgba(255,255,255,0.05)'
                  : 'inset 0 0.5px 0 rgba(255,255,255,0.6)',
              border: msg.isUser
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
                lineHeight: 1.55,
                letterSpacing: -0.2,
                color: msg.isUser ? '#fff' : dark ? '#e8e6e3' : '#1a1a1a',
              }}
            >
              {renderContent(msg.text)}
              {msg.streaming && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: 16,
                    marginLeft: 1,
                    background: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    animation: 'cursorBlink 0.8s step-end infinite',
                    verticalAlign: 'text-bottom',
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Token stats */}
      {msg.tokens ? (
        <div
          style={{
            display: 'flex',
            justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
            padding: '2px 4px',
          }}
        >
          <span style={{ fontSize: 10, color: c.muted, fontFamily: 'monospace' }}>
            {msg.tokens} tokens
          </span>
        </div>
      ) : null}
    </div>
  );
}
