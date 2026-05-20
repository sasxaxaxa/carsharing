export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : 'https://morent-backend-production.up.railway.app');

export const AUTH_TOKEN_KEY = 'morent_auth_token';
