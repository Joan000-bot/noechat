// noe-v2-components.jsx — Apple-grade Liquid Glass components
// SVG refraction, dynamic specular, rim light, chromatic dispersion, 3D tilt.

// ─── SVG Refraction Filters (singleton) ───
(function injectSVGFilter() {
  if (document.getElementById('lg-filters')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'lg-filters';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <filter id="lg-refract" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="2" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="lg-refract-mobile" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="5" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);
})();

// ─── Apple-grade Glass Surface ───
function Glass({ children, dark = false, style = {}, onClick, radius = 20, intensity = 'medium', dispersion = false, tilt = false }) {
  const [pressed, setPressed] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
  const [tiltTransform, setTiltTransform] = React.useState('');
  const containerRef = React.useRef(null);
  const isHovering = React.useRef(false);

  const blur = { light: 8, medium: 16, strong: 24 }[intensity] || 16;
  const bgAlpha = dark
    ? { light: 0.03, medium: 0.04, strong: 0.06 }[intensity]
    : { light: 0.3, medium: 0.38, strong: 0.45 }[intensity];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: mx, y: my });

    if (tilt) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltTransform(`perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`);
    }
  };

  const handleMouseLeave = () => {
    setPressed(false);
    isHovering.current = false;
    setMousePos({ x: 50, y: 50 });
    if (tilt) setTiltTransform('');
  };

  // Rim light angle from mouse position
  const rimAngle = Math.atan2(mousePos.y - 50, mousePos.x - 50) * 180 / Math.PI;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onPointerDown={() => onClick && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { isHovering.current = true; }}
      style={{
        position: 'relative',
        borderRadius: radius,
        cursor: onClick ? 'pointer' : 'default',
        transform: pressed ? 'scale(0.985)' : (tiltTransform || 'scale(1)'),
        transition: tilt ? 'transform 0.12s ease' : 'transform 0.18s ease',
        ...style,
      }}
    >
      {/* Chromatic dispersion edge */}
      {dispersion && (
        <div style={{
          position: 'absolute', inset: -1.5, borderRadius: radius + 1.5,
          background: `conic-gradient(from 45deg, 
            rgba(255,100,100,0.2), rgba(100,100,255,0.2), 
            rgba(100,255,200,0.2), rgba(255,255,100,0.2), 
            rgba(255,100,100,0.2))`,
          filter: 'blur(3px)',
          opacity: dark ? 0.18 : 0.14,
          animation: 'dispersionRotate 12s linear infinite',
          pointerEvents: 'none', zIndex: -1,
        }} />
      )}

      {/* Main container with overflow hidden */}
      <div style={{ position: 'relative', borderRadius: radius, overflow: 'hidden' }}>
        {/* Refraction + blur layer — inset -20px for displacement overflow */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: radius,
          backdropFilter: `blur(${blur}px) saturate(${dark ? 140 : 170}%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${dark ? 140 : 170}%)`,
          background: dark
            ? `rgba(255,255,255,${bgAlpha})`
            : `rgba(255,255,255,${bgAlpha})`,
          filter: intensity !== 'light' ? 'url(#lg-refract)' : 'none',
        }} />

        {/* Specular highlight — follows mouse */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
          background: `radial-gradient(
            circle 120px at ${mousePos.x}% ${mousePos.y}%, 
            ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.25)'} 0%, 
            ${dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)'} 40%, 
            transparent 70%)`,
          transition: 'background 0.3s ease',
        }} />

        {/* Rim light — conic gradient masked to border only */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
          background: `conic-gradient(
            from ${rimAngle}deg at ${mousePos.x}% ${mousePos.y}%, 
            ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)'} 0%, 
            transparent 25%, transparent 75%, 
            ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)'} 100%)`,
          WebkitMaskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
          WebkitMaskSize: '100% 100%, calc(100% - 2px) calc(100% - 2px)',
          WebkitMaskPosition: '0 0, 1px 1px',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          transition: 'background 0.4s ease',
        }} />

        {/* Inset border + shine */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
          boxShadow: dark
            ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)'
            : 'inset 0 0.5px 0 rgba(255,255,255,0.5)',
          border: dark
            ? '0.5px solid rgba(255,255,255,0.04)'
            : '0.5px solid rgba(0,0,0,0.03)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>

      {/* Outer shadow */}
      <div style={{
        position: 'absolute', inset: -1, borderRadius: radius + 1, pointerEvents: 'none', zIndex: -1,
        boxShadow: dark
          ? '0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)'
          : '0 0.5px 1px rgba(0,0,0,0.015), 0 2px 8px rgba(0,0,0,0.025)',
      }} />
    </div>
  );
}

