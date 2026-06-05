# Noé terminal backend

A small WebSocket → `node-pty` server that gives the app's **Terminal** screen a
real interactive shell (via xterm.js in the browser).

Kept as its own package because `node-pty` is a native module — the web app
build (Vite/Vercel) never installs it.

## Run

```bash
cd server/terminal
npm install
TERMINAL_TOKEN=your-secret npm start   # ws://localhost:3001
```

Environment:

| Var | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | listen port |
| `TERMINAL_TOKEN` | _(none)_ | if set, clients must pass `?token=...` |
| `SHELL` | `bash` | shell to spawn |

## Connect from the app

Open the **Terminal** screen → tap the ⚙ (or the disconnected hint) → enter the
WebSocket URL, e.g.:

```
ws://localhost:3001                       # local dev
wss://your-host/terminal?token=your-secret  # deployed, behind TLS
```

The URL is saved to `localStorage` (`noe_terminal_ws`). With no URL configured,
the screen falls back to the built-in simulated terminal.

## ⚠️ Security

This exposes an **interactive shell** to whoever can reach the socket. Before
putting it anywhere non-local:

- **Always** set `TERMINAL_TOKEN` and serve over **`wss://`** (TLS).
- Put it behind a reverse proxy / firewall; never expose the raw port publicly.
- Consider running it as an unprivileged user in a container/jail.
