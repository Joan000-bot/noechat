import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { streamUnified, listModels } from './src/server/chatProxy.js';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function withServerKey(params) {
  if (!params.apiKey) {
    params.apiKey =
      params.provider === 'anthropic' ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  }
  return params;
}

// Dev-only equivalent of the Vercel Edge functions in api/*.js, so `npm run dev`
// behaves like production.
function chatDevApi() {
  return {
    name: 'chat-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/models', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        try {
          const params = withServerKey(await readJsonBody(req));
          const models = await listModels(params);
          res.end(JSON.stringify({ models }));
        } catch (e) {
          res.end(JSON.stringify({ error: String(e?.message || e) }));
        }
      });

      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        let params;
        try {
          params = withServerKey(await readJsonBody(req));
        } catch {
          res.statusCode = 400;
          res.end('Bad JSON');
          return;
        }
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
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), chatDevApi()],
  server: {
    host: true,
  },
});
