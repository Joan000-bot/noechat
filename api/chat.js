// Vercel Edge function: streams chat completions from an OpenAI- or
// Anthropic-compatible provider as newline-delimited JSON events.
//
// The API key may be supplied per-request from the client (the key entered in
// Settings) or, if omitted, falls back to a server env var so the app can also
// be deployed with a shared key:
//   OPENAI_API_KEY / ANTHROPIC_API_KEY
import { streamUnified } from '../src/server/chatProxy.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let params;
  try {
    params = await req.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  if (!params.apiKey) {
    params.apiKey =
      params.provider === 'anthropic' ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const evt of streamUnified({ ...params, signal: req.signal })) {
          controller.enqueue(encoder.encode(JSON.stringify(evt) + '\n'));
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ type: 'error', message: String(e?.message || e) }) + '\n')
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
