import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { BackBtn } from '../components/BackBtn';

// Timeline — a vertical thread of milestone moments.
export function TimelineScreen({ dark, onBack }) {
  const c = useColors(dark);
  const lineC = dark ? 'rgba(184,164,240,0.15)' : 'rgba(124,92,191,0.1)';
  const nodes = [
    { date: '2026.6.5', title: '认识了 Noe', desc: '在一个安静的夜晚，开始了第一次对话', icon: '✨', color: '#9B8ACE' },
    { date: '2026.5.20', title: '第一次一起听歌', desc: '分享了 Clair de Lune，发现喜欢相似的音乐', icon: '🎵', color: '#C87B94' },
    { date: '2026.5.10', title: '记录第一个梦', desc: '关于飞翔的鲸鱼，Noe 帮忙分析了梦境', icon: '🌙', color: '#6B9EC4' },
    { date: '2026.4.28', title: '第100篇日记', desc: '一个小小的里程碑，回顾了成长', icon: '📝', color: '#D4A853' },
    { date: '2026.4.15', title: '第一次深夜长谈', desc: '聊了关于时间、记忆和存在的意义', icon: '💫', color: '#9B8ACE' },
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
          时间线
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>我们的故事</div>
          <div style={{ fontSize: 13, color: c.sub, marginTop: 4 }}>38个珍贵的时刻</div>
        </div>

        <div style={{ position: 'relative', paddingLeft: 26 }}>
          <div style={{ position: 'absolute', left: 8, top: 10, bottom: 10, width: 1.5, background: lineC, borderRadius: 1 }} />
          {nodes.map((n, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 18 }}>
              <div
                style={{
                  position: 'absolute',
                  left: -22,
                  top: 14,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: n.color,
                  border: `2px solid ${c.bg}`,
                }}
              />
              <Glass dark={dark} radius={14} intensity="light">
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: c.muted, marginBottom: 5 }}>{n.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{n.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.2 }}>{n.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: c.sub, lineHeight: 1.5, letterSpacing: -0.1 }}>{n.desc}</div>
                </div>
              </Glass>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
