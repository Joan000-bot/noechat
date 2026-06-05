import React from 'react';
import { useColors } from '../theme/colors';
import { Glass } from '../components/Glass';
import { SectionLabel } from '../components/SectionLabel';
import { BackBtn } from '../components/BackBtn';
import { fetchModels } from '../lib/chat';

function lsSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

// Settings — profile, infrastructure (API keys / MCP / storage), Noé persona
// (system prompt + user style), and preferences. The theme switcher is lifted to
// the app so it actually drives light/dark/system.
export function SettingsScreen({ dark, onBack, themeMode, onThemeChange }) {
  const c = useColors(dark);
  const [avatar, setAvatar] = React.useState(() => {
    try {
      return localStorage.getItem('noe_avatar') || '🧑';
    } catch (e) {
      return '🧑';
    }
  });
  const [username, setUsername] = React.useState(() => {
    try {
      return localStorage.getItem('noe_username') || 'User';
    } catch (e) {
      return 'User';
    }
  });
  const [editingName, setEditingName] = React.useState(false);
  const [showApiPanel, setShowApiPanel] = React.useState(false);
  const [showPromptPanel, setShowPromptPanel] = React.useState(false);
  const [showStylePanel, setShowStylePanel] = React.useState(false);
  const [systemPrompt, setSystemPrompt] = React.useState(() => {
    try {
      return (
        localStorage.getItem('noe_system_prompt') ||
        '你是 Noé，一个温暖、有思想的 AI 伙伴。你善于倾听，喜欢分享有趣的想法，会记住用户的喜好和经历。语气亲切自然，像一个老朋友。'
      );
    } catch (e) {
      return '';
    }
  });
  const [userStyle, setUserStyle] = React.useState(() => {
    try {
      return (
        localStorage.getItem('noe_user_style') ||
        '简洁、温暖、偶尔带一点幽默。回复不要太长，保持对话感。用中文回复。'
      );
    } catch (e) {
      return '';
    }
  });
  const [apiProvider, setApiProvider] = React.useState(() => {
    try {
      return localStorage.getItem('noe_provider') || 'openai';
    } catch (e) {
      return 'openai';
    }
  });
  const [apiKey, setApiKey] = React.useState(() => {
    try {
      return localStorage.getItem('noe_api_key') || '';
    } catch (e) {
      return '';
    }
  });
  const [baseUrl, setBaseUrl] = React.useState(() => {
    try {
      return localStorage.getItem('noe_base_url') || 'https://api.openai.com/v1';
    } catch (e) {
      return 'https://api.openai.com/v1';
    }
  });
  const [fetchedModels, setFetchedModels] = React.useState([]);
  const [selectedModel, setSelectedModel] = React.useState(() => {
    try {
      return localStorage.getItem('noe_model') || '';
    } catch (e) {
      return '';
    }
  });
  const [fetching, setFetching] = React.useState(false);
  const [fetchError, setFetchError] = React.useState('');

  // Auto-set base URL when provider changes
  const switchProvider = (p) => {
    setApiProvider(p);
    setFetchedModels([]);
    setFetchError('');
    const defaultUrl = p === 'openai' ? 'https://api.openai.com/v1' : 'https://api.anthropic.com/v1';
    setBaseUrl(defaultUrl);
    lsSet('noe_provider', p);
    lsSet('noe_base_url', defaultUrl);
  };

  const selectModel = (m) => {
    setSelectedModel(m);
    lsSet('noe_model', m);
  };

  const handleFetchModels = async () => {
    if (!apiKey.trim() || !baseUrl.trim() || fetching) return;
    setFetching(true);
    setFetchError('');
    lsSet('noe_provider', apiProvider);
    lsSet('noe_base_url', baseUrl);
    lsSet('noe_api_key', apiKey);
    try {
      const models = await fetchModels({ provider: apiProvider, baseUrl, apiKey });
      if (!models.length) throw new Error('未返回任何模型');
      setFetchedModels(models);
      selectModel(models[0]);
    } catch (e) {
      // Fall back to a curated list so configuration still works offline / on CORS.
      setFetchError(String(e?.message || e));
      const fallback =
        apiProvider === 'openai'
          ? ['gpt-4o', 'gpt-4o-mini', 'o3', 'o4-mini', 'gpt-4.1']
          : ['claude-opus-4-1', 'claude-sonnet-4-5', 'claude-haiku-4-5'];
      setFetchedModels(fallback);
      selectModel(fallback[0]);
    } finally {
      setFetching(false);
    }
  };

  const settingSections = [
    {
      label: '基础设施',
      items: [
        { icon: '🔑', title: 'API Keys', detail: selectedModel || '未配置', color: '#D4A853', action: () => setShowApiPanel(!showApiPanel) },
        { icon: '🔌', title: 'MCP 服务', detail: '3 个已连接', color: '#6BAFB2' },
        { icon: '💾', title: '数据存储', detail: '本地 + 云端', color: '#6B9EC4' },
      ],
    },
    {
      label: 'Noé 人设',
      items: [
        { icon: '✏️', title: 'System Prompt', detail: systemPrompt ? '已配置' : '未配置', color: '#9B8ACE', action: () => setShowPromptPanel(!showPromptPanel), isPrompt: true },
        { icon: '🎭', title: 'User Style', detail: userStyle ? '已配置' : '未配置', color: '#C87B94', action: () => setShowStylePanel(!showStylePanel), isStyle: true },
      ],
    },
    {
      label: '偏好',
      items: [
        { icon: '🎨', title: '主题', detail: '', color: '#C87B94', isTheme: true },
        { icon: '🔔', title: '通知', detail: '已开启', color: '#D4A853' },
      ],
    },
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
          设置
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {/* Avatar + username */}
        <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
          <div
            onClick={() => document.getElementById('avatar-upload').click()}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              margin: '0 auto 12px',
              background: avatar.startsWith('data:')
                ? `url(${avatar}) center/cover no-repeat`
                : dark
                  ? 'rgba(184,164,240,0.15)'
                  : 'rgba(124,92,191,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              border: `2px solid ${c.accent}33`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {!avatar.startsWith('data:') && avatar}
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                setAvatar(ev.target.result);
                try {
                  localStorage.setItem('noe_avatar', ev.target.result);
                } catch (err) {
                  /* ignore */
                }
              };
              reader.readAsDataURL(file);
            }}
          />
          {editingName ? (
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => {
                setEditingName(false);
                try {
                  localStorage.setItem('noe_username', username);
                } catch (e) {
                  /* ignore */
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingName(false);
                  try {
                    localStorage.setItem('noe_username', username);
                  } catch (err) {
                    /* ignore */
                  }
                }
              }}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: c.text,
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                borderBottom: `1.5px solid ${c.accent}`,
                padding: '2px 8px',
                fontFamily: '-apple-system, system-ui',
              }}
            />
          ) : (
            <div
              onClick={() => setEditingName(true)}
              style={{ fontSize: 16, fontWeight: 600, color: c.text, cursor: 'pointer' }}
            >
              {username}
            </div>
          )}
        </div>

        {/* Setting sections */}
        {settingSections.map((section, si) => (
          <div key={si} style={{ marginBottom: 16 }}>
            <SectionLabel dark={dark} style={{ marginBottom: 8 }}>
              {section.label}
            </SectionLabel>
            <Glass dark={dark} radius={16} intensity="light">
              {section.items.map((item, i) => (
                <React.Fragment key={i}>
                  <div
                    onClick={item.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      cursor: item.action ? 'pointer' : 'default',
                      borderBottom:
                        i < section.items.length - 1 && !item.isTheme
                          ? `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`
                          : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        fontSize: 16,
                        flexShrink: 0,
                        background: dark ? `${item.color}15` : `${item.color}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: c.text, letterSpacing: -0.2 }}>
                        {item.title}
                      </div>
                    </div>
                    {item.isTheme ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[
                          { k: 'light', l: '浅色' },
                          { k: 'dark', l: '深色' },
                          { k: 'system', l: '系统' },
                        ].map((opt) => (
                          <div
                            key={opt.k}
                            onClick={() => onThemeChange && onThemeChange(opt.k)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: 'pointer',
                              background:
                                themeMode === opt.k
                                  ? dark
                                    ? 'rgba(184,164,240,0.15)'
                                    : 'rgba(124,92,191,0.1)'
                                  : 'transparent',
                              color: themeMode === opt.k ? c.accent : c.muted,
                              border: themeMode === opt.k ? `1px solid ${c.accent}33` : '1px solid transparent',
                            }}
                          >
                            {opt.l}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <React.Fragment>
                        {item.detail && (
                          <span style={{ fontSize: 13, color: c.muted, flexShrink: 0 }}>{item.detail}</span>
                        )}
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0 }}>
                          <path
                            d="M1 1l5 5-5 5"
                            stroke={c.muted}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </React.Fragment>
                    )}
                  </div>
                  {/* Expanded API panel */}
                  {item.title === 'API Keys' && showApiPanel && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div
                        style={{
                          borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                          paddingTop: 12,
                        }}
                      >
                        {/* Provider selector */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                          {['openai', 'anthropic'].map((p) => (
                            <div
                              key={p}
                              onClick={() => switchProvider(p)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: 'pointer',
                                background:
                                  apiProvider === p
                                    ? dark
                                      ? 'rgba(184,164,240,0.15)'
                                      : 'rgba(124,92,191,0.1)'
                                    : dark
                                      ? 'rgba(255,255,255,0.04)'
                                      : 'rgba(0,0,0,0.03)',
                                color: apiProvider === p ? c.accent : c.sub,
                                border: apiProvider === p ? `1px solid ${c.accent}33` : '1px solid transparent',
                              }}
                            >
                              {p === 'openai' ? 'OpenAI' : 'Anthropic'}
                            </div>
                          ))}
                        </div>
                        {/* API Key */}
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>API Key</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              value={apiKey}
                              onChange={(e) => {
                                setApiKey(e.target.value);
                                lsSet('noe_api_key', e.target.value);
                              }}
                              placeholder={apiProvider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                              type="password"
                              style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                                borderRadius: 10,
                                padding: '8px 12px',
                                fontSize: 12,
                                color: c.text,
                                fontFamily: 'monospace',
                              }}
                            />
                            <div
                              onClick={handleFetchModels}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: '#fff',
                                flexShrink: 0,
                                background: dark ? '#b8a4f0' : '#7c5cbf',
                                opacity: fetching ? 0.6 : 1,
                              }}
                            >
                              {fetching ? '拉取中...' : '拉取模型'}
                            </div>
                          </div>
                          {fetchError && (
                            <div style={{ fontSize: 11, color: '#C87B94', marginTop: 6 }}>
                              拉取失败，已用备用列表（{fetchError}）
                            </div>
                          )}
                        </div>
                        {/* Base URL */}
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>Base URL</div>
                          <input
                            value={baseUrl}
                            onChange={(e) => {
                              setBaseUrl(e.target.value);
                              lsSet('noe_base_url', e.target.value);
                            }}
                            placeholder="https://api.openai.com/v1"
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                              borderRadius: 10,
                              padding: '8px 12px',
                              fontSize: 12,
                              color: c.text,
                              fontFamily: 'monospace',
                            }}
                          />
                        </div>
                        {/* Chat Completions endpoint */}
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>Chat Completions</div>
                          <input
                            value={`${baseUrl}/chat/completions`}
                            readOnly
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                              borderRadius: 10,
                              padding: '8px 12px',
                              fontSize: 12,
                              color: c.muted,
                              fontFamily: 'monospace',
                            }}
                          />
                        </div>
                        {fetchedModels.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, color: c.muted, marginBottom: 6 }}>可用模型</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {fetchedModels.map((m) => (
                                <div
                                  key={m}
                                  onClick={() => selectModel(m)}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 8,
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    fontFamily: 'monospace',
                                    background:
                                      selectedModel === m
                                        ? dark
                                          ? 'rgba(184,164,240,0.15)'
                                          : 'rgba(124,92,191,0.1)'
                                        : dark
                                          ? 'rgba(255,255,255,0.04)'
                                          : 'rgba(0,0,0,0.03)',
                                    color: selectedModel === m ? c.accent : c.sub,
                                    border: selectedModel === m ? `1px solid ${c.accent}33` : '1px solid transparent',
                                  }}
                                >
                                  {m}
                                </div>
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
                      <div
                        style={{
                          borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                          paddingTop: 12,
                        }}
                      >
                        <div style={{ fontSize: 11, color: c.muted, marginBottom: 6 }}>Noé 的性格、角色和行为指令</div>
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => {
                            setSystemPrompt(e.target.value);
                            try {
                              localStorage.setItem('noe_system_prompt', e.target.value);
                            } catch (ex) {
                              /* ignore */
                            }
                          }}
                          placeholder="定义 Noé 的人格..."
                          style={{
                            width: '100%',
                            minHeight: 100,
                            border: 'none',
                            outline: 'none',
                            resize: 'vertical',
                            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 10,
                            padding: '10px 12px',
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: c.text,
                            fontFamily: '-apple-system, system-ui',
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Expanded User Style panel */}
                  {item.isStyle && showStylePanel && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div
                        style={{
                          borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                          paddingTop: 12,
                        }}
                      >
                        <div style={{ fontSize: 11, color: c.muted, marginBottom: 6 }}>Noé 的回复风格和语气偏好</div>
                        <textarea
                          value={userStyle}
                          onChange={(e) => {
                            setUserStyle(e.target.value);
                            try {
                              localStorage.setItem('noe_user_style', e.target.value);
                            } catch (ex) {
                              /* ignore */
                            }
                          }}
                          placeholder="定义回复风格..."
                          style={{
                            width: '100%',
                            minHeight: 80,
                            border: 'none',
                            outline: 'none',
                            resize: 'vertical',
                            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 10,
                            padding: '10px 12px',
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: c.text,
                            fontFamily: '-apple-system, system-ui',
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
