import React from 'react';
import { useColors } from '../theme/colors';
import { Dot } from '../components/Dot';
import { BackBtn } from '../components/BackBtn';

// Terminal — a mock Claude Code session with ANSI color rendering. (A real build
// would wire this to a backend WebSocket → node-pty.)
export function TerminalScreen({ dark, onBack }) {
  // Terminal uses its own fixed palette; useColors kept for parity with the handoff.
  useColors(dark);
  const [lines, setLines] = React.useState([
    { type: 'system', text: '╭─────────────────────────────────────╮' },
    { type: 'system', text: '│  Noé Terminal v1.0                  │' },
    { type: 'system', text: '│  WebSocket → node-pty → Claude Code │' },
    { type: 'system', text: '╰─────────────────────────────────────╯' },
    { type: 'info', text: '' },
    { type: 'info', text: '\x1b[32m✓\x1b[0m Connected to ws://localhost:3001' },
    { type: 'info', text: '\x1b[32m✓\x1b[0m PTY session active (bash)' },
    { type: 'info', text: '' },
    { type: 'output', text: '\x1b[36m~/projects/noe\x1b[0m \x1b[33m(main)\x1b[0m' },
    { type: 'prompt', text: '$ claude' },
    { type: 'info', text: '' },
    { type: 'output', text: '\x1b[1m\x1b[35m  ╭──────────────────────────────╮\x1b[0m' },
    { type: 'output', text: '\x1b[1m\x1b[35m  │    \x1b[37mClaude Code v1.0.12\x1b[35m      │\x1b[0m' },
    { type: 'output', text: '\x1b[1m\x1b[35m  ╰──────────────────────────────╯\x1b[0m' },
    { type: 'info', text: '' },
    { type: 'output', text: '\x1b[90m  Type your request, or /help for commands\x1b[0m' },
    { type: 'info', text: '' },
    { type: 'prompt', text: '\x1b[35m❯\x1b[0m ' },
  ]);
  const [input, setInput] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const renderAnsi = (text) => {
    // Simple ANSI color parser
    const colorMap = {
      30: '#4a4a4a', 31: '#ef4444', 32: '#22c55e', 33: '#eab308',
      34: '#3b82f6', 35: '#a855f7', 36: '#06b6d4', 37: '#e8e6e3',
      90: '#6b7280', 91: '#f87171', 92: '#4ade80', 93: '#facc15',
      94: '#60a5fa', 95: '#c084fc', 96: '#22d3ee', 97: '#f9fafb',
    };
    const parts = text.split(/\x1b\[([0-9;]+)m/);
    let currentStyle = {};
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // This is a code
        const codes = part.split(';');
        codes.forEach((code) => {
          if (code === '0') currentStyle = {};
          else if (code === '1') currentStyle = { ...currentStyle, fontWeight: 700 };
          else if (colorMap[code]) currentStyle = { ...currentStyle, color: colorMap[code] };
        });
        return null;
      }
      return part ? (
        <span key={i} style={currentStyle}>
          {part}
        </span>
      ) : null;
    });
  };

  const handleCommand = () => {
    if (!input.trim() || processing) return;
    const cmd = input.trim();
    setInput('');
    setProcessing(true);

    // Add the command line
    setLines((prev) => [...prev, { type: 'input', text: `\x1b[35m❯\x1b[0m ${cmd}` }]);

    // Simulate response
    setTimeout(() => {
      let response = [];
      if (cmd === '/help' || cmd === 'help') {
        response = [
          { type: 'info', text: '' },
          { type: 'output', text: '\x1b[1mAvailable commands:\x1b[0m' },
          { type: 'output', text: '  \x1b[36m/help\x1b[0m      Show this help' },
          { type: 'output', text: '  \x1b[36m/clear\x1b[0m     Clear terminal' },
          { type: 'output', text: '  \x1b[36m/model\x1b[0m     Show current model' },
          { type: 'output', text: '  \x1b[36m/status\x1b[0m    Connection status' },
          { type: 'info', text: '' },
        ];
      } else if (cmd === '/clear' || cmd === 'clear') {
        setLines([{ type: 'prompt', text: '\x1b[35m❯\x1b[0m ' }]);
        setProcessing(false);
        return;
      } else if (cmd === '/status') {
        response = [
          { type: 'info', text: '' },
          { type: 'output', text: '\x1b[32m●\x1b[0m WebSocket: \x1b[32mConnected\x1b[0m' },
          { type: 'output', text: '\x1b[32m●\x1b[0m PTY: \x1b[32mActive\x1b[0m (pid: 48291)' },
          { type: 'output', text: '\x1b[32m●\x1b[0m Model: \x1b[36mclaude-sonnet-4-5\x1b[0m' },
          { type: 'info', text: '' },
        ];
      } else {
        response = [
          { type: 'info', text: '' },
          { type: 'output', text: `\x1b[90m  Thinking...\x1b[0m` },
          { type: 'info', text: '' },
          { type: 'output', text: `\x1b[37m  I'll help you with: "${cmd}"\x1b[0m` },
          { type: 'output', text: `\x1b[37m  This terminal connects to Claude Code via\x1b[0m` },
          { type: 'output', text: `\x1b[37m  WebSocket → node-pty for full interactive\x1b[0m` },
          { type: 'output', text: `\x1b[37m  ANSI support.\x1b[0m` },
          { type: 'info', text: '' },
          { type: 'output', text: '\x1b[32m✓\x1b[0m Done \x1b[90m(0.8s · 124 tokens)\x1b[0m' },
          { type: 'info', text: '' },
        ];
      }
      response.push({ type: 'prompt', text: '\x1b[35m❯\x1b[0m ' });
      setLines((prev) => [...prev, ...response]);
      setProcessing(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 0' }}>
      <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={true} onClick={onBack} />
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#e8e6e3',
            letterSpacing: -0.3,
            fontFamily: '-apple-system, system-ui',
          }}
        >
          Terminal
        </span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 8,
            background: 'rgba(34,197,94,0.12)',
            border: '0.5px solid rgba(34,197,94,0.2)',
          }}
        >
          <Dot color="#22c55e" size={5} />
          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 500 }}>Connected</span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 14px',
          background: '#0d0d0f',
          fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
          fontSize: 12,
          lineHeight: 1.6,
          color: '#d4d4d4',
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ minHeight: line.text ? undefined : 8 }}>
            {line.text ? renderAnsi(line.text) : ' '}
          </div>
        ))}
        {processing && (
          <div style={{ color: '#6b7280' }}>
            <span style={{ animation: 'orbPulse 1s ease-in-out infinite' }}>⠋</span> Processing...
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '8px 14px 36px',
          background: '#0d0d0f',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            padding: '6px 10px',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ color: '#a855f7', fontSize: 13, fontWeight: 600 }}>❯</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            placeholder="Type a command..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
              fontSize: 13,
              color: '#e8e6e3',
              padding: '4px 0',
            }}
          />
        </div>
      </div>
    </div>
  );
}
