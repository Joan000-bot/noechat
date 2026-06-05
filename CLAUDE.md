# CLAUDE.md — noechat

Noé AI‑companion app. **Vite + React** port of the design prototype in
`design_handoff_noe/`. Dark‑first, Apple "Liquid Glass" aesthetic, rendered in a
centered iPhone frame.

## Commands

```bash
npm install
npm run dev      # dev server, http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the build
```

There is no linter/test runner configured yet.

## Architecture

- **Routing** is local state in `src/App.jsx` (`screen` string + a 120ms fade),
  not a router. Add a screen by writing `src/screens/<Name>.jsx`, importing it in
  `App.jsx`, and adding a `case` to `renderScreen()`.
- **Theme** lives in `App.jsx`: `themeMode` (`light`/`dark`/`system`) →
  resolved `dark` boolean, passed down as a prop. Settings changes it via
  `onThemeChange`. Tokens come from `useColors(dark)` in `src/theme/colors.js`.
- **Liquid Glass** — use the `Glass` component for cards
  (`intensity` = `light`/`medium`/`strong`, plus `dispersion` / `tilt`). The
  SVG refraction filters are rendered once by `SvgFilters` in `App.jsx`.
- **Styling** is inline style objects (matching the handoff). Shared keyframes
  and the scrollbar reset are in `src/styles/global.css`.
- **Persistence** — `localStorage` keys are prefixed `noe_` (`noe_theme_mode`,
  `noe_v2_screen`, `noe_avatar`, `noe_username`, `noe_base_url`,
  `noe_system_prompt`, `noe_user_style`).

## Conventions

- Components are named exports; one component family per file.
- Keep visual parity with `design_handoff_noe/` — it is the source of truth for
  colors, spacing, radii and animation timings.
- Data is currently mocked in each screen; chat/music/terminal interactions are
  simulated client‑side.

## Key decisions (from the handoff)

- Dark mode is `#161618` (not pure black).
- User bubble: dark text bg in light mode, light bg in dark mode.
- Thinking chain folds by default, auto‑expands while streaming.
- No tab bar — Home is a card grid; Chat uses a left slide‑out drawer.
