import React from 'react';
import { useColors } from '../theme/colors';
import { NoeOrb } from '../components/NoeOrb';
import { RichBubble } from './chat/RichBubble';

// Chat — full-screen conversation with a left slide-out drawer of chat history,
// streaming responses with a thinking phase, and a Claude-style input bar.
export function ChatHubScreen({ dark, onBack }) {
  const c = useColors(dark);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [activeChat, setActiveChat] = React.useState('h1');
  const [messages, setMessages] = React.useState([
    { id: 1, text: '今天过得怎么样？有什么想分享的吗？', isUser: false, time: '14:20', tokens: 18 },
    { id: 2, text: '还不错！下午去了趟书店，买了两本你之前推荐的书', isUser: true, time: '14:22', tokens: 22 },
    {
      id: 3,
      text: '太好了！是《小王子》和《月亮与六便士》吗？希望你会喜欢。读完之后我们可以一起聊聊感想。[memory:用户喜欢读书，购买了小王子和月亮与六便士]',
      isUser: false,
      time: '14:23',
      tokens: 64,
      thinking: '用户提到买了我推荐的书，我应该确认是哪两本，并表达期待讨论的意愿。同时存入记忆。',
      thinkingDuration: '0.8s',
    },
    { id: 4, text: '对！就是这两本。我先从小王子开始读', isUser: true, time: '14:25', tokens: 16 },
    {
      id: 5,
      text: '"真正重要的东西，用眼睛是看不见的。" 这是我最喜欢的一句。\n\n给你一段代码来记录读书笔记：\n```python\nclass ReadingNote:\n    def __init__(self, book, quote):\n        self.book = book\n        self.quote = quote\n        self.date = datetime.now()\n```\n期待听到你的感受 ✨',
      isUser: false,
      time: '14:26',
      tokens: 89,
      thinking: '用户决定先读小王子，我可以分享一句经典引用来引起共鸣，同时附上一段实用代码帮助记录读书笔记。',
      thinkingDuration: '1.5s',
    },
  ]);
  const [typing, setTyping] = React.useState(false);
  const [, setStreamingId] = React.useState(null);
  const scrollRef = React.useRef(null);
  const touchStartX = React.useRef(0);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const streamText = (msgId, thinkText, fullText, tokens) => {
    const now2 = new Date().toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit' });
    // Phase 1: thinking
    setMessages((prev) => [
      ...prev,
      {
        id: msgId,
        text: '',
        isUser: false,
        time: now2,
        tokens: 0,
        thinking: '',
        thinkingStreaming: true,
        streaming: true,
      },
    ]);
    setStreamingId(msgId);

    let ti = 0;
    const thinkInterval = setInterval(() => {
      ti++;
      if (ti <= thinkText.length) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, thinking: thinkText.slice(0, ti) } : m))
        );
      } else {
        clearInterval(thinkInterval);
        // End thinking phase
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, thinkingStreaming: false, thinkingDuration: '1.2s' } : m
          )
        );
        // Phase 2: stream response
        let ci = 0;
        const charInterval = setInterval(() => {
          ci++;
          if (ci <= fullText.length) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === msgId
                  ? { ...m, text: fullText.slice(0, ci), tokens: Math.ceil(ci * 0.8) }
                  : m
              )
            );
          } else {
            clearInterval(charInterval);
            setMessages((prev) =>
              prev.map((m) => (m.id === msgId ? { ...m, text: fullText, tokens, streaming: false } : m))
            );
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
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, isUser: true, time: now, tokens: Math.ceil(input.length * 1.3) },
    ]);
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
    setChatHistory((prev) => prev.map((ch) => (ch.id === id ? { ...ch, starred: !ch.starred } : ch)));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 60 && !sidebarOpen) setSidebarOpen(true);
    if (dx < -60 && sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div
      style={{ display: 'flex', height: '100%', position: 'relative', overflow: 'hidden' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            background: 'rgba(0,0,0,0.3)',
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 300,
          zIndex: 35,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-300px)',
          transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '0 20px 20px 0' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
              background: dark ? 'rgba(22,22,24,0.92)' : 'rgba(245,243,239,0.95)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRight: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '62px 16px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>Chats</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 10px' }}>
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat.id);
                    setSidebarOpen(false);
                  }}
                  style={{
                    padding: '11px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    marginBottom: 2,
                    background:
                      activeChat === chat.id
                        ? dark
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.04)'
                        : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: activeChat === chat.id ? 600 : 400,
                        color: c.text,
                        letterSpacing: -0.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 160,
                      }}
                    >
                      {chat.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(chat.id);
                        }}
                        style={{ cursor: 'pointer', fontSize: 12, lineHeight: 1 }}
                      >
                        {chat.starred ? '⭐' : ''}
                      </div>
                      <span style={{ fontSize: 10, color: c.muted }}>{chat.time}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: c.muted,
                      letterSpacing: -0.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat.preview}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px 36px' }}>
              <div
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
                    stroke={c.sub}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontSize: 13, color: c.sub }}>返回主页</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'absolute', top: 58, left: 18, zIndex: 10 }}>
          <div
            onClick={() => setSidebarOpen(true)}
            style={{
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: '50%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backdropFilter: 'blur(16px) saturate(160%)',
                WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
                border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
              }}
            />
            <svg
              style={{ position: 'relative', zIndex: 1 }}
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
            >
              <path d="M1 1h14M1 6h14M1 11h14" stroke={c.text} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '100px 0 8px' }}>
          {messages.map((m) => (
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
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 24,
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 24,
                pointerEvents: 'none',
                boxShadow: dark
                  ? 'inset 0 0.5px 0 rgba(255,255,255,0.06)'
                  : 'inset 0 0.5px 0 rgba(255,255,255,0.5)',
                border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px 4px 16px', minHeight: 40 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Reply to Noé..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: '-apple-system, system-ui',
                    fontSize: 16,
                    color: c.text,
                    padding: '4px 0',
                    letterSpacing: -0.2,
                    lineHeight: '22px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px 10px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke={c.sub} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '5px 12px',
                    borderRadius: 12,
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: c.sub }}>Noé 4.0</span>
                  <span style={{ fontSize: 11, fontWeight: 400, color: c.muted }}>Max</span>
                </div>
                <div style={{ flex: 1 }} />
                {typing ? (
                  <div
                    onClick={() => setTyping(false)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: dark ? '#e8e6e3' : '#1a1a1a' }} />
                  </div>
                ) : input.trim() ? (
                  <>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
                          stroke={c.muted}
                          strokeWidth="1.8"
                        />
                        <path
                          d="M19 10v2a7 7 0 01-14 0v-2"
                          stroke={c.muted}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div
                      onClick={handleSend}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: dark ? 'rgba(255,255,255,0.85)' : '#1a1a1a',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 19V5M5 12l7-7 7 7"
                          stroke={dark ? '#1a1a1a' : '#fff'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 19V5M5 12l7-7 7 7"
                        stroke={c.muted}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