// ─── Floating Tab Bar (ChatGPT / iOS 26 hybrid) ───
function FloatingTabBar({ tabs, active, onChange, dark = false }) {
  return (
    <div style={{
      position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 22, height: 48,
        display: 'flex', alignItems: 'center', gap: 0,
        padding: '0 5px',
        pointerEvents: 'auto',
      }}>
        {/* glass bg */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 22,
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          background: dark ? 'rgba(38,38,40,0.72)' : 'rgba(255,255,255,0.68)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 22, pointerEvents: 'none',
          boxShadow: dark
            ? 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 12px rgba(0,0,0,0.35)'
            : 'inset 0 0.5px 0 rgba(255,255,255,0.8), 0 1px 6px rgba(0,0,0,0.06)',
          border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.05)',
        }} />
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                position: 'relative', zIndex: 1,
                height: 38, borderRadius: 16, padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer',
                background: isActive
                  ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
                  : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <span style={{
                fontSize: 16, lineHeight: 1,
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 0.2s ease',
              }}>{tab.icon}</span>
              {isActive && (
                <span style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: 0.1,
                  fontFamily: '-apple-system, system-ui',
                  color: dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                }}>{tab.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Noe Orb (smaller, quieter) ───
function NoeOrb({ size = 36, dark = false, active = true, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: dark
        ? 'radial-gradient(circle at 38% 38%, #b8a4f0, #7c5cbf 55%, #5b3d99)'
        : 'radial-gradient(circle at 38% 38%, #d4c7f5, #a78bda 55%, #7c5cbf)',
      boxShadow: dark
        ? `0 0 ${size * 0.3}px rgba(167,139,250,0.2)`
        : `0 0 ${size * 0.3}px rgba(167,139,250,0.12)`,
      position: 'relative',
      animation: active ? 'orbPulse 4s ease-in-out infinite' : 'none',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: '12%', left: '18%',
        width: '32%', height: '24%', borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)', filter: 'blur(3px)',
      }} />
    </div>
  );
}

// ─── Chat Input Bar (ChatGPT-style) ───
function ChatInputBar({ dark = false, value = '', onChange, onSend, placeholder = 'Reply to Noé...' }) {
  const text = dark ? '#e8e6e3' : '#1a1a1a';
  const muted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.32)';
  const hasText = value.trim().length > 0;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}>
      {/* glass bg */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 24,
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
        boxShadow: dark
          ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)'
          : 'inset 0 0.5px 0 rgba(255,255,255,0.7)',
        border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 6px 4px 16px', minHeight: 48,
      }}>
        {/* attachment */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', opacity: 0.5,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={text} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <input
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend && onSend()}
          placeholder={placeholder}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: '-apple-system, system-ui', fontSize: 16, color: text,
            padding: '8px 0', letterSpacing: -0.2, lineHeight: '22px',
          }}
        />
        {/* send or mic */}
        <div
          onClick={() => hasText && onSend && onSend()}
          style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: hasText ? 'pointer' : 'default',
            background: hasText
              ? (dark ? 'rgba(255,255,255,0.85)' : '#1a1a1a')
              : 'transparent',
            transition: 'background 0.2s ease',
          }}
        >
          {hasText ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke={dark ? '#1a1a1a' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={muted} strokeWidth="1.8"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={muted} strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M12 19v4M8 23h8" stroke={muted} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Subtle wave bars (for music) ───
function WaveBars({ dark = false, playing = true, count = 5, height = 20, color }) {
  const c = color || (dark ? 'rgba(167,139,250,0.7)' : 'rgba(124,58,237,0.5)');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 2.5, borderRadius: 1.5, background: c,
          height: playing ? undefined : 3,
          animation: playing ? `waveBar 1.2s ease-in-out ${i * 0.15}s infinite` : 'none',
        }} />
      ))}
    </div>
  );
}

// ─── Pill Nav Button ───
function PillButton({ children, dark = false, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: 'relative', overflow: 'hidden',
      height: 36, borderRadius: 18, padding: '0 14px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 18,
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 18, pointerEvents: 'none',
        border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
        boxShadow: dark ? 'none' : 'inset 0 0.5px 0 rgba(255,255,255,0.6)',
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Status dot ───
function Dot({ color = '#22c55e', size = 7 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

// ─── Section label ───
function SectionLabel({ children, dark = false, style = {} }) {
  return (
    <div style={{
      fontFamily: '-apple-system, system-ui', fontSize: 12, fontWeight: 600,
      color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)',
      letterSpacing: 0.8, textTransform: 'uppercase',
      padding: '0 4px', ...style,
    }}>{children}</div>
  );
}

// ─── Chat bubble (refined) ───
function Bubble({ text, isUser = false, dark = false, time }) {
  const bgUser = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.85)';
  const bgOther = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      padding: '0 16px', marginBottom: 6,
    }}>
      <div style={{
        maxWidth: '80%', padding: '10px 14px',
        borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          background: isUser ? bgUser : bgOther,
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          boxShadow: isUser
            ? 'inset 0 0.5px 0 rgba(255,255,255,0.12)'
            : (dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.05)' : 'inset 0 0.5px 0 rgba(255,255,255,0.6)'),
          border: isUser
            ? '0.5px solid rgba(255,255,255,0.1)'
            : (dark ? '0.5px solid rgba(255,255,255,0.04)' : '0.5px solid rgba(0,0,0,0.03)'),
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: '-apple-system, system-ui',
            fontSize: 15, lineHeight: 1.5, letterSpacing: -0.2,
            color: isUser ? '#fff' : (dark ? '#e8e6e3' : '#1a1a1a'),
          }}>{text}</div>
          {time && (
            <div style={{
              fontSize: 11, marginTop: 3, textAlign: 'right',
              color: isUser ? 'rgba(255,255,255,0.5)' : (dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)'),
            }}>{time}</div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Glass, FloatingTabBar, NoeOrb, ChatInputBar, WaveBars,
  PillButton, Dot, SectionLabel, Bubble,
});
