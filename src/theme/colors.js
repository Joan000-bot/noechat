// Color tokens resolved for the active theme. Kept as a `useColors` factory to
// mirror the design handoff; it is a pure function (no hooks) so it is safe to
// call anywhere.
export function useColors(dark) {
  return {
    text: dark ? '#e8e6e3' : '#1a1a1a',
    sub: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.42)',
    muted: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)',
    accent: dark ? '#b8a4f0' : '#7c5cbf',
    bg: dark ? '#161618' : '#F5F3EF',
  };
}
