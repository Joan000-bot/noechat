import React from 'react';
import { handleRedirect as handleSpotifyRedirect } from './lib/spotify';
import { SvgFilters } from './components/SvgFilters';
import { IOSStatusBar } from './components/ios/IOSStatusBar';
import { HomeScreen } from './screens/HomeScreen';
import { ChatHubScreen } from './screens/ChatHubScreen';
import { MusicScreen } from './screens/MusicScreen';
import { JournalScreen } from './screens/JournalScreen';
import { DreamScreen } from './screens/DreamScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import { MemoryScreen } from './screens/MemoryScreen';
import { MessageBoardScreen } from './screens/MessageBoardScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TerminalScreen } from './screens/TerminalScreen';

// Phone-frame dimensions from the design handoff.
const FRAME_W = 402;
const FRAME_H = 874;
// Light-mode background tint. The design ships dark-first; all warmths collapse
// to #161618 in dark mode.
const WARMTH = 'cool';

function BgAmbient({ dark }) {
  const blobs = dark
    ? [
        { color: 'rgba(155,138,206,0.08)', size: 180, x: '12%', y: '18%', anim: 'softFloat1 14s ease-in-out infinite' },
        { color: 'rgba(107,158,196,0.06)', size: 150, x: '68%', y: '55%', anim: 'softFloat2 18s ease-in-out infinite' },
      ]
    : [
        { color: 'rgba(155,138,206,0.06)', size: 200, x: '8%', y: '15%', anim: 'softFloat1 14s ease-in-out infinite' },
        { color: 'rgba(200,123,148,0.04)', size: 160, x: '65%', y: '60%', anim: 'softFloat2 18s ease-in-out infinite' },
      ];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 48,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: b.color,
            filter: 'blur(50px)',
            animation: b.anim,
          }}
        />
      ))}
    </div>
  );
}

function prefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : true;
}

export default function App() {
  // Theme: 'light' | 'dark' | 'system'. Defaults to dark to match the handoff's
  // dark-first look. Resolved into `dark` (system follows the OS).
  const [themeMode, setThemeMode] = React.useState(() => {
    try {
      return localStorage.getItem('noe_theme_mode') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [systemDark, setSystemDark] = React.useState(prefersDark);
  const dark = themeMode === 'system' ? systemDark : themeMode === 'dark';

  const [screen, setScreen] = React.useState('home');
  const [visible, setVisible] = React.useState(true);
  const [scale, setScale] = React.useState(1);

  // Restore last screen
  React.useEffect(() => {
    try {
      const s = localStorage.getItem('noe_v2_screen');
      if (s) setScreen(s);
    } catch (e) {
      /* ignore */
    }
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem('noe_v2_screen', screen);
    } catch (e) {
      /* ignore */
    }
  }, [screen]);

  // Complete the Spotify OAuth redirect if we came back with a ?code=
  React.useEffect(() => {
    handleSpotifyRedirect().catch(() => {});
  }, []);

  // Track OS theme for 'system' mode
  React.useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const changeTheme = (mode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('noe_theme_mode', mode);
    } catch (e) {
      /* ignore */
    }
  };

  // Scale the fixed phone frame down to fit smaller viewports (real phones).
  React.useEffect(() => {
    const fit = () =>
      setScale(Math.min(1, window.innerWidth / FRAME_W, window.innerHeight / FRAME_H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const navigate = (s) => {
    setVisible(false);
    setTimeout(() => {
      setScreen(s);
      setTimeout(() => setVisible(true), 30);
    }, 120);
  };
  const goBack = () => navigate('home');

  const bgColors = {
    warm: dark ? '#161618' : '#F5F3EF',
    neutral: dark ? '#161618' : '#F0EFED',
    cool: dark ? '#161618' : '#ECEEF0',
  };
  const bg = bgColors[WARMTH];

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen dark={dark} onNavigate={navigate} />;
      case 'chathub':
        return <ChatHubScreen dark={dark} onBack={goBack} />;
      case 'music':
        return <MusicScreen dark={dark} onBack={goBack} />;
      case 'journal':
        return <JournalScreen dark={dark} onBack={goBack} />;
      case 'dream':
        return <DreamScreen dark={dark} onBack={goBack} />;
      case 'timeline':
        return <TimelineScreen dark={dark} onBack={goBack} />;
      case 'memory':
        return <MemoryScreen dark={dark} onBack={goBack} />;
      case 'board':
        return <MessageBoardScreen dark={dark} onBack={goBack} />;
      case 'settings':
        return <SettingsScreen dark={dark} onBack={goBack} themeMode={themeMode} onThemeChange={changeTheme} />;
      case 'terminal':
        return <TerminalScreen dark={dark} onBack={goBack} />;
      default:
        return <HomeScreen dark={dark} onNavigate={navigate} />;
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ddd9d2',
        overflow: 'hidden',
      }}
    >
      <SvgFilters />
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        {/* Phone shell */}
        <div
          style={{
            width: FRAME_W,
            height: FRAME_H,
            borderRadius: 48,
            overflow: 'hidden',
            position: 'relative',
            background: bg,
            boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.1)',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <BgAmbient dark={dark} />

          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 11,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 126,
              height: 37,
              borderRadius: 24,
              background: '#000',
              zIndex: 50,
            }}
          />

          {/* Status bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 45 }}>
            <IOSStatusBar dark={dark} />
          </div>

          {/* Screen */}
          <div
            className="v2-screen"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(10px)',
            }}
          >
            {renderScreen()}
          </div>

          {/* Home indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 60,
              height: 28,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingBottom: 7,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: 134,
                height: 5,
                borderRadius: 100,
                background: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
