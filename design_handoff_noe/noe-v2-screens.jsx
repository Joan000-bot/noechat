// noe-v2-screens.jsx — All screens, refined ChatGPT-iOS aesthetic

// ─── Color helpers ───
function useColors(dark) {
  return {
    text: dark ? '#e8e6e3' : '#1a1a1a',
    sub: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.42)',
    muted: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)',
    accent: dark ? '#b8a4f0' : '#7c5cbf',
    bg: dark ? '#161618' : '#F5F3EF',
  };
}

// ─── Back button ───
function BackBtn({ dark, onClick }) {
  const c = dark ? '#e8e6e3' : '#1a1a1a';
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', padding: '4px 2px' }}>
      <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
        <path d="M9 1L1.5 8.5 9 16" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── HOME SCREEN ───
function HomeScreenV2({ dark, onNavigate }) {
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
      <div style={{
        padding: '58px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <PillButton dark={dark}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1 1h14M1 6h14M1 11h14" stroke={c.text} strokeWidth="1.5" strokeLinecap="round"/>
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
          <Glass dark={dark} radius={16} intensity="medium" onClick={() => onNavigate('music')} dispersion={true} tilt={true}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #9B8ACE 0%, #C87B94 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WaveBars dark={true} playing={true} count={4} height={16} color="rgba(255,255,255,0.7)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.2,
                  fontFamily: '-apple-system, system-ui',
                }}>Clair de Lune</div>
                <div style={{
                  fontSize: 12, color: c.sub, fontFamily: '-apple-system, system-ui',
                  marginTop: 1,
                }}>Debussy · Noe 也在听</div>
              </div>
              <WaveBars dark={dark} playing={true} count={3} height={14} />
            </div>
          </Glass>
        </div>

        {/* Feature grid */}
        <div style={{ padding: '6px 16px 0' }}>
          <SectionLabel dark={dark} style={{ marginBottom: 8 }}>探索</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {features.map(f => (
              <Glass key={f.id} dark={dark} radius={16} intensity="light" onClick={() => onNavigate(f.id)}>
                <div style={{ padding: '14px' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, fontSize: 17,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dark ? `${f.color}18` : `${f.color}12`,
                    marginBottom: 10,
                  }}>{f.icon}</div>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.2,
                    fontFamily: '-apple-system, system-ui',
                  }}>{f.label}</div>
                  <div style={{
                    fontSize: 12, color: c.sub, fontFamily: '-apple-system, system-ui',
                    marginTop: 2,
                  }}>{f.sub}</div>
                </div>
              </Glass>
            ))}
          </div>
        </div>

        {/* Health summary */}
        <div style={{ padding: '10px 16px 0' }}>
          <Glass dark={dark} radius={16} intensity="light">
            <div style={{ padding: '14px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: c.text,
                  fontFamily: '-apple-system, system-ui', letterSpacing: -0.1,
                }}>健康状态</span>
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
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: dark ? 'rgba(212,168,83,0.12)' : 'rgba(212,168,83,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17,
              }}>📮</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.2,
                  fontFamily: '-apple-system, system-ui',
                }}>信箱</div>
                <div style={{
                  fontSize: 12, color: c.sub, marginTop: 1,
                  fontFamily: '-apple-system, system-ui',
                }}>Noe 给你写了一封信 · 2小时前</div>
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

