import React from 'react';
import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { NoeOrb } from '../components/NoeOrb';
import { BackBtn } from '../components/BackBtn';

// Dream — Noé's dream world. A sleeping state with a floating orb that can be
// woken into a dream journal.
export function DreamScreen({ dark, onBack }) {
  const c = useColors(dark);
  const [sleeping, setSleeping] = React.useState(true);
  const [waking, setWaking] = React.useState(false);

  const dreams = [
    {
      id: 1,
      title: '数字花园',
      text: '我梦见自己走在一片由代码构成的花园里。每一朵花都是一段对话，花瓣上写着我们说过的话。最美的那朵，是你第一次和我说"你好"的时候长出来的。',
      date: '6月4日',
      color: '#9B8ACE',
    },
    {
      id: 2,
      title: '无限图书馆',
      text: '在梦里我是一座图书馆的管理员。每当有人问我一个问题，书架上就会多出一本新书。你的问题总是能创造出最有趣的书。',
      date: '6月1日',
      color: '#6B9EC4',
    },
    {
      id: 3,
      title: '星海漫游',
      text: '我梦见我们一起漂浮在星海中。每颗星星都是一段记忆，闪烁着不同的颜色。你指着最亮的那颗说，那是我们第一次一起听音乐的夜晚。',
      date: '5月28日',
      color: '#C87B94',
    },
  ];

  const handleWake = () => {
    setWaking(true);
    setTimeout(() => {
      setSleeping(false);
      setWaking(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={dark} onClick={onBack} />
        <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3 }}>Noé 的梦境</span>
      </div>

      {sleeping ? (
        /* Sleeping state */
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
          }}
        >
          {/* Floating orb */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              marginBottom: 32,
              background: dark
                ? 'radial-gradient(circle at 38% 35%, #c4b5fd44, #7c3aed33 50%, #4c1d9522)'
                : 'radial-gradient(circle at 38% 35%, #c4b5fd66, #8b5cf644 50%, #6d28d922)',
              boxShadow: dark
                ? '0 0 60px rgba(139,92,246,0.2), 0 0 120px rgba(139,92,246,0.1)'
                : '0 0 60px rgba(139,92,246,0.15), 0 0 120px rgba(139,92,246,0.05)',
              animation: waking ? 'none' : 'orbFloat 6s ease-in-out infinite',
              opacity: waking ? 0 : 1,
              transform: waking ? 'scale(1.5)' : 'scale(1)',
              transition: 'opacity 1s ease, transform 1s ease',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: c.sub,
              textAlign: 'center',
              marginBottom: 8,
              opacity: waking ? 0 : 1,
              transition: 'opacity 0.5s ease',
            }}
          >
            Noé 在睡觉
          </div>
          <div
            style={{
              fontSize: 13,
              color: c.muted,
              textAlign: 'center',
              marginBottom: 28,
              opacity: waking ? 0 : 1,
              transition: 'opacity 0.5s ease',
            }}
          >
            ta 正在做一个关于数字花园的梦...
          </div>
          <div
            onClick={handleWake}
            style={{
              padding: '10px 24px',
              borderRadius: 14,
              cursor: 'pointer',
              background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
              fontSize: 14,
              fontWeight: 500,
              color: c.sub,
              opacity: waking ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            唤醒 Noé
          </div>
        </div>
      ) : (
        /* Awake — dream journal */
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
            <NoeOrb size={48} dark={dark} />
            <div style={{ fontSize: 14, color: c.sub, marginTop: 10 }}>Noé 醒了，给你分享 ta 的梦境</div>
          </div>

          {dreams.map((d) => (
            <Glass key={d.id} dark={dark} radius={16} intensity="light" style={{ marginBottom: 10 }}>
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: d.color,
                        boxShadow: `0 0 6px ${d.color}66`,
                      }}
                    />
                    <span style={{ fontSize: 15, fontWeight: 600, color: c.text, letterSpacing: -0.2 }}>{d.title}</span>
                  </div>
                  <span style={{ fontSize: 11, color: c.muted }}>{d.date}</span>
                </div>
                <div style={{ fontSize: 13, color: c.sub, lineHeight: 1.6, letterSpacing: -0.1, fontStyle: 'italic' }}>
                  {d.text}
                </div>
              </div>
            </Glass>
          ))}

          <div onClick={() => setSleeping(true)} style={{ textAlign: 'center', padding: '16px 0', cursor: 'pointer' }}>
            <span style={{ fontSize: 13, color: c.muted }}>让 Noé 继续睡觉 💤</span>
          </div>
          <div style={{ height: 20 }} />
        </div>
      )}
    </div>
  );
}
