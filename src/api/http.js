import { API_BASE_URL, AUTH_TOKEN_KEY } from './config.js';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.error) return data.error;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const value = data[firstKey];
    return Array.isArray(value) ? value[0] : String(value);
  }
  return fallback;
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false, headers = {} } = options;

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      requestHeaders.Authorization = `Token ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  const hasJson = contentType?.includes('application/json');
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Ошибка запроса (${response.status})`),
      response.status,
      data,
    );
  }

  return data;
}

/**
 * Бэкенд иногда отдаёт внешний URL как /media/https%3A/example.com/...
 * — декодируем и возвращаем прямую ссылку.
 */
export function getMediaUrl(path) {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  const mediaPrefix = '/media/';

  if (normalized.startsWith(mediaPrefix)) {
    const encodedPart = normalized.slice(mediaPrefix.length);
    try {
      const decoded = decodeURIComponent(encodedPart);
      if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
        return decoded;
      }
    } catch {
      /* оставляем как путь к media */
    }
  }

  return `${API_BASE_URL}${normalized}`;
}
