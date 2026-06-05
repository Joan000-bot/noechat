// Noé terminal backend: a WebSocket server that bridges the browser (xterm.js)
// to a real PTY via node-pty.
//
// Protocol (JSON frames both ways):
//   client → server: { type: 'input', data }            keystrokes
//                    { type: 'resize', cols, rows }      viewport size
//   server → client: { type: 'output', data }           pty output
//                    { type: 'exit' }                    shell exited
//
// ⚠️  Security: this exposes an interactive shell. Always run it behind TLS
// (wss://) and set TERMINAL_TOKEN so only clients with the matching
// `?token=...` can connect. Do not expose it on a public port without both.
import os from 'os';
import { WebSocketServer } from 'ws';
import pty from 'node-pty';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const TOKEN = process.env.TERMINAL_TOKEN || '';
const SHELL = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : 'bash');

const wss = new WebSocketServer({ port: PORT, host: HOST });
console.log(
  `Noé terminal server listening on ws://${HOST}:${PORT}` + (TOKEN ? ' (token required)' : ' (no token — dev only)')
);

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (TOKEN && url.searchParams.get('token') !== TOKEN) {
    try {
      ws.send(JSON.stringify({ type: 'output', data: '\r\n\x1b[31mUnauthorized\x1b[0m\r\n' }));
    } catch {
      /* ignore */
    }
    ws.close();
    return;
  }

  const shell = pty.spawn(SHELL, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || process.cwd(),
    env: process.env,
  });

  const send = (obj) => {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify(obj));
      } catch {
        /* ignore */
      }
    }
  };

  shell.onData((data) => send({ type: 'output', data }));
  shell.onExit(() => {
    send({ type: 'exit' });
    try {
      ws.close();
    } catch {
      /* ignore */
    }
  });

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (msg.type === 'input' && typeof msg.data === 'string') {
      shell.write(msg.data);
    } else if (msg.type === 'resize' && msg.cols && msg.rows) {
      try {
        shell.resize(msg.cols, msg.rows);
      } catch {
        /* ignore */
      }
    }
  });

  ws.on('close', () => {
    try {
      shell.kill();
    } catch {
      /* ignore */
    }
  });
});
