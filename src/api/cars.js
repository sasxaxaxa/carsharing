import { apiClient } from '../patterns/proxy/apiClient.js';

export function getCarsList(params) {
  return apiClient.getCarsList(params);
}

export function getAllCars(params) {
  return apiClient.getAllCars(params);
}

export function getCarDetail(carId) {
  return apiClient.getCarDetail(carId);
}

export function getCarCategories() {
  return apiClient.getCarCategories();
}

export function getNearestCars(payload) {
  return apiClient.getNearestCars(payload);
}
