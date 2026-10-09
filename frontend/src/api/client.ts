import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api'),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach sessionId
client.interceptors.request.use(config => {
  const session = getSessionId();
  if (session) config.headers['X-Session-Id'] = session;
  return config;
});

// Response interceptor — unwrap errors
client.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

// ─── Session ID helper ────────────────────────────────────────────────────────
export function getSessionId(): string {
  let sid = localStorage.getItem('shopeee_session');
  if (!sid) {
    sid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('shopeee_session', sid);
  }
  return sid;
}

export default client;
