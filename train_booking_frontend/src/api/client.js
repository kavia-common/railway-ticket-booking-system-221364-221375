/**
 * Centralized API client using fetch with auth header and env-driven base URL.
 * PUBLIC_INTERFACE
 * - get(path, options)
 * - post(path, body, options)
 * - put(path, body, options)
 * - del(path, options)
 */
const BASE_URL = process.env.REACT_APP_API_BASE || '';

function getToken() {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

async function request(method, path, body, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...options,
  });

  const contentType = res.headers.get('Content-Type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = (isJson && payload?.detail) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

// PUBLIC_INTERFACE
export function get(path, options) {
  /** Perform GET request to backend */
  return request('GET', path, null, options);
}

// PUBLIC_INTERFACE
export function post(path, body, options) {
  /** Perform POST request to backend */
  return request('POST', path, body, options);
}

// PUBLIC_INTERFACE
export function put(path, body, options) {
  /** Perform PUT request to backend */
  return request('PUT', path, body, options);
}

// PUBLIC_INTERFACE
export function del(path, options) {
  /** Perform DELETE request to backend */
  return request('DELETE', path, null, options);
}

export default { get, post, put, del };
