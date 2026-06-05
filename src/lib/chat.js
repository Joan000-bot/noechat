// Fetch the available model list for a provider via the /api/models proxy.
// payload: { provider, baseUrl, apiKey }
export async function fetchModels(payload) {
  const res = await fetch('/api/models', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const j = await res.json().catch(() => ({}));
  if (j.error) throw new Error(j.error);
  return j.models || [];
}

// Frontend client for the /api/chat streaming proxy. Posts the request and
// dispatches unified NDJSON events to handlers.
//
//   await streamChat(payload, { signal, onThinking, onText, onDone, onError })
//
// payload: { provider, baseUrl, apiKey, model, system, thinking, messages }
//   messages: [{ role: 'user' | 'assistant', content }]
export async function streamChat(payload, handlers = {}) {
  const { signal, onThinking, onText, onDone, onError } = handlers;

  let res;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') return;
    onError?.(new Error('无法连接对话服务: ' + (e?.message || e)));
    return;
  }

  if (!res.ok || !res.body) {
    onError?.(new Error('对话请求失败: HTTP ' + res.status));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line) continue;
        let evt;
        try {
          evt = JSON.parse(line);
        } catch {
          continue;
        }
        if (evt.type === 'thinking') onThinking?.(evt.delta);
        else if (evt.type === 'text') onText?.(evt.delta);
        else if (evt.type === 'done') onDone?.(evt.usage);
        else if (evt.type === 'error') onError?.(new Error(evt.message));
      }
    }
  } catch (e) {
    if (e?.name === 'AbortError') return;
    onError?.(new Error('对话流中断: ' + (e?.message || e)));
  }
}
