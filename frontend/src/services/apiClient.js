const DEFAULT_API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.DEV)
    ? ''
    : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
      'http://localhost:3000';

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path) {
  if (!path) return DEFAULT_API_BASE;
  if (/^https?:\/\//i.test(path)) return path;
  if (!DEFAULT_API_BASE && typeof window !== 'undefined') {
    return new URL(path.startsWith('/') ? path : `/${path}`, window.location.origin).toString();
  }
  const base = DEFAULT_API_BASE.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {}, query = {}, ...rest } = options;
  const url = new URL(buildUrl(path));

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const requestHeaders = { Accept: 'application/json', ...headers };
  const hasBody = body !== undefined && body !== null;

  if (isFormData) {
    delete requestHeaders['Content-Type'];
    delete requestHeaders['content-type'];
  }

  if (hasBody && !isFormData && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url.toString(), {
    method,
    credentials: 'include',
    headers: requestHeaders,
    body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined,
    ...rest,
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Unable to connect to TakeFashion. Please try again.';
    throw new ApiError(message, response.status, payload?.details || null);
  }

  return payload;
}

export const apiClient = {
  get(path, query = {}) {
    return apiRequest(path, { method: 'GET', query });
  },
  post(path, body, query = {}) {
    return apiRequest(path, { method: 'POST', body, query });
  },
  patch(path, body, query = {}) {
    return apiRequest(path, { method: 'PATCH', body, query });
  },
  remove(path, query = {}) {
    return apiRequest(path, { method: 'DELETE', query });
  },
};
