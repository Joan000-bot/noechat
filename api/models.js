// Vercel Edge function: list available models for the configured provider.
import { listModels } from '../src/server/chatProxy.js';

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
  try {
    const models = await listModels(params);
    return Response.json({ models });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) });
  }
}
