// Floating glass tab bar (design-system primitive). The current app uses
// card-grid navigation from Home rather than a tab bar, but this is kept as part
// of the component library.
export function FloatingTabBar({ tabs, active, onChange, dark = false }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 28,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 22,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '0 5px',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            background: dark ? 'rgba(38,38,40,0.72)' : 'rgba(255,255,255,0.68)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            pointerEvents: 'none',
            boxShadow: dark
              ? 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 12px rgba(0,0,0,0.35)'
              : 'inset 0 0.5px 0 rgba(255,255,255,0.8), 0 1px 6px rgba(0,0,0,0.06)',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.05)',
          }}
        />
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                position: 'relative',
                zIndex: 1,
                height: 38,
                borderRadius: 16,
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                background: isActive
                  ? dark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)'
                  : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  lineHeight: 1,
                  opacity: isActive ? 1 : 0.5,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {tab.icon}
              </span>
              {isActive && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 0.1,
                    fontFamily: '-apple-system, system-ui',
                    color: dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  }}
                >
                  {tab.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
