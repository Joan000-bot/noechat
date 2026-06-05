// Runtime-agnostic streaming chat proxy for OpenAI- and Anthropic-compatible
// APIs. Used by both the Vercel Edge function (api/chat.js) and the Vite dev
// middleware (vite.config.js). Yields unified events so the client only ever
// parses one shape:
//   { type: 'thinking', delta }   reasoning / extended-thinking text
//   { type: 'text', delta }       answer text
//   { type: 'done', usage }       { prompt, completion, total }
//   { type: 'error', message }
//
// Relies only on web-standard fetch / TextDecoder / ReadableStream, which exist
// in Node 18+ and the Edge runtime.

const DEFAULT_MAX_TOKENS = 2048;

export async function* streamUnified(params) {
  const {
    provider = 'openai',
    baseUrl,
    apiKey,
    model,
    messages = [],
    system = '',
    thinking = false,
    maxTokens = DEFAULT_MAX_TOKENS,
    signal,
  } = params || {};

  if (!apiKey) {
    yield { type: 'error', message: '未配置 API Key（在「设置 → API Keys」填入并拉取模型）' };
    return;
  }
  if (!model) {
    yield { type: 'error', message: '未选择模型（在「设置 → API Keys」拉取并选择一个模型）' };
    return;
  }

  const defaultBase = provider === 'anthropic' ? 'https://api.anthropic.com/v1' : 'https://api.openai.com/v1';
  const base = (baseUrl || defaultBase).replace(/\/+$/, '');

  if (provider === 'anthropic') {
    yield* streamAnthropic({ base, apiKey, model, messages, system, thinking, maxTokens, signal });
  } else {
    yield* streamOpenAI({ base, apiKey, model, messages, system, maxTokens, signal });
  }
}

async function* streamOpenAI({ base, apiKey, model, messages, system, maxTokens, signal }) {
  const body = {
    model,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    ],
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: maxTokens,
  };

  let res;
  try {
    res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    yield { type: 'error', message: '网络错误: ' + (e?.message || e) };
    return;
  }
  if (!res.ok || !res.body) {
    yield { type: 'error', message: `上游返回 ${res.status}: ${await safeText(res)}` };
    return;
  }

  let usage = null;
  for await (const data of sseData(res.body)) {
    if (data === '[DONE]') break;
    let json;
    try {
      json = JSON.parse(data);
    } catch {
      continue;
    }
    if (json.usage) usage = json.usage;
    const delta = json.choices && json.choices[0] && json.choices[0].delta;
    if (!delta) continue;
    // Many OpenAI-compatible providers (DeepSeek, etc.) expose reasoning here.
    const reasoning = delta.reasoning_content ?? delta.reasoning;
    if (reasoning) yield { type: 'thinking', delta: reasoning };
    if (delta.content) yield { type: 'text', delta: delta.content };
  }
  yield {
    type: 'done',
    usage: usage
      ? { prompt: usage.prompt_tokens, completion: usage.completion_tokens, total: usage.total_tokens }
      : null,
  };
}

async function* streamAnthropic({ base, apiKey, model, messages, system, thinking, maxTokens, signal }) {
  const body = {
    model,
    max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
    messages: messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    stream: true,
  };
  if (system) body.system = system;
  if (thinking) {
    const budget = Math.min(Math.max(1024, Math.floor((maxTokens || DEFAULT_MAX_TOKENS) / 2)), 8000);
    body.thinking = { type: 'enabled', budget_tokens: budget };
    // Anthropic requires max_tokens > thinking budget.
    if (body.max_tokens <= budget) body.max_tokens = budget + 1024;
  }

  let res;
  try {
    res = await fetch(`${base}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    yield { type: 'error', message: '网络错误: ' + (e?.message || e) };
    return;
  }
  if (!res.ok || !res.body) {
    yield { type: 'error', message: `上游返回 ${res.status}: ${await safeText(res)}` };
    return;
  }

  const usage = { input: 0, output: 0 };
  for await (const data of sseData(res.body)) {
    let json;
    try {
      json = JSON.parse(data);
    } catch {
      continue;
    }
    if (json.type === 'content_block_delta') {
      const d = json.delta || {};
      if (d.type === 'thinking_delta' && d.thinking) yield { type: 'thinking', delta: d.thinking };
      else if (d.type === 'text_delta' && d.text) yield { type: 'text', delta: d.text };
    } else if (json.type === 'message_start') {
      usage.input = json.message?.usage?.input_tokens ?? usage.input;
    } else if (json.type === 'message_delta') {
      usage.output = json.usage?.output_tokens ?? usage.output;
    } else if (json.type === 'error') {
      yield { type: 'error', message: json.error?.message || 'Anthropic 流式错误' };
      return;
    }
  }
  yield { type: 'done', usage: { prompt: usage.input, completion: usage.output, total: usage.input + usage.output } };
}

// Parse a Server-Sent-Events body and yield each `data:` payload string.
async function* sseData(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith('data:')) {
        const payload = line.slice(5).trim();
        if (payload) yield payload;
      }
    }
  }
}

async function safeText(res) {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return res.statusText || 'unknown error';
  }
}

// List models for a provider. For OpenAI-compatible APIs this hits GET
// `{base}/models`; for Anthropic it tries the same and otherwise returns a
// curated current list. Throws on hard failure so the caller can fall back.
export async function listModels({ provider = 'openai', baseUrl, apiKey } = {}) {
  if (!apiKey) throw new Error('未配置 API Key');
  const defaultBase = provider === 'anthropic' ? 'https://api.anthropic.com/v1' : 'https://api.openai.com/v1';
  const base = (baseUrl || defaultBase).replace(/\/+$/, '');

  if (provider === 'anthropic') {
    try {
      const res = await fetch(`${base}/models`, {
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      });
      if (res.ok) {
        const j = await res.json();
        const ids = (j.data || j.models || []).map((m) => m.id || m.name).filter(Boolean);
        if (ids.length) return ids;
      }
    } catch {
      /* fall through to curated list */
    }
    return ['claude-opus-4-1', 'claude-sonnet-4-5', 'claude-haiku-4-5'];
  }

  const res = await fetch(`${base}/models`, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) throw new Error(`上游返回 ${res.status}: ${await safeText(res)}`);
  const j = await res.json();
  const ids = (j.data || j.models || []).map((m) => m.id || m.name).filter(Boolean);
  return ids.sort();
}
