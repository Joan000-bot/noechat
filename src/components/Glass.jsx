import React from 'react';

// Apple-grade Liquid Glass surface: SVG refraction + blur, mouse-tracked
// specular highlight, rim light, chromatic dispersion edge, optional 3D tilt.
export function Glass({
  children,
  dark = false,
  style = {},
  onClick,
  radius = 20,
  intensity = 'medium',
  dispersion = false,
  tilt = false,
}) {
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
  const rimAngle = (Math.atan2(mousePos.y - 50, mousePos.x - 50) * 180) / Math.PI;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onPointerDown={() => onClick && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      style={{
        position: 'relative',
        borderRadius: radius,
        cursor: onClick ? 'pointer' : 'default',
        transform: pressed ? 'scale(0.985)' : tiltTransform || 'scale(1)',
        transition: tilt ? 'transform 0.12s ease' : 'transform 0.18s ease',
        ...style,
      }}
    >
      {/* Chromatic dispersion edge */}
      {dispersion && (
        <div
          style={{
            position: 'absolute',
            inset: -1.5,
            borderRadius: radius + 1.5,
            background: `conic-gradient(from 45deg,
              rgba(255,100,100,0.2), rgba(100,100,255,0.2),
              rgba(100,255,200,0.2), rgba(255,255,100,0.2),
              rgba(255,100,100,0.2))`,
            filter: 'blur(3px)',
            opacity: dark ? 0.18 : 0.14,
            animation: 'dispersionRotate 12s linear infinite',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}

      {/* Main container with overflow hidden */}
      <div style={{ position: 'relative', borderRadius: radius, overflow: 'hidden' }}>
        {/* Refraction + blur layer — inset -20px for displacement overflow */}
        <div
          style={{
            position: 'absolute',
            inset: -20,
            borderRadius: radius,
            backdropFilter: `blur(${blur}px) saturate(${dark ? 140 : 170}%)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${dark ? 140 : 170}%)`,
            background: `rgba(255,255,255,${bgAlpha})`,
            filter: intensity !== 'light' ? 'url(#lg-refract)' : 'none',
          }}
        />

        {/* Specular highlight — follows mouse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            pointerEvents: 'none',
            background: `radial-gradient(
              circle 120px at ${mousePos.x}% ${mousePos.y}%,
              ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.25)'} 0%,
              ${dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)'} 40%,
              transparent 70%)`,
            transition: 'background 0.3s ease',
          }}
        />

        {/* Rim light — conic gradient masked to border only */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            pointerEvents: 'none',
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
          }}
        />

        {/* Inset border + shine */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            pointerEvents: 'none',
            boxShadow: dark
              ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)'
              : 'inset 0 0.5px 0 rgba(255,255,255,0.5)',
            border: dark
              ? '0.5px solid rgba(255,255,255,0.04)'
              : '0.5px solid rgba(0,0,0,0.03)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>

      {/* Outer shadow */}
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: radius + 1,
          pointerEvents: 'none',
          zIndex: -1,
          boxShadow: dark
            ? '0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)'
            : '0 0.5px 1px rgba(0,0,0,0.015), 0 2px 8px rgba(0,0,0,0.025)',
        }}
      />
    </div>
  );
}
