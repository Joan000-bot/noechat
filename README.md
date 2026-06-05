# Noé — AI Companion

A faithful **Vite + React** port of the Noé design handoff: an AI‑companion app
with an Apple iOS 26 "Liquid Glass" aesthetic (refraction, dynamic specular
highlights, rim light, chromatic dispersion, 3D tilt). It renders inside a
centered iPhone frame and ships dark‑first.

> Status: **UI prototype.** All data is mocked and interactions (chat streaming,
> music playback, terminal) are simulated in the client. See
> [Next steps](#next-steps) for wiring real services.

## Screens

Card‑grid navigation from Home — no tab bar.

| Screen | What it does |
| --- | --- |
| **Home** | Entry point: music mini‑bar, feature grid, health summary, mailbox |
| **Chats** | Full‑screen conversation, left slide‑out history drawer, streaming replies with a collapsible *Thinking* chain, markdown + code blocks, `[memory:]` / `[mcp:]` / `[artifact:]` tags, token counts |
| **Music** | Shared listening — playlist + player with scrolling lyrics and progress |
| **Journal** | Collaborative diary; Noé auto‑responds to each entry |
| **Dream** | Noé's dream world — a floating orb you can wake into a dream journal |
| **Timeline** | Vertical thread of milestone moments |
| **Memory** | Recall of facts about you, filterable by category |
| **Message Board** | Staggered sticky notes; Noé auto‑replies |
| **Settings** | Profile, API keys, MCP, Noé persona (system prompt + user style), theme |
| **Terminal** | Mock Claude Code session with ANSI color rendering |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
index.html                 Vite entry
public/favicon.svg         Noé orb icon
src/
  main.jsx                 React root
  App.jsx                  Phone shell, routing, theme, responsive scaling
  styles/global.css        Reset + keyframes (orbPulse, waveBar, cursorBlink, …)
  theme/colors.js          useColors() token factory
  components/               Liquid Glass design system
    Glass.jsx              The core glass surface (refraction + specular + rim)
    NoeOrb, WaveBars, PillButton, Dot, SectionLabel, BackBtn,
    Bubble, ChatInputBar, FloatingTabBar, SvgFilters
    ios/IOSStatusBar.jsx
  screens/                 One file per screen (see table above)
    chat/RichBubble.jsx    Chat bubble: markdown, tags, streaming cursor
    chat/ThinkingBlock.jsx Collapsible reasoning chain
design_handoff_noe/        Original design prototype + spec (source of truth)
```

## Design notes

- **Theme** — `light` / `dark` / `system`, switchable in Settings and persisted
  to `localStorage` (`noe_theme_mode`); `system` follows the OS. Dark is the
  default to match the handoff.
- **Liquid Glass** — `Glass` composes a blurred, SVG‑refracted backdrop
  (`#lg-refract`), a mouse‑tracked specular gradient, a masked conic rim light,
  and a chromatic‑dispersion edge. Defined once in `SvgFilters`.
- **Phone frame** — fixed 402×874 and scaled down to fit smaller viewports, so
  it stays usable on a real phone while preserving the design proportions.
- **Persistence** — avatar, username, theme, last screen, chat config
  (provider / key / base URL / model), system prompt, user style, terminal
  WebSocket URL, and the Memory / Journal / Message Board entries are all stored
  in `localStorage`.

## Backends

| Feature | Status |
| --- | --- |
| **Chat** | **Real.** Streams from an OpenAI/Anthropic‑compatible API via the same‑origin `/api/chat` proxy (`api/chat.js` on Vercel, mirrored by a Vite dev middleware). Configure provider + key + model in Settings. Falls back to a canned demo with no key. |
| **Terminal** | **Real** when a backend is configured — xterm.js over a WebSocket to `server/terminal` (`node-pty`). Set the `ws://` URL via the ⚙ in the Terminal screen; falls back to a simulated session otherwise. See `server/terminal/README.md`. |
| **Memory / Journal / Message Board** | **Real** local persistence (add / remove, saved to `localStorage`). |
| **Music** | **Real** when connected to Spotify (Settings → Spotify; Authorization Code + PKCE, no secret): live now‑playing, working transport, and your playlists. Falls back to the simulated demo player otherwise. |

## Deploy to Vercel (git integration)

The repo is zero‑config ready: Vercel auto‑detects **Vite** (build `vite build`
→ `dist`) and turns `api/*` into **Edge functions** automatically.

1. Vercel dashboard → **Add New… → Project → Import** the GitHub repo
   `Joan000-bot/noechat`. Keep the auto‑detected Vite settings.
2. Production deploys track the **`main`** branch — merge the PR into `main` to
   publish the app. Every PR also gets an automatic **preview** URL.
3. *(Optional)* set `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` env vars for a shared
   chat key; otherwise each user enters their own in Settings.

> The terminal's `node-pty` server is **not** deployed by Vercel (serverless
> can't host a PTY). Run `server/terminal` on a host that allows long‑lived
> sockets (e.g. a VPS) and point the app at its `wss://` URL.

## Self-host (your own domain, no Vercel)

Serve the static build with any web server and run the API as a tiny Node
service (`server/api/server.js`, **zero dependencies** — reuses
`src/server/chatProxy.js`).

```bash
npm install && npm run build                 # → dist/
node server/api/server.js                     # /api on 127.0.0.1:3012
```

nginx in front:

```nginx
server {
    server_name noechat.example.com;
    root /path/to/dist;
    location / { try_files $uri /index.html; }
    location /api/ { proxy_pass http://127.0.0.1:3012; proxy_buffering off; }
    # listen 443 ssl …  (e.g. `certbot --nginx -d noechat.example.com`)
}
```

See `design_handoff_noe/README.md` for the full design spec (tokens, animation
table, state model, backend architecture).