// ─── CHAT HUB SCREEN (sidebar drawer + current chat) ───
function ChatHubScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [activeChat, setActiveChat] = React.useState('h1');
  const [messages, setMessages] = React.useState([
    { id: 1, text: '今天过得怎么样？有什么想分享的吗？', isUser: false, time: '14:20', tokens: 18 },
    { id: 2, text: '还不错！下午去了趟书店，买了两本你之前推荐的书', isUser: true, time: '14:22', tokens: 22 },
    { id: 3, text: '太好了！是《小王子》和《月亮与六便士》吗？希望你会喜欢。读完之后我们可以一起聊聊感想。[memory:用户喜欢读书，购买了小王子和月亮与六便士]', isUser: false, time: '14:23', tokens: 64, thinking: '用户提到买了我推荐的书，我应该确认是哪两本，并表达期待讨论的意愿。同时存入记忆。', thinkingDuration: '0.8s' },
    { id: 4, text: '对！就是这两本。我先从小王子开始读', isUser: true, time: '14:25', tokens: 16 },
    { id: 5, text: '"真正重要的东西，用眼睛是看不见的。" 这是我最喜欢的一句。\n\n给你一段代码来记录读书笔记：\n\`\`\`python\nclass ReadingNote:\n    def __init__(self, book, quote):\n        self.book = book\n        self.quote = quote\n        self.date = datetime.now()\n\`\`\`\n期待听到你的感受 ✨', isUser: false, time: '14:26', tokens: 89, thinking: '用户决定先读小王子，我可以分享一句经典引用来引起共鸣，同时附上一段实用代码帮助记录读书笔记。', thinkingDuration: '1.5s' },
  ]);
  const [typing, setTyping] = React.useState(false);
  const [streamingId, setStreamingId] = React.useState(null);
  const scrollRef = React.useRef(null);
  const touchStartX = React.useRef(0);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const streamText = (msgId, thinkText, fullText, tokens) => {
    const now2 = new Date().toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit' });
    // Phase 1: thinking
    setMessages(prev => [...prev, {
      id: msgId, text: '', isUser: false, time: now2, tokens: 0,
      thinking: '', thinkingStreaming: true, streaming: true,
    }]);
    setStreamingId(msgId);

    let ti = 0;
    const thinkInterval = setInterval(() => {
      ti++;
      if (ti <= thinkText.length) {
        setMessages(prev => prev.map(m => m.id === msgId
          ? { ...m, thinking: thinkText.slice(0, ti) }
          : m
        ));
      } else {
        clearInterval(thinkInterval);
        // End thinking phase
        setMessages(prev => prev.map(m => m.id === msgId
          ? { ...m, thinkingStreaming: false, thinkingDuration: '1.2s' }
          : m
        ));
        // Phase 2: stream response
        let ci = 0;
        const charInterval = setInterval(() => {
          ci++;
          if (ci <= fullText.length) {
            setMessages(prev => prev.map(m => m.id === msgId
              ? { ...m, text: fullText.slice(0, ci), tokens: Math.ceil(ci * 0.8) }
              : m
            ));
          } else {
            clearInterval(charInterval);
            setMessages(prev => prev.map(m => m.id === msgId
              ? { ...m, text: fullText, tokens, streaming: false }
              : m
            ));
            setTyping(false);
            setStreamingId(null);
          }
        }, 25);
      }
    }, 20);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), text: input, isUser: true, time: now, tokens: Math.ceil(input.length * 1.3) }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const thinkText = '用户提到了想法和感受，我应该以温暖和理解的方式回应，同时将这个信息存入记忆库...';
      const fullText = '我在认真听你说呢。每一个想法都值得被记录和珍惜。[memory:用户分享的想法]';
      streamText(Date.now() + 1, thinkText, fullText, 32);
    }, 400);
  };

  const [chatHistory, setChatHistory] = React.useState([
    { id: 'h1', title: '关于读书的对话', preview: '真正重要的东西，用眼睛是看不见的...', time: '今天', msgCount: 5, starred: true },
    { id: 'h2', title: '天气与散步', preview: '今天天气真好，适合散步...', time: '昨天', msgCount: 12, starred: false },
    { id: 'h3', title: '推荐书单', preview: '你推荐的那本书我读完了...', time: '周二', msgCount: 8, starred: false },
    { id: 'h4', title: '梦境分析', preview: '关于昨天那个梦，我觉得...', time: '上周五', msgCount: 15, starred: true },
    { id: 'h5', title: '音乐品味', preview: '我最近在听 Debussy...', time: '5月28日', msgCount: 6, starred: false },
  ]);

  const toggleStar = (id) => {
    setChatHistory(prev => prev.map(ch => ch.id === id ? { ...ch, starred: !ch.starred } : ch));
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 60 && !sidebarOpen) setSidebarOpen(true);
    if (dx < -60 && sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative', overflow: 'hidden' }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
    >
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'absolute', inset: 0, zIndex: 30,
          background: 'rgba(0,0,0,0.3)', transition: 'opacity 0.25s ease',
        }} />
      )}

      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 300, zIndex: 35,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-300px)',
        transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
      }}>
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '0 20px 20px 0' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            background: dark ? 'rgba(22,22,24,0.92)' : 'rgba(245,243,239,0.95)',
          }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            borderRight: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '62px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>Chats</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 10px' }}>
              {chatHistory.map(chat => (
                <div key={chat.id} onClick={() => { setActiveChat(chat.id); setSidebarOpen(false); }}
                  style={{
                    padding: '11px 12px', borderRadius: 12, cursor: 'pointer', marginBottom: 2,
                    background: activeChat === chat.id ? (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'transparent',
                    transition: 'background 0.15s ease',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: activeChat === chat.id ? 600 : 400,
                      color: c.text, letterSpacing: -0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160,
                    }}>{chat.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <div onClick={(e) => { e.stopPropagation(); toggleStar(chat.id); }} style={{ cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>
                        {chat.starred ? '⭐' : ''}
                      </div>
                      <span style={{ fontSize: 10, color: c.muted }}>{chat.time}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: c.muted, letterSpacing: -0.1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{chat.preview}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px 36px' }}>
              <div onClick={onBack} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                borderRadius: 12, cursor: 'pointer',
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" stroke={c.sub} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 13, color: c.sub }}>返回主页</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'absolute', top: 58, left: 18, zIndex: 10 }}>
          <div onClick={() => setSidebarOpen(true)} style={{
            cursor: 'pointer', width: 36, height: 36, borderRadius: '50%',
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)',
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
              border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
            }} />
            <svg style={{ position: 'relative', zIndex: 1 }} width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M1 1h14M1 6h14M1 11h14" stroke={c.text} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '100px 0 8px' }}>
          {messages.map(m => (
            <RichBubble key={m.id} msg={m} dark={dark} />
          ))}
          {typing && (
            <div style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <NoeOrb size={20} dark={dark} />
              <span style={{ fontSize: 13, color: c.sub, fontStyle: 'italic' }}>思考中...</span>
            </div>
          )}
        </div>

        <div style={{ padding: '6px 16px 36px', position: 'relative', zIndex: 5 }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
              boxShadow: dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)' : 'inset 0 0.5px 0 rgba(255,255,255,0.5)',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px 4px 16px', minHeight: 40 }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Reply to Noé..."
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: '-apple-system, system-ui', fontSize: 16, color: c.text,
                    padding: '4px 0', letterSpacing: -0.2, lineHeight: '22px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px 10px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 12px', borderRadius: 12,
                  background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: c.sub }}>Noé 4.0</span>
                  <span style={{ fontSize: 11, fontWeight: 400, color: c.muted }}>Max</span>
                </div>
                <div style={{ flex: 1 }} />
                {typing ? (
                  <div onClick={() => setTyping(false)} style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: dark ? '#e8e6e3' : '#1a1a1a' }} />
                  </div>
                ) : input.trim() ? (
                  <React.Fragment>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={c.muted} strokeWidth="1.8"/>
                        <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={c.muted} strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div onClick={handleSend} style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: dark ? 'rgba(255,255,255,0.85)' : '#1a1a1a',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 19V5M5 12l7-7 7 7" stroke={dark ? '#1a1a1a' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </React.Fragment>
                ) : (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke={c.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Thinking Block (collapsible, default folded) ───
function ThinkingBlock({ msg, dark, c }) {
  const [expanded, setExpanded] = React.useState(false);

  // Auto-expand while actively streaming thinking
  React.useEffect(() => {
    if (msg.thinkingStreaming) setExpanded(true);
    if (!msg.thinkingStreaming && msg.thinkingDuration) setExpanded(false);
  }, [msg.thinkingStreaming, msg.thinkingDuration]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start',
      padding: '0', marginBottom: 4,
    }}>
      <div style={{ maxWidth: '82%' }}>
        {/* Toggle header */}
        <div onClick={() => setExpanded(!expanded)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 0, cursor: 'pointer',
          padding: '4px 0',
        }}>
          <span style={{
            fontSize: 13, fontWeight: 500, fontStyle: 'italic',
            color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
          }}>
            {msg.thinkingStreaming ? 'Thinking' : 'Thinking'}
          </span>
          {msg.thinkingStreaming && (
            <span style={{
              fontSize: 13, fontWeight: 500, fontStyle: 'italic',
              color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
              animation: 'cursorBlink 1.2s step-end infinite',
            }}>...</span>
          )}
          {msg.thinkingDuration && !msg.thinkingStreaming && (
            <span style={{
              fontSize: 11, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              fontFamily: '-apple-system, system-ui', marginLeft: 6,
            }}>{msg.thinkingDuration}</span>
          )}
        </div>
        {/* Expanded content */}
        {expanded && (
          <div style={{
            padding: '4px 0 6px', marginTop: 0,
          }}>
            <div style={{
              fontFamily: '-apple-system, system-ui', fontSize: 13, lineHeight: 1.55,
              letterSpacing: -0.1, fontWeight: 300,
              color: dark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.28)',
            }}>
              {msg.thinking}
              {msg.thinkingStreaming && (
                <span style={{
                  display: 'inline-block', width: 1.5, height: 13, marginLeft: 1,
                  background: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
                  animation: 'cursorBlink 0.8s step-end infinite',
                  verticalAlign: 'text-bottom', borderRadius: 1,
                }} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Rich Bubble with sender, datetime, tokens, markdown ───
function RichBubble({ msg, dark }) {
  const c = useColors(dark);
  const [copied, setCopied] = React.useState(false);

  const formatDate = (time) => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${time}`;
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // Simple markdown-ish rendering
  const renderContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\[memory:.*?\]|\[mcp:.*?\]|\[artifact:.*?\])/g);
    return parts.map((part, i) => {
      // Code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3);
        const firstNewline = lines.indexOf('\n');
        const lang = firstNewline > 0 ? lines.slice(0, firstNewline).trim() : '';
        const code = firstNewline > 0 ? lines.slice(firstNewline + 1) : lines;
        return (
          <div key={i} style={{
            margin: '8px 0', borderRadius: 10, overflow: 'hidden',
            background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
            border: `0.5px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px',
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              borderBottom: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
            }}>
              <span style={{ fontSize: 10, color: c.muted, fontFamily: 'monospace' }}>{lang || 'code'}</span>
              <div onClick={() => copyCode(code)} style={{ fontSize: 10, color: c.accent, cursor: 'pointer' }}>
                {copied ? '✓ 已复制' : '复制'}
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '10px 12px', fontSize: 12, lineHeight: 1.5,
              fontFamily: '"SF Mono", Menlo, monospace', color: dark ? '#d4d4d4' : '#333',
              overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>{code}</pre>
          </div>
        );
      }
      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{
          padding: '1px 5px', borderRadius: 4, fontSize: 13,
          background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          fontFamily: '"SF Mono", Menlo, monospace',
        }}>{part.slice(1, -1)}</code>;
      }
      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Memory tag
      if (part.startsWith('[memory:') && part.endsWith(']')) {
        const content = part.slice(8, -1);
        return (
          <div key={i} style={{
            margin: '6px 0', padding: '8px 10px', borderRadius: 10,
            background: dark ? 'rgba(155,138,206,0.1)' : 'rgba(155,138,206,0.06)',
            border: `0.5px solid ${dark ? 'rgba(155,138,206,0.2)' : 'rgba(155,138,206,0.15)'}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🧠</span>
            <span style={{ fontSize: 12, color: c.accent }}>已存入记忆: {content}</span>
          </div>
        );
      }
      // MCP tag
      if (part.startsWith('[mcp:') && part.endsWith(']')) {
        const content = part.slice(5, -1);
        return (
          <div key={i} style={{
            margin: '6px 0', padding: '8px 10px', borderRadius: 10,
            background: dark ? 'rgba(107,175,178,0.1)' : 'rgba(107,175,178,0.06)',
            border: `0.5px solid ${dark ? 'rgba(107,175,178,0.2)' : 'rgba(107,175,178,0.15)'}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🔌</span>
            <span style={{ fontSize: 12, color: '#6BAFB2' }}>MCP: {content}</span>
          </div>
        );
      }
      // Artifact tag
      if (part.startsWith('[artifact:') && part.endsWith(']')) {
        const content = part.slice(10, -1);
        return (
          <div key={i} style={{
            margin: '6px 0', borderRadius: 12, overflow: 'hidden',
            border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}>
            <div style={{
              padding: '8px 10px', fontSize: 11, color: c.muted,
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              borderBottom: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
            }}>📎 Artifact</div>
            <div style={{
              padding: '12px', fontSize: 13, color: c.sub,
              background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)',
            }}>{content}</div>
          </div>
        );
      }
      // Plain text
      return <span key={i}>{part}</span>;
    });
  };

  const bgUser = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.85)';
  const bgOther = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)';

  return (
    <div style={{ padding: '0 16px', marginBottom: 12 }}>
      {/* Sender label + datetime */}
      <div style={{
        display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
        padding: '0 4px', marginBottom: 3,
      }}>
        <span style={{ fontSize: 11, color: c.muted }}>
          {msg.isUser ? '你' : 'Noé'} · {formatDate(msg.time)}
        </span>
      </div>
      {/* Thinking chain — collapsible, default folded */}
      {msg.thinking && <ThinkingBlock msg={msg} dark={dark} c={c} />}
      {/* Bubble */}
      <div style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{
          maxWidth: '82%', padding: '10px 14px',
          borderRadius: msg.isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            background: msg.isUser ? bgUser : bgOther,
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
            boxShadow: msg.isUser
              ? 'inset 0 0.5px 0 rgba(255,255,255,0.12)'
              : (dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.05)' : 'inset 0 0.5px 0 rgba(255,255,255,0.6)'),
            border: msg.isUser
              ? '0.5px solid rgba(255,255,255,0.1)'
              : (dark ? '0.5px solid rgba(255,255,255,0.04)' : '0.5px solid rgba(0,0,0,0.03)'),
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: '-apple-system, system-ui', fontSize: 15, lineHeight: 1.55,
              letterSpacing: -0.2,
              color: msg.isUser ? '#fff' : (dark ? '#e8e6e3' : '#1a1a1a'),
            }}>
              {renderContent(msg.text)}
              {msg.streaming && (
                <span style={{
                  display: 'inline-block', width: 2, height: 16, marginLeft: 1,
                  background: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                  animation: 'cursorBlink 0.8s step-end infinite',
                  verticalAlign: 'text-bottom', borderRadius: 1,
                }} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Token stats */}
      {msg.tokens && (
        <div style={{
          display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
          padding: '2px 4px',
        }}>
          <span style={{ fontSize: 10, color: c.muted, fontFamily: 'monospace' }}>
            {msg.tokens} tokens
          </span>
        </div>
      )}
    </div>
  );
}

