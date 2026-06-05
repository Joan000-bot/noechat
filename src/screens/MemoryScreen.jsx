import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { PillButton } from '../components/PillButton';
import { BackBtn } from '../components/BackBtn';

// Memory — Noé's recall of facts about you, filterable by category.
export function MemoryScreen({ dark, onBack }) {
  const c = useColors(dark);
  const cats = [
    { label: '全部', count: 126, active: true },
    { label: '对话', count: 68 },
    { label: '情感', count: 34 },
    { label: '知识', count: 24 },
  ];
  const items = [
    { title: '喜欢在雨天喝热可可', src: '5月3日', icon: '☕', color: '#D4A853' },
    { title: '最喜欢的作家是村上春树', src: '4月20日', icon: '📖', color: '#6B9EC4' },
    { title: '每天睡前读30分钟书', src: '4月15日', icon: '🌙', color: '#9B8ACE' },
    { title: '对抽象艺术很感兴趣', src: '3月28日', icon: '🎨', color: '#C87B94' },
    { title: '喜欢独自在海边散步', src: '3月15日', icon: '🌊', color: '#6BAFB2' },
  ];

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
          {items.map((m, i) => (
            <Glass key={i} dark={dark} radius={14} intensity="light" style={{ marginBottom: 8 }}>
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
              </div>
            </Glass>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
