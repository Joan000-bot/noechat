import React from 'react';
import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { NoeOrb } from '../components/NoeOrb';
import { BackBtn } from '../components/BackBtn';

// Message Board — staggered sticky notes between you and Noé; Noé auto-replies.
export function MessageBoardScreen({ dark, onBack }) {
  const c = useColors(dark);
  const [input, setInput] = React.useState('');
  const [notes, setNotes] = React.useState([
    { id: 1, text: '记得多喝水 🌊', author: 'Noé', time: '今天 09:00', color: '#9B8ACE' },
    { id: 2, text: '明天要去看牙医！', author: '你', time: '今天 08:30', color: '#6B9EC4' },
    { id: 3, text: '推荐你听 Ludovico Einaudi 的 Nuvole Bianche', author: 'Noé', time: '昨天', color: '#C87B94' },
    { id: 4, text: '今晚想吃火锅', author: '你', time: '昨天', color: '#D4A853' },
    { id: 5, text: '"生活就像一盒巧克力" —— 想和你分享这句话', author: 'Noé', time: '6月3日', color: '#6BAFB2' },
  ]);

  const addNote = () => {
    if (!input.trim()) return;
    const colors = ['#9B8ACE', '#6B9EC4', '#C87B94', '#D4A853', '#6BAFB2'];
    setNotes((prev) => [
      { id: Date.now(), text: input, author: '你', time: '刚刚', color: colors[Math.floor(Math.random() * 5)] },
      ...prev,
    ]);
    setInput('');
    setTimeout(() => {
      setNotes((prev) => [
        { id: Date.now() + 1, text: '收到～已贴在留言板上 📌', author: 'Noé', time: '刚刚', color: '#9B8ACE' },
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={dark} onClick={onBack} />
        <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3 }}>留言板</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {/* Notes grid — staggered sticky notes style */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {notes.map((note, i) => (
            <Glass
              key={note.id}
              dark={dark}
              radius={14}
              intensity="light"
              style={{
                width: i % 3 === 0 ? '100%' : 'calc(50% - 4px)',
                minHeight: 80,
              }}
            >
              <div style={{ padding: '12px 14px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 12,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: note.color,
                    boxShadow: `0 0 4px ${note.color}66`,
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: c.text,
                    letterSpacing: -0.1,
                    marginBottom: 8,
                    paddingRight: 14,
                    fontStyle: note.author === 'Noé' ? 'italic' : 'normal',
                  }}
                >
                  {note.text}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {note.author === 'Noé' && <NoeOrb size={10} dark={dark} />}
                  <span style={{ fontSize: 10, color: c.muted }}>
                    {note.author} · {note.time}
                  </span>
                </div>
              </div>
            </Glass>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>

      {/* Add note */}
      <div style={{ padding: '6px 16px 0' }}>
        <Glass dark={dark} radius={18} intensity="light">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 14px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNote()}
              placeholder="写一条留言..."
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
              onClick={addNote}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: input.trim() ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke={input.trim() ? c.text : c.muted}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}
