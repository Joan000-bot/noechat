import React from 'react';
import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { PillButton } from '../components/PillButton';
import { BackBtn } from '../components/BackBtn';
import { usePersistentState } from '../lib/storage';

const SEED_MEMORIES = [
  { id: 1, title: '喜欢在雨天喝热可可', src: '5月3日', icon: '☕', color: '#D4A853' },
  { id: 2, title: '最喜欢的作家是村上春树', src: '4月20日', icon: '📖', color: '#6B9EC4' },
  { id: 3, title: '每天睡前读30分钟书', src: '4月15日', icon: '🌙', color: '#9B8ACE' },
  { id: 4, title: '对抽象艺术很感兴趣', src: '3月28日', icon: '🎨', color: '#C87B94' },
  { id: 5, title: '喜欢独自在海边散步', src: '3月15日', icon: '🌊', color: '#6BAFB2' },
];
const NEW_COLORS = ['#9B8ACE', '#6B9EC4', '#C87B94', '#D4A853', '#6BAFB2'];

// Memory — Noé's recall of facts about you. Persisted locally; add and remove
// entries.
export function MemoryScreen({ dark, onBack }) {
  const c = useColors(dark);
  const [items, setItems] = usePersistentState('noe_memories', SEED_MEMORIES);
  const [input, setInput] = React.useState('');

  const cats = [
    { label: '全部', count: items.length, active: true },
    { label: '对话', count: 68 },
    { label: '情感', count: 34 },
    { label: '知识', count: 24 },
  ];

  const addMemory = () => {
    if (!input.trim()) return;
    setItems((prev) => [
      {
        id: Date.now(),
        title: input.trim(),
        src: '今天',
        icon: '🧠',
        color: NEW_COLORS[prev.length % NEW_COLORS.length],
      },
      ...prev,
    ]);
    setInput('');
  };
  const removeMemory = (id) => setItems((prev) => prev.filter((m) => m.id !== id));

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
          记忆库
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflow: 'auto' }}>
          {cats.map((cat) => (
            <PillButton
              key={cat.label}
              dark={dark}
              style={{
                background: cat.active ? (dark ? 'rgba(184,164,240,0.12)' : 'rgba(124,92,191,0.06)') : undefined,
                border: cat.active ? `1px solid ${c.accent}33` : undefined,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: cat.active ? 600 : 400,
                  color: cat.active ? c.accent : c.sub,
                }}
              >
                {cat.label}
              </span>
              <span style={{ fontSize: 11, color: c.muted }}>{cat.count}</span>
            </PillButton>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          {items.map((m) => (
            <Glass key={m.id} dark={dark} radius={14} intensity="light" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    fontSize: 17,
                    flexShrink: 0,
                    background: dark ? `${m.color}15` : `${m.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {m.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.2, marginBottom: 2 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 11, color: c.muted }}>来自 {m.src} 的对话</div>
                </div>
                <div
                  onClick={() => removeMemory(m.id)}
                  title="删除"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: c.muted,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </Glass>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: c.muted }}>
              还没有记忆，写一条吧
            </div>
          )}
        </div>
        <div style={{ height: 12 }} />
      </div>

      {/* Add memory */}
      <div style={{ padding: '6px 16px 0' }}>
        <Glass dark={dark} radius={18} intensity="light">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 14px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMemory()}
              placeholder="记住一件关于我的事…"
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
              onClick={addMemory}
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
