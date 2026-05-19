import { apiRequest } from './http.js';

export function registerUser(payload) {
  return apiRequest('/api/users/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload) {
  return apiRequest('/api/users/login', {
    method: 'POST',
    body: payload,
  });
}

export function getProfile() {
  return apiRequest('/api/users/profile', { auth: true });
}
