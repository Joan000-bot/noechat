// Spotify Web API client using the Authorization Code + PKCE flow — runs fully
// in the browser, no client secret. The user supplies a Client ID (from their
// Spotify developer dashboard) and registers the app's URL as a redirect URI.
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'user-read-recently-played',
].join(' ');

const LS_CLIENT = 'noe_spotify_client_id';
const LS_TOKENS = 'noe_spotify_tokens';
const LS_VERIFIER = 'noe_spotify_verifier';

function ls(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function lsSet(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* ignore */
  }
}
function lsDel(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getClientId() {
  return ls(LS_CLIENT) || '';
}
export function setClientId(id) {
  lsSet(LS_CLIENT, id);
}
function loadTokens() {
  try {
    return JSON.parse(ls(LS_TOKENS) || 'null');
  } catch {
    return null;
  }
}
function saveTokens(t) {
  lsSet(LS_TOKENS, JSON.stringify(t));
}
export function isConnected() {
  return !!loadTokens()?.access_token;
}
export function disconnect() {
  lsDel(LS_TOKENS);
}

// The redirect URI must exactly match one registered in the Spotify app.
export function redirectUri() {
  return window.location.origin + window.location.pathname;
}

function randString(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => ('0' + b.toString(16)).slice(-2)).join('');
}
async function sha256base64url(input) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  let bin = '';
  new Uint8Array(digest).forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Build the Spotify consent URL (without navigating). Exposed for testing.
export async function buildAuthUrl() {
  const clientId = getClientId();
  if (!clientId) throw new Error('未设置 Spotify Client ID');
  const verifier = randString(48);
  lsSet(LS_VERIFIER, verifier);
  const challenge = await sha256base64url(verifier);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: SCOPES,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function beginAuth() {
  window.location.href = await buildAuthUrl();
}

// Call once on app load. If the URL carries an auth `code`, exchange it for
// tokens and strip it from the address bar. Returns true when a code was found.
export async function handleRedirect() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  if (!code) return false;

  const clientId = getClientId();
  const verifier = ls(LS_VERIFIER) || '';
  // Clean the URL regardless of success.
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  if (!clientId || !verifier) return false;

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(),
    code_verifier: verifier,
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Spotify token 交换失败: ' + res.status);
  const t = await res.json();
  t.expires_at = Date.now() + (t.expires_in || 3600) * 1000;
  saveTokens(t);
  lsDel(LS_VERIFIER);
  return true;
}

async function freshToken() {
  const t = loadTokens();
  if (!t) throw new Error('未连接 Spotify');
  if (Date.now() < (t.expires_at || 0) - 10000) return t.access_token;
  if (!t.refresh_token) {
    disconnect();
    throw new Error('Spotify 登录已过期，请重新连接');
  }
  const body = new URLSearchParams({
    client_id: getClientId(),
    grant_type: 'refresh_token',
    refresh_token: t.refresh_token,
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    disconnect();
    throw new Error('Spotify 刷新失败，请重新连接');
  }
  const nt = await res.json();
  nt.refresh_token = nt.refresh_token || t.refresh_token;
  nt.expires_at = Date.now() + (nt.expires_in || 3600) * 1000;
  saveTokens(nt);
  return nt.access_token;
}

async function api(path, opts = {}) {
  const token = await freshToken();
  const res = await fetch(API + path, {
    ...opts,
    headers: { Authorization: 'Bearer ' + token, ...(opts.headers || {}) },
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error('Spotify API ' + res.status);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : null;
}

export const getPlayback = () => api('/me/player');
export const getPlaylists = () => api('/me/playlists?limit=20');
export const getRecentlyPlayed = () => api('/me/player/recently-played?limit=20');
export const play = () => api('/me/player/play', { method: 'PUT' });
export const playContext = (context_uri) =>
  api('/me/player/play', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context_uri }),
  });
export const pause = () => api('/me/player/pause', { method: 'PUT' });
export const next = () => api('/me/player/next', { method: 'POST' });
export const previous = () => api('/me/player/previous', { method: 'POST' });
