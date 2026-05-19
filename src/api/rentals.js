import { apiRequest } from './http.js';

export function startRental(payload) {
  return apiRequest('/api/rentals/start', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function endRental(payload) {
  return apiRequest('/api/rentals/end', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function getRentalHistory() {
  return apiRequest('/api/rentals/history', { auth: true });
}

export function getRentalDetail(rentalId) {
  return apiRequest(`/api/rentals/${rentalId}`, { auth: true });
}
