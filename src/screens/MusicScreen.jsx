import React from 'react';
import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { WaveBars } from '../components/WaveBars';
import { NoeOrb } from '../components/NoeOrb';
import { PillButton } from '../components/PillButton';
import { BackBtn } from '../components/BackBtn';

// Music — shared listening: a playlist view and a player with scrolling lyrics.
export function MusicScreen({ dark, onBack }) {
  const c = useColors(dark);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0.35);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [showPlaylist, setShowPlaylist] = React.useState(false);
  const [addInput, setAddInput] = React.useState('');
  const [listenStart] = React.useState(() => Date.now() - 3600000 * 2.5); // 2.5h ago
  const [elapsed, setElapsed] = React.useState('');

  const [playlist, setPlaylist] = React.useState([
    {
      title: 'Clair de Lune',
      artist: 'Claude Debussy',
      album: 'Suite bergamasque',
      duration: '5:00',
      durationSec: 300,
      color: '#9B8ACE',
      addedBy: 'Noé',
      lyrics: [
        { t: 0, text: '♪ ···' },
        { t: 0.08, text: '月光轻洒在水面' },
        { t: 0.16, text: '如梦似幻的夜' },
        { t: 0.24, text: '琴键诉说着温柔' },
        { t: 0.35, text: '每一个音符都在呼吸' },
        { t: 0.45, text: '静谧中流淌的旋律' },
        { t: 0.55, text: '像月光穿过薄雾' },
        { t: 0.65, text: '轻抚着沉睡的世界' },
        { t: 0.75, text: '在寂静中绽放光芒' },
        { t: 0.88, text: '余韵悠长 ···' },
        { t: 0.95, text: '♪' },
      ],
    },
    {
      title: 'Gymnopédie No.1',
      artist: 'Erik Satie',
      album: 'Trois Gymnopédies',
      duration: '3:30',
      durationSec: 210,
      color: '#6B9EC4',
      addedBy: '你',
      lyrics: [
        { t: 0, text: '♪ ···' },
        { t: 0.1, text: '缓慢的步伐' },
        { t: 0.25, text: '像走在空旷的大厅' },
        { t: 0.4, text: '每一步都轻柔' },
        { t: 0.55, text: '仿佛时间停止流动' },
        { t: 0.7, text: '只剩下回忆的回响' },
        { t: 0.85, text: '在空气中飘散' },
        { t: 0.95, text: '♪' },
      ],
    },
    {
      title: 'River Flows in You',
      artist: 'Yiruma',
      album: 'First Love',
      duration: '3:12',
      durationSec: 192,
      color: '#C87B94',
      addedBy: 'Noé',
      lyrics: [
        { t: 0, text: '♪ ···' },
        { t: 0.1, text: '河水在你心中流淌' },
        { t: 0.25, text: '带走所有的忧伤' },
        { t: 0.4, text: '温柔的旋律缠绕' },
        { t: 0.55, text: '像一个永恒的拥抱' },
        { t: 0.7, text: '在指尖跳动的音符' },
        { t: 0.85, text: '讲述着爱的故事' },
        { t: 0.95, text: '♪' },
      ],
    },
  ]);

  const song = playlist[currentIdx];

  // Timer: elapsed listen time
  React.useEffect(() => {
    const iv = setInterval(() => {
      const ms = Date.now() - listenStart;
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      setElapsed(h > 0 ? h + '小时' + m + '分钟' : m + '分钟');
    }, 10000);
    setElapsed('2小时30分钟');
    return () => clearInterval(iv);
  }, [listenStart]);

  // Progress
  React.useEffect(() => {
    if (!playing) return;
    const iv = setInterval(
      () =>
        setProgress((p) => {
          if (p >= 1) {
            nextTrack();
            return 0;
          }
          return p + 1 / (song.durationSec * 10);
        }),
      100
    );
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, currentIdx]);

  const nextTrack = () => {
    setCurrentIdx((i) => (i + 1) % playlist.length);
    setProgress(0);
  };
  const prevTrack = () => {
    if (progress > 0.05) {
      setProgress(0);
      return;
    }
    setCurrentIdx((i) => (i - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const addSong = () => {
    if (!addInput.trim()) return;
    const parts = addInput.split(' - ');
    const title = parts[0] || addInput;
    const artist = parts[1] || 'Unknown';
    const colors = ['#D4A853', '#6BAFB2', '#9B8ACE', '#C87B94', '#6B9EC4'];
    setPlaylist((prev) => [
      ...prev,
      {
        title: title.trim(),
        artist: artist.trim(),
        album: '',
        duration: '3:30',
        durationSec: 210,
        color: colors[prev.length % colors.length],
        addedBy: '你',
        lyrics: [
          { t: 0, text: '♪ ···' },
          { t: 0.5, text: '歌词加载中...' },
          { t: 0.95, text: '♪' },
        ],
      },
    ]);
    setAddInput('');
  };

  // Current lyric
  const currentLyric = song.lyrics ? song.lyrics.filter((l) => l.t <= progress).pop() : null;
  const nextLyric = song.lyrics ? song.lyrics.find((l) => l.t > progress) : null;

  const formatTime = (p) => {
    const total = song.durationSec * p;
    return Math.floor(total / 60) + ':' + String(Math.floor(total % 60)).padStart(2, '0');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={dark} onClick={onBack} />
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
            letterSpacing: -0.3,
            fontFamily: '-apple-system, system-ui',
          }}
        >
          一起听歌
        </span>
        <div style={{ flex: 1 }} />
        <PillButton dark={dark} onClick={() => setShowPlaylist(!showPlaylist)}>
          <span style={{ fontSize: 12, color: c.sub }}>{showPlaylist ? '播放器' : '播放列表'}</span>
          <span style={{ fontSize: 10, color: c.muted }}>{playlist.length}</span>
        </PillButton>
      </div>

      {showPlaylist ? (
        /* Playlist view */
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          {/* Add song input */}
          <Glass dark={dark} radius={14} intensity="light" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 14px' }}>
              <input
                value={addInput}
                onChange={(e) => setAddInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSong()}
                placeholder="添加歌曲 (歌名 - 歌手)"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  color: c.text,
                  padding: '8px 0',
                  fontFamily: '-apple-system, system-ui',
                }}
              />
              <div
                onClick={addSong}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Glass>
          {/* Song list */}
          {playlist.map((s, i) => (
            <Glass
              key={i}
              dark={dark}
              radius={14}
              intensity="light"
              onClick={() => {
                setCurrentIdx(i);
                setProgress(0);
                setShowPlaylist(false);
              }}
              style={{ marginBottom: 6 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}88 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i === currentIdx && playing ? (
                    <WaveBars dark={true} playing={true} count={3} height={14} color="rgba(255,255,255,0.8)" />
                  ) : (
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>♪</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: i === currentIdx ? 600 : 400,
                      color: i === currentIdx ? c.accent : c.text,
                      letterSpacing: -0.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 1 }}>{s.artist}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: c.muted }}>{s.duration}</div>
                  <div style={{ fontSize: 10, color: c.muted, marginTop: 1 }}>{s.addedBy}</div>
                </div>
              </div>
            </Glass>
          ))}
          <div style={{ height: 20 }} />
        </div>
      ) : (
        /* Player view */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px' }}>
          {/* Album art */}
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: 22,
              marginBottom: 24,
              marginTop: 8,
              background: `linear-gradient(135deg, ${song.color} 0%, ${song.color}88 60%, ${song.color}44 100%)`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 12px 40px ${dark ? song.color + '44' : song.color + '33'}`,
              animation: playing ? 'orbPulse 4s ease-in-out infinite' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 40, opacity: 0.8 }}>♪</span>
            </div>
          </div>

          {/* Track info */}
          <div style={{ textAlign: 'center', marginBottom: 16, width: '100%' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>{song.title}</div>
            <div style={{ fontSize: 14, color: c.sub, marginTop: 2 }}>
              {song.artist}
              {song.album ? ' · ' + song.album : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 8 }}>
              <NoeOrb size={14} dark={dark} />
              <span style={{ fontSize: 12, color: c.accent }}>和 Noé 一起听了 {elapsed}</span>
            </div>
          </div>

          {/* Scrolling lyrics */}
          <div
            style={{
              width: '100%',
              height: 60,
              marginBottom: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {currentLyric && (
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: c.text,
                  textAlign: 'center',
                  letterSpacing: -0.2,
                  transition: 'all 0.5s ease',
                }}
              >
                {currentLyric.text}
              </div>
            )}
            {nextLyric && (
              <div
                style={{
                  fontSize: 13,
                  color: c.muted,
                  textAlign: 'center',
                  marginTop: 4,
                  transition: 'all 0.5s ease',
                }}
              >
                {nextLyric.text}
              </div>
            )}
          </div>

          {/* Progress */}
          <div style={{ width: '100%', marginBottom: 22 }}>
            <div
              style={{
                height: 3,
                borderRadius: 1.5,
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 1.5,
                  width: `${progress * 100}%`,
                  background: song.color,
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: c.muted }}>
              <span>{formatTime(progress)}</span>
              <span>{song.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div onClick={prevTrack} style={{ cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={c.sub}>
                <path d="M19 20L9 12l10-8v16zM7 4H5v16h2V4z" />
              </svg>
            </div>
            <Glass dark={dark} radius={999} intensity="medium" onClick={() => setPlaying(!playing)}>
              <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={c.text}>
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={c.text}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </Glass>
            <div onClick={nextTrack} style={{ cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={c.sub}>
                <path d="M5 4l10 8-10 8V4zM17 4h2v16h-2V4z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
