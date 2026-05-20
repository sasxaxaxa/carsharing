import { apiClient } from '../patterns/proxy/apiClient.js';

export function startRental(payload) {
  return apiClient.startRental(payload);
}

export function endRental(payload) {
  return apiClient.endRental(payload);
}

export function getRentalHistory() {
  return apiClient.getRentalHistory();
}

export function getRentalDetail(rentalId) {
  return apiClient.request(`/api/rentals/${rentalId}`, { auth: true });
}