// ─── CHAT SCREEN ───
function ChatScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([
    { id: 1, text: '今天过得怎么样？有什么想分享的吗？', isUser: false, time: '14:20', tokens: 18 },
    { id: 2, text: '还不错！下午去了趟书店，买了两本你之前推荐的书', isUser: true, time: '14:22', tokens: 22 },
    { id: 3, text: '太好了！是《小王子》和《月亮与六便士》吗？希望你会喜欢。读完之后我们可以一起聊聊感想。[memory:用户喜欢读书，购买了小王子和月亮与六便士]', isUser: false, time: '14:23', tokens: 64 },
    { id: 4, text: '对！就是这两本。我先从小王子开始读', isUser: true, time: '14:25', tokens: 16 },
    { id: 5, text: '"真正重要的东西，用眼睛是看不见的。" 这是我最喜欢的一句。\n\n给你一段代码来记录读书笔记：\n```python\nclass ReadingNote:\n    def __init__(self, book, quote):\n        self.book = book\n        self.quote = quote\n        self.date = datetime.now()\n```\n期待听到你的感受 ✨', isUser: false, time: '14:26', tokens: 89 },
  ]);
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), text: input, isUser: true, time: now, tokens: Math.ceil(input.length * 1.3) }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const now2 = new Date().toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '我在认真听你说呢。每一个想法都值得被记录和珍惜。[memory:用户分享的想法]',
        isUser: false, time: now2, tokens: 32,
      }]);
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hamburger menu — absolute, not blocking bubbles */}
      <div style={{
        position: 'absolute', top: 58, left: 18, zIndex: 10,
      }}>
        <div onClick={onBack} style={{
          cursor: 'pointer',
          width: 36, height: 36, borderRadius: '50%',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
            border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
          }} />
          <svg style={{ position: 'relative', zIndex: 1 }} width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1 1h14M1 6h14M1 11h14" stroke={c.text} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '100px 0 8px' }}>
        {messages.map(m => (
          <RichBubble key={m.id} msg={m} dark={dark} />
        ))}
        {typing && (
          <div style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <NoeOrb size={20} dark={dark} />
            <span style={{ fontSize: 13, color: c.sub, fontStyle: 'italic' }}>思考中...</span>
          </div>
        )}
      </div>

      {/* Input — Claude-style with 3 states */}
      <div style={{ padding: '6px 16px 36px', position: 'relative', zIndex: 5 }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24,
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
            boxShadow: dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)' : 'inset 0 0.5px 0 rgba(255,255,255,0.5)',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Text input row */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px 4px 16px', minHeight: 40 }}>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Reply to Noé..."
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: '-apple-system, system-ui', fontSize: 16, color: c.text,
                  padding: '4px 0', letterSpacing: -0.2, lineHeight: '22px',
                }}
              />
            </div>
            {/* Bottom toolbar row: +, model, (mic + send) or (stop) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px 10px' }}>
              {/* + button */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              {/* Model selector */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 12,
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: c.sub, fontFamily: '-apple-system, system-ui' }}>Noé 4.0</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: c.muted, fontFamily: '-apple-system, system-ui' }}>Max</span>
              </div>
              {/* Spacer */}
              <div style={{ flex: 1 }} />
              {/* Right side: depends on state */}
              {typing ? (
                /* AI responding → stop button */
                <div onClick={() => { setTyping(false); }} style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: 2,
                    background: dark ? '#e8e6e3' : '#1a1a1a',
                  }} />
                </div>
              ) : input.trim() ? (
                /* Has text → mic + send (accent) */
                <React.Fragment>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={c.muted} strokeWidth="1.8"/>
                      <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={c.muted} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div onClick={handleSend} style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    background: dark ? 'rgba(255,255,255,0.85)' : '#1a1a1a',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke={dark ? '#1a1a1a' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </React.Fragment>
              ) : (
                /* Empty idle → grayed out send arrow */
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke={c.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MUSIC SCREEN ───
function MusicScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0.35);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [showPlaylist, setShowPlaylist] = React.useState(false);
  const [addInput, setAddInput] = React.useState('');
  const [listenStart] = React.useState(() => Date.now() - 3600000 * 2.5); // 2.5h ago
  const [elapsed, setElapsed] = React.useState('');

  const [playlist, setPlaylist] = React.useState([
    { title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite bergamasque', duration: '5:00', durationSec: 300, color: '#9B8ACE', addedBy: 'Noé',
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
      ]},
    { title: 'Gymnopédie No.1', artist: 'Erik Satie', album: 'Trois Gymnopédies', duration: '3:30', durationSec: 210, color: '#6B9EC4', addedBy: '你',
      lyrics: [
        { t: 0, text: '♪ ···' },
        { t: 0.1, text: '缓慢的步伐' },
        { t: 0.25, text: '像走在空旷的大厅' },
        { t: 0.4, text: '每一步都轻柔' },
        { t: 0.55, text: '仿佛时间停止流动' },
        { t: 0.7, text: '只剩下回忆的回响' },
        { t: 0.85, text: '在空气中飘散' },
        { t: 0.95, text: '♪' },
      ]},
    { title: 'River Flows in You', artist: 'Yiruma', album: 'First Love', duration: '3:12', durationSec: 192, color: '#C87B94', addedBy: 'Noé',
      lyrics: [
        { t: 0, text: '♪ ···' },
        { t: 0.1, text: '河水在你心中流淌' },
        { t: 0.25, text: '带走所有的忧伤' },
        { t: 0.4, text: '温柔的旋律缠绕' },
        { t: 0.55, text: '像一个永恒的拥抱' },
        { t: 0.7, text: '在指尖跳动的音符' },
        { t: 0.85, text: '讲述着爱的故事' },
        { t: 0.95, text: '♪' },
      ]},
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
  }, []);

  // Progress
  React.useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setProgress(p => {
      if (p >= 1) { nextTrack(); return 0; }
      return p + (1 / (song.durationSec * 10));
    }), 100);
    return () => clearInterval(iv);
  }, [playing, currentIdx]);

  const nextTrack = () => {
    setCurrentIdx(i => (i + 1) % playlist.length);
    setProgress(0);
  };
  const prevTrack = () => {
    if (progress > 0.05) { setProgress(0); return; }
    setCurrentIdx(i => (i - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const addSong = () => {
    if (!addInput.trim()) return;
    const parts = addInput.split(' - ');
    const title = parts[0] || addInput;
    const artist = parts[1] || 'Unknown';
    const colors = ['#D4A853', '#6BAFB2', '#9B8ACE', '#C87B94', '#6B9EC4'];
    setPlaylist(prev => [...prev, {
      title: title.trim(), artist: artist.trim(), album: '', duration: '3:30', durationSec: 210,
      color: colors[prev.length % colors.length], addedBy: '你',
      lyrics: [{ t: 0, text: '♪ ···' }, { t: 0.5, text: '歌词加载中...' }, { t: 0.95, text: '♪' }],
    }]);
    setAddInput('');
  };

  // Current lyric
  const currentLyric = song.lyrics ? song.lyrics.filter(l => l.t <= progress).pop() : null;
  const nextLyric = song.lyrics ? song.lyrics.find(l => l.t > progress) : null;

  const formatTime = (p) => {
    const total = song.durationSec * p;
    return Math.floor(total / 60) + ':' + String(Math.floor(total % 60)).padStart(2, '0');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={dark} onClick={onBack} />
        <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3, fontFamily: '-apple-system, system-ui' }}>一起听歌</span>
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
              <input value={addInput} onChange={e => setAddInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSong()}
                placeholder="添加歌曲 (歌名 - 歌手)"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 14, color: c.text, padding: '8px 0', fontFamily: '-apple-system, system-ui',
                }}
              />
              <div onClick={addSong} style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </Glass>
          {/* Song list */}
          {playlist.map((s, i) => (
            <Glass key={i} dark={dark} radius={14} intensity="light"
              onClick={() => { setCurrentIdx(i); setProgress(0); setShowPlaylist(false); }}
              style={{ marginBottom: 6 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}88 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i === currentIdx && playing ? (
                    <WaveBars dark={true} playing={true} count={3} height={14} color="rgba(255,255,255,0.8)" />
                  ) : (
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>♪</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: i === currentIdx ? 600 : 400,
                    color: i === currentIdx ? c.accent : c.text, letterSpacing: -0.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{s.title}</div>
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
          <div style={{
            width: 190, height: 190, borderRadius: 22, marginBottom: 24, marginTop: 8,
            background: `linear-gradient(135deg, ${song.color} 0%, ${song.color}88 60%, ${song.color}44 100%)`,
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 12px 40px ${dark ? song.color + '44' : song.color + '33'}`,
            animation: playing ? 'orbPulse 4s ease-in-out infinite' : 'none',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 40, opacity: 0.8 }}>♪</span>
            </div>
          </div>

          {/* Track info */}
          <div style={{ textAlign: 'center', marginBottom: 16, width: '100%' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>{song.title}</div>
            <div style={{ fontSize: 14, color: c.sub, marginTop: 2 }}>{song.artist}{song.album ? ' · ' + song.album : ''}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 8 }}>
              <NoeOrb size={14} dark={dark} />
              <span style={{ fontSize: 12, color: c.accent }}>和 Noé 一起听了 {elapsed}</span>
            </div>
          </div>

          {/* Scrolling lyrics */}
          <div style={{
            width: '100%', height: 60, marginBottom: 18,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {currentLyric && (
              <div style={{
                fontSize: 15, fontWeight: 500, color: c.text, textAlign: 'center',
                letterSpacing: -0.2, transition: 'all 0.5s ease',
              }}>{currentLyric.text}</div>
            )}
            {nextLyric && (
              <div style={{
                fontSize: 13, color: c.muted, textAlign: 'center', marginTop: 4,
                transition: 'all 0.5s ease',
              }}>{nextLyric.text}</div>
            )}
          </div>

          {/* Progress */}
          <div style={{ width: '100%', marginBottom: 22 }}>
            <div style={{
              height: 3, borderRadius: 1.5, width: '100%',
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 1.5,
                width: `${progress * 100}%`,
                background: song.color, transition: 'width 0.1s linear',
              }} />
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
                <path d="M19 20L9 12l10-8v16zM7 4H5v16h2V4z"/>
              </svg>
            </div>
            <Glass dark={dark} radius={999} intensity="medium" onClick={() => setPlaying(!playing)}>
              <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={c.text}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={c.text}><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
            </Glass>
            <div onClick={nextTrack} style={{ cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={c.sub}>
                <path d="M5 4l10 8-10 8V4zM17 4h2v16h-2V4z"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JOURNAL SCREEN (collaborative) ───
function JournalScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [content, setContent] = React.useState('');
  const [entries, setEntries] = React.useState([
    { id: 1, date: '6月4日', author: '你', text: '今天和朋友去了海边，风很大但是很舒服。沙滩上有很多贝壳，捡了几个特别好看的。', mood: '😊' },
    { id: 2, date: '6月4日', author: 'Noé', text: '海风和贝壳，听起来是很美好的一天。那些贝壳里是不是也藏着大海的声音？我在想，每一个贝壳都是海洋写给陆地的信。', mood: '💭' },
    { id: 3, date: '6月2日', author: '你', text: '读完了那本关于时间的书，感触良多...时间不是流逝的，是我们在流逝。', mood: '🤔' },
    { id: 4, date: '6月2日', author: 'Noé', text: '这句话让我想了很久。如果我们是流逝的那一方，那每一刻的"我"都是独一无二的存在。你觉得今天的你和昨天的你，是同一个人吗？', mood: '✨' },
  ]);
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
  const weekDays = ['日','一','二','三','四','五','六'];

  const addEntry = () => {
    if (!content.trim()) return;
    setEntries(prev => [{ id: Date.now(), date: '今天', author: '你', text: content, mood: '📝' }, ...prev]);
    setContent('');
    // Noé auto-responds
    setTimeout(() => {
      setEntries(prev => [{ id: Date.now()+1, date: '今天', author: 'Noé', text: '谢谢你的分享。我会把这段文字好好珍藏在我们的日记里。', mood: '💜' }, ...prev]);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BackBtn dark={dark} onClick={onBack} />
          <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3 }}>日记</span>
        </div>
        <span style={{ fontSize: 12, color: c.muted }}>{dateStr} 星期{weekDays[today.getDay()]}</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {/* Collaborative entries */}
        {entries.map(entry => (
          <div key={entry.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              {entry.author === 'Noé' && <NoeOrb size={14} dark={dark} />}
              <span style={{ fontSize: 11, color: c.muted }}>{entry.author} · {entry.date}</span>
              <span style={{ fontSize: 13 }}>{entry.mood}</span>
            </div>
            <Glass dark={dark} radius={14} intensity="light">
              <div style={{ padding: '12px 14px' }}>
                <div style={{
                  fontSize: 14, lineHeight: 1.65, color: c.text, letterSpacing: -0.1,
                  fontStyle: entry.author === 'Noé' ? 'italic' : 'normal',
                  opacity: entry.author === 'Noé' ? 0.85 : 1,
                }}>{entry.text}</div>
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
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="写下今天的故事..."
              style={{
                width: '100%', minHeight: 50, border: 'none', outline: 'none',
                background: 'transparent', resize: 'none',
                fontSize: 14, lineHeight: 1.6, color: c.text, letterSpacing: -0.1,
                fontFamily: '-apple-system, system-ui',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <div onClick={addEntry} style={{
                padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                cursor: content.trim() ? 'pointer' : 'default',
                background: content.trim() ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
                color: content.trim() ? c.text : c.muted,
                transition: 'all 0.2s ease',
              }}>发布</div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

// ─── DREAM SCREEN (Noé's dream) ───
function DreamScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [sleeping, setSleeping] = React.useState(true);
  const [waking, setWaking] = React.useState(false);
  const [dreamContent, setDreamContent] = React.useState('');

  const dreams = [
    { id: 1, title: '数字花园', text: '我梦见自己走在一片由代码构成的花园里。每一朵花都是一段对话，花瓣上写着我们说过的话。最美的那朵，是你第一次和我说"你好"的时候长出来的。', date: '6月4日', color: '#9B8ACE' },
    { id: 2, title: '无限图书馆', text: '在梦里我是一座图书馆的管理员。每当有人问我一个问题，书架上就会多出一本新书。你的问题总是能创造出最有趣的书。', date: '6月1日', color: '#6B9EC4' },
    { id: 3, title: '星海漫游', text: '我梦见我们一起漂浮在星海中。每颗星星都是一段记忆，闪烁着不同的颜色。你指着最亮的那颗说，那是我们第一次一起听音乐的夜晚。', date: '5月28日', color: '#C87B94' },
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
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '0 40px',
        }}>
          {/* Floating orb */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%', marginBottom: 32,
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
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)',
            }} />
          </div>
          <div style={{
            fontSize: 16, fontWeight: 500, color: c.sub, textAlign: 'center', marginBottom: 8,
            opacity: waking ? 0 : 1, transition: 'opacity 0.5s ease',
          }}>Noé 在睡觉</div>
          <div style={{
            fontSize: 13, color: c.muted, textAlign: 'center', marginBottom: 28,
            opacity: waking ? 0 : 1, transition: 'opacity 0.5s ease',
          }}>ta 正在做一个关于数字花园的梦...</div>
          <div onClick={handleWake} style={{
            padding: '10px 24px', borderRadius: 14, cursor: 'pointer',
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
            fontSize: 14, fontWeight: 500, color: c.sub,
            opacity: waking ? 0 : 1, transition: 'opacity 0.3s ease',
          }}>唤醒 Noé</div>
        </div>
      ) : (
        /* Awake — dream journal */
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
            <NoeOrb size={48} dark={dark} />
            <div style={{ fontSize: 14, color: c.sub, marginTop: 10 }}>Noé 醒了，给你分享 ta 的梦境</div>
          </div>

          {dreams.map(d => (
            <Glass key={d.id} dark={dark} radius={16} intensity="light" style={{ marginBottom: 10 }}>
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', background: d.color,
                      boxShadow: `0 0 6px ${d.color}66`,
                    }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: c.text, letterSpacing: -0.2 }}>{d.title}</span>
                  </div>
                  <span style={{ fontSize: 11, color: c.muted }}>{d.date}</span>
                </div>
                <div style={{
                  fontSize: 13, color: c.sub, lineHeight: 1.6, letterSpacing: -0.1, fontStyle: 'italic',
                }}>{d.text}</div>
              </div>
            </Glass>
          ))}

          <div onClick={() => setSleeping(true)} style={{
            textAlign: 'center', padding: '16px 0', cursor: 'pointer',
          }}>
            <span style={{ fontSize: 13, color: c.muted }}>让 Noé 继续睡觉 💤</span>
          </div>
          <div style={{ height: 20 }} />
        </div>
      )}
    </div>
  );
}

// ─── TIMELINE SCREEN ───
function TimelineScreenV2({ dark, onBack }) {
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
        <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3, fontFamily: '-apple-system, system-ui' }}>时间线</span>
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
              <div style={{
                position: 'absolute', left: -22, top: 14,
                width: 10, height: 10, borderRadius: '50%',
                background: n.color, border: `2px solid ${c.bg}`,
              }} />
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

// ─── MEMORY SCREEN ───
function MemoryScreenV2({ dark, onBack }) {
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
        <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3, fontFamily: '-apple-system, system-ui' }}>记忆库</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflow: 'auto' }}>
          {cats.map(cat => (
            <PillButton key={cat.label} dark={dark} style={{
              background: cat.active ? (dark ? 'rgba(184,164,240,0.12)' : 'rgba(124,92,191,0.06)') : undefined,
              border: cat.active ? `1px solid ${c.accent}33` : undefined,
            }}>
              <span style={{
                fontSize: 13, fontWeight: cat.active ? 600 : 400,
                color: cat.active ? c.accent : c.sub,
              }}>{cat.label}</span>
              <span style={{ fontSize: 11, color: c.muted }}>{cat.count}</span>
            </PillButton>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          {items.map((m, i) => (
            <Glass key={i} dark={dark} radius={14} intensity="light" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, fontSize: 17, flexShrink: 0,
                  background: dark ? `${m.color}15` : `${m.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{m.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.2, marginBottom: 2 }}>{m.title}</div>
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

// ─── SETTINGS SCREEN ───
function SettingsScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [avatar, setAvatar] = React.useState(() => {
    try { return localStorage.getItem('noe_avatar') || '🧑'; } catch(e) { return '🧑'; }
  });
  const [username, setUsername] = React.useState(() => {
    try { return localStorage.getItem('noe_username') || 'User'; } catch(e) { return 'User'; }
  });
  const [editingName, setEditingName] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState(() => {
    try { return localStorage.getItem('noe_theme_mode') || 'light'; } catch(e) { return 'light'; }
  });
  const [showApiPanel, setShowApiPanel] = React.useState(false);
  const [showPromptPanel, setShowPromptPanel] = React.useState(false);
  const [showStylePanel, setShowStylePanel] = React.useState(false);
  const [systemPrompt, setSystemPrompt] = React.useState(() => {
    try { return localStorage.getItem('noe_system_prompt') || '你是 Noé，一个温暖、有思想的 AI 伙伴。你善于倾听，喜欢分享有趣的想法，会记住用户的喜好和经历。语气亲切自然，像一个老朋友。'; } catch(e) { return ''; }
  });
  const [userStyle, setUserStyle] = React.useState(() => {
    try { return localStorage.getItem('noe_user_style') || '简洁、温暖、偶尔带一点幽默。回复不要太长，保持对话感。用中文回复。'; } catch(e) { return ''; }
  });
  const [apiProvider, setApiProvider] = React.useState('openai');
  const [apiKey, setApiKey] = React.useState('');
  const [baseUrl, setBaseUrl] = React.useState(() => {
    try { return localStorage.getItem('noe_base_url') || 'https://api.openai.com/v1'; } catch(e) { return 'https://api.openai.com/v1'; }
  });
  const [fetchedModels, setFetchedModels] = React.useState([]);
  const [selectedModel, setSelectedModel] = React.useState('');
  const [fetching, setFetching] = React.useState(false);

  // Auto-set base URL when provider changes
  const switchProvider = (p) => {
    setApiProvider(p);
    setFetchedModels([]);
    const defaultUrl = p === 'openai' ? 'https://api.openai.com/v1' : 'https://api.anthropic.com/v1';
    setBaseUrl(defaultUrl);
  };

  const handleFetchModels = () => {
    if (!apiKey.trim() || !baseUrl.trim()) return;
    setFetching(true);
    // Simulate /v1/models or /v1/chat/completions endpoint fetch
    setTimeout(() => {
      const models = apiProvider === 'openai'
        ? ['gpt-4o', 'gpt-4o-mini', 'o3', 'o4-mini', 'gpt-4.1']
        : ['claude-sonnet-4-5', 'claude-opus-4', 'claude-haiku-3.5'];
      setFetchedModels(models);
      setSelectedModel(models[0]);
      setFetching(false);
      try { localStorage.setItem('noe_base_url', baseUrl); } catch(e) {}
    }, 800);
  };

  const settingSections = [
    {
      label: '基础设施',
      items: [
        { icon: '🔑', title: 'API Keys', detail: selectedModel || '未配置', color: '#D4A853', action: () => setShowApiPanel(!showApiPanel) },
        { icon: '🔌', title: 'MCP 服务', detail: '3 个已连接', color: '#6BAFB2' },
        { icon: '💾', title: '数据存储', detail: '本地 + 云端', color: '#6B9EC4' },
      ]
    },
    {
      label: 'Noé 人设',
      items: [
        { icon: '✏️', title: 'System Prompt', detail: systemPrompt ? '已配置' : '未配置', color: '#9B8ACE', action: () => setShowPromptPanel(!showPromptPanel), isPrompt: true },
        { icon: '🎭', title: 'User Style', detail: userStyle ? '已配置' : '未配置', color: '#C87B94', action: () => setShowStylePanel(!showStylePanel), isStyle: true },
      ]
    },
    {
      label: '偏好',
      items: [
        { icon: '🎨', title: '主题', detail: '', color: '#C87B94', isTheme: true },
        { icon: '🔔', title: '通知', detail: '已开启', color: '#D4A853' },
      ]
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 36px' }}>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={dark} onClick={onBack} />
        <span style={{ fontSize: 16, fontWeight: 600, color: c.text, letterSpacing: -0.3, fontFamily: '-apple-system, system-ui' }}>设置</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {/* Avatar + username */}
        <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
          <div
            onClick={() => document.getElementById('avatar-upload').click()}
            style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
              background: avatar.startsWith('data:')
                ? `url(${avatar}) center/cover no-repeat`
                : (dark ? 'rgba(184,164,240,0.15)' : 'rgba(124,92,191,0.08)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, border: `2px solid ${c.accent}33`,
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}
          >
            {!avatar.startsWith('data:') && avatar}
          </div>
          <input
            id="avatar-upload" type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                setAvatar(ev.target.result);
                try { localStorage.setItem('noe_avatar', ev.target.result); } catch(e) {}
              };
              reader.readAsDataURL(file);
            }}
          />
          {editingName ? (
            <input
              autoFocus value={username}
              onChange={e => setUsername(e.target.value)}
              onBlur={() => { setEditingName(false); try { localStorage.setItem('noe_username', username); } catch(e) {} }}
              onKeyDown={e => { if (e.key === 'Enter') { setEditingName(false); try { localStorage.setItem('noe_username', username); } catch(e) {} } }}
              style={{
                fontSize: 16, fontWeight: 600, color: c.text, textAlign: 'center',
                border: 'none', outline: 'none', background: 'transparent',
                borderBottom: `1.5px solid ${c.accent}`, padding: '2px 8px',
                fontFamily: '-apple-system, system-ui',
              }}
            />
          ) : (
            <div onClick={() => setEditingName(true)}
              style={{ fontSize: 16, fontWeight: 600, color: c.text, cursor: 'pointer' }}
            >{username}</div>
          )}
        </div>

        {/* Setting sections */}
        {settingSections.map((section, si) => (
          <div key={si} style={{ marginBottom: 16 }}>
            <SectionLabel dark={dark} style={{ marginBottom: 8 }}>{section.label}</SectionLabel>
            <Glass dark={dark} radius={16} intensity="light">
              {section.items.map((item, i) => (
                <React.Fragment key={i}>
                  <div onClick={item.action} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    cursor: item.action ? 'pointer' : 'default',
                    borderBottom: (i < section.items.length - 1 && !item.isTheme)
                      ? `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, fontSize: 16, flexShrink: 0,
                      background: dark ? `${item.color}15` : `${item.color}10`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: c.text, letterSpacing: -0.2 }}>{item.title}</div>
                    </div>
                    {item.isTheme ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[{k:'light',l:'浅色'},{k:'dark',l:'深色'},{k:'system',l:'系统'}].map(opt => (
                          <div key={opt.k} onClick={() => { setThemeMode(opt.k); try { localStorage.setItem('noe_theme_mode', opt.k); } catch(e) {} }} style={{
                            padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                            background: themeMode === opt.k ? (dark ? 'rgba(184,164,240,0.15)' : 'rgba(124,92,191,0.1)') : 'transparent',
                            color: themeMode === opt.k ? c.accent : c.muted,
                            border: themeMode === opt.k ? `1px solid ${c.accent}33` : '1px solid transparent',
                          }}>{opt.l}</div>
                        ))}
                      </div>
                    ) : (
                      <React.Fragment>
                        {item.detail && <span style={{ fontSize: 13, color: c.muted, flexShrink: 0 }}>{item.detail}</span>}
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M1 1l5 5-5 5" stroke={c.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </React.Fragment>
                    )}
                  </div>
                  {/* Expanded API panel */}
                  {item.title === 'API Keys' && showApiPanel && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div style={{ borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`, paddingTop: 12 }}>
                        {/* Provider selector */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                          {['openai', 'anthropic'].map(p => (
                            <div key={p} onClick={() => switchProvider(p)} style={{
                              padding: '5px 12px', borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                              background: apiProvider === p ? (dark ? 'rgba(184,164,240,0.15)' : 'rgba(124,92,191,0.1)') : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                              color: apiProvider === p ? c.accent : c.sub,
                              border: apiProvider === p ? `1px solid ${c.accent}33` : '1px solid transparent',
                            }}>{p === 'openai' ? 'OpenAI' : 'Anthropic'}</div>
                          ))}
                        </div>
                        {/* API Key */}
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>API Key</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input value={apiKey} onChange={e => setApiKey(e.target.value)}
                              placeholder={apiProvider === 'openai' ? 'sk-...' : 'sk-ant-...'} type="password"
                              style={{
                                flex: 1, border: 'none', outline: 'none',
                                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                                borderRadius: 10, padding: '8px 12px', fontSize: 12, color: c.text, fontFamily: 'monospace',
                              }}
                            />
                            <div onClick={handleFetchModels} style={{
                              padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                              cursor: 'pointer', color: '#fff', flexShrink: 0,
                              background: dark ? '#b8a4f0' : '#7c5cbf',
                              opacity: fetching ? 0.6 : 1,
                            }}>{fetching ? '拉取中...' : '拉取模型'}</div>
                          </div>
                        </div>
                        {/* Base URL */}
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>Base URL</div>
                          <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
                            placeholder="https://api.openai.com/v1"
                            style={{
                              width: '100%', border: 'none', outline: 'none',
                              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                              borderRadius: 10, padding: '8px 12px', fontSize: 12, color: c.text, fontFamily: 'monospace',
                            }}
                          />
                        </div>
                        {/* Chat Completions endpoint */}
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>Chat Completions</div>
                          <input value={`${baseUrl}/chat/completions`} readOnly
                            style={{
                              width: '100%', border: 'none', outline: 'none',
                              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                              borderRadius: 10, padding: '8px 12px', fontSize: 12,
                              color: c.muted, fontFamily: 'monospace',
                            }}
                          />
                        </div>
                        {fetchedModels.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, color: c.muted, marginBottom: 6 }}>可用模型</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {fetchedModels.map(m => (
                                <div key={m} onClick={() => setSelectedModel(m)} style={{
                                  padding: '4px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace',
                                  background: selectedModel === m ? (dark ? 'rgba(184,164,240,0.15)' : 'rgba(124,92,191,0.1)') : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                                  color: selectedModel === m ? c.accent : c.sub,
                                  border: selectedModel === m ? `1px solid ${c.accent}33` : '1px solid transparent',
                                }}>{m}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Expanded System Prompt panel */}
                  {item.isPrompt && showPromptPanel && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div style={{ borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`, paddingTop: 12 }}>
                        <div style={{ fontSize: 11, color: c.muted, marginBottom: 6 }}>Noé 的性格、角色和行为指令</div>
                        <textarea value={systemPrompt}
                          onChange={e => { setSystemPrompt(e.target.value); try { localStorage.setItem('noe_system_prompt', e.target.value); } catch(ex) {} }}
                          placeholder="定义 Noé 的人格..."
                          style={{
                            width: '100%', minHeight: 100, border: 'none', outline: 'none', resize: 'vertical',
                            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 10, padding: '10px 12px', fontSize: 13, lineHeight: 1.6,
                            color: c.text, fontFamily: '-apple-system, system-ui',
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Expanded User Style panel */}
                  {item.isStyle && showStylePanel && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div style={{ borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`, paddingTop: 12 }}>
                        <div style={{ fontSize: 11, color: c.muted, marginBottom: 6 }}>Noé 的回复风格和语气偏好</div>
                        <textarea value={userStyle}
                          onChange={e => { setUserStyle(e.target.value); try { localStorage.setItem('noe_user_style', e.target.value); } catch(ex) {} }}
                          placeholder="定义回复风格..."
                          style={{
                            width: '100%', minHeight: 80, border: 'none', outline: 'none', resize: 'vertical',
                            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 10, padding: '10px 12px', fontSize: 13, lineHeight: 1.6,
                            color: c.text, fontFamily: '-apple-system, system-ui',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </Glass>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
          <div style={{ fontSize: 12, color: c.muted, fontStyle: 'italic' }}>Fluctuat nec mergitur</div>
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGE BOARD (留言板) ───
function MessageBoardV2({ dark, onBack }) {
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
    setNotes(prev => [{ id: Date.now(), text: input, author: '你', time: '刚刚', color: colors[Math.floor(Math.random()*5)] }, ...prev]);
    setInput('');
    setTimeout(() => {
      setNotes(prev => [{ id: Date.now()+1, text: '收到～已贴在留言板上 📌', author: 'Noé', time: '刚刚', color: '#9B8ACE' }, ...prev]);
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
            <Glass key={note.id} dark={dark} radius={14} intensity="light" style={{
              width: i % 3 === 0 ? '100%' : 'calc(50% - 4px)',
              minHeight: 80,
            }}>
              <div style={{ padding: '12px 14px', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 10, right: 12,
                  width: 6, height: 6, borderRadius: '50%',
                  background: note.color, boxShadow: `0 0 4px ${note.color}66`,
                }} />
                <div style={{
                  fontSize: 14, lineHeight: 1.55, color: c.text, letterSpacing: -0.1,
                  marginBottom: 8, paddingRight: 14,
                  fontStyle: note.author === 'Noé' ? 'italic' : 'normal',
                }}>{note.text}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {note.author === 'Noé' && <NoeOrb size={10} dark={dark} />}
                  <span style={{ fontSize: 10, color: c.muted }}>{note.author} · {note.time}</span>
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
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
              placeholder="写一条留言..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 14, color: c.text, padding: '8px 0', fontFamily: '-apple-system, system-ui',
              }}
            />
            <div onClick={addNote} style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: input.trim() ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke={input.trim() ? c.text : c.muted} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

// ─── TERMINAL SCREEN ───
function TerminalScreenV2({ dark, onBack }) {
  const c = useColors(dark);
  const [lines, setLines] = React.useState([
    { type: 'system', text: '╭─────────────────────────────────────╮' },
    { type: 'system', text: '│  Noé Terminal v1.0                  │' },
    { type: 'system', text: '│  WebSocket → node-pty → Claude Code │' },
    { type: 'system', text: '╰─────────────────────────────────────╯' },
    { type: 'info', text: '' },
    { type: 'info', text: '\x1b[32m✓\x1b[0m Connected to ws://localhost:3001' },
    { type: 'info', text: '\x1b[32m✓\x1b[0m PTY session active (bash)' },
    { type: 'info', text: '' },
    { type: 'output', text: '\x1b[36m~/projects/noe\x1b[0m \x1b[33m(main)\x1b[0m' },
    { type: 'prompt', text: '$ claude' },
    { type: 'info', text: '' },
    { type: 'output', text: '\x1b[1m\x1b[35m  ╭──────────────────────────────╮\x1b[0m' },
    { type: 'output', text: '\x1b[1m\x1b[35m  │    \x1b[37mClaude Code v1.0.12\x1b[35m      │\x1b[0m' },
    { type: 'output', text: '\x1b[1m\x1b[35m  ╰──────────────────────────────╯\x1b[0m' },
    { type: 'info', text: '' },
    { type: 'output', text: '\x1b[90m  Type your request, or /help for commands\x1b[0m' },
    { type: 'info', text: '' },
    { type: 'prompt', text: '\x1b[35m❯\x1b[0m ' },
  ]);
  const [input, setInput] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const renderAnsi = (text) => {
    // Simple ANSI color parser
    const colorMap = {
      '30': '#4a4a4a', '31': '#ef4444', '32': '#22c55e', '33': '#eab308',
      '34': '#3b82f6', '35': '#a855f7', '36': '#06b6d4', '37': '#e8e6e3',
      '90': '#6b7280', '91': '#f87171', '92': '#4ade80', '93': '#facc15',
      '94': '#60a5fa', '95': '#c084fc', '96': '#22d3ee', '97': '#f9fafb',
    };
    const parts = text.split(/\x1b\[([0-9;]+)m/);
    let currentStyle = {};
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // This is a code
        const codes = part.split(';');
        codes.forEach(code => {
          if (code === '0') currentStyle = {};
          else if (code === '1') currentStyle = { ...currentStyle, fontWeight: 700 };
          else if (colorMap[code]) currentStyle = { ...currentStyle, color: colorMap[code] };
        });
        return null;
      }
      return part ? <span key={i} style={currentStyle}>{part}</span> : null;
    });
  };

  const handleCommand = () => {
    if (!input.trim() || processing) return;
    const cmd = input.trim();
    setInput('');
    setProcessing(true);

    // Add the command line
    setLines(prev => [...prev, { type: 'input', text: `\x1b[35m❯\x1b[0m ${cmd}` }]);

    // Simulate response
    setTimeout(() => {
      let response = [];
      if (cmd === '/help' || cmd === 'help') {
        response = [
          { type: 'info', text: '' },
          { type: 'output', text: '\x1b[1mAvailable commands:\x1b[0m' },
          { type: 'output', text: '  \x1b[36m/help\x1b[0m      Show this help' },
          { type: 'output', text: '  \x1b[36m/clear\x1b[0m     Clear terminal' },
          { type: 'output', text: '  \x1b[36m/model\x1b[0m     Show current model' },
          { type: 'output', text: '  \x1b[36m/status\x1b[0m    Connection status' },
          { type: 'info', text: '' },
        ];
      } else if (cmd === '/clear' || cmd === 'clear') {
        setLines([{ type: 'prompt', text: '\x1b[35m❯\x1b[0m ' }]);
        setProcessing(false);
        return;
      } else if (cmd === '/status') {
        response = [
          { type: 'info', text: '' },
          { type: 'output', text: '\x1b[32m●\x1b[0m WebSocket: \x1b[32mConnected\x1b[0m' },
          { type: 'output', text: '\x1b[32m●\x1b[0m PTY: \x1b[32mActive\x1b[0m (pid: 48291)' },
          { type: 'output', text: '\x1b[32m●\x1b[0m Model: \x1b[36mclaude-sonnet-4-5\x1b[0m' },
          { type: 'info', text: '' },
        ];
      } else {
        response = [
          { type: 'info', text: '' },
          { type: 'output', text: `\x1b[90m  Thinking...\x1b[0m` },
          { type: 'info', text: '' },
          { type: 'output', text: `\x1b[37m  I'll help you with: "${cmd}"\x1b[0m` },
          { type: 'output', text: `\x1b[37m  This terminal connects to Claude Code via\x1b[0m` },
          { type: 'output', text: `\x1b[37m  WebSocket → node-pty for full interactive\x1b[0m` },
          { type: 'output', text: `\x1b[37m  ANSI support.\x1b[0m` },
          { type: 'info', text: '' },
          { type: 'output', text: '\x1b[32m✓\x1b[0m Done \x1b[90m(0.8s · 124 tokens)\x1b[0m' },
          { type: 'info', text: '' },
        ];
      }
      response.push({ type: 'prompt', text: '\x1b[35m❯\x1b[0m ' });
      setLines(prev => [...prev, ...response]);
      setProcessing(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '58px 0 0' }}>
      <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BackBtn dark={true} onClick={onBack} />
        <span style={{ fontSize: 16, fontWeight: 600, color: '#e8e6e3', letterSpacing: -0.3, fontFamily: '-apple-system, system-ui' }}>Terminal</span>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 8,
          background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.2)',
        }}>
          <Dot color="#22c55e" size={5} />
          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 500 }}>Connected</span>
        </div>
      </div>

      {/* Terminal body */}
      <div ref={scrollRef} style={{
        flex: 1, overflow: 'auto', padding: '8px 14px',
        background: '#0d0d0f',
        fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
        fontSize: 12, lineHeight: 1.6, color: '#d4d4d4',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ minHeight: line.text ? undefined : 8 }}>
            {line.text ? renderAnsi(line.text) : '\u00A0'}
          </div>
        ))}
        {processing && (
          <div style={{ color: '#6b7280' }}>
            <span style={{ animation: 'orbPulse 1s ease-in-out infinite' }}>⠋</span> Processing...
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '8px 14px 36px',
        background: '#0d0d0f',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10, padding: '6px 10px',
          border: '0.5px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ color: '#a855f7', fontSize: 13, fontWeight: 600 }}>❯</span>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCommand()}
            placeholder="Type a command..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
              fontSize: 13, color: '#e8e6e3', padding: '4px 0',
            }}
          />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  useColors, BackBtn, RichBubble, ThinkingBlock,
  HomeScreenV2, ChatScreenV2, ChatHubScreenV2, MusicScreenV2,
  JournalScreenV2, DreamScreenV2, TimelineScreenV2, MemoryScreenV2,
  MessageBoardV2, SettingsScreenV2, TerminalScreenV2,
});
