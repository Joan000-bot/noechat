// Self-host API server: the same /api/chat and /api/models endpoints that run as
// Vercel Edge functions, as a tiny dependency-free Node server (reuses
// src/server/chatProxy.js, which only needs global fetch). Put nginx in front to
// serve the built static site and proxy /api/* here.
//
//   node server/api/server.js            # PORT=3012 HOST=127.0.0.1 by default
import http from 'http';
import { streamUnified, listModels } from '../../src/server/chatProxy.js';

const PORT = Number(process.env.PORT) || 3012;
const HOST = process.env.HOST || '127.0.0.1';

function readJson(req) {
  return new Promise((resolve, reject) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(b || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function withServerKey(p) {
  if (!p.apiKey) {
    p.apiKey = p.provider === 'anthropic' ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  }
  return p;
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }
  const path = (req.url || '').split('?')[0];
  let params;
  try {
    params = withServerKey(await readJson(req));
  } catch {
    res.writeHead(400);
    res.end('Bad JSON');
    return;
  }

  if (path === '/api/models') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      res.end(JSON.stringify({ models: await listModels(params) }));
    } catch (e) {
      res.end(JSON.stringify({ error: String(e?.message || e) }));
    }
    return;
  }

  if (path === '/api/chat') {
    const ac = new AbortController();
    res.on('close', () => ac.abort());
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    try {
      for await (const evt of streamUnified({ ...params, signal: ac.signal })) {
        res.write(JSON.stringify(evt) + '\n');
      }
    } catch (e) {
      res.write(JSON.stringify({ type: 'error', message: String(e?.message || e) }) + '\n');
    }
    res.end();
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, HOST, () => console.log(`Noé api server on http://${HOST}:${PORT}`));
