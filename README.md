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
- **Persistence** — avatar, username, theme, base URL, system prompt, user
  style and the last screen are stored in `localStorage`.

## Next steps

The handoff describes real backing services that aren't wired yet:

- **Chat** → stream from an OpenAI/Anthropic‑compatible `…/chat/completions`
  endpoint (key + base URL already captured in Settings), with extended
  thinking.
- **Music** → connect a real player / shared session.
- **Terminal** → backend WebSocket → `node-pty` for a live PTY.

See `design_handoff_noe/README.md` for the full spec (design tokens, animation
table, state model, backend architecture).
