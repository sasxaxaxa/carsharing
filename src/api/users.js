import { apiClient } from '../patterns/proxy/apiClient.js';

export function registerUser(payload) {
  return apiClient.register(payload);
}

export function loginUser(payload) {
  return apiClient.login(payload);
}

export function getProfile() {
  return apiClient.getProfile();
}

export function updateProfile(payload) {
  return apiClient.updateProfile(payload);
}

export function updateUserLocation(payload) {
  return apiClient.updateUserLocation(payload);
}
