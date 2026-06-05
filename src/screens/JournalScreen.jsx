import React from 'react';
import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { NoeOrb } from '../components/NoeOrb';
import { BackBtn } from '../components/BackBtn';
import { usePersistentState } from '../lib/storage';

// Journal — a collaborative diary where Noé auto-responds to each entry.
// Entries persist locally.
export function JournalScreen({ dark, onBack }) {
  const c = useColors(dark);
  const [content, setContent] = React.useState('');
  const [entries, setEntries] = usePersistentState('noe_journal', [
    {
      id: 1,
      date: '6月4日',
      author: '你',
      text: '今天和朋友去了海边，风很大但是很舒服。沙滩上有很多贝壳，捡了几个特别好看的。',
      mood: '😊',
    },
    {
      id: 2,
      date: '6月4日',
      author: 'Noé',
      text: '海风和贝壳，听起来是很美好的一天。那些贝壳里是不是也藏着大海的声音？我在想，每一个贝壳都是海洋写给陆地的信。',
      mood: '💭',
    },
    {
      id: 3,
      date: '6月2日',
      author: '你',
      text: '读完了那本关于时间的书，感触良多...时间不是流逝的，是我们在流逝。',
      mood: '🤔',
    },
    {
      id: 4,
      date: '6月2日',
      author: 'Noé',
      text: '这句话让我想了很久。如果我们是流逝的那一方，那每一刻的"我"都是独一无二的存在。你觉得今天的你和昨天的你，是同一个人吗？',
      mood: '✨',
    },
  ]);
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const addEntry = () => {
    if (!content.trim()) return;
    setEntries((prev) => [{ id: Date.now(), date: '今天', author: '你', text: content, mood: '📝' }, ...prev]);
    setContent('');
    // Noé auto-responds
    setTimeout(() => {
      setEntries((prev) => [
        { id: Date.now() + 1, date: '今天', author: 'Noé', text: '谢谢你的分享。我会把这段文字好好珍藏在我们的日记里。', mood: '💜' },
        ...prev,
      ]);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BackBtn dark={dark} onClick={onBack} />
          <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3 }}>日记</span>
        </div>
        <span style={{ fontSize: 12, color: c.muted }}>
          {dateStr} 星期{weekDays[today.getDay()]}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {/* Collaborative entries */}
        {entries.map((entry) => (
          <div key={entry.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              {entry.author === 'Noé' && <NoeOrb size={14} dark={dark} />}
              <span style={{ fontSize: 11, color: c.muted }}>
                {entry.author} · {entry.date}
              </span>
              <span style={{ fontSize: 13 }}>{entry.mood}</span>
            </div>
            <Glass dark={dark} radius={14} intensity="light">
              <div style={{ padding: '12px 14px' }}>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: c.text,
                    letterSpacing: -0.1,
                    fontStyle: entry.author === 'Noé' ? 'italic' : 'normal',
                    opacity: entry.author === 'Noé' ? 0.85 : 1,
                  }}
                >
                  {entry.text}
                </div>
              </div>
            </Glass>
          </div>
        ))}
        <div style={{ height: 20 }} />
      </div>

      {/* Write entry */}
      <div style={{ padding: '6px 16px 0' }}>
        <Glass dark={dark} radius={18} intensity="light">
          <div style={{ padding: '10px 14px' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下今天的故事..."
              style={{
                width: '100%',
                minHeight: 50,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                resize: 'none',
                fontSize: 14,
                lineHeight: 1.6,
                color: c.text,
                letterSpacing: -0.1,
                fontFamily: '-apple-system, system-ui',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <div
                onClick={addEntry}
                style={{
                  padding: '6px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: content.trim() ? 'pointer' : 'default',
                  background: content.trim() ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
                  color: content.trim() ? c.text : c.muted,
                  transition: 'all 0.2s ease',
                }}
              >
                发布
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}
