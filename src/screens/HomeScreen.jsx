import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { WaveBars } from '../components/WaveBars';
import { SectionLabel } from '../components/SectionLabel';
import { NoeOrb } from '../components/NoeOrb';
import { PillButton } from '../components/PillButton';
import { Dot } from '../components/Dot';

// Home — card-grid entry point for every feature.
export function HomeScreen({ dark, onNavigate }) {
  const c = useColors(dark);

  const features = [
    { id: 'chathub', icon: '💬', label: 'Chats', sub: '3 条对话', color: '#9B8ACE' },
    { id: 'journal', icon: '📝', label: '日记', sub: '今日未记录', color: '#D4A853' },
    { id: 'dream', icon: '🌙', label: '梦境', sub: '2篇本周', color: '#9B8ACE' },
    { id: 'timeline', icon: '⏳', label: '时间线', sub: '38个节点', color: '#6B9EC4' },
    { id: 'memory', icon: '🧠', label: '记忆库', sub: '126条', color: '#C87B94' },
    { id: 'board', icon: '📌', label: '留言板', sub: '5条留言', color: '#6BAFB2' },
    { id: 'terminal', icon: '💻', label: '终端', sub: 'Terminal', color: '#4ADE80' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div
        style={{
          padding: '58px 18px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <PillButton dark={dark}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1 1h14M1 6h14M1 11h14" stroke={c.text} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </PillButton>
        <div onClick={() => onNavigate('settings')} style={{ cursor: 'pointer' }}>
          <NoeOrb size={32} dark={dark} />
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 0 0' }}>
        {/* Music mini-bar */}
        <div style={{ padding: '0 16px 10px' }}>
          <Glass
            dark={dark}
            radius={16}
            intensity="medium"
            onClick={() => onNavigate('music')}
            dispersion={true}
            tilt={true}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #9B8ACE 0%, #C87B94 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WaveBars dark={true} playing={true} count={4} height={16} color="rgba(255,255,255,0.7)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.text,
                    letterSpacing: -0.2,
                    fontFamily: '-apple-system, system-ui',
                  }}
                >
                  Clair de Lune
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: c.sub,
                    fontFamily: '-apple-system, system-ui',
                    marginTop: 1,
                  }}
                >
                  Debussy · Noe 也在听
                </div>
              </div>
              <WaveBars dark={dark} playing={true} count={3} height={14} />
            </div>
          </Glass>
        </div>

        {/* Feature grid */}
        <div style={{ padding: '6px 16px 0' }}>
          <SectionLabel dark={dark} style={{ marginBottom: 8 }}>
            探索
          </SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {features.map((f) => (
              <Glass key={f.id} dark={dark} radius={16} intensity="light" onClick={() => onNavigate(f.id)}>
                <div style={{ padding: '14px' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      fontSize: 17,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: dark ? `${f.color}18` : `${f.color}12`,
                      marginBottom: 10,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: c.text,
                      letterSpacing: -0.2,
                      fontFamily: '-apple-system, system-ui',
                    }}
                  >
                    {f.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: c.sub,
                      fontFamily: '-apple-system, system-ui',
                      marginTop: 2,
                    }}
                  >
                    {f.sub}
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </div>

        {/* Health summary */}
        <div style={{ padding: '10px 16px 0' }}>
          <Glass dark={dark} radius={16} intensity="light">
            <div style={{ padding: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.text,
                    fontFamily: '-apple-system, system-ui',
                    letterSpacing: -0.1,
                  }}
                >
                  健康状态
                </span>
                <span style={{ fontSize: 11, color: c.muted }}>今日</span>
              </div>
              <div style={{ display: 'flex', gap: 0 }}>
                {[
                  { label: '情绪', value: '😊', note: '平静' },
                  { label: '睡眠', value: '7.5h', note: '良好' },
                  { label: '活力', value: '85%', note: '充沛' },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 3 }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: c.muted }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Glass>
        </div>

        {/* Mailbox */}
        <div style={{ padding: '10px 16px' }}>
          <Glass dark={dark} radius={16} intensity="light">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: dark ? 'rgba(212,168,83,0.12)' : 'rgba(212,168,83,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}
              >
                📮
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.text,
                    letterSpacing: -0.2,
                    fontFamily: '-apple-system, system-ui',
                  }}
                >
                  信箱
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: c.sub,
                    marginTop: 1,
                    fontFamily: '-apple-system, system-ui',
                  }}
                >
                  Noe 给你写了一封信 · 2小时前
                </div>
              </div>
              <Dot color="#D4A853" size={7} />
            </div>
          </Glass>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}
